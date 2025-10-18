const mongoose = require("mongoose")
const Schema = mongoose.Schema

const leaderboardSnapshotSchema = Schema({
    discordID: { type: String, required: true },
    discordUsername: { type: String, required: true },
    gameName: { type: String, required: true },
    gameTag: { type: String, required: true },
    leagueLegends: { id: { type: Number, required: false }, name: { type: String, required: false } },
    trophiesLegends: { type: Number, required: false },
    trophiesBuilders: { type: Number, required: false }
})

module.exports = mongoose.model("Leaderboard_Snapshot", leaderboardSnapshotSchema)