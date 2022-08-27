require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const profile = require('./schema');

const findTag = async (discordID) => 
    profile.findOne({
        discordID
    }).then((result) => result.tag)

const saveDefaultProfile = async (tag, discordID) => 
    profile.updateOne({
        discordID
    }, 
    { $set: { tag: tag }},
    { upsert: true })

module.exports = {
    findTag,
    saveDefaultProfile
}