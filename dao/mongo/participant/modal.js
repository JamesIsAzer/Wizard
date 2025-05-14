const mongoose = require("mongoose")
const Schema = mongoose.Schema

const participantSchema = Schema({
    discordID: String,
    playerTag: String,
    leaderboard: Boolean,
    builderleaderboard: Boolean
})

module.exports = mongoose.model("Participant", participantSchema)