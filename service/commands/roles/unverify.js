const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const { unverifyUser } = require('../../../dao/mongo/verification/queries');
const { uncompeteAllAccountsForUser } = require('../../../dao/mongo/participant/queries');
const { removeRoles } = require('../../../utils/removeRoles')
const { getUnverifiedEmbed } = require('../../../utils/embeds/verify')
const { InteractionContextType, MessageFlags } = require('discord.js');
const client = require('../../../client');
const { getConfig } = require('../../../config');
const { ownerGuildID } = require('../../../config.json');
const { default: Bottleneck } = require('bottleneck');
const { loading } = require('../../../emojis.json')

const limiter = new Bottleneck({
  reservoir: 20,                 
  reservoirRefreshAmount: 20,    
  reservoirRefreshInterval: 1000,
  maxConcurrent: 3,              
  minTime: 50                    
});


module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('unverify')
    .setDescription('Unverifies a user and removes their roles.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Mod only - Discord ID of account to unverify.')
        .setRequired(false)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /unverify`)

    await interaction.deferReply({ 
      flags: MessageFlags.Ephemeral
     });

     await interaction.editReply(`${loading} Checking all guilds and unverifying, this may take a bit...`);

    if (interaction.options.getString('id')) {
      if (interaction.guildId != ownerGuildID)
        return interaction.editReply('This command can only be run from the main Discord server.')

      if(!hasMediumPerms(interaction.member))
        return interaction.editReply('Insufficient permissions to unverify other users.')
    }
    
    const discordID = interaction.options.getString('id') ?? interaction.member.id
    
    uncompeteAllAccountsForUser(discordID)

    const fetchTasks = [...client.guilds.cache.values()].map(guild =>
      limiter.schedule(async () => {
        let member = guild.members.cache.get(discordID);
        if (!member) {
          try { member = await guild.members.fetch(discordID) } 
          catch { return null }
        }
        return member ? { guild, member } : null;
      })
    );

    const pairs = (await Promise.all(fetchTasks)).filter(Boolean);

    const configEntries = await Promise.allSettled(
      pairs.map(({ guild }) => getConfig(guild.id).then(cfg => [guild.id, cfg]))
    );

    const configByGuild = new Map(
      configEntries
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
    );

    const dbOps = Promise.allSettled([
      unverifyUser(discordID),
      uncompeteAllAccountsForUser(discordID),
    ]);

    const roleTasks = pairs.map(({ guild, member }) =>
      limiter.schedule(async () => {
        try {
          const cfg = configByGuild.get(guild.id) ?? (await getConfig(guild.id)); // fallback if fetch failed
          await removeRoles(member, cfg);
          return { guildId: guild.id, ok: true };
        } catch (err) {
          console.error(`Error processing guild ${guild.id}:`, err);
          return { guildId: guild.id, ok: false, err };
        }
      })
    );

    const [_, roleResults] = await Promise.all([
      dbOps,
      Promise.allSettled(roleTasks),
    ]);

    const successes = roleResults.filter(r => r.status === 'fulfilled' && r.value?.ok).length;
    const failures =
      roleResults.length - successes;

    interaction.editReply({
      content: null,
      embeds: [getUnverifiedEmbed()] 
    })

    console.log(`Unverify ${discordID}: roles removed in ${successes}/${pairs.length} guilds; failures=${failures}`);
  },
};
