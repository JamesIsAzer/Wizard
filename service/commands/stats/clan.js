const { SlashCommandBuilder } = require('@discordjs/builders');
const { getClanEmbed } = require('../../../utils/embeds/stats');
const { getInvalidTagEmbed } = require('../../../utils/embeds/clanTag')
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { findClan } = require('../../../dao/clash/clans')
const { InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('clan')
    .setDescription('Get information about a clans in-game stats.')
    .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel, InteractionContextType.BotDM)
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
    .addStringOption((option) =>
        option
        .setName('tag')
        .setDescription('The clan tag you want to look up.')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(`${new Date().toString()} ${interaction.user.id} used the command: /clan`)
    await interaction.deferReply();
    
    const tag = parseTag(interaction.options.getString('tag'))

    if (!isTagValid(tag)) {
        sendInvalidTagReply(interaction)
        return
    }
    
    const clanResponse = await findClan(tag)

    if (!clanResponse.response) {
        return interaction.editReply(`An error occured: ${clanResponse.error}`)
    }

    if (!clanResponse.response.found) {
        sendInvalidTagReply(interaction)
        return
    }

    const clanData = clanResponse.response.data

    interaction.editReply({
      embeds: [getClanEmbed(clanData)]
    })
  }
};

const sendInvalidTagReply = async(interaction) => await interaction.editReply({
  embeds: [ getInvalidTagEmbed()]
});
