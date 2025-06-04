const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../config');
const { displayRow } = require('./verification/displayRoleInfo');

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

const alertAttemptCrossVerification = (newUserId, originalOwnerId, tag) => new EmbedBuilder()
    .setTitle('Attempted cross verification⚠️')
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
        displayRow("<:xp:1379105235204833442>", achieved.member, verificationRoles?.member) +
        displayRow("<:legend:1379105324660818060>", achieved.legends, verificationRoles?.legends) +
        displayRow("<:star:1379105336174186536>", achieved.starLord, verificationRoles?.starLord) +
        displayRow("<:loot:1379105350200070164>", achieved.farmersRUs, verificationRoles?.farmersRUs) +
        displayRow("<:masterbuilder:1379105361004335174>", achieved.masterBuilder, verificationRoles?.masterBuilder) +
        displayRow("<:clancastle:1379105390565916824>", achieved.philanthropist, verificationRoles?.philanthropist) +
        displayRow("<:bush:1379105776790016095>", achieved.greenThumb, verificationRoles?.greenThumb) +
        displayRow("<:clangames:1379105895153270855>", achieved.masterGamer, verificationRoles?.masterGamer) +
        displayRow("<:legendtrophy:1379105415656112229>", achieved.conqueror, verificationRoles?.conqueror) +
        displayRow("<:diamondleague:1379105433486098595>", achieved.vanquisher, verificationRoles?.vanquisher) +
        displayRow("<:capitalgold:1379105449357476012>", achieved.capitalist, verificationRoles?.capitalist) +
        displayRow("<:goblin:1379121226013741086>", achieved.campaigner, verificationRoles?.campaigner) +
        displayRow("<:rock:1379120933096259787>", achieved.rockSolid, verificationRoles?.rockSolid) +
        getThLevelDescription(thLevel, townhallRoles)
    );
}

const getThLevelDescription = (thLevel, townhallRoles) => {
    if (thLevel < 8) return ''
    if (thLevel == 8) return displayRow("<:th8:1379105497696833598>", true, townhallRoles?.townhall8)
    if (thLevel == 9) return displayRow("<:th9:1379105513337520271>", true, townhallRoles?.townhall9)
    if (thLevel == 10) return displayRow("<:th10:1379105521994432552>", true, townhallRoles?.townhall10)
    if (thLevel == 11) return displayRow("<:th11:1379105529896636416>", true, townhallRoles?.townhall11)
    if (thLevel == 12) return displayRow("<:th12:1379105568861458472>", true, townhallRoles?.townhall12)
    if (thLevel == 13) return displayRow("<:th13:1379105577824817224>", true, townhallRoles?.townhall13)
    if (thLevel == 14) return displayRow("<:th14:1379105609974284349>", true, townhallRoles?.townhall14)
    if (thLevel == 15) return displayRow("<:th15:1379105622435565699>", true, townhallRoles?.townhall15)
    if (thLevel == 16) return displayRow("<:th16:1379105633886015510>", true, townhallRoles?.townhall16)
    if (thLevel == 17) return displayRow("<:th17:1379105644304535624>", true, townhallRoles?.townhall17)
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

