const mongoose = require("mongoose")
const Schema = mongoose.Schema

const profileSchema = Schema({
    discordID: { type: String, required: true },
    tag: { type: String, required: true }
})

module.exports = mongoose.model("Profile", profileSchema)