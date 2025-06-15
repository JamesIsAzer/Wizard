const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasMediumPerms } = require('../../../utils/permissions');
const {
  uncompete,
  uncompeteAnyone
} = require('../../../dao/mongo/participant/queries');
const {
  getInvalidTagEmbed,
} = require('../../../utils/embeds/verify');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { InteractionContextType } = require('discord.js');

module.exports = {
  mainServerOnly: true,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('uncompete')
    .setDescription('Allows you to uncompete on the server leaderboard.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag that you have verified with.')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /uncompete`)

    await interaction.deferReply();
    
    const tag = parseTag(interaction.options.getString('tag'))
    const id = interaction.member.id

    if (!isTagValid(tag)) {
        return interaction.editReply({
          embeds: [getInvalidTagEmbed()]
        });
    }

    const success = hasMediumPerms(interaction.member) ? await uncompeteAnyone(tag) : await uncompete(tag, id)

    if (success) interaction.editReply(`Leaderboard withdrawal successful for \`#${tag}\`. To compete again use \`/compete <player tag>\``) 
    else interaction.editReply(`Couldn't uncompete \`#${tag}\`. Make sure the tag is correct and that you have verified under it.`)
  },
};