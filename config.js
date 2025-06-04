const NodeCache = require('node-cache');
const configCache = new NodeCache({ stdTTL: 300 });
const { getConfigDB, updateConfigDB, getAllConfigs } = require('./dao/mongo/guildConfiguration/queries')

const getConfig = async (guildID) => {
    let config = configCache.get(guildID);
    config = await getConfigDB(guildID)
    configCache.set(guildID, config)
    return config;
};

const getAllLeaderboards = async () => 
    (await getAllConfigs())
        .map((result) => result?.leaderboardChannels)
        .filter((channels) => channels)

const updateConfig = async (guildID, config) => {
    configCache.set(guildID, config)
    updateConfigDB(guildID, config)
}

module.exports = {
    getConfig,
    updateConfig,
    getAllLeaderboards
};