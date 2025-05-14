const mongoose = require("mongoose")
const Schema = mongoose.Schema

const guildTogglesSchema = Schema({
    guildID: String,
    lockLeaderboard: Boolean
})

module.exports = mongoose.model("Toggle", guildTogglesSchema)