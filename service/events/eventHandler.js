const fs = require('fs');
const path = require('path');
const { MessageFlags } = require('discord.js');

const buttonHandlers = new Map();
const modalHandlers = new Map();
const selectMenuHandlers = new Map();

const BUTTON_DIRECTORY = 'buttons'
//const MODAL_DIRECTORY = 'modals'
//const SELECT_MENU_DIRECTORY = 'selectMenus'

const loadHandlers = (eventHandler, directory) => {
  const eventPath = path.join(__dirname, `./${directory}`);
  for (const file of fs.readdirSync(eventPath)) {
    const handler = require(path.join(eventPath, file));
    if (handler.idPrefix) {
      eventHandler.set(handler.idPrefix, handler);
    }
  }
}

loadHandlers(buttonHandlers, BUTTON_DIRECTORY)
//loadHandlers(modalHandlers, MODAL_DIRECTORY)
//loadHandlers(selectMenuHandlers, SELECT_MENU_DIRECTORY)

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const getHandlerExecute = (eventHandlers) => {
      for (const [prefix, handler] of eventHandlers) {
        if (interaction.customId.startsWith(prefix)) {
          return handler.execute(interaction);
        }
      }
    } 

    try {
      if (interaction.isButton()) return getHandlerExecute(buttonHandlers)
      if (interaction.isModalSubmit()) return getHandlerExecute(modalHandlers)
      if (interaction.isStringSelectMenu()) return getHandlerExecute(selectMenuHandlers)
    } catch(e) {
      console.error(`${new Date().toString()} - ${e}`);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};