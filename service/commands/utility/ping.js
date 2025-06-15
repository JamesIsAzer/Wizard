const { SlashCommandBuilder } = require('@discordjs/builders');
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /ping`)
    interaction.reply('Pong!')
  },
};
