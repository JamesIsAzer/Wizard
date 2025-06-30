const { getLeaderboardAccounts } = require('../../dao/mongo/participant/queries');
const { refreshLeaderboardSnapshot } = require('../../dao/mongo/leaderboardSnapshot/queries');
const { findProfile } = require('../../dao/clash/verification');
const { getLegendaryLeaderboard, getBuilderLeaderboard } = require('../../utils/embeds/leaderboard')
const { getHowToCompete } = require('../../utils/buttons/leaderboard')
const { ownerGuildID } = require('../../config.json')
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
    minTime: 0                      
});

const createLeaderboard = async() => {
    console.log(`${new Date().toString()} Creating leaderboards`)
    
    const leaderboards = getAllLeaderboards()
    const participants = await getLeaderboardAccounts()
    const discordData = await appendDiscordData(participants)
    const filteredDiscordData = filterInvalidAccounts(discordData)
    const playerData = await fetchAllAccounts(filteredDiscordData).then((x) => pruneIncompleteData(x))
    
    const participantsSplit = splitParticipants(playerData)

    const topLegends = takeTopPlayers(sortLegends(participantsSplit.legendParticipants))
    const topBuilders = takeTopPlayers(sortBuilders(participantsSplit.builderParticipants))

    const legendParticipantCount = participantsSplit.legendParticipants.length
    const builderParticipantCount = participantsSplit.builderParticipants.length

    const { legendsChannelIDs, builderChannelIDs } = findLeaderboardChannels(await leaderboards)

    refreshLeaderboardSnapshot(playerData)
    
    sendLeaderboards(legendsChannelIDs, builderChannelIDs, topLegends, topBuilders, legendParticipantCount, builderParticipantCount)
}

const sendLeaderboards = async (
    legendsChannelIDs, 
    builderChannelIDs, 
    topLegends, 
    topBuilders, 
    legendParticipantCount, 
    builderParticipantCount
) => {
    const sendTasks = [
        ...legendsChannelIDs.map((channelID) =>
            discordAPILimiter.schedule(async () => {
                try {
                    const channel = await getChannel(channelID);
                    await channel.send({
                        embeds: [
                            getLegendaryLeaderboard(
                                formatToSnapshot(topLegends),
                                legendParticipantCount,
                                0,
                                MAX_LEADERBOARD_PARTICIPANTS
                            )
                        ],
                        components: [getHowToCompete()]
                    });
                } catch (e) {
                    console.error(`Failed to send to legend channel ${channelID}:`, e);
                }
            })
        ),
        ...builderChannelIDs.map((channelID) =>
            discordAPILimiter.schedule(async () => {
                try {
                    const channel = await getChannel(channelID);
                    await channel.send({
                        embeds: [
                            getBuilderLeaderboard(
                                formatToSnapshot(topBuilders),
                                builderParticipantCount,
                                0,
                                MAX_LEADERBOARD_PARTICIPANTS
                            )
                        ],
                        components: [getHowToCompete()]
                    });
                } catch (e) {
                    console.error(`Failed to send to builder channel ${channelID}:`, e);
                }
            })
        )
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

const appendDiscordData = async(participants) => {
    const participantsIDs = participants.map((participant) => participant.discordID)
    const guild = client.guilds.cache.get(ownerGuildID)
    
    const participantIDChunks = chunk(participantsIDs, 100)

    const memberDataAsync = participantIDChunks.reduce((acc, participantIDChunk) => {
        const members = guild.members.fetch({ user: participantIDChunk })
        return acc.concat(members)
    }, [])

    const memberDataArray = (await Promise.all(memberDataAsync))
    const memberData = new Map(memberDataArray.map(x => [...x]).flat())

    return participants.map((participant) => ({ ...participant._doc, discordUsername: findDiscordUsername(participant, memberData) }))
}

const findDiscordUsername = (participant, memberData) => {
    const discordUser = memberData.get(participant.discordID)?.user
    return discordUser ? `${discordUser.username}` : null
}

const filterInvalidAccounts = (participants) => 
    participants.filter((participant) => participant.discordUsername)

const fetchAllAccounts = (participants) => 
    promiseAllProps(
        participants.map((participant) => 
            clashAPILimiter.schedule(async () => {
                const clashData = await findProfile(participant.playerTag)
                return {
                    discordUsername: participant.discordUsername,
                    clash: clashData,
                    discordID: participant.discordID,
                    leaderboard: participant.leaderboard,
                    builderleaderboard: participant.builderleaderboard
                }
            })
        )
    )

const splitParticipants = (participants) => 
    participants.reduce((acc, x) => {
        if (x.leaderboard) acc.legendParticipants.push(x)
        if (x.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })

const pruneIncompleteData = (playerData) =>
    playerData.reduce((acc, x) => {
        if (x.clash.response?.found) acc.push(x)
        return acc
    }, [])

const sortLegends = (legendParticipants) => 
    legendParticipants.sort((a, b) => b.clash.response.data.trophies - a.clash.response.data.trophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const sortBuilders = (builderParticipants) => 
    builderParticipants.sort((a, b) => b.clash.response.data.builderBaseTrophies - a.clash.response.data.builderBaseTrophies)
        .slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const takeTopPlayers = (participants) => participants.slice(0, MAX_LEADERBOARD_PARTICIPANTS)

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    )

const formatToSnapshot = (participants) => participants.map(participant => ({
    discordID: participant.discordID,
    discordUsername: participant.discordUsername,
    gameName: participant.clash.response.data.name,
    gameTag: participant.clash.response.data.tag,
    trophiesLegends: participant.leaderboard ? participant.clash.response.data.trophies : null,
    trophiesBuilders: participant.builderleaderboard ? participant.clash.response.data.builderBaseTrophies : null
}))

module.exports = {
    createLeaderboard,
    splitParticipants,
    sortLegends,
    sortBuilders
}