require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.commands = new Collection();


const commandFolders = fs.readdirSync('./service/commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./service/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./service/commands/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
}


client.on('interactionCreate', async interaction => {
    console.log(interaction.isCommand())
    if(!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply({ content: 'Pong!', ephemeral: true})
    }
});

client.once('ready', () => {
    console.log('Ready!')
})
client.login(process.env.DISCORD_TOKEN)