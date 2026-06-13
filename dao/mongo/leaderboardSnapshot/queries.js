const leaderboardSnapshots = require('./modal');

const getLeaderboardSnapshotsLegendary = async () => 
    leaderboardSnapshots.find({ trophiesLegends: { $ne: null }}).then((result) => result)

const getLeaderboardSnapshotsBuilder = async () => 
    leaderboardSnapshots.find({ trophiesBuilders: { $ne: null }}).then((result) => result)


const refreshLegendaryLeaderboardSnapshot = async (participants) => {
  try {
    await leaderboardSnapshots.bulkWrite(
      participants.map(participant => ({
        updateOne: {
          filter: { discordID: participant.discordID },
          update: {
            $set: {
              discordUsername: participant.discordUsername,
              gameName: participant.clash.response.data.name,
              gameTag: participant.clash.response.data.tag,
              leagueLegends: participant.leaderboard
                ? {
                    id: participant.clash.response.data.leagueTier.id,
                    name: participant.clash.response.data.leagueTier.name
                  }
                : null,
              trophiesLegends: participant.leaderboard
                ? participant.clash.response.data.trophies
                : null
            }
          },
          upsert: true
        }
      }))
    );
  } catch (e) {
    console.error(e);
  }
};

const refreshBuilderLeaderboardSnapshot = async (participants) => {
  try {
    await leaderboardSnapshots.bulkWrite(
      participants.map(participant => ({
        updateOne: {
          filter: { discordID: participant.discordID },
          update: {
            $set: {
              discordUsername: participant.discordUsername,
              gameName: participant.clash.response.data.name,
              gameTag: participant.clash.response.data.tag,
              trophiesBuilders: participant.builderleaderboard 
                ? participant.clash.response.data.builderBaseTrophies
                : null
            }
          },
          upsert: true
        }
      }))
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
    getLeaderboardSnapshotsLegendary,
    getLeaderboardSnapshotsBuilder,
    refreshLegendaryLeaderboardSnapshot,
    refreshBuilderLeaderboardSnapshot
}