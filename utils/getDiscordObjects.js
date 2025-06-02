const { client } = require('../client')

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
}

const getChannel = async (guild, channelID) => {
    let logChannel = guild.channels.cache.get(channelID);
    if (!logChannel) {
        try {
            logChannel = await guild.channels.fetch(channelID);
        } catch (error) {
            console.error(`Failed to fetch channel ${channelID}:`, error);
            return null;
        }
    }
}


module.exports = {
    getGuild,
    getChannel
}