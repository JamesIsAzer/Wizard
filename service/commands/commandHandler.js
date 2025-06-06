const client = require('../../client')
const { Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const loadCommands = (client) => {
    client.commands = new Collection();
    const commandsPath = __dirname;
    const commandFolders = fs.readdirSync(commandsPath, {withFileTypes: true})
      .filter(child => child.isDirectory())
      .map(child => child.name)

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      const commandFiles = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.js'))
  
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
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    }
};