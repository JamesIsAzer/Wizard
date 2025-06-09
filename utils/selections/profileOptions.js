const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { xp, versusbattles } = require('../../emojis.json')

const profileOptions = (selectedValue, disable = false) => {
    const [, xpname, xpid ] = xp.replace(/[<>]/g, '').split(':')
    const [, versusbattlesname, versusbattlesid ] = versusbattles.replace(/[<>]/g, '').split(':')

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`helpOption`)
            .setPlaceholder('What do you need help with?')
            .setDisabled(disable)
            .addOptions(
                new StringSelectMenuOptionBuilder()
					.setLabel(`Profile`)
					.setDescription(`General info for player.`)
					.setValue('profile')
                    .setDefault(selectedValue === 'profile')
                    .setEmoji({name: xpname, id: xpid}),
                new StringSelectMenuOptionBuilder()
					.setLabel(`Army`)
					.setDescription(`Contains army levels.`)
					.setValue('army')
                    .setDefault(selectedValue === 'army')
                    .setEmoji({name: versusbattlesname, id: versusbattlesid})

            )
    )
}
    

module.exports = {
    profileOptions
};
  