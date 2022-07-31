
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { verifyProfile } = require('../../../api/clash/verification')
const { tagVerified, alreadyTaken } = require('../../../api/mongo/verify/connections')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifies a user and sets their roles.')
        .addStringOption(option => option.setName('tag').setDescription('Your in-game player tag.').setRequired(true))
        .addStringOption(option => option.setName('token').setDescription('The API token of the account').setRequired(true)),
    async execute(interaction) {
        const tag = interaction.options.getString('tag')
        const token = interaction.options.getString('token')

        const verifyResponse = await verifyProfile(tag, token)
        if (verifyResponse.error) {
            await interaction.reply(`An error has occured: ${verifyResponse.error}`)
            return;
        }

        const isValid = verifyResponse.response.status === 'ok'
        if (!isValid) await interaction.reply({embeds: [getUnsuccessfulVerificationEmbed()], ephemeral: true})

        if (await tagVerified(tag)) {
            if(await alreadyTaken(tag, interaction.member.id)) {
                await interaction.reply('This account is already taken!')
                return
            } else {
                await interaction.reply('Updating profile')
                return
            }
        } else {
            await interaction.reply('Creating profile.')
            return
        } 
    },
}

const getUnsuccessfulVerificationEmbed = () => {
    return new MessageEmbed()
    .setTitle('Verification unsuccessful! ❌')
    .setDescription('Make sure both your player tag and API token are correct!')
    .setColor('#D10202')
    .addFields({
        name: 'How can I find my player tag?',
        value: 'Your player tag can be found on your in-game profile page.'
    })
    .addFields({
      name: 'How can I find my API token?',
      value: 'You can find your API token by going into settings -> advanced settings.',
    })
    .setImage(
      'https://media.discordapp.net/attachments/582092054264545280/813606623519703070/image0.png?width=1440&height=665'
    )
}