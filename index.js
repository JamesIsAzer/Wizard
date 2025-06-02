const { ActivityType, MessageFlags } = require('discord.js');
const client = require('./client.js')
const { scheduleLeaderboards } = require('./utils/scheduler')
const connectDB = require('./dao/mongo/config');

require('dotenv').config();

const interactionCommand = require('./service/commands/commandHandler.js');
const interactionEvent = require('./service/events/eventHandler');

interactionCommand.loadCommands(client);

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isCommand()) return interactionCommand.execute(interaction)
    return interactionEvent.execute(interaction)
  } catch (e) {
    console.log(`${new Date().toString()} - ${e}`);
    await interaction.editReply({
      content: 'There was an error while executing this command!',
      flags: MessageFlags.Ephemeral
    });
  }
});

client.once('ready', async () => {
  console.log('Connected to discord!');
  await connectDB()

  client.user.setPresence({ activities: [{ name: 'with fireballs 🔥', type: ActivityType.Playing }], status: 'online'})
  scheduleLeaderboards()
  console.log('Wizard is ready to go!')
});

client.login(process.env.DISCORD_TOKEN);
