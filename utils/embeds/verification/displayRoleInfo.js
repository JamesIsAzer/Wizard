const displayRow = (icon, shouldDisplay, roleID) => shouldDisplay && roleID ? `${icon} <@&${roleID}> added!\n` : ``
const emoji = require('../../../emojis.json')
const displayRowColour = (icon, shouldDisplay, colourRoleID) => shouldDisplay && colourRoleID ? `${icon} <@&${colourRoleID}>\n` : ``
const displayRowColourRequirements = (colourRoleID, roleID) => {
    if (!colourRoleID) return ""
    if (!roleID) return `${emoji.bullet} <@&${colourRoleID}> does not require anything\n\n`
    return `${emoji.bullet} <@&${colourRoleID}> requires <@&${roleID}>\n\n`
}

module.exports = {
    displayRow,
    displayRowColour,
    displayRowColourRequirements
} 