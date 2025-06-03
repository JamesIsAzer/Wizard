
const { getConfig } = require('../config');

const removeRoles = async (user, guildID) => {
    const config = await getConfig(guildID)

    const roleIDsRemoved = []
    const removeRolesInList = (user, roles) => {
        for (const [_, roleID] of Object.entries(roles)) {
            if (user.roles.cache.has(roleID)) {
                user.roles.remove(roleID);
                roleIDsRemoved.push(roleID)
            }
        }
    }

    removeRolesInList(user, config.verificationRoles)
    removeRolesInList(user, config.colourRoles)
    removeRolesInList(user, config.townhallRoles)

    return roleIDsRemoved
}

module.exports = {
    removeRoles
};
  

