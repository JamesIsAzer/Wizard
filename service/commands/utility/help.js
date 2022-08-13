const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getGeneralHelp, getVerificationHelp, getColoursHelp, getStatsHelp, getLeaderboardHelp
  } = require('../../../utils/embeds/help');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gives information about the bot!')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Commands you want to know about.')
        .setRequired(false)
        .addChoices(
            { name: 'verification', value: 'verification' },
            { name: 'colours', value: 'colours' },
            { name: 'stats', value: 'stats' },
            { name: 'leaderboards', value: 'leaderboards' },
          )
    ),
  async execute(interaction) {
    switch(interaction.options.getString('command')){
        case 'verification':
        await interaction.editReply({embeds: [getVerificationHelp()], ephemeral: true,})
        return
        case 'colours':
        await interaction.editReply({embeds: [getColoursHelp()], ephemeral: true,})
        return
        case 'stats':
        await interaction.editReply({embeds: [getStatsHelp()], ephemeral: true,})
        return
        case 'leaderboards':
        await interaction.editReply({embeds: [getLeaderboardHelp()], ephemeral: true,})
        return
        default:
        await interaction.editReply({embeds: [getGeneralHelp()], ephemeral: true,})
        return
    }
  },
};
