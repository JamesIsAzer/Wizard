const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  verifyProfile,
  findProfile,
} = require('../../../dao/clash/verification');
const {
  tagVerified,
  alreadyTaken,
  insertVerification,
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/queries');
const {
  getInvalidApiTokenEmbed,
  getInvalidTagEmbed,
  alertAttemptCrossVerification,
  alertAttemptNewVerification
} = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { setRoles } = require('../../../utils/setRoles');
const { IDs } = require('../../../config.json')
const { getNewVerifationID, getCrossVerificationIDs } = require('../../../utils/buttons/getID')
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verifies a user and sets their roles.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('The API token of the account.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const tag = parseTag(interaction.options.getString('tag'))
    const token = interaction.options.getString('token');
    const crossVerifyLogChannel = interaction.guild.channels.cache.get(IDs.logChannels.crossVerify)
    const newVerifyLogChannel = interaction.guild.channels.cache.get(IDs.logChannels.newVerify)
    const memberId = interaction.member.id

    if (!isTagValid(tag)) {
      console.log(`${new Date().toString()} - User ${interaction.member.id} attempted to verify with the tag ${tag}`);
      
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const findProfileResponse = await findProfile(tag);

    if (findProfileResponse.error) {
      await interaction.editReply(
        `An error has occured: ${findProfileResponse.error}`
      );
      return;
    }

    if (!findProfileResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const profileData = findProfileResponse.response.data;

    const verifyResponse = await verifyProfile(tag, token);
    if (verifyResponse.error) {
      await interaction.editReply(
        `An error has occured: ${verifyResponse.error}`
      );
      return;
    }

    const isValid = verifyResponse.response.status === 'ok';
    if (!isValid) {
      await interaction.editReply({
        embeds: [getInvalidApiTokenEmbed()],
        ephemeral: true,
      });
      return;
    }

    if (await tagVerified(tag)) {
      if (await alreadyTaken(tag, interaction.member.id)) {
        const originalAccountId = await getDiscordOfTag(tag)
        await interaction.editReply('This account is already taken!');
        await crossVerifyLogChannel.send({embeds: [alertAttemptCrossVerification(memberId, originalAccountId, tag)], components: [getCrossVerificationIDs(memberId, originalAccountId)]})
        return;
      } else {
        await interaction.editReply({
          embeds: [setRoles(profileData, interaction.member)],
          ephemeral: true,
        });
        return;
      }
    } else {
      insertVerification(tag, memberId);
      await interaction.editReply({
        embeds: [setRoles(profileData, interaction.member)],
        ephemeral: true
      });
      console.log(`${new Date().toString()} - User ${memberId} verified with the tag ${tag}`);
      await newVerifyLogChannel.send({embeds: [alertAttemptNewVerification(memberId, tag)], components: [getNewVerifationID(memberId)]})
      return;
    }
  },
};
