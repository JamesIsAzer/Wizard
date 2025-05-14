const restrictions = require('./modal');

const saveLeaderboardRestriction = async (playerTag, restricted) => 
    restrictions.updateOne({
        playerTag
    }, 
    { $set: { restrictions: { leaderboard: restricted } } },
    { upsert: true })

const isLeaderboardRestricted = async ( playerTag ) =>
    restrictions.findOne({
        playerTag
    }).then((result) => result?.restrictions?.leaderboard)

module.exports = {
    saveLeaderboardRestriction,
    isLeaderboardRestricted
}