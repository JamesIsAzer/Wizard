require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

const verify = require('./schema')

const tagVerified = async (tag) => 
    verify.findOne({
        playerTag: tag
    }).then((result) => {
        if (result) return true
        return false
    })

const alreadyTaken = async (tag, discordID) => 
    verify.findOne({
        discordID: { $ne: discordID },
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })


const getDiscordOfTag = async (tag) => 
    verify.findOne({
        playerTag: tag
    }).then((result) => result.discordID)

const insertVerification = async (tag, discordID) =>
    verify.create({
        discordID: discordID,
        playerTag: tag,
        leaderboard: false,
        trophies: 0,
        builderleaderboard: false,
        buildertrophies: 0
    }).catch((e) => console.log(e))


module.exports = {
    tagVerified,
    alreadyTaken,
    getDiscordOfTag,
    insertVerification
}