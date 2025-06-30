const { ActivityType, MessageFlags } = require('discord.js');
const client = require('./client.js')
const { scheduleLeaderboards } = require('./utils/scheduler')
const connectDB = require('./dao/mongo/config');

require('dotenv').config();

const interactionCommand = require('./service/commands/commandHandler.js');
const interactionEvent = require('./service/events/eventHandler');
const { preloadAllImages } = require('./utils/canvas/shared.js');

interactionCommand.loadCommands(client);

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception at ${new Date().toString()} - ${error}`)
})

setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Heap Used: ${Math.round(mem.heapUsed / 1024 / 1024)} MB, RSS: ${Math.round(mem.rss / 1024 / 1024)} MB`);
}, 3600000);

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isCommand()) return await interactionCommand.execute(interaction)
    return await interactionEvent.execute(interaction)
  } catch (e) {
    console.error(`[INTERACTION ERROR]: ${new Date().toString()} - ${e} ${e.stack}`);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: 'There was an error while executing this command!' });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});

client.once('ready', async () => {
  console.log(`${new Date().toString()} Connected to discord!`);
  await connectDB()
  await preloadAllImages()
  client.user.setPresence({ activities: [{ name: 'with fireballs 🔥', type: ActivityType.Playing }], status: 'online'})
  scheduleLeaderboards()
  console.log(`${new Date().toString()} Wizard is ready to go!`)
});

client.login(process.env.DISCORD_TOKEN);
