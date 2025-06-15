const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getGeneralHelp, getVerificationHelp, getColoursHelp, getStatsHelp, getLeaderboardHelp
  } = require('../../../utils/embeds/help');
const { InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tells you how to use the bot.')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM)
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
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /help`)

    switch(interaction.options.getString('command')){
        case 'verification':
        await interaction.reply({
          embeds: [getVerificationHelp()], 
          flags: MessageFlags.Ephemeral
        })
        return
        case 'colours':
        await interaction.reply({
          embeds: [getColoursHelp()], 
          flags: MessageFlags.Ephemeral
        })
        return
        case 'stats':
        await interaction.reply({
          embeds: [getStatsHelp()], 
          flags: MessageFlags.Ephemeral
        })
        return
        case 'leaderboards':
        await interaction.reply({
          embeds: [getLeaderboardHelp()], 
          flags: MessageFlags.Ephemeral
        })
        return
        default:
        await interaction.reply({
          embeds: [getGeneralHelp()], 
          flags: MessageFlags.Ephemeral
        })
        return
    }
  },
};
