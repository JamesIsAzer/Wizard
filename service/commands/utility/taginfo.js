const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/queries');
const { parseTag } = require('../../../utils/arguments/tagHandling');
const { hasMediumPerms } = require('../../../utils/permissions');
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('taginfo')
    .setDescription('Mod only - gets verification for a given tag.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option.setName('playertag').setDescription('Player Tag').setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /taginfo`)

    if (!hasMediumPerms(interaction.member))
      return interaction.reply({
        content: `You do not have permission to use this command.`
      });
    const targetPlayerTag = parseTag(
      interaction.options.getString('playertag')
    );
    const playersDiscordID = await getDiscordOfTag(targetPlayerTag);
    if (!playersDiscordID) {
      return interaction.reply({
        content: `No verifications found for tag ${targetPlayerTag}.`
      });
    }

    interaction.reply(playersDiscordID);
  },
};
