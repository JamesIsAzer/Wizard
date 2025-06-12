const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

const expiredOptions = () => 
    new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`Expired`)
            .setPlaceholder('This interaction has expired.')
            .setDisabled(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Disabled due to timeout...`)
                    .setValue('expired')
                    .setDefault(true)
                    .setEmoji({name: 'cross', id: '1381545321229713468'})
            )
    )

module.exports = {
    expiredOptions
};
  