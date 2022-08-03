const {
    getLeaderboardAccounts
} = require('../../api/mongo/verify/connections');

const {
    findProfile
} = require('../../api/clash/verification');
const { IDs } = require('../../config.json')
const Bottleneck = require('bottleneck');
const client = require('../../utils/client')
const {Promise} = require('bluebird')
const builderChannel = IDs.leaderboardChannels.builder
const legendsChannel = IDs.leaderboardChannels.legendary

const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  

const createLeaderboard = async() => {
    const participants = await getLeaderboardAccounts()
    console.time("Time taken")
    const playerData = fetchAllAccounts(participants)

    console.timeEnd("Time taken")
    const participantsSplit = splitParticipants(playerData)

    
    const legendParticipants = participantsSplit.legendParticipants
    const builderParticipants = participantsSplit.builderParticipants

}

const fetchAllAccounts = (participants) => 
    promiseAllProps(participantDatas = participants.map((participant) => 
        limiter.schedule(() => {
            return {
                discord: client.users.fetch(participant['discordID']),
                clash: findProfile(participant.playerTag),
                db: {
                    discordID: participant.discordID,
                    leaderboard: participant.leaderboard,
                    builderleaderboard: participant.builderleaderboard
                }
            }
        })
    ))

const splitParticipants = (participants) => 
    participants.reduce((acc, x) => {
        if (x.discord.leaderboard) acc.legendParticipants.push(x)
        if (x.discord.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })


const promiseAllProps = (arrayOfObjects) => 
    Promise.map(arrayOfObjects, (obj) => Promise.props(obj));

module.exports = {
    createLeaderboard
}