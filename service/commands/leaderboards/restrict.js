const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { saveLeaderboardRestriction } = require('../../../dao/mongo/restriction/queries')
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('restrict')
    .setDescription('Mod only - Restrict a discord user from participating on the leaderboard.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
          option
            .setName('action')
            .setDescription('What they are restricted from.')
            .setRequired(true)
            .addChoices(
              { name: 'Leaderboard', value: 'LEADERBOARD' },
            )
        )
    .addBooleanOption((option) =>
        option
          .setName('trigger')
          .setDescription('Turn restrictions on/off.')
          .setRequired(true)
      )
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Their in-game player tag.')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /restrict`)

    await interaction.deferReply();
    
    if(!hasMediumPerms(interaction.member)) {
      await interaction.editReply(`Insufficient permissions to use this command.`)
      return
    }

    const tag = parseTag(interaction.options.getString('tag'))
    if (!isTagValid(tag)) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()]
      });
      return;
    }

    const restricted = interaction.options.getBoolean('trigger')
    switch(interaction.options.getString('action')){
      case 'LEADERBOARD':
        restrictLeaderboard(tag, restricted, interaction)
        return;
    }

  },
};

const restrictLeaderboard = async (tag, restricted, interaction) => {
  saveLeaderboardRestriction(tag, restricted)
  await interaction.editReply(`Set leaderboard restriction for player tag \`#${tag}\` to \`${restricted}\``)
}