require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

const verify = require('./schema')

const tagVerified = async (tag) => {
    return verify.findOne({
        playerTag: tag
    }).then((result) => {
        if (result) return true
        return false
    })
}

const alreadyTaken = async (tag, discordID) => {
    return verify.findOne({
        discordID: { $ne: discordID },
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })
}

module.exports = {
    tagVerified,
    alreadyTaken
}