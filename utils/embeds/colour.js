const { EmbedBuilder } = require('discord.js');
const emojis = require('../../emojis.json');
const { displayRowColour, displayRowColourRequirements } = require('./verification/displayRoleInfo');
const getSuccessfulColourEmbed = (roleID) =>
  new EmbedBuilder()
    .setTitle('🔥 Color override added! 🔥')
    .setColor('#00de30')
    .setDescription(`I have added <@&${roleID}> as your override`);

const getUnsatisfiedRequirementEmbed = (roleID) =>
  new EmbedBuilder()
    .setTitle("💨 Couldn't add color override! 💨")
    .setColor('#d10202')
    .setDescription(`For this override you need <@&${roleID}>`);

const getColourList = (user, colourRoles, verificationRoles) => {
  const shouldDisplayRole = (colourRole, verificationRole) => {
    if (!verificationRole) return true
    return (colourRole && user.roles.cache.has(verificationRole))
  }

  return (
    displayRowColour(emojis.legend, shouldDisplayRole(colourRoles?.legends, verificationRoles?.legends), colourRoles?.legends) +
    displayRowColour(emojis.star, shouldDisplayRole(colourRoles?.starLord, verificationRoles?.starLord), colourRoles?.starLord) +
    displayRowColour(emojis.loot, shouldDisplayRole(colourRoles?.farmersRUs, verificationRoles?.farmersRUs), colourRoles?.farmersRUs) +
    displayRowColour(emojis.masterbuilder, shouldDisplayRole(colourRoles?.masterBuilder, verificationRoles?.masterBuilder), colourRoles?.masterBuilder) +
    displayRowColour(emojis.clancastle, shouldDisplayRole(colourRoles?.philanthropist, verificationRoles?.philanthropist), colourRoles?.philanthropist) +
    displayRowColour(emojis.bush, shouldDisplayRole(colourRoles?.greenThumb, verificationRoles?.greenThumb), colourRoles?.greenThumb) +
    displayRowColour(emojis.clangames, shouldDisplayRole(colourRoles?.masterGamer, verificationRoles?.masterGamer), colourRoles?.masterGamer) +
    displayRowColour(emojis.legendtrophy, shouldDisplayRole(colourRoles?.conqueror, verificationRoles?.conqueror), colourRoles?.conqueror) +
    displayRowColour(emojis.diamondleague, shouldDisplayRole(colourRoles?.vanquisher, verificationRoles?.vanquisher), colourRoles?.vanquisher) +
    displayRowColour(emojis.capitalgold, shouldDisplayRole(colourRoles?.capitalist, verificationRoles?.capitalist), colourRoles?.capitalist) +
    displayRowColour(emojis.goblin, shouldDisplayRole(colourRoles?.campaigner, verificationRoles?.campaigner), colourRoles?.campaigner) +
    displayRowColour(emojis.xp, shouldDisplayRole(colourRoles?.bsoto, verificationRoles?.bsoto), colourRoles?.bsoto) +
    displayRowColour(emojis.rock, shouldDisplayRole(colourRoles?.rockSolid, verificationRoles?.rockSolid), colourRoles?.rockSolid) +
    displayRowColour(emojis.heart, shouldDisplayRole(colourRoles?.vip, verificationRoles?.vip), colourRoles?.vip) +
    displayRowColour(emojis.gold, shouldDisplayRole(colourRoles?.gold, verificationRoles?.gold), colourRoles?.gold) +
    displayRowColour(emojis.unranked, true, colourRoles?.default)
  )
}

const getColourListRequirements = (colourRoles, verificationRoles) => {
  return (
    displayRowColourRequirements(colourRoles?.legends, verificationRoles?.legends) +
    displayRowColourRequirements(colourRoles?.starLord, verificationRoles?.starLord) +
    displayRowColourRequirements(colourRoles?.farmersRUs, verificationRoles?.farmersRUs) +
    displayRowColourRequirements(colourRoles?.masterBuilder, verificationRoles?.masterBuilder) +
    displayRowColourRequirements(colourRoles?.philanthropist, verificationRoles?.philanthropist) +
    displayRowColourRequirements(colourRoles?.greenThumb, verificationRoles?.greenThumb) +
    displayRowColourRequirements(colourRoles?.masterGamer, verificationRoles?.masterGamer) +
    displayRowColourRequirements(colourRoles?.conqueror, verificationRoles?.conqueror) +
    displayRowColourRequirements(colourRoles?.vanquisher, verificationRoles?.vanquisher) +
    displayRowColourRequirements(colourRoles?.capitalist, verificationRoles?.capitalist) +
    displayRowColourRequirements(colourRoles?.campaigner, verificationRoles?.campaigner) +
    displayRowColourRequirements(colourRoles?.bsoto, verificationRoles?.bsoto) +
    displayRowColourRequirements(colourRoles?.rockSolid, verificationRoles?.rockSolid) +
    displayRowColourRequirements(colourRoles?.vip, verificationRoles?.vip) +
    displayRowColourRequirements(colourRoles?.gold, verificationRoles?.gold) +
    displayRowColourRequirements(colourRoles?.default, verificationRoles?.default)
  )
}

const getColoursListEmbed = (colourRoles, verificationRoles) => {
  const colourList = getColourListRequirements(colourRoles, verificationRoles)
  
  return new EmbedBuilder()
    .setTitle('Colours List')
    .setColor('#4CF7D6')
    .setDescription(
      `These are all the available colour roles\nUse \`/colour add\` to change your colour override\n\n` +
        colourList +
      `Use \`/colour remove\` to remove your colour roles.`
    );
};

const getAvailableColoursListEmbed = (user, colourRoles, verificationRoles) => {
  const colourList = getColourList(user, colourRoles, verificationRoles)

  return new EmbedBuilder()
    .setTitle('Colours List')
    .setColor('#4CF7D6')
    .setDescription(
      `These are all colour roles you can switch to\nUse \`/colour add\` to change your colour override\n\n` +
        colourList +
      `\nLooks wrong? Make sure you have the required roles first. Use \`/verify\` to get any applicable roles\nUse \`/colour remove\` to remove your colour roles.`
    );
};

module.exports = {
  getUnsatisfiedRequirementEmbed,
  getSuccessfulColourEmbed,
  getColoursListEmbed,
  getAvailableColoursListEmbed,
};
