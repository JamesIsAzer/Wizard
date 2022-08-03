const {
    getLeaderboardAccounts
} = require('../../api/mongo/verify/connections');

const {
    findProfile
} = require('../../api/clash/verification');

const {
    getLegendaryLeaderboard,
    getBuilderLeaderboard
} = require('../../utils/embeds/leaderboard')

const { IDs } = require('../../config.json')
const Bottleneck = require('bottleneck');
const client = require('../../utils/client')
const {Promise} = require('bluebird');

const MAX_LEADERBOARD_PARTICIPANTS = 5

const limiter = new Bottleneck({
    maxConcurrent: 40,
    minTime: 25
  });
  
const createLeaderboard = async() => {
    const participants = await getLeaderboardAccounts()
    const discordData = await appendDiscordData(participants)
    const playerData = await fetchAllAccounts(discordData).then((x) => pruneIncompleteData(x))
    
    const participantsSplit = splitParticipants(playerData)

    const topLegends = getTopLegends(participantsSplit.legendParticipants, MAX_LEADERBOARD_PARTICIPANTS)
    const topBuilders = getTopBuilders(participantsSplit.builderParticipants, MAX_LEADERBOARD_PARTICIPANTS)
    const legendParticipantCount = participantsSplit.legendParticipants.length
    const builderParticipantCount = participantsSplit.builderParticipants.length

    const legendsChannel = client.channels.cache.get(IDs.leaderboardChannels.legendary)
    const builderChannel = client.channels.cache.get(IDs.leaderboardChannels.builder)

    legendsChannel.send({embeds: [getLegendaryLeaderboard(topLegends, legendParticipantCount)]})
    builderChannel.send({embeds: [getBuilderLeaderboard(topBuilders, builderParticipantCount)]})
}

const appendDiscordData = async(participants) => {
    const participantsIDs = participants.map((participant) => participant.discordID)
    const guild = client.guilds.cache.get(IDs.guild)
    const memberData = await guild.members.fetch({ user: participantsIDs })

    return participants.map((participant) => {
        return { ...participant._doc, discordUsername: findDiscordUsername(participant, memberData) } 
    })
}

const findDiscordUsername = (participant, memberData) => 
    memberData.reduce((acc, x) => {
        if (acc) return acc
        if (participant.discordID === x.user.id) return `${x.user.username}#${x.user.discriminator}`
    }, null) 

const fetchAllAccounts = (participants) => 
    promiseAllProps(participantDatas = participants.map((participant) => 
        limiter.schedule(() => {
            return {
                discord: participant.discordUsername ? participant.discordUsername : '[Could not find name]',
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
        if (x.db.leaderboard) acc.legendParticipants.push(x)
        if (x.db.builderleaderboard) acc.builderParticipants.push(x)
        return acc
    } , { legendParticipants: [], builderParticipants: [] })

const pruneIncompleteData = (playerData) =>
    playerData.reduce((acc, x) => {
        if (x.clash.response) acc.push(x)
        return acc
    }, [])

const getTopLegends = (legendParticipants, max) => 
    legendParticipants.sort((a, b) => 
        (a.clash.response.trophies > b.clash.response.trophies) ? 1 : 
        ((b.clash.response.trophies > a.clash.response.trophies) ? -1 : 0)
    ).slice(0, max)

const getTopBuilders = (builderParticipants, max) => 
builderParticipants.sort((a, b) => 
    (a.clash.response.versusTrophies > b.clash.response.versusTrophies) ? 1 : 
    ((b.clash.response.versusTrophies > a.clash.response.versusTrophies) ? -1 : 0)
).slice(0, max)

const promiseAllProps = (arrayOfObjects) => 
    Promise.map(arrayOfObjects, (obj) => Promise.props(obj));

module.exports = {
    createLeaderboard
}