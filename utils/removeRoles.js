
const removeRoles = async (user, config) => {
    const roleIDsRemoved = []
    const removeRolesInList = (user, roles) => {
        for (const [_, roleID] of Object.entries(roles)) {
            if (user.roles.cache.has(roleID)) {
                user.roles.remove(roleID)
                    .catch(_ => console.error(`${new Date().toString()} - Error removing role with role ID: ${roleID}`))
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
  

