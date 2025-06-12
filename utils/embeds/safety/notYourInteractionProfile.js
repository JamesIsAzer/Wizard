const { EmbedBuilder } = require('discord.js')

const getNotYourInteractionProfileEmbed = () => new EmbedBuilder()
    .setDescription(`Hey Chief! This is not your interaction to use. If you'd like to create one, type \`/profile show\`.`)
    .setColor('#EC4245')

module.exports = {
    getNotYourInteractionProfileEmbed
};
      