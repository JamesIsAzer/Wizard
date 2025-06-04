const { ActivityType, MessageFlags } = require('discord.js');
const client = require('./client.js')
const { scheduleLeaderboards } = require('./utils/scheduler')
const connectDB = require('./dao/mongo/config');

require('dotenv').config();

const interactionCommand = require('./service/commands/commandHandler.js');
const interactionEvent = require('./service/events/eventHandler');

interactionCommand.loadCommands(client);

//process.on('uncaughtException', (error) => {
//  console.error(`Uncaught exception at ${new Date().toString()} - ${error}`)
//})

//process.on('unhandledRejection', (reason, promise) => {
//  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
//})

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isCommand()) return await interactionCommand.execute(interaction)
    return await interactionEvent.execute(interaction)
  } catch (e) {
    console.error(`[INTERACTION ERROR]: ${new Date().toString()} - ${e}`);
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
