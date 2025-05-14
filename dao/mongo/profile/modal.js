const mongoose = require("mongoose")
const Schema = mongoose.Schema

const profileSchema = Schema({
    discordID: String,
    tag: String
})

module.exports = mongoose.model("Profile", profileSchema)