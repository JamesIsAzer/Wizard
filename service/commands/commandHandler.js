const client = require('../../client')
//const { isConfigComplete } = require('../config');
const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const loadCommands = (client) => {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, './commands');
    const commandFolders = fs.readdirSync(commandsPath);
  
    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  
      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
      }
    }
};

module.exports = {
    loadCommands,
    name: 'interactionCreate',
    async execute(interaction) {
      //const completedConfig = interaction.guildId ? await isConfigComplete(interaction.guildId) : true
      const command = client.commands.get(interaction.commandName);

      // if (!completedConfig && command.requiresConfigSetup) 
      //   return interaction.reply("Configuration not yet complete. An admin must use \`/setconfiguration\` first.")

      if (!command) return;
      await command.execute(interaction);
    }
};