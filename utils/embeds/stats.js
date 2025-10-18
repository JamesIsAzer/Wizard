const { EmbedBuilder } = require('discord.js')
const MAX_MEMBERS = 3
const { prettyNumbers } = require('../format');
const emojis = require('../../emojis.json');
const { parseTag } = require('../arguments/tagHandling');
const { getLeagueEmote, getWarLeagueEmote } = require('../getEmojis');

const getTroopShowcaseEmbed = async (profile, verified, endTimestamp, fileName) => {
    const descriptionLines = [
        `**Player tag:** \`${profile.tag}\``,
        `${emojis.link} **[View profile in-game](https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${parseTag(profile.tag)})**`,
        `${emojis.clock} ${ endTimestamp ? `Menu timeout <t:${endTimestamp}:R>` : `Calculating menu timeout...`}`
    ];

    const embed = new EmbedBuilder()
        .setTitle(`${getLeagueEmote(profile?.leagueTier?.name)} ${profile.name} • Army showcase`)
        .setURL(`https://www.clashofstats.com/players/${getURLName(profile)}-${getURLTag(profile)}/summary`)
        .setColor('#33E3FF')
        .setDescription(descriptionLines.join('\n'))
        .setImage(`attachment://${fileName}`)
        .setThumbnail('https://i.imgur.com/wbbK27a.png')
    if (verified) embed.setFooter({text: 'Verified under this account', iconURL: "https://media.discordapp.net/attachments/582092054264545280/935702845183918160/check-mark_2714-fe0f.png"})
    return embed
}

const getProfileEmbed = async (profile, verified, endTimestamp, fileName, thumbnailFileName) => {
    
    const descriptionLines = [
        `**Player tag:** \`${profile.tag}\``,
        `${emojis.link} **[View profile in-game](https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${parseTag(profile.tag)})**`,
        `${emojis.clock} ${ endTimestamp ? `Menu timeout <t:${endTimestamp}:R>` : `Calculating menu timeout...`}`
    ];

    const embed = new EmbedBuilder()
        .setTitle(`${getLeagueEmote(profile?.leagueTier?.name)} ${profile.name} • Profile overview`)
        .setURL(`https://www.clashofstats.com/players/${getURLName(profile)}-${getURLTag(profile)}/summary`)
        .setColor('#33E3FF')
        .setDescription(descriptionLines.join('\n'))
        .setImage(`attachment://${fileName}`)
        .setThumbnail(`attachment://${thumbnailFileName}`);

    if (verified) {
        embed.setFooter({
            text: 'Verified under this account',
            iconURL: "https://media.discordapp.net/attachments/582092054264545280/935702845183918160/check-mark_2714-fe0f.png"
        });
    }

    return embed
}

const getClanEmbed = (clan) => {
    const embed = new EmbedBuilder()
        .setTitle(`${emojis.versusbattles} ${clan.name} ${clan.tag}`)
        .setURL(`https://www.clashofstats.com/clans/${getURLClanName(clan)}-${getURLClanTag(clan)}/summary`)
        .setThumbnail(clan.badgeUrls.medium)
        .setColor('#33E3FF')
        .addFields(
        {
            name: 'War wins',
            value: `${emojis.zap} ${prettyNumbers(clan.warWins)}`,
            inline: true
        },
        {
            name: 'War losses',
            value: `${emojis.dash} ${clan.warLosses ? prettyNumbers(clan.warLosses) : 'Private'}`,
            inline: true
        },
        {
            name: 'War league',
            value: `${getWarLeagueEmote(clan.warLeague.id)} ${clan.warLeague.name}`,
            inline: true
        }, 

        {
            name: 'Required trophies',
            value: `${emojis.trophy} ${prettyNumbers(clan.requiredTrophies)}`,
            inline: true
        },
        {
            name: 'Clan trophies',
            value: `${emojis.trophy} ${clan.clanPoints ? prettyNumbers(clan.clanPoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Members',
            value: `${emojis.personsilhouette} ${prettyNumbers(clan.members)}/50`,
            inline: true
        },

        {
            name: 'Required builder cups',
            value: `${emojis.buildertrophy} ${prettyNumbers(clan.requiredBuilderBaseTrophies)}`,
            inline: true
        },
        {
            name: 'Clan builder cups',
            value: `${emojis.buildertrophy} ${clan.clanBuilderBasePoints ? prettyNumbers(clan.clanBuilderBasePoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Language',
            value: `${emojis.speech} ${clan.chatLanguage ? prettyNumbers(clan.chatLanguage.name) : 'Not set'}`,
            inline: true
        },

        {
            name: 'Top players',
            value: getTopMemberNames(clan) ?? "No players",
            inline: true
        },
        {
            name: 'Tag',
            value: getTopMemberTags(clan) ?? "-",
            inline: true
        },
        {
            name: 'Trophies',
            value: getTopMemberTrophies(clan) ?? "-",
            inline: true
        });
        
        if (clan.description !== "") embed.setDescription(clan.description)
        if(clan.labels.length > 0) embed.setFooter({text: `${clan.labels[0].name}`, iconURL: `${clan.labels[0].iconUrls.small}` });
        return embed
}

const getURLTag = (profile) => profile.tag.substr(1)
const getURLName = (profile) => encodeURIComponent(profile.name.replace(/\s+/g, '-').toLowerCase())
const getURLClanTag = (clan) => clan.tag.substr(1)
const getURLClanName = (clan) => encodeURIComponent(clan.name.replace(/[\s+]/g, '-').toLowerCase())
const getTopMemberNames = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.name).join("\n"))
const getTopMemberTags = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.tag).join("\n"))
const getTopMemberTrophies = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.trophies).join("\n"))
const getTopMembers = (memberList) => memberList.slice(0, MAX_MEMBERS)

const fillEmptyString = (str) => str == '' ? '-' : str

module.exports = {
    getProfileEmbed,
    getClanEmbed,
    getTroopShowcaseEmbed
} 
