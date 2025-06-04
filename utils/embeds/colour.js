const { EmbedBuilder } = require('discord.js');
const { IDs } = require('../../config.json');
const { displayRow, displayRowColour, displayRowColourRequirements } = require('./verification/displayRoleInfo');
const colours = IDs.verificationRoles.colour;
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
    displayRowColour("<:legend:1379105324660818060>", shouldDisplayRole(colourRoles?.legends, verificationRoles?.legends), colourRoles?.legends) +
    displayRowColour("<:star:1379105336174186536>", shouldDisplayRole(colourRoles?.starLord, verificationRoles?.starLord), colourRoles?.starLord) +
    displayRowColour("<:loot:1379105350200070164>", shouldDisplayRole(colourRoles?.farmersRUs, verificationRoles?.farmersRUs), colourRoles?.farmersRUs) +
    displayRowColour("<:masterbuilder:1379105361004335174>", shouldDisplayRole(colourRoles?.masterBuilder, verificationRoles?.masterBuilder), colourRoles?.masterBuilder) +
    displayRowColour("<:clancastle:1379105390565916824>", shouldDisplayRole(colourRoles?.philanthropist, verificationRoles?.philanthropist), colourRoles?.philanthropist) +
    displayRowColour("<:bush:1379105776790016095>", shouldDisplayRole(colourRoles?.greenThumb, verificationRoles?.greenThumb), colourRoles?.greenThumb) +
    displayRowColour("<:clangames:1379105895153270855>", shouldDisplayRole(colourRoles?.masterGamer, verificationRoles?.masterGamer), colourRoles?.masterGamer) +
    displayRowColour("<:legendtrophy:1379105415656112229>", shouldDisplayRole(colourRoles?.conqueror, verificationRoles?.conqueror), colourRoles?.conqueror) +
    displayRowColour("<:diamondleague:1379105433486098595>", shouldDisplayRole(colourRoles?.vanquisher, verificationRoles?.vanquisher), colourRoles?.vanquisher) +
    displayRowColour("<:capitalgold:1379105449357476012>", shouldDisplayRole(colourRoles?.capitalist, verificationRoles?.capitalist), colourRoles?.capitalist) +
    displayRowColour("<:goblin:1379121226013741086>", shouldDisplayRole(colourRoles?.campaigner, verificationRoles?.campaigner), colourRoles?.campaigner) +
    displayRowColour("<:rock:1379120933096259787>", shouldDisplayRole(colourRoles?.rockSolid, verificationRoles?.rockSolid), colourRoles?.rockSolid) +
    displayRowColour("<:heart:1379105474275705012>", shouldDisplayRole(colourRoles?.vip, verificationRoles?.vip), colourRoles?.vip) +
    displayRowColour("<:gold:1379105463102341190>", shouldDisplayRole(colourRoles?.gold, verificationRoles?.gold), colourRoles?.gold) +
    displayRowColour("<:unranked:935678512822616074>", true, colourRoles?.default)
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
