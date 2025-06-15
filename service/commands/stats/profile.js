const { SlashCommandBuilder } = require('@discordjs/builders');
const { findTag, saveDefaultProfile, removeDefaultProfile } = require('../../../dao/mongo/profile/queries');
const { isOwnerOfAccount } = require('../../../dao/mongo/verification/queries');
const { parseTag, isTagValid } = require('../../../utils/arguments/tagHandling');
const { findProfile } = require('../../../dao/clash/verification');
const { getInvalidTagEmbed } = require('../../../utils/embeds/verify');
const { getProfileEmbed, getTroopShowcaseEmbed } = require('../../../utils/embeds/stats')
const { InteractionContextType, ApplicationIntegrationType, ComponentType, AttachmentBuilder, MessageFlags } = require('discord.js');
const { profileOptions } = require('../../../utils/selections/profileOptions');
const { expiredOptions } = require('../../../utils/selections/expiredOptions');
const { getLoadingEmbed } = require('../../../utils/embeds/loading');
const { getNotYourInteractionProfileEmbed } = require('../../../utils/embeds/safety/notYourInteractionProfile');
const renderManager = require('../../../utils/render/SafeRenderManager');

module.exports = {
  mainServerOnly: false,
  requiresConfigSetup: true,
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Get information about players in-game stats.')
    .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel, InteractionContextType.BotDM)
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
    .addSubcommand((subcommand) => 
        subcommand
          .setName('show')
          .setDescription('Gets the stats of an in-game account.')
          .addStringOption((option) =>
            option
            .setName('tag')
            .setDescription('The player tag to get the stats of.')
            .setRequired(false)
        ),
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('save')
            .setDescription('Save an account as your default profile.')
            .addStringOption((option) =>
                option
                .setName('tag')
                .setDescription('The verified tag you want to save.')
                .setRequired(true)
            )
      
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove your default profile.')
      ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'show'){
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /profile show`)

        const unsanitizedTag = interaction.options.getString('tag') ?? await findTag(interaction.user.id)
        
        if (!unsanitizedTag) {
            return await interaction.reply({
                content: `You have not set a default profile. To do so type \`/profile save <player tag>\``,
                flags: MessageFlags.Ephemeral
            })
        }
        
        const tag = parseTag(unsanitizedTag);
        if (!isTagValid(tag)) {
            return sendInvalidTagReply(interaction)
        }
        const playerResponse = await findProfile(tag)

        if (!playerResponse.response) {
            return await interaction.reply({
                content: `An error occured: ${playerResponse.error}`,
                flags: MessageFlags.Ephemeral
            })
        }

        if (!playerResponse.response.found) {
            return sendInvalidTagReply(interaction)
        }

        await interaction.deferReply();

        const verified = await isOwnerOfAccount(tag, interaction.user.id)
        const playerData = playerResponse.response.data
        
        const timeoutMs = 300_000
        const endTimestamp = Math.floor((Date.now() + timeoutMs) / 1000);

        const keyProfile = playerData.tag.replace(/[^a-zA-Z0-9-_]/g, '');
        const keyTroop = keyProfile + '_troop';

        const profileImage = await renderManager.render('profile', playerData, keyProfile);
        const troopImage = await renderManager.render('troop', playerData, keyTroop);

        const profileAttachment = new AttachmentBuilder(Buffer.from(profileImage.buffer), { name: profileImage.fileName });

        const profileEmbed = await getProfileEmbed(playerData, verified, null, profileImage.fileName);

        const profileMenu = profileOptions('profile')

        const message = await interaction.editReply({ 
            embeds: [profileEmbed], 
            files: [profileAttachment], 
            components: [profileMenu]
        })

        const timestampedProfileEmbed = await getProfileEmbed(playerData, verified, endTimestamp, profileImage.fileName)
        const timestampedTroopShowcaseEmbed = await getTroopShowcaseEmbed(playerData, verified, endTimestamp, troopImage.fileName)

        const dataOptions = {
            'profile': timestampedProfileEmbed,
            'army': timestampedTroopShowcaseEmbed
        }

        await interaction.editReply({
            embeds: [timestampedProfileEmbed],
            components: [profileMenu]
        });
        
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: timeoutMs
        });

        collector.on('collect', async (selectInteraction) => {
            if (selectInteraction.user.id !== interaction.user.id) {
                return await selectInteraction.reply({
                    embeds: [getNotYourInteractionProfileEmbed()],
                    flags: MessageFlags.Ephemeral
                });
            }
    
            const selected = selectInteraction.values[0];
            const selectedData = dataOptions[selected];

            if (!selectedData) {
                return await selectInteraction.reply({
                    content: 'Invalid selection.',
                    flags: MessageFlags.Ephemeral
                });
            }

            await selectInteraction.deferUpdate();

            await selectInteraction.editReply({
                embeds: [getLoadingEmbed()],
                files: [],
                components: [profileOptions(selected, true)]
            });
            
            const attachment = selected === 'profile' 
                ? new AttachmentBuilder(Buffer.from(profileImage.buffer), { name: profileImage.fileName })
                : new AttachmentBuilder(Buffer.from(troopImage.buffer), { name: troopImage.fileName });

            await selectInteraction.editReply({
                embeds: [selectedData],
                files: [attachment],
                components: [profileOptions(selected)]
            });
        });

        collector.on('end', async () => {
            await interaction.editReply({ components: [expiredOptions()] });
        });

    } else if (interaction.options.getSubcommand() === 'save') {
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /profile save`)
        const tag = parseTag(interaction.options.getString('tag'))
        if (!isTagValid(tag)) {
            sendInvalidTagReply(interaction)
            return
        }

        const playerResponse = await findProfile(tag)

        if (!playerResponse.response) {
            return await interaction.reply({
                content: `An error occured: ${playerResponse.error}`,
                flags: MessageFlags.Ephemeral
            })
        }

        if (!playerResponse.response.found) {
            sendInvalidTagReply(interaction)
            return
        }

        saveDefaultProfile(tag, interaction.user.id)
        return await interaction.reply({
            content: `I have successfully saved your profile #${tag} as the default one!`,
            flags: MessageFlags.Ephemeral
        })

    } else if ( interaction.options.getSubcommand() === 'remove') {
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /profile remove`)
        const foundDefaultProfile = await removeDefaultProfile(interaction.user.id)
        if (foundDefaultProfile) {
            return await interaction.reply({
                content: `I have removed your default profile.`,
                flags: MessageFlags.Ephemeral
            })
        }
        else {
            return await interaction.reply({
                content: `You don't have a default profile to remove!`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
  }
};

const sendInvalidTagReply = async(interaction) => await interaction.reply({
    embeds: [getInvalidTagEmbed()],
    flags: MessageFlags.Ephemeral
});
