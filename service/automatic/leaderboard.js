const {
    getLeaderboardAccounts
} = require('../../api/mongo/verify/connections');

const {
    findProfile
} = require('../../api/clash/verification');
const { IDs } = require('../../config.json')
const Bottleneck = require('bottleneck');
const client = require('../../utils/client')

const builderChannel = IDs.leaderboardChannels.builder
const legendsChannel = IDs.leaderboardChannels.legendary

const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  

const createLeaderboard = async() => {
    const participants = await getLeaderboardAccounts()
    const playerData = await fetchAllAccounts(participants)
    const participantsSplit = splitParticipants(playerData)
}

const fetchAllAccounts = (participants) => {
    const participantDatas = participants.map((participant) => 
        limiter.schedule(() => {
            return {
                discord: {
                    fetch: client.users.fetch(participant['discordID']),
                    discordID: participant.discordID,
                    leaderboard: participant.leaderboard,
                    builderleaderboard: participant.builderleaderboard
                },
                clash: findProfile(participant.playerTag)
            }
        })
    )
    return Promise.all(participantDatas)
}


const splitParticipants = (participants) => 
    participants.reduce((acc, x) => {
        if (x.discord.leaderboard) acc.legendParticipants.push(x)
        if (x.discord.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })

module.exports = {
    createLeaderboard
}