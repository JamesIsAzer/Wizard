const { getLeaderboardAccounts, getLegendaryLeaderboardAccounts, getBuilderLeaderboardAccounts } = require('../../dao/mongo/participant/queries');
const { refreshBuilderLeaderboardSnapshot, refreshLegendaryLeaderboardSnapshot } = require('../../dao/mongo/leaderboardSnapshot/queries');
const { findProfile } = require('../../dao/clash/verification');
const { getLegendaryLeaderboard, getBuilderLeaderboard } = require('../../utils/embeds/leaderboard')
const { getHowToCompete } = require('../../utils/buttons/leaderboard')
const Bottleneck = require('bottleneck');
const client = require('../../client')
const {Promise} = require('bluebird');
const { promiseAllProps } = require('../../utils/promiseHelpers');
const { getAllLeaderboards } = require('../../config');
const { getChannel } = require('../../utils/getDiscordObjects');

const MAX_LEADERBOARD_PARTICIPANTS = 5

const clashAPISecondLimiter = new Bottleneck({
    reservoir: 60,
    reservoirRefreshAmount: 60,
    reservoirRefreshInterval: 1000,
    maxConcurrent: 10
});

const clashAPIMinuteLimiter = new Bottleneck({
    reservoir: 2500,
    reservoirRefreshAmount: 2500,
    reservoirRefreshInterval: 60_000,
});

const clashAPILimiter = clashAPISecondLimiter.chain(clashAPIMinuteLimiter)

const discordAPILimiter = new Bottleneck({
    reservoir: 25,                  
    reservoirRefreshAmount: 25,     
    reservoirRefreshInterval: 1000, 
    maxConcurrent: 5,
    minTime: 50                      
});

const createLegendaryLeaderboard = async() => {
    console.log(`${new Date().toString()} Creating legendary leaderboards`)
    const leaderboards = getAllLeaderboards()
    const participants = await getLegendaryLeaderboardAccounts() 

    const playerData = await fetchAllAccounts(participants).then((x) => pruneIncompleteData(x))
    const topLegends = takeTopPlayers(sortLegends(playerData))

    const legendParticipantCount = playerData.length

    const { legendsChannelIDs } = findLeaderboardChannels(await leaderboards)

    refreshLegendaryLeaderboardSnapshot(playerData)

    sendLegendaryLeaderboard(legendsChannelIDs, topLegends, legendParticipantCount, "legend")
}

const createBuilderLeaderboard = async() => {
    console.log(`${new Date().toString()} Creating builder leaderboards`)
    const leaderboards = getAllLeaderboards()
    const participants = await getBuilderLeaderboardAccounts() 

    const playerData = await fetchAllAccounts(participants).then((x) => pruneIncompleteData(x))
    const topBuilders = takeTopPlayers(sortBuilders(playerData))

    const builderParticipantCount = playerData.length

    const { builderChannelIDs } = findLeaderboardChannels(await leaderboards)

    refreshBuilderLeaderboardSnapshot(playerData)

    sendBuilderLeaderboard(builderChannelIDs, topBuilders, builderParticipantCount, "builder")
}

const sendLegendaryLeaderboard = async (
    channelIDs,
    topUsers,
    participantCount
) => {
    const sendTasks = [
        ...channelIDs.map((channelID) =>
            discordAPILimiter.schedule(async () => {
                try {
                    const channel = await getChannel(channelID);
                    await channel.send({
                        embeds: [
                            getLegendaryLeaderboard(
                                formatToLegendarySnapshot(topUsers),
                                participantCount,
                                0,
                                MAX_LEADERBOARD_PARTICIPANTS
                            )
                        ],
                        components: [getHowToCompete()]
                    });
                } catch (e) {
                    console.error(`${new Date().toString()} - Failed to send to legendary channel ${channelID}, ${e}`);
                }
            })
        ),
    ];

    await Promise.allSettled(sendTasks);
}

const sendBuilderLeaderboard = async (
    channelIDs,
    topUsers,
    participantCount
) => {
    const sendTasks = [
        ...channelIDs.map((channelID) =>
            discordAPILimiter.schedule(async () => {
                try {
                    const channel = await getChannel(channelID);
                    await channel.send({
                        embeds: [
                            getBuilderLeaderboard(
                                formatToBuilderSnapshot(topUsers),
                                participantCount,
                                0,
                                MAX_LEADERBOARD_PARTICIPANTS
                            )
                        ],
                        components: [getHowToCompete()]
                    });
                } catch (e) {
                    console.error(`${new Date().toString()} - Failed to send to builder channel ${channelID}, ${e}`);
                }
            })
        ),
    ];

    await Promise.allSettled(sendTasks);
}

const findLeaderboardChannels = (leaderboards) => 
    leaderboards.reduce((acc, { legendary, builder }) => {
          if (legendary) acc.legendsChannelIDs.push(legendary);
          if (builder) acc.builderChannelIDs.push(builder);
          return acc;
        },
        { legendsChannelIDs: [], builderChannelIDs: [] }
      );

const fetchAllAccounts = (participants) => 
    promiseAllProps(
        participants.map((participant) => 
            clashAPILimiter.schedule(async () => {
                const clashData = await findProfile(participant.playerTag)
                return {
                    discordUsername: participant.discordUsername ?? "-",
                    clash: clashData,
                    discordID: participant.discordID,
                    leaderboard: participant.leaderboard,
                    builderleaderboard: participant.builderleaderboard
                }
            })
        )
    )

const pruneIncompleteData = (playerData) =>
    playerData.reduce((acc, x) => {
        if (x.clash.response?.found) acc.push(x)
        return acc
    }, [])

const sortLegends = (legendParticipants) =>
  legendParticipants
    .sort((a, b) => {
      const leagueA = a.clash.response.data.leagueTier.id;
      const leagueB = b.clash.response.data.leagueTier.id;
      const trophiesA = a.clash.response.data.trophies;
      const trophiesB = b.clash.response.data.trophies;

      // 1) Sort by league tier ID (descending)
      if (leagueB !== leagueA) {
        return leagueB - leagueA;
      }

      // 2) If same league tier, sort by trophies (descending)
      return trophiesB - trophiesA;
    })
    .slice(0, MAX_LEADERBOARD_PARTICIPANTS);

const sortBuilders = (builderParticipants) => 
    builderParticipants.sort((a, b) => b.clash.response.data.builderBaseTrophies - a.clash.response.data.builderBaseTrophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const takeTopPlayers = (participants) => participants.slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const formatToLegendarySnapshot = (participants) => participants.map(participant => ({
    discordID: participant.discordID,
    discordUsername: participant.discordUsername,
    gameName: participant.clash.response.data.name,
    gameTag: participant.clash.response.data.tag,
    league: {
        id: participant.clash.response.data.leagueTier.id, name: participant.clash.response.data.leagueTier.name
    },
    trophies: participant.clash.response.data.trophies,
}))

const formatToBuilderSnapshot = (participants) => participants.map(participant => ({
    discordID: participant.discordID,
    discordUsername: participant.discordUsername,
    gameName: participant.clash.response.data.name,
    gameTag: participant.clash.response.data.tag,
    trophies:participant.clash.response.data.builderBaseTrophies
}))

module.exports = {
    createLegendaryLeaderboard,
    createBuilderLeaderboard,
    sortLegends,
    sortBuilders
}