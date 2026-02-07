const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVerificationModal } = require('../../../utils/modals/verificationInputModal');
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verifies a user and sets their roles.')
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /verify`)

    await interaction.showModal(await getVerificationModal())
  },
};
