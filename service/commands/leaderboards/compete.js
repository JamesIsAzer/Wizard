const { SlashCommandBuilder } = require('@discordjs/builders');
const { findProfile } = require('../../../dao/clash/verification');
const { isOwnerOfAccount } = require('../../../dao/mongo/verification/queries')
const {
  checkIfCompetingInBoth,
  updateLeaderboardParticipation
} = require('../../../dao/mongo/participant/queries');
const { isLeaderboardRestricted } = require('../../../dao/mongo/restriction/queries')
const { isLeaderboardLocked } = require('../../../dao/mongo/toggle/queries')
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { leaderboardContestID } = require("../../../config.json");
const { InteractionContextType, MessageFlags } = require('discord.js');

const LEGENDARY_MINIMUM = 5000
const BUILDER_MINIMUM = 5000

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('compete')
    .setDescription('Allows you to compete on the server leaderboard.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag that you have verified with.')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /compete`)

    await interaction.deferReply({       
      flags: MessageFlags.Ephemeral
    });
    
    const tag = parseTag(interaction.options.getString('tag'))
    const id = interaction.user.id
    const username = interaction.user.username

    if (await isLeaderboardLocked()) {
      await interaction.editReply('Leaderboard participation is currently locked.')
      return
    }

    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const isOwner = isOwnerOfAccount(tag, id)
    const competingInBoth = checkIfCompetingInBoth(tag, id)

    if (!await isOwner) {
      await interaction.editReply('You have not verified with this tag, to do so type `/verify <player tag> <api token>`')
      return
    }

    if (await competingInBoth) {
      await interaction.editReply('You are competing in both leaderboards already!')
      return
    }

    if (await isLeaderboardRestricted(tag)) {
      await interaction.editReply('Your account has been restricted from participating on the leaderboards.')
      return
    }

    const accountResponse = await findProfile(tag)

    if (accountResponse.error) {
      await interaction.editReply(
        `An error has occured: ${accountResponse.error}`
      );
      return;
    }

    if (!accountResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const account = accountResponse.response.data

    const legends = account.trophies >= LEGENDARY_MINIMUM
    const builder = account.builderBaseTrophies >= BUILDER_MINIMUM

    if (legends || builder) {
      updateLeaderboardParticipation(tag, id, username, legends, builder)
      interaction.member.roles.add(leaderboardContestID);
    }

    const msg = x => `You are now competing under the ${x}, good luck!`

    if (legends && builder) interaction.editReply(msg('legends and builder ladder'))
    else if (legends) interaction.editReply(msg('legends ladder'))
    else if (builder) interaction.editReply(msg('builder ladder'))
    else interaction.editReply('You are not eligible to compete under any of the leaderboards (must have 5000 cups in either ladder or builder base).')
  },
};