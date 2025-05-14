const mongoose = require("mongoose")
const Schema = mongoose.Schema

const leaderboardSnapshotSchema = Schema({
    discordID: String,
    discordUsername: String,
    gameName: String,
    gameTag: String,
    trophiesLegends: Number,
    trophiesBuilders: Number
})

module.exports = mongoose.model("Leaderboard_Snapshot", leaderboardSnapshotSchema)