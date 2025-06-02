const mongoose = require("mongoose")
const Schema = mongoose.Schema

const guildTogglesSchema = Schema({
    guildID: { type: String, required: true },
    lockLeaderboard: { type: Boolean, required: true }
})

module.exports = mongoose.model("Toggle", guildTogglesSchema)