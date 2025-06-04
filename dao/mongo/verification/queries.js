const verifation = require('./modal');

const tagVerified = async (tag) => 
    verifation.findOne({
        playerTag: tag
    }).then((result) => {
        if (result) return true
        return false
    })

const alreadyTaken = async (tag, discordID) => 
    verifation.findOne({
        discordID: { $ne: discordID },
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })

const isOwnerOfAccount = async (tag, discordID) => 
    verifation.findOne({
        discordID,
        playerTag: tag
    }).then((result) => {
        if(result) return true
        return false
    })

const getDiscordOfTag = async (tag) => 
    verifation.findOne({
        playerTag: tag
    }).then((result) => result?.discordID)

const insertVerification = async (tag, discordID) =>
    verifation.create({
        discordID,
        playerTag: tag
    }).catch((e) => console.error(e))
    
const tagVerifiedBySameUser = async (tag, discordID) => 
    verifation.findOne({
      discordID,
      playerTag: tag,
    })
    .then((result) => {
      if (result) return true;
      return false;
    });

const unverifyUser = async (discordID) =>
    verifation.deleteMany({
        discordID: discordID
    }).then(result => result)
    .catch((e) => console.error(e))

const getVerifications = async (discordID) =>
    verifation.find({discordID})

const getAllVerifications = async () =>
    verifation.find()

const getVerificationCount = async () => 
    verifation.countDocuments()

module.exports = {
    tagVerified,
    alreadyTaken,
    isOwnerOfAccount,
    getDiscordOfTag,
    insertVerification,
    tagVerifiedBySameUser,
    unverifyUser,
    getVerifications,
    getAllVerifications,
    getVerificationCount
}