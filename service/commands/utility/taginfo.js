const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/connections');
const {
  parseTag,
  isTagValid,
} = require('../../../utils/arguments/tagHandling');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { hasMediumPerms } = require('../../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('taginfo')
    .setDescription('Mod only - gets verification for a given tag.')
    .addStringOption((option) =>
      option.setName('playertag').setDescription('Player Tag').setRequired(true)
    ),
  async execute(interaction) {
    if (!hasMediumPerms(interaction.member))
      return interaction.reply({
        content: `You do not have permission to use this command.`,
        ephemeral: false,
      });
    const targetPlayerTag = parseTag(
      interaction.options.getString('playertag')
    );
    if (!isTagValid(targetPlayerTag)) {
      await interaction.reply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const tagVerification = await getDiscordOfTag(targetPlayerTag);
    if (!tagVerification) {
      interaction.reply({
        content: `No verifications found for tag ${targetPlayerTag}.`,
        ephemeral: false,
      });
      return;
    }

    interaction.reply(tagVerification);
  },
};
