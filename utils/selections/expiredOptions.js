const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { cross } = require('../../emojis.json')

const expiredOptions = () => {
    const [, crossname, crossid ] = cross.replace(/[<>]/g, '').split(':')

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`Expired`)
            .setPlaceholder('This interaction has expired.')
            .setDisabled(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Disabled due to timeout...`)
                    .setValue('expired')
                    .setDefault(true)
                    .setEmoji({ name: crossname, id: crossid })
            )
    )
}
    

module.exports = {
    expiredOptions
};
  