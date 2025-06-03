const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const { unverifyUser } = require('../../../dao/mongo/verification/queries');
const { uncompeteAllAccountsForUser } = require('../../../dao/mongo/participant/queries');
const { removeRoles } = require('../../../utils/removeRoles')
const { getUnverifiedEmbed } = require('../../../utils/embeds/verify')
const { InteractionContextType, MessageFlags } = require('discord.js');

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

    if (interaction.options.getString('id') && !hasMediumPerms(interaction.member)) 
      return interaction.editReply('Insufficient permissions to unverify other users.')
    
    const discordID = interaction.options.getString('id') ?? interaction.member.id

    uncompeteAllAccountsForUser(discordID)

    interaction.guild.members.fetch(discordID)
        .then(member => unverifyOnServer(member, interaction))
        .catch(_ => unverifyOffServer(discordID, interaction))
  },
};

const unverifyOnServer = async (member, interaction) => {
    const result = await unverifyUser(member.id)
    if (result.deletedCount > 0) {
        const rolesRemoved = removeRoles(member, interaction.guildId)
        interaction.editReply({
          embeds: [getUnverifiedEmbed(rolesRemoved)], 
          flags: MessageFlags.Ephemeral
        })
    } else interaction.editReply('User does not have a verification.')
}

const unverifyOffServer = async (id, interaction) => {
    const result = await unverifyUser(id)
    if (result.deletedCount > 0) interaction.editReply('User not on server, unverified from database.')
    else interaction.editReply('Could not find user from database.')
}
