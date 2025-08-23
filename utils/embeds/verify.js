const { EmbedBuilder } = require('discord.js');
const { displayRow } = require('./verification/displayRoleInfo');
const emojis = require('../../emojis.json')

const getInvalidTagEmbed = () => new EmbedBuilder()
    .setTitle('Invalid Tag! ❌')
    .setColor('#D10202')
    .addFields({
        name: 'How can I find my player tag?',
        value: 'Your player tag can be found on your in-game profile page.'
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/1013012740861853696/findprofile.jpg?width=959&height=443'
    )

const getInvalidApiTokenEmbed = () => new EmbedBuilder()
    .setTitle('Invalid API token! ❌')
    .setColor('#D10202')
    .addFields({
      name: 'How can I find my API token?',
      value: 'You can find your API token by going into settings -> advanced settings.',
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/813606623519703070/image0.png?width=1440&height=665'
    )

const getValidVerificationEmbed = (achieved, thLevel, anyRoles, config) => new EmbedBuilder()
    .setTitle('Verification successful! ✅')
    .setColor('#00DE30')
    .addFields({
        name: 'Roles added',
        value: getSuccessfulVerificationEmbedDescription(achieved, thLevel, anyRoles, config)
    })
    
const getUnverifiedEmbed = () => new EmbedBuilder()
    .setTitle('Unverification successful! ✅')
    .setColor('#00DE30')
    .setDescription('Unverified all accounts linked to you and removed achievement roles in all servers.');

const alertAttemptCrossVerification = (newUserId, originalOwnerId, tag, onMainServer) => new EmbedBuilder()
    .setTitle(`Attempted cross verification ${onMainServer ? '' : 'outside of server'}⚠️`)
    .setColor('FFFF00')
    .setDescription(`User <@${newUserId}> tried to verify an account linked to <@${originalOwnerId}> using the tag \`#${tag}\``)

const alertAttemptNewVerification = (newUserId, tag) => new EmbedBuilder()
    .setTitle('New verification⚠️')
    .setColor('00DE30')
    .setDescription(`User <@${newUserId}> (${newUserId}) verified a new account under the tag \`#${tag}\``)

const getSuccessfulVerificationEmbedDescription = (achieved, thLevel, anyRoles, config) => {
    if (!anyRoles) return `• Not eligible for any roles\n`;

    const verificationRoles = config.verificationRoles
    const townhallRoles = config.townhallRoles

    return (
        displayRow(emojis.xp, achieved.member, verificationRoles?.member) +
        displayRow(emojis.legend, achieved.legends, verificationRoles?.legends) +
        displayRow(emojis.star, achieved.starLord, verificationRoles?.starLord) +
        displayRow(emojis.loot, achieved.farmersRUs, verificationRoles?.farmersRUs) +
        displayRow(emojis.masterbuilder, achieved.masterBuilder, verificationRoles?.masterBuilder) +
        displayRow(emojis.clancastle, achieved.philanthropist, verificationRoles?.philanthropist) +
        displayRow(emojis.bush, achieved.greenThumb, verificationRoles?.greenThumb) +
        displayRow(emojis.clangames, achieved.masterGamer, verificationRoles?.masterGamer) +
        displayRow(emojis.legendtrophy, achieved.conqueror, verificationRoles?.conqueror) +
        displayRow(emojis.diamondleague, achieved.vanquisher, verificationRoles?.vanquisher) +
        displayRow(emojis.capitalgold, achieved.capitalist, verificationRoles?.capitalist) +
        displayRow(emojis.goblin, achieved.campaigner, verificationRoles?.campaigner) +
        displayRow(emojis.xp, achieved.bsoto, verificationRoles?.bsoto) +
        displayRow(emojis.rock, achieved.rockSolid, verificationRoles?.rockSolid) +
        getThLevelDescription(thLevel, townhallRoles)
    );
}

const getThLevelDescription = (thLevel, townhallRoles) => {
    if (thLevel < 8) return ''
    if (thLevel == 8) return displayRow(emojis.th8, true, townhallRoles?.townhall8)
    if (thLevel == 9) return displayRow(emojis.th9, true, townhallRoles?.townhall9)
    if (thLevel == 10) return displayRow(emojis.th10, true, townhallRoles?.townhall10)
    if (thLevel == 11) return displayRow(emojis.th11, true, townhallRoles?.townhall11)
    if (thLevel == 12) return displayRow(emojis.th12, true, townhallRoles?.townhall12)
    if (thLevel == 13) return displayRow(emojis.th13, true, townhallRoles?.townhall13)
    if (thLevel == 14) return displayRow(emojis.th14, true, townhallRoles?.townhall14)
    if (thLevel == 15) return displayRow(emojis.th15, true, townhallRoles?.townhall15)
    if (thLevel == 16) return displayRow(emojis.th16, true, townhallRoles?.townhall16)
    if (thLevel == 17) return displayRow(emojis.th17, true, townhallRoles?.townhall17)
    return ""
}

module.exports = {
    getInvalidTagEmbed,
    getInvalidApiTokenEmbed,
    getValidVerificationEmbed,
    getUnverifiedEmbed,
    alertAttemptCrossVerification,
    alertAttemptNewVerification
} 

