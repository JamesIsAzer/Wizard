
const removeRoles = async (user, config) => {
    const removeRolesInList = (user, roles) => {
        for (const roleID of roles) {
            if (user.roles.cache.has(roleID)) {
                user.roles.remove(roleID)
                    .catch(_ => console.error(`${new Date().toString()} - Error removing role with role ID: ${roleID}`))
            }
        }
    }

    const verificationRolesList = Object.values(config.verificationRoles)
    const colourRolesList = Object.values(config.colourRoles)
    const townhallRolesList = Object.values(config.townhallRoles)

    const removableVerificationRolesList = verificationRolesList
        .filter((role) => role != config.verificationRoles.vip && role != config.verificationRoles.gold)

    removeRolesInList(user, removableVerificationRolesList)
    removeRolesInList(user, colourRolesList)
    removeRolesInList(user, townhallRolesList)
}


module.exports = {
    removeRoles
};
  

