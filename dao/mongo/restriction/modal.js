const mongoose = require("mongoose")
const Schema = mongoose.Schema

const restrictionSchema = Schema({
    playerTag: String,
    restrictions: { leaderboard: Boolean }
})

module.exports = mongoose.model("Restriction", restrictionSchema)