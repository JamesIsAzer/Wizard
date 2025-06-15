const { SlashCommandBuilder } = require('@discordjs/builders');
const { findProfile } = require('../../../dao/clash/verification');
const { tagVerifiedBySameUser } = require('../../../dao/mongo/verification/queries');
const { getInvalidTagEmbed, getValidVerificationEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { hasAnyRoles, getMaxTownhallLevel, getAchievements, addRoles } = require('../../../utils/setRoles');
const { InteractionContextType, MessageFlags } = require('discord.js');
const { getConfig } = require('../../../config');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Updates your profile roles if already verified.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag.')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /refresh`)

    await interaction.deferReply({ 
      flags: MessageFlags.Ephemeral 
    });
    const tag = parseTag(interaction.options.getString('tag'));
    const discordID = interaction.member.id;
    if (!isTagValid(tag)) {
      return await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        flags: MessageFlags.Ephemeral
      });
    }
    if (await tagVerifiedBySameUser(tag, discordID)) {
      const findProfileResponse = await findProfile(tag);
      const profileData = findProfileResponse.response.data;

      const achieved = getAchievements(profileData, interaction.member)
      const townhallLevel = await getMaxTownhallLevel(profileData, interaction.member).catch(_ => {
        console.error(`${new Date().toString()} - Failed on trying to find max townhall level.`)
        return interaction.editReply("Error trying to retrieve your max townhall level. This could be due to a Clash API error. Please try again later.")
      })
      const anyRoles = hasAnyRoles(townhallLevel)

      const config = await getConfig(interaction.guildId)

      addRoles(anyRoles, achieved, townhallLevel, interaction.member, config)

      return interaction.editReply({
        embeds: [getValidVerificationEmbed(achieved, townhallLevel, anyRoles, config)]
      });
      
    } else {
      return interaction.editReply('You did not verify under this tag, to verify use the \`/verify\` command.');
    }
  },
};
