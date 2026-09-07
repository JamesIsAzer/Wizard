const leaderboardSnapshots = require('./modal');

const LEADERBOARD_CATEGORIES = {
  LEGENDARY: 'LEGENDARY',
  BUILDER: 'BUILDER'
};

const getLeaderboardSnapshotsLegendary = async () => 
    leaderboardSnapshots.find({ category: LEADERBOARD_CATEGORIES.LEGENDARY}).then((result) => result)

const getLeaderboardSnapshotsBuilder = async () => 
    leaderboardSnapshots.find({ category: LEADERBOARD_CATEGORIES.BUILDER}).then((result) => result)


const refreshLegendaryLeaderboardSnapshot = async (participants) => {
  try {
    await leaderboardSnapshots.bulkWrite(
      participants.map(participant => ({
        updateOne: {
          filter: {
            discordID: participant.discordID,
            gameTag: participant.clash.response.data.tag,
            category: LEADERBOARD_CATEGORIES.LEGENDARY
          },
          update: {
            $set: {
              discordUsername: participant.discordUsername,
              gameName: participant.clash.response.data.name,
              league: {
                id: participant.clash.response.data.leagueTier.id,
                name: participant.clash.response.data.leagueTier.name
              },
              trophies: participant.clash.response.data.trophies
            }
          },
          upsert: true
        }
      }))
    );

    const currentParticipants = participants.map(participant => ({
      discordID: participant.discordID,
      gameTag: participant.clash.response.data.tag
    }));

    await leaderboardSnapshots.deleteMany({
      category: LEADERBOARD_CATEGORIES.LEGENDARY,
      $nor: currentParticipants
    });

  } catch (e) {
    console.error(e);
  }
};

const refreshBuilderLeaderboardSnapshot = async (participants) => {
  try {
    await leaderboardSnapshots.bulkWrite(
      participants.map(participant => ({
        updateOne: {
          filter: { discordID: participant.discordID, category: LEADERBOARD_CATEGORIES.BUILDER },
          update: {
            $set: {
              discordUsername: participant.discordUsername,
              gameName: participant.clash.response.data.name,
              gameTag: participant.clash.response.data.tag,
              trophies: participant.clash.response.data.builderBaseTrophies
            }
          },
          upsert: true
        }
      }))
    );

    const currentParticipants = participants.map(participant => ({
      discordID: participant.discordID,
      gameTag: participant.clash.response.data.tag
    }));

    await leaderboardSnapshots.deleteMany({
      category: LEADERBOARD_CATEGORIES.BUILDER,
      $nor: currentParticipants
    });
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