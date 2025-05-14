const { ActionRowBuilder, ButtonBuilder } = require('discord.js')

const verifyingIDButton = (verifyingID) => new ButtonBuilder()
    .setCustomId(`getID_${verifyingID}`)
    .setLabel('Get user ID')
    .setStyle('Primary')

const verifiedIDButton = (verifiedID) => new ButtonBuilder()
    .setCustomId(`getID_${verifiedID}`)
    .setLabel('Get ID of linked account')
    .setStyle('Primary')

const getNewVerifationID = (verifyingID) => 
    new ActionRowBuilder().addComponents(
        verifyingIDButton(verifyingID)
    )

const getCrossVerificationIDs = (verifyingID, verifiedID) => 
    new ActionRowBuilder().addComponents(
        verifyingIDButton(verifyingID), verifiedIDButton(verifiedID)
    )

module.exports = {
    getNewVerifationID,
    getCrossVerificationIDs
};
  