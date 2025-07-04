const { SlashCommandBuilder } = require('@discordjs/builders');
const { ComponentType, InteractionContextType } = require('discord.js');
const { ownerGuildID } = require('../../../config.json')
const client = require('../../../client')
const { hasMediumPerms } = require('../../../utils/permissions');
const { verificationPageEmbed } = require('../../../utils/embeds/userinfo/infoPage')
const { getVerifications } = require('../../../dao/mongo/verification/queries')
const { getRow } = require('../../../utils/rows/pagination')
const { containsOnlyNumbers } = require('../../../utils/arguments/discordID')
const PAGE_LENGTH = 20

const paginateVerifications = (acc, verifications) => {
    const pageLength = Math.min(verifications.length, PAGE_LENGTH)
    if (verifications.length > PAGE_LENGTH) {
        const page = verifications.slice(0, pageLength)
        const remainder = verifications.slice(pageLength)
        acc.push(page)
        return paginateVerifications(acc, remainder)
    }
    if (verifications.length > 0) {
        acc.push(verifications)
        return acc
    }
    return acc
}

module.exports = {
    mainServerOnly: true,
    requiresConfigSetup: true,
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Mod only - gets all verifications for a given user.')
      .setContexts(InteractionContextType.Guild)
      .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('User ID.')
        .setRequired(true)
      ),
    async execute(interaction) {
        console.log(`${new Date().toString()} ${interaction.user.id} used the command: /userinfo`)

        if (!hasMediumPerms(interaction.member)) return interaction.reply({
            content: `You do not have permission to use this command.`
        })

        const targetUserID = interaction.options.getString('id')
        if (!containsOnlyNumbers(targetUserID)) return interaction.reply({content: `Invalid ID format.`})

        const userVerifications = await getVerifications(targetUserID)
        if (userVerifications.length <= 0) return interaction.reply({
            content: `No verifications found for user <@${targetUserID}>.`
        })

        let index = 0
        const verificationsPaginated = paginateVerifications([], userVerifications)
        const numberOfPages = verificationsPaginated.length

        const guildID = ownerGuildID
        const guild = client.guilds.cache.get(guildID)
        const targetUserData = await guild.members.fetch({ user: targetUserID }).catch(_ => null)

        const embeds = verificationsPaginated.map((casePage, index) => verificationPageEmbed(targetUserData, casePage, index, PAGE_LENGTH))

        const reply = await interaction.reply({ embeds: [embeds[index]], components: [getRow(index, numberOfPages)] })

        const time = 1000 * 60 * 5

        const collector = await reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        })

        collector.on('collect', async i => {
            if (!i) return
            if (i.customId !== "prev_page" && i.customId !== "next_page") return
            if (i.customId === "prev_page" && index > 0) index--
            if (i.customId === "next_page" && index < numberOfPages - 1) index++
            if (reply) i.update({
                embeds: [embeds[index]],
                components: [getRow(index, numberOfPages)]
            }) 
        })
    },
  };