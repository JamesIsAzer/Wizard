const leaderboardSnapshots = require('./modal');

const getLeaderboardSnapshotsLegendary = async () => 
    leaderboardSnapshots.find({ trophiesLegends: { $ne: null }}).then((result) => result)

const getLeaderboardSnapshotsBuilder = async () => 
    leaderboardSnapshots.find({ trophiesBuilders: { $ne: null }}).then((result) => result)

const refreshLeaderboardSnapshot = async (participants) => {
    leaderboardSnapshots.deleteMany( { } )
    .then(_ => {
        leaderboardSnapshots.insertMany(participants.map(participant => ({
            discordID: participant.discordID,
            discordUsername: participant.discordUsername,
            gameName: participant.clash.response.data.name,
            gameTag: participant.clash.response.data.tag,
            leagueLegends: participant.leaderboard ? { 
                id: participant.clash.response.data.leagueTier.id, name: participant.clash.response.data.leagueTier.name 
            } : null,
            trophiesLegends: participant.leaderboard ? participant.clash.response.data.trophies : null,
            trophiesBuilders: participant.builderleaderboard ? participant.clash.response.data.builderBaseTrophies : null
        })))
    })
    .catch(e => console.error(e))
}

module.exports = {
    getLeaderboardSnapshotsLegendary,
    getLeaderboardSnapshotsBuilder,
    refreshLeaderboardSnapshot
}