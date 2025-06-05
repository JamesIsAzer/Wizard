const guildToggles = require('./modal');

const { ownerGuildID } = require('../../../config.json');

const toggleLeaderboard = async (lockLeaderboard) => 
    guildToggles.updateOne({
        guildID: ownerGuildID
    }, 
    { $set: { lockLeaderboard: lockLeaderboard } },
    { upsert: true })

const isLeaderboardLocked = async () =>
    guildToggles.findOne({
        guildID: ownerGuildID,
    }).then((result) => result.lockLeaderboard)

module.exports = {
    toggleLeaderboard,
    isLeaderboardLocked
}