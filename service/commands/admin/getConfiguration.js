const { SlashCommandBuilder } = require('@discordjs/builders');
const { getConfig } = require('../../../config');
const { InteractionContextType, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
    mainServerOnly: false,
    requiresConfigSetup: false,
    data: new SlashCommandBuilder()
        .setName('configuration')
        .setDescription('Admin only - get current guild configurations for bot.')
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /configuration`)

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
              content: "You do not have permission to use this command."
            });
          }

        const guildID = interaction.guild.id

        const config = await getConfig(guildID)
        
        const formatConfigValue = (configValue) =>
            configValue ? `<#${configValue}>` : 'Not set'

        const displayRole = (name, role) => {
            if (role) return `- ${name}: <@&${role}>\n` 
            else return ''
        }
            

        // Leaderboard Channels
        const legendaryChannelID = config?.leaderboardChannels?.legendary
        const builderChannelID = config?.leaderboardChannels?.builder

        // Verification roles
        const memberRoleID = config?.verificationRoles?.member
        const legendsRoleID = config?.verificationRoles?.legends
        const starLordRoleID = config?.verificationRoles?.starLord
        const farmersRUsRoleID = config?.verificationRoles?.farmersRUs
        const masterBuilderRoleID = config?.verificationRoles?.masterBuilder
        const philanthropistRoleID = config?.verificationRoles?.philanthropist
        const greenThumbRoleID = config?.verificationRoles?.greenThumb
        const masterGamerRoleID = config?.verificationRoles?.masterGamer
        const conquerorRoleID = config?.verificationRoles?.conqueror
        const vanquisherRoleID = config?.verificationRoles?.vanquisher
        const capitalistRoleID = config?.verificationRoles?.capitalist
        const campaignerRoleID = config?.verificationRoles?.campaigner
        const bsotoRoleID = config?.verificationRoles?.bsoto
        const rockSolidRoleID = config?.verificationRoles?.rockSolid
        const vipRoleID = config?.verificationRoles?.vip
        const goldRoleID = config?.verificationRoles?.gold

        // Colour roles
        const defaultColourRoleID = config?.colourRoles?.default
        const legendsColourRoleID = config?.colourRoles?.legends
        const starLordColourRoleID = config?.colourRoles?.starLord
        const farmersRUsColourRoleID = config?.colourRoles?.farmersRUs
        const masterBuilderColourRoleID = config?.colourRoles?.masterBuilder
        const philanthropistColourRoleID = config?.colourRoles?.philanthropist
        const greenThumbColourRoleID = config?.colourRoles?.greenThumb
        const masterGamerColourRoleID = config?.colourRoles?.masterGamer
        const conquerorColourRoleID = config?.colourRoles?.conqueror
        const vanquisherColourRoleID = config?.colourRoles?.vanquisher
        const capitalistColourRoleID = config?.colourRoles?.capitalist
        const campaignerColourRoleID = config?.colourRoles?.campaigner
        const bsotoColourRoleID = config?.colourRoles?.bsoto
        const rockSolidColourRoleID = config?.colourRoles?.rockSolid
        const vipColourRoleID = config?.colourRoles?.vip
        const goldColourRoleID = config?.colourRoles?.gold

        // Townhall roles
        const townhall8 = config?.townhallRoles?.townhall8
        const townhall9 = config?.townhallRoles?.townhall9
        const townhall10 = config?.townhallRoles?.townhall10
        const townhall11 = config?.townhallRoles?.townhall11
        const townhall12 = config?.townhallRoles?.townhall12
        const townhall13 = config?.townhallRoles?.townhall13
        const townhall14 = config?.townhallRoles?.townhall14
        const townhall15 = config?.townhallRoles?.townhall15
        const townhall16 = config?.townhallRoles?.townhall16
        const townhall17 = config?.townhallRoles?.townhall17

        await interaction.reply({ content: 
            `**Guild configurations**\n` +
            `__Leaderboard channel IDs__\n` +
            `- Legendary leaderboard: ${formatConfigValue(legendaryChannelID)}\n` +
            `- Builder leaderboard: ${formatConfigValue(builderChannelID)}\n` +
            `\n__Verification role IDs__\n` +
            displayRole('Member', memberRoleID) +
            displayRole('Legends', legendsRoleID) +
            displayRole('Star Lord', starLordRoleID) +
            displayRole('Farmers R Us', farmersRUsRoleID) +
            displayRole('Master Builder', masterBuilderRoleID) +
            displayRole('Philanthropist', philanthropistRoleID) +
            displayRole('Green Thumb', greenThumbRoleID) +
            displayRole('Master Gamer', masterGamerRoleID) +
            displayRole('Conqueror', conquerorRoleID) +
            displayRole('Vanquisher', vanquisherRoleID) +
            displayRole('Capitalist', capitalistRoleID) +
            displayRole('Campaigner', campaignerRoleID) +
            displayRole('Bsoto', bsotoRoleID) +
            displayRole('Rock Solid', rockSolidRoleID) +
            displayRole('VIP', vipRoleID) +
            displayRole('Gold', goldRoleID) +
            `\n__Colour role IDs__\n` +
            displayRole('Default', defaultColourRoleID) +
            displayRole('Legends', legendsColourRoleID) +
            displayRole('Star Lord', starLordColourRoleID) +
            displayRole('Farmers R Us', farmersRUsColourRoleID) +
            displayRole('Master Builder', masterBuilderColourRoleID) +
            displayRole('Philanthropist', philanthropistColourRoleID) +
            displayRole('Green Thumb', greenThumbColourRoleID) +
            displayRole('Master Gamer', masterGamerColourRoleID) +
            displayRole('Conqueror', conquerorColourRoleID) +
            displayRole('Vanquisher', vanquisherColourRoleID) +
            displayRole('Capitalist', capitalistColourRoleID) +
            displayRole('Campaigner', campaignerColourRoleID) +
            displayRole('Bsoto', bsotoColourRoleID) +
            displayRole('Rock Solid', rockSolidColourRoleID) +
            displayRole('VIP', vipColourRoleID) +
            displayRole('Gold', goldColourRoleID) +
            `\n__Townhall role IDs__\n` +
            displayRole('Townhall 8', townhall8) +
            displayRole('Townhall 9', townhall9) +
            displayRole('Townhall 10', townhall10) +
            displayRole('Townhall 11', townhall11) +
            displayRole('Townhall 12', townhall12) +
            displayRole('Townhall 13', townhall13) +
            displayRole('Townhall 14', townhall14) +
            displayRole('Townhall 15', townhall15) +
            displayRole('Townhall 16', townhall16) +
            displayRole('Townhall 17', townhall17),
            flags: MessageFlags.Ephemeral
        })
    },
  };
  
  
  