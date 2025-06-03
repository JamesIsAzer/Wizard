const NodeCache = require('node-cache');
const configCache = new NodeCache({ stdTTL: 300 });
const { getConfigDB, updateConfigDB } = require('./dao/mongo/guildConfiguration/queries')

const getConfig = async (guildID) => {
    console.log("1")
    let config = configCache.get(guildID);
    console.log("2")

    config = await getConfigDB(guildID)
    console.log("3")

    configCache.set(guildID, config)
    return config;
};

const updateConfig = async (guildID, config) => {
    configCache.set(guildID, config)
    updateConfigDB(guildID, config)
}

module.exports = {
    getConfig,
    updateConfig
};