const { EmbedBuilder } = require('discord.js')
const { loading, hairflip } = require('../../emojis.json')

const getLoadingEmbed = () => new EmbedBuilder()
    .setDescription(`${loading} Generating info, please enjoy this hairflip ${hairflip}`)

module.exports = {
    getLoadingEmbed
};
      