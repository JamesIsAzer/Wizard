const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getInfo
  } = require('../../../utils/embeds/info');
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives information about the bot!')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),
  async execute(interaction) {
    interaction.reply({embeds: [getInfo()], ephemeral: false})
  },
};
