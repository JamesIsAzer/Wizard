const displayRow = (icon, shouldDisplay, roleID) => shouldDisplay && roleID ? `${icon} <@&${roleID}> added!\n` : ``

const displayRowColour = (icon, shouldDisplay, colourRoleID) => shouldDisplay && colourRoleID ? `${icon} <@&${colourRoleID}>\n` : ``
const displayRowColourRequirements = (colourRoleID, roleID) => {
    if (!colourRoleID) return ""
    if (!roleID) return `<:bullet:1379718041293688862> <@&${colourRoleID}> does not require anything\n\n`
    return `<:bullet:1379718041293688862> <@&${colourRoleID}> requires <@&${roleID}>\n\n`
}

module.exports = {
    displayRow,
    displayRowColour,
    displayRowColourRequirements
} 