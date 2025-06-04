const client = require('../client')

const getGuild = async (guildID) => {
    let guild = client.guilds.cache.get(guildID);
    if (!guild) {
        try {
            guild = await client.guilds.fetch(guildID);
        } catch (error) {
            console.error(`Failed to fetch guild ${guildID}:`, error);
            return null;
        }
    }

    return guild
}

const getChannel = async (channelID) => {
    let logChannel = client.channels.cache.get(channelID);
    if (!logChannel) {
        try {
            logChannel = await client.channels.fetch(channelID);
        } catch (error) {
            console.error(`Failed to fetch channel ${channelID}:`, error);
            return null;
        }
    }
    
    return logChannel
}


module.exports = {
    getGuild,
    getChannel
}