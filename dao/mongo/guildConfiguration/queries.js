const GuildConfiguration = require('./modal');

const getConfigDB = async (guildID) => {
    config = await GuildConfiguration.findOne({ guildID });
    if (!config) {
        config = await GuildConfiguration.create({ guildID });
    }
    return config;
};

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
  getGuildIDs
};