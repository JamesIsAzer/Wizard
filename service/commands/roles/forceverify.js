const { getConfig } = require('../../../config')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { hasMediumPerms } = require('../../../utils/permissions')
const {
  getInvalidTagEmbed,
  getValidVerificationEmbed,
  alertAttemptNewVerification,
} = require('../../../utils/embeds/verify')
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling')
const { containsOnlyNumbers } = require('../../../utils/arguments/discordID')
const { findProfile } = require('../../../dao/clash/verification')
const {
  tagVerified,
  alreadyTaken,
  insertVerification,
  getDiscordOfTag,
} = require('../../../dao/mongo/verification/queries')
const {
  getAchievements,
  hasAnyRoles,
  getMaxTownhallLevel,
  addRoles,
} = require('../../../utils/setRoles')
const { getNewVerifationID } = require('../../../utils/buttons/getID')
const { getChannel } = require('../../../utils/getDiscordObjects')
const { logChannels } = require('../../../config.json')
const { InteractionContextType } = require('discord.js')

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('forceverify')
    .setDescription(
      'Mod only - Verify a user and set up roles without using the API token.',
    )
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option.setName('id').setDescription('User ID.').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Their in-game player tag.')
        .setRequired(true),
    ),
  async execute(interaction) {
    console.log(
      `${new Date().toString()} ${interaction.user.id} used the command: /forceverify`,
    )

    await interaction.deferReply()

    if (!hasMediumPerms(interaction.member)) {
      await interaction.editReply(
        `Insufficient permissions to use this command.`,
      )
      return
    }

    const tag = parseTag(interaction.options.getString('tag'))
    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
      })
      return
    }
    const memberId = interaction.options.getString('id')
    if (!containsOnlyNumbers(memberId)) {
      await interaction.editReply('Invalid ID format.')
      return
    }
    const config = await getConfig(interaction.guildId)
    const newVerifyLogChannel = getChannel(logChannels.newVerify)
    if (!newVerifyLogChannel)
      return interaction.editReply(
        'Something went wrong, if this keeps happening please contact \`azerfrost\`!',
      )
    const findProfileResponse = await findProfile(tag)

    if (findProfileResponse.error) {
      await interaction.editReply(
        `An error has occured: ${findProfileResponse.error}`,
      )
      return
    }

    if (!findProfileResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
      })
      return
    }
    const profileData = findProfileResponse.response.data

    const member = await interaction.guild.members
      .fetch({ user: memberId })
      .catch((_) => null)
    if (!member) {
      await interaction.editReply(
        `Could not find user <@${memberId}> in this server.`,
      )
      return
    }

    if (await alreadyTaken(tag, memberId)) {
      const originalAccountId = await getDiscordOfTag(tag)
      await interaction.editReply(
        `The tag \`#${tag}\` is already linked to <@${originalAccountId}>, unverify them first.`,
      )
      return
    }

    const achieved = getAchievements(profileData, member)
    const townhallLevel = await getMaxTownhallLevel(profileData, member)
    const anyRoles = hasAnyRoles(townhallLevel)

    const newVerification = !(await tagVerified(tag))
    if (newVerification) insertVerification(tag, memberId)

    addRoles(anyRoles, achieved, townhallLevel, member, config)

    await interaction.editReply({
      content: `Force verified <@${memberId}> with the tag \`#${tag}\``,
      embeds: [
        getValidVerificationEmbed(achieved, townhallLevel, anyRoles, config),
      ],
    })

    if (!newVerification) return
    console.log(
      `${new Date().toString()} - User ${memberId} was force verified with the tag ${tag} by ${interaction.user.id}`,
    )
    return (await newVerifyLogChannel).send({
      embeds: [alertAttemptNewVerification(memberId, tag)],
      components: [getNewVerifationID(memberId)],
    })
  },
}
