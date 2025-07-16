const participants = require('./modal');

const getLeaderboardAccounts = async ( guildID ) => 
    participants.find({ guildID }).then((result) => result)

const checkIfCompetingInBoth = async ( tag, discordID ) => 
    participants.findOne({
        discordID,
        playerTag: tag,
        leaderboard: true,
        builderleaderboard: true
    }).then((result) => { 
        if (result) return true
        return false
    })

const updateLeaderboardParticipation = async (tag, discordID, discordUsername, leaderboard, builderleaderboard) =>
    participants.updateOne({ discordID, playerTag: tag },
    { $set: { leaderboard, builderleaderboard, discordUsername } },
    { upsert: true })

const uncompete = async ( tag, discordID ) =>
    participants.deleteOne({ discordID, playerTag: tag }).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

const uncompeteAnyone = async ( tag ) =>
    participants.deleteOne({ playerTag: tag }).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

const uncompeteAllAccountsForUser = async ( discordID ) =>
    participants.deleteMany({
        discordID
    }).then(result => result)
    .catch((e) => console.error(e))

const resetLeaderboards = async () =>
    participants.deleteMany( { } ).catch(e => console.error(e))


module.exports = {
    getLeaderboardAccounts,
    checkIfCompetingInBoth,
    updateLeaderboardParticipation,
    uncompete,
    uncompeteAnyone,
    uncompeteAllAccountsForUser,
    resetLeaderboards
}