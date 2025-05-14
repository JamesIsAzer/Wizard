module.exports = {
    idPrefix: 'howToCompete',
    async execute(interaction) {
        return interaction.reply({
            content: 'Run `/compete <player tag>` in <#328964121871777793>',
            ephemeral: true,
        })
    },
};