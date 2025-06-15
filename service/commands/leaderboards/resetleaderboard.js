const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasFullPerms } = require('../../../utils/permissions');
const { resetLeaderboards } = require('../../../dao/mongo/participant/queries')
const { InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('resetleaderboard')
    .setDescription('Admin only - Uncompete all participants on every leaderboard.')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /resetleaderboard`)

    await interaction.deferReply({ 
      flags: MessageFlags.Ephemeral 
    });

    if(hasFullPerms(interaction.member)){
      resetLeaderboards()
      await interaction.editReply(`Leaderboards have been reset.`)        
    } else await interaction.editReply(`Insufficient permissions to use this command.`)
  }
};
