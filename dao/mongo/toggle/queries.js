const guildToggles = require('./modal');

const { IDs } = require('../../../config.json');

const toggleLeaderboard = async (lockLeaderboard) => 
    guildToggles.updateOne({
        guildID: IDs.guild
    }, 
    { $set: { lockLeaderboard: lockLeaderboard } },
    { upsert: true })

const isLeaderboardLocked = async () =>
    guildToggles.findOne({
        guildID: IDs.guild,
    }).then((result) => result.lockLeaderboard)

module.exports = {
    toggleLeaderboard,
    isLeaderboardLocked
}