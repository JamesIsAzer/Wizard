const { MessageFlags } = require('discord.js');

module.exports = {
    idPrefix: 'getID',
    async execute(interaction) {
        const id = interaction.customId.split("_")[1]
        interaction.reply({
            content: id,
            flags: MessageFlags.Ephemeral
        })
    },
};

