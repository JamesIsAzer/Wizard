const mongoose = require("mongoose")
const Schema = mongoose.Schema

const verifationSchema = Schema({
    discordID: String,
    playerTag: String
})

module.exports = mongoose.model("Verification", verifationSchema)