const mongoose = require("mongoose")
const Schema = mongoose.Schema

const restrictionSchema = Schema({
    guildID: { type: String, required: true },
    playerTag: { type: String, required: true },
    restrictions: { leaderboard: { type: Boolean, required: true } }
})

module.exports = mongoose.model("Restriction", restrictionSchema)