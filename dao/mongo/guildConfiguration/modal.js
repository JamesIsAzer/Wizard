const mongoose = require("mongoose")
const Schema = mongoose.Schema

const guildConfigurationSchema = Schema({
    guildID: { type: String, required: true },
    leaderboardChannels: {
        legendary: { type: String, required: false },
        builder: { type: String, required: false }
    },
    verificationRoles: {
        member: { type: String, required: false },
        legends: { type: String, required: false },
        starLord: { type: String, required: false },
        farmersRUs: { type: String, required: false },
        masterBuilder: { type: String, required: false },
        philanthropist:{ type: String, required: false },
        greenThumb: { type: String, required: false },
        masterGamer: { type: String, required: false },
        conqueror: { type: String, required: false },
        vanquisher: { type: String, required: false },
        capitalist: { type: String, required: false },
        campaigner: { type: String, required: false },
        bsoto: { type: String, required: false },
        rockSolid: { type: String, required: false },
        vip: { type: String, required: false },
        gold: { type: String, required: false }
    },
    colourRoles: {
        default: { type: String, required: false },
        legends: { type: String, required: false },
        starLord: { type: String, required: false },
        farmersRUs: { type: String, required: false },
        masterBuilder: { type: String, required: false },
        philanthropist:{ type: String, required: false },
        greenThumb: { type: String, required: false },
        masterGamer: { type: String, required: false },
        conqueror: { type: String, required: false },
        vanquisher: { type: String, required: false },
        capitalist: { type: String, required: false },
        campaigner: { type: String, required: false },
        bsoto: { type: String, required: false },
        rockSolid: { type: String, required: false },
        vip: { type: String, required: false },
        gold: { type: String, required: false }
    },
    townhallRoles: {
        townhall8: { type: String, required: false },
        townhall9: { type: String, required: false },
        townhall10: { type: String, required: false },
        townhall11: { type: String, required: false },
        townhall12: { type: String, required: false },
        townhall13: { type: String, required: false },
        townhall14: { type: String, required: false },
        townhall15: { type: String, required: false },
        townhall16: { type: String, required: false },
        townhall17: { type: String, required: false }
    }
})

module.exports = mongoose.model("GuildConfiguration", guildConfigurationSchema)