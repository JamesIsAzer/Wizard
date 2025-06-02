const mongoose = require("mongoose")
const Schema = mongoose.Schema

const verifationSchema = Schema({
    discordID: { type: String, required: true },
    playerTag: { type: String, required: true }
})

module.exports = mongoose.model("Verification", verifationSchema)