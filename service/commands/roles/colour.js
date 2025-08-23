const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getSuccessfulColourEmbed,
  getUnsatisfiedRequirementEmbed,
  getColoursListEmbed,
  getAvailableColoursListEmbed,
} = require('../../../utils/embeds/colour');
const { InteractionContextType, MessageFlags } = require('discord.js');
const { getConfig } = require('../../../config');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('colour')
    .setDescription('Manage colour roles.')
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription(
          'Adds colour override to user if they have the in-game role.'
        )
        .addStringOption((option) =>
          option
            .setName('colour')
            .setDescription('The colour override you want.')
            .setRequired(true)
            .addChoices(
              { name: 'Legends Purple', value: 'PURPLE' },
              { name: 'Star Lord Yellow', value: 'YELLOW' },
              { name: 'Farmers Pink', value: 'FARMERPINK' },
              { name: 'Builder Blue', value: 'BLUE' },
              { name: 'Philanthropist Pink', value: 'PINK' },
              { name: 'Gold', value: 'GOLD' },
              { name: 'Vip Red', value: 'VIPRED' },
              { name: 'Bush Green', value: 'GREEN' },
              { name: 'Gamer Mint', value: 'MINT' },
              { name: 'Conqueror Red', value: 'RED' },
              { name: 'Vanquisher Turqoise', value: 'TURQUOISE' },
              { name: 'Capitalist Black', value: 'BLACK' },
              { name: 'Rock Solid Beige', value: 'BEIGE' },
              { name: 'Campaigner Olive', value: 'OLIVE' },
              { name: 'Bsoto Blue', value: 'BSOTOBLUE' },
              { name: 'Default White', value: 'WHITE' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove colour overrides.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List all colour overrides available.')
        .addBooleanOption((option) =>
          option
            .setName('onlyavailable')
            .setDescription('List only the colour roles you can switch to.')
        )
    ),
  async execute(interaction) {
    await interaction.deferReply({ 
      flags: MessageFlags.Ephemeral 
    });

    const config = await getConfig(interaction.guildId)
    const verificationRoles = config.verificationRoles
    const colourRoles = config.colourRoles

    if (interaction.options.getSubcommand() === 'remove') {
      console.log(`${new Date().toString()} ${interaction.user.id} used the command: /colour remove`)
      await removeColourRoles(colourRoles, interaction.member);
      await interaction.editReply(`Removed colour override!`);
      return;
    } else if (interaction.options.getSubcommand() === 'add') {
      console.log(`${new Date().toString()} ${interaction.user.id} used the command: /colour add`)
      const colour = interaction.options.getString('colour');
      await setColorRoles(colour, verificationRoles, colourRoles, interaction);
      return;
    } else if (interaction.options.getSubcommand() === 'list') {
      console.log(`${new Date().toString()} ${interaction.user.id} used the command: /colour list`)
      if (interaction.options.getBoolean('onlyavailable')) {
        await interaction.editReply({
          embeds: [getAvailableColoursListEmbed(interaction.member, colourRoles, verificationRoles)],
        });
        return;
      } else {
        await interaction.editReply({
          embeds: [getColoursListEmbed(colourRoles, verificationRoles)],
        });
        return;
      }
    }
  },
};

const removeColourRoles = async (colourRoles, user) => {
  for (const [_, roleID] of Object.entries(colourRoles)) {
    if (user.roles.cache.has(roleID)) 
      user.roles.remove(roleID)
        .catch(_ => console.error(`${new Date().toString()} - Failed to remove colour role ${roleID}.`));
  } 
};

const setColorRoles = async (colour, verificationRoles, colourRoles, interaction) => {
  const addRoleIfRequirementMet = async (colourRoleID, achievementRoleID) => {
    if (!colourRoleID) 
      return interaction.editReply('This colour role is not configured.')

    if(!achievementRoleID || interaction.member.roles.cache.has(achievementRoleID)) {
        removeColourRoles(colour, interaction.member)
        interaction.member.roles.add(colourRoleID)
          .catch(_ => console.error(`${new Date().toString()} - Failed to add colour role ${roleID}.`))
        return interaction.editReply({embeds: [getSuccessfulColourEmbed(colourRoleID)]})
    }
    return interaction.editReply({
      embeds: [getUnsatisfiedRequirementEmbed(achievementRoleID)],
    });
  }

  try {
    if (colour == "PURPLE") addRoleIfRequirementMet(colourRoles?.legends, verificationRoles?.legends)
    if (colour == "YELLOW") addRoleIfRequirementMet(colourRoles?.starLord, verificationRoles?.starLord)
    if (colour == "FARMERPINK") addRoleIfRequirementMet(colourRoles?.farmersRUs, verificationRoles?.farmersRUs)
    if (colour == "BLUE") addRoleIfRequirementMet(colourRoles?.masterBuilder, verificationRoles?.masterBuilder)
    if (colour == "PINK") addRoleIfRequirementMet(colourRoles?.philanthropist, verificationRoles?.philanthropist)
    if (colour == "GOLD") addRoleIfRequirementMet(colourRoles?.gold, verificationRoles?.gold)
    if (colour == "VIPRED") addRoleIfRequirementMet(colourRoles?.vip, verificationRoles?.vip)
    if (colour == "GREEN") addRoleIfRequirementMet(colourRoles?.greenThumb, verificationRoles?.greenThumb)
    if (colour == "MINT") addRoleIfRequirementMet(colourRoles?.masterGamer, verificationRoles?.masterGamer)
    if (colour == "RED") addRoleIfRequirementMet(colourRoles?.conqueror, verificationRoles?.conqueror)
    if (colour == "TURQUOISE") addRoleIfRequirementMet(colourRoles?.vanquisher, verificationRoles?.vanquisher)
    if (colour == "BLACK") addRoleIfRequirementMet(colourRoles?.capitalist, verificationRoles?.capitalist)
    if (colour == "BEIGE") addRoleIfRequirementMet(colourRoles?.rockSolid, verificationRoles?.rockSolid)
    if (colour == "OLIVE") addRoleIfRequirementMet(colourRoles?.campaigner, verificationRoles?.campaigner)
    if (colour == "BSOTOBLUE") addRoleIfRequirementMet(colourRoles?.bsoto, verificationRoles?.bsoto)
    if (colour == "WHITE") addRoleIfRequirementMet(colourRoles?.default, null)
  } catch (e) {
    return interaction.editReply("Error configuring colour roles, please make sure the IDs are set correctly. You can see them by typing `\/config`\.")
  }  
};

