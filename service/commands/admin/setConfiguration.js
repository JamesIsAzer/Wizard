const { SlashCommandBuilder } = require('@discordjs/builders');
const { updateConfig, getConfig } = require('../../../config');
const { InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    mainServerOnly: false,
    requiresConfigSetup: false,
    data: new SlashCommandBuilder()
        .setName('setconfiguration')
        .setDescription('Admin only - set guild configuration for bot (must fill all to run bot).')
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('leaderboard_channels')
                .setDescription('Channel IDs where the respective leaderboards will be posted.')
                .addStringOption((option) =>
                    option
                        .setName('legendary_channel_id')
                        .setDescription('Channel ID where the legendary leaderboard will be posted.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('builder_channel_id')
                        .setDescription('Channel ID where the builder leaderboard will be posted.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('verification_roles')
                .setDescription('Role IDs related to verification.')
                .addStringOption((option) =>
                    option
                        .setName('member_role_id')
                        .setDescription('Member role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('legends_role_id')
                        .setDescription('Legends role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('star_lord_role_id')
                        .setDescription('Star Lord role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('farmers_r_us_role_id')
                        .setDescription('Farmers R Us role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('master_builder_role_id')
                        .setDescription('Master Builder role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('philanthropist_role_id')
                        .setDescription('Philanthropist role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('green_thumb_role_id')
                        .setDescription('Green Thumb role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('master_gamer_role_id')
                        .setDescription('Master Gamer role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('conqueror_role_id')
                        .setDescription('Conqueror role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('vanquisher_role_id')
                        .setDescription('Vanquisher role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('capitalist_role_id')
                        .setDescription('Capitalist role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('campaigner_role_id')
                        .setDescription('Campaigner role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('bsoto_role_id')
                        .setDescription('Bsoto role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('rock_solid_role_id')
                        .setDescription('Rock Solid role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                ) 
                .addStringOption((option) =>
                    option
                        .setName('vip_role_id')
                        .setDescription('VIP role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('gold_role_id')
                        .setDescription('Gold role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('colour_roles')
                .setDescription('Role IDs for the colour overrides.')
                .addStringOption((option) =>
                    option
                        .setName('legends_colour_role_id')
                        .setDescription('Legends colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('star_lord_colour_role_id')
                        .setDescription('Star Lord colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('farmers_r_us_colour_role_id')
                        .setDescription('Farmers R Us colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('master_builder_colour_role_id')
                        .setDescription('Master Builder colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('philanthropist_colour_role_id')
                        .setDescription('Philanthropist colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('green_thumb_colour_role_id')
                        .setDescription('Green Thumb colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('master_gamer_colour_role_id')
                        .setDescription('Master Gamer colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('conqueror_colour_role_id')
                        .setDescription('Conqueror colour role ID')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('vanquisher_colour_role_id')
                        .setDescription('Vanquisher colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('capitalist_colour_role_id')
                        .setDescription('Capitalist colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('campaigner_colour_role_id')
                        .setDescription('Campaigner colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('bsoto_colour_role_id')
                        .setDescription('Bsoto colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('rock_solid_colour_role_id')
                        .setDescription('Rock Solid colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('vip_colour_role_id')
                        .setDescription('VIP colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('gold_colour_role_id')
                        .setDescription('Gold colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('default_colour_role_id')
                        .setDescription('Default colour role ID.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('townhall_roles')
                .setDescription('Role IDs for each townhall.')
                .addStringOption((option) =>
                    option
                        .setName('townhall_8_id')
                        .setDescription('Role ID for townhall 8.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_9_id')
                        .setDescription('Role ID for townhall 9.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_10_id')
                        .setDescription('Role ID for townhall 10.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_11_id')
                        .setDescription('Role ID for townhall 11.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_12_id')
                        .setDescription('Role ID for townhall 12.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_13_id')
                        .setDescription('Role ID for townhall 13.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_14_id')
                        .setDescription('Role ID for townhall 14.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_15_id')
                        .setDescription('Role ID for townhall 15.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_16_id')
                        .setDescription('Role ID for townhall 16.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
                .addStringOption((option) =>
                    option
                        .setName('townhall_17_id')
                        .setDescription('Role ID for townhall 17.')
                        .setRequired(false)
                        .setMinLength(17)
                        .setMaxLength(19)
                )
        ),
    async execute(interaction) {
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /setconfiguration`)

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
              content: "You do not have permission to use this command."
            });
        }

        const legendaryChannelInputID = interaction.options.getString('legendary_channel_id')
        const builderChannelInputID = interaction.options.getString('builder_channel_id')
        const memberRoleInputID = interaction.options.getString('member_role_id')
        const legendsRoleInputID = interaction.options.getString('legends_role_id')
        const starLordRoleInputID = interaction.options.getString('star_lord_role_id')
        const farmersRUsRoleInputID = interaction.options.getString('farmers_r_us_role_id')
        const masterBuilderRoleInputID = interaction.options.getString('master_builder_role_id')
        const philanthropistRoleInputID = interaction.options.getString('philanthropist_role_id')
        const greenThumbRoleInputID = interaction.options.getString('green_thumb_role_id')
        const masterGamerRoleInputID = interaction.options.getString('master_gamer_role_id')
        const conquerorRoleInputID = interaction.options.getString('conqueror_role_id')
        const vanquisherRoleInputID = interaction.options.getString('vanquisher_role_id')
        const capitalistRoleInputID = interaction.options.getString('capitalist_role_id')
        const campaignerRoleInputID = interaction.options.getString('campaigner_role_id')
        const bsotoRoleInputID = interaction.options.getString('bsoto_role_id')
        const rockSolidRoleInputID = interaction.options.getString('rock_solid_role_id')
        const vipRoleInputID = interaction.options.getString('vip_role_id')
        const goldRoleInputID = interaction.options.getString('gold_role_id')
        const legendsColourRoleInputID = interaction.options.getString('legends_colour_role_id')
        const starLordColourRoleInputID = interaction.options.getString('star_lord_colour_role_id')
        const farmersRUsColourRoleInputID = interaction.options.getString('farmers_r_us_colour_role_id')
        const masterBuilderColourRoleInputID = interaction.options.getString('master_builder_colour_role_id')
        const philanthropistColourRoleInputID = interaction.options.getString('philanthropist_colour_role_id')
        const greenThumbColourRoleInputID = interaction.options.getString('green_thumb_colour_role_id')
        const masterGamerColourRoleInputID = interaction.options.getString('master_gamer_colour_role_id')
        const conquerorColourRoleInputID = interaction.options.getString('conqueror_colour_role_id')
        const vanquisherColourRoleInputID = interaction.options.getString('vanquisher_colour_role_id')
        const capitalistColourRoleInputID = interaction.options.getString('capitalist_colour_role_id')
        const campaignerColourRoleInputID = interaction.options.getString('campaigner_colour_role_id')
        const bsotoColourRoleInputID = interaction.options.getString('bsoto_colour_role_id')
        const rockSolidColourRoleInputID = interaction.options.getString('rock_solid_colour_role_id')
        const vipColourRoleInputID = interaction.options.getString('vip_colour_role_id')
        const goldColourRoleInputID = interaction.options.getString('gold_colour_role_id')
        const defaultColourRoleInputID = interaction.options.getString('default_colour_role_id')
        const townhall8RoleID = interaction.options.getString('townhall_8_id')
        const townhall9RoleID = interaction.options.getString('townhall_9_id')
        const townhall10RoleID = interaction.options.getString('townhall_10_id')
        const townhall11RoleID = interaction.options.getString('townhall_11_id')
        const townhall12RoleID = interaction.options.getString('townhall_12_id')
        const townhall13RoleID = interaction.options.getString('townhall_13_id')
        const townhall14RoleID = interaction.options.getString('townhall_14_id')
        const townhall15RoleID = interaction.options.getString('townhall_15_id')
        const townhall16RoleID = interaction.options.getString('townhall_16_id')
        const townhall17RoleID = interaction.options.getString('townhall_17_id')

        const guildID = interaction.guild.id

        const config = await getConfig(guildID)

        const newConfigConstructor = () => ({
            leaderboardChannels: {
                legendary: legendaryChannelInputID ? legendaryChannelInputID : config?.leaderboardChannels?.legendary,
                builder: builderChannelInputID ? builderChannelInputID : config?.leaderboardChannels?.builder
            },
            verificationRoles: {
                member: memberRoleInputID ? memberRoleInputID : config?.verificationRoles?.member,
                legends: legendsRoleInputID ? legendsRoleInputID : config?.verificationRoles?.legends,
                starLord: starLordRoleInputID ? starLordRoleInputID : config?.verificationRoles?.starLord,
                farmersRUs: farmersRUsRoleInputID ? farmersRUsRoleInputID : config?.verificationRoles?.farmersRUs,
                masterBuilder: masterBuilderRoleInputID ? masterBuilderRoleInputID : config?.verificationRoles?.masterBuilder,
                philanthropist: philanthropistRoleInputID ? philanthropistRoleInputID : config?.verificationRoles?.philanthropist,
                greenThumb: greenThumbRoleInputID ? greenThumbRoleInputID : config?.verificationRoles?.greenThumb,
                masterGamer: masterGamerRoleInputID ? masterGamerRoleInputID : config?.verificationRoles?.masterGamer,
                conqueror: conquerorRoleInputID ? conquerorRoleInputID : config?.verificationRoles?.conqueror,
                vanquisher: vanquisherRoleInputID ? vanquisherRoleInputID : config?.verificationRoles?.vanquisher,
                capitalist: capitalistRoleInputID ? capitalistRoleInputID : config?.verificationRoles?.capitalist,
                campaigner: campaignerRoleInputID ? campaignerRoleInputID : config?.verificationRoles?.campaigner,
                bsoto: bsotoRoleInputID ? bsotoRoleInputID : config?.verificationRoles?.bsoto,
                rockSolid: rockSolidRoleInputID ? rockSolidRoleInputID : config?.verificationRoles?.rockSolid,
                vip: vipRoleInputID ? vipRoleInputID : config?.verificationRoles?.vip,
                gold: goldRoleInputID ? goldRoleInputID : config?.verificationRoles?.gold
            },
            colourRoles: {
                default: defaultColourRoleInputID ? defaultColourRoleInputID : config?.colourRoles?.default,
                legends: legendsColourRoleInputID ? legendsColourRoleInputID : config?.colourRoles?.legends,
                starLord: starLordColourRoleInputID ? starLordColourRoleInputID : config?.colourRoles?.starLord,
                farmersRUs: farmersRUsColourRoleInputID ? farmersRUsColourRoleInputID : config?.colourRoles?.farmersRUs,
                masterBuilder: masterBuilderColourRoleInputID ? masterBuilderColourRoleInputID : config?.colourRoles?.masterBuilder,
                philanthropist: philanthropistColourRoleInputID ? philanthropistColourRoleInputID : config?.colourRoles?.philanthropist,
                greenThumb: greenThumbColourRoleInputID ? greenThumbColourRoleInputID : config?.colourRoles?.greenThumb,
                masterGamer: masterGamerColourRoleInputID ? masterGamerColourRoleInputID : config?.colourRoles?.masterGamer,
                conqueror: conquerorColourRoleInputID ? conquerorColourRoleInputID : config?.colourRoles?.conqueror,
                vanquisher: vanquisherColourRoleInputID ? vanquisherColourRoleInputID : config?.colourRoles?.vanquisher,
                capitalist: capitalistColourRoleInputID ? capitalistColourRoleInputID : config?.colourRoles?.capitalist,
                campaigner: campaignerColourRoleInputID ? campaignerColourRoleInputID : config?.colourRoles?.campaigner,
                bsoto: bsotoColourRoleInputID ? bsotoColourRoleInputID : config?.colourRoles?.bsoto,
                rockSolid: rockSolidColourRoleInputID ? rockSolidColourRoleInputID : config?.colourRoles?.rockSolid,
                vip: vipColourRoleInputID ? vipColourRoleInputID : config?.colourRoles?.vip,
                gold: goldColourRoleInputID ? goldColourRoleInputID : config?.colourRoles?.gold
            },
            townhallRoles: {
                townhall8: townhall8RoleID ? townhall8RoleID : config?.townhallRoles?.townhall8,
                townhall9: townhall9RoleID ? townhall9RoleID : config?.townhallRoles?.townhall9,
                townhall10: townhall10RoleID ? townhall10RoleID : config?.townhallRoles?.townhall10,
                townhall11: townhall11RoleID ? townhall11RoleID : config?.townhallRoles?.townhall11,
                townhall12: townhall12RoleID ? townhall12RoleID : config?.townhallRoles?.townhall12,
                townhall13: townhall13RoleID ? townhall13RoleID : config?.townhallRoles?.townhall13,
                townhall14: townhall14RoleID ? townhall14RoleID : config?.townhallRoles?.townhall14,
                townhall15: townhall15RoleID ? townhall15RoleID : config?.townhallRoles?.townhall15,
                townhall16: townhall16RoleID ? townhall16RoleID : config?.townhallRoles?.townhall16,
                townhall17: townhall17RoleID ? townhall17RoleID : config?.townhallRoles?.townhall17,
            }
        })

        updateConfig(guildID, newConfigConstructor())

        await interaction.reply('Configuration set, to check current configuration type `/configuration`.')
    },
  };
  
  
  