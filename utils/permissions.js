const { mediumPermRolesID, fullPermRolesID } = require('../config.json');

const hasMediumPerms = (member) => member.roles.cache.find(r => mediumPermRolesID.includes(r.id) || IDs.fullPermRoles.includes(r.id))

const hasFullPerms = (member) => member.roles.cache.find(r => fullPermRolesID.includes(r.id))

module.exports = {
    hasMediumPerms,
    hasFullPerms
}