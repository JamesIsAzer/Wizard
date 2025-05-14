const profile = require('./modal');

const findTag = async (discordID) => 
    profile.findOne({
        discordID
    }).then((result) => result?.tag)

const saveDefaultProfile = async (tag, discordID) => 
    profile.updateOne({
        discordID
    }, 
    { $set: { tag: tag }},
    { upsert: true })

const removeDefaultProfile = async (discordID) =>
    profile.deleteOne({discordID}).then((result) => {
        if(result.deletedCount === 1) return true
        else return false
    })

module.exports = {
    findTag,
    saveDefaultProfile,
    removeDefaultProfile
}