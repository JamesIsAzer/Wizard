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
    await interaction.deferReply({ 
      flags: MessageFlags.Ephemeral
     });

    if (interaction.options.getString('id')) {
      if (interaction.guildId != ownerGuildID)
        return interaction.editReply('This command can only be run from the main Discord server.')

      if(!hasMediumPerms(interaction.member))
        return interaction.editReply('Insufficient permissions to unverify other users.')
    }
    
    const discordID = interaction.options.getString('id') ?? interaction.member.id

    uncompeteAllAccountsForUser(discordID)

    const sharedGuilds = [];

    for (const guild of client.guilds.cache.values()) {
      let member = guild.members.cache.get(interaction.member.id);

      if (!member)
        member = await guild.members.fetch(interaction.member.id).catch(() => null);
      
      if (member) 
        sharedGuilds.push(guild);
    }

    unverifyUser(interaction.member.id)
    
    for (const sharedGuild of sharedGuilds) {
      try {
        const configForSharedGuild = await getConfig(sharedGuild.id);
        await removeRoles(interaction.member, configForSharedGuild);
      } catch (error) {
        console.error(`Error processing guild ${sharedGuild.id}:`, error);
      }
    }

    interaction.editReply({
      embeds: [getUnverifiedEmbed()], 
      flags: MessageFlags.Ephemeral
    })
  },
};
