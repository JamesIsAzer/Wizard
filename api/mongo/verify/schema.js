const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifySchema = Schema({
    discordID: String,
    playerTag: String,
    leaderboard: Boolean,
    trophies: Number,
    buildertrophies: Number,
    builderleaderboard: Boolean,
})

const verify = mongoose.model("Data", verifySchema);

module.exports = verify;