const GuildConfiguration = require('./modal');

const getConfigDB = async (guildID) => {
    const config = await GuildConfiguration.findOneAndUpdate(
        { guildID: guildID },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    .lean()
    .exec();

    return config;
};

const getAllConfigs = async () => GuildConfiguration.find()

const updateConfigDB = async (guildID, config) => 
    GuildConfiguration.updateOne(
        { guildID }, 
        { $set: config }, 
        { upsert: true }
    );

const getGuildIDs = async () => 
    GuildConfiguration.find().then((result) => result.map(config => config.guildID));

module.exports = {
  getConfigDB,
  updateConfigDB,
  getGuildIDs,
  getAllConfigs
};