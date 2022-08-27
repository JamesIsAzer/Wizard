const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasFullPerms } = require('../../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetleaderboard')
    .setDescription('Admin only - Uncompete all participants on every leaderboard.'),
  async execute(interaction) {

    await interaction.deferReply({ ephemeral: false });
    if(hasFullPerms(interaction.member)){
      await interaction.editReply(`Leaderboard ${shouldLock ? 'locked' : 'unlocked'}`)        
    } else await interaction.editReply(`Insufficient permissions to use this command.`)
  }
};
