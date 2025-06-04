const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getInfo
  } = require('../../../utils/embeds/info');
const { InteractionContextType } = require('discord.js');
const { getVerificationCount } = require('../../../dao/mongo/verification/queries');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives information about the bot!')
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM),
  async execute(interaction) {
    const verificationCount = await getVerificationCount()
    interaction.reply({
      embeds: [getInfo(verificationCount)]
    })
  },
};
