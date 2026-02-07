const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, LabelBuilder } = require("discord.js")

const getVerificationModal = async () => {
    const verificationModal = new ModalBuilder()
        .setTitle(`Verify your Clash of Clans account`)
        .setCustomId(`verificationModal`);

    const playerTagInput = new TextInputBuilder()
        .setCustomId('playerTagInput')
        .setPlaceholder("Example: #VP0QG80Y")
        .setStyle(TextInputStyle.Short);

    const apiTokenInput = new TextInputBuilder()
        .setCustomId('apiTokenInput')
        .setMinLength(8)
        .setMaxLength(8)
        .setPlaceholder("Example: pd6smtn9")
        .setStyle(TextInputStyle.Short);
        
    const playerTagLabel = new LabelBuilder()
        .setLabel("What is your player tag?")
        .setDescription("Found directly under your username in your in-game profile page")
        .setTextInputComponent(playerTagInput);

    const apiTokenLabel = new LabelBuilder()
        .setLabel("What is your API token?")
        .setDescription("Found in your in-game settings -> more settings -> scroll down and tap 'show' to see your API token")
        .setTextInputComponent(apiTokenInput);

    return verificationModal.setLabelComponents(playerTagLabel, apiTokenLabel);
}

module.exports = {
    getVerificationModal
}