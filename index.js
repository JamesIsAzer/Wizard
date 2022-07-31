const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.commands = new Collection();


const commandFolders = fs.readdirSync('./service/commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./service/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        
      const command = require(`./service/commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
    }
}


client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (e) {
        console.log(`${new Date().toString()} - ${e}`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log('Ready!')
})
client.login(process.env.DISCORD_TOKEN)