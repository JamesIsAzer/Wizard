const { Collection } = require('discord.js');
const fs = require('fs');
const client = require('./utils/client')
const { scheduleLeaderboards } = require('./utils/scheduler')

require('dotenv').config();

client.commands = new Collection();

const commandFolders = fs.readdirSync('./service/commands');
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./service/commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./service/commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await interaction.deferReply({ ephemeral: true });
    await command.execute(interaction);
  } catch (e) {
    console.log(`${new Date().toString()} - ${e}`);
    await interaction.editReply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.once('ready', () => {
  console.log('Ready!');
  scheduleLeaderboards()
});
client.login(process.env.DISCORD_TOKEN);
