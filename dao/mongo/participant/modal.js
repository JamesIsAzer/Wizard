const mongoose = require("mongoose")
const Schema = mongoose.Schema

const participantSchema = Schema({
    guildID: { type: String, required: true },
    discordID: { type: String, required: true },
    discordUsername: { type: String, required: false },
    playerTag: { type: String, required: true },
    leaderboard: { type: Boolean, required: true },
    builderleaderboard: { type: Boolean, required: true }
})

module.exports = mongoose.model("Participant", participantSchema)