const { EmbedBuilder } = require('discord.js')
const MAX_MEMBERS = 3
const { IDs } = require('../../config.json') 
const getProfileEmbed = (profile, verified) => {
    const embed = new EmbedBuilder()
    .setTitle(`${getLeagueEmote(profile.trophies)} ${profile.name} ${profile.tag}`)
    .setURL(`https://www.clashofstats.com/players/${getURLName(profile)}-${getURLTag(profile)}/summary`)
    .setColor('#33E3FF')
    .addFields(
    {
        name: 'Townhall Level',
        value: `${getTownhallEmote(profile.townHallLevel)} ${profile.townHallLevel}`,
        inline: true,
    },
    {
        name: 'Exp Level',
        value: `<:xp:1379105235204833442> ${prettyNumbers(profile.expLevel)}`,
        inline: true,
    },
    {
        name: 'Clan',
        value: `<:clancastle2:1379727958562050140> ${isInClan(profile) ? `[${profile.clan.name}](https://www.clashofstats.com/clans/${getURLPlayerClanName(profile)}-${getURLPlayerClanTag(profile)}/summary)` : "No clan found"}`,
        inline: true,
    }, 
    {
        name: 'Trophies',
        value: `<:trophy:1379728059443449886> ${prettyNumbers(profile.trophies)}`,
        inline: true,
    }, 
    {
        name: 'Personal Best',
        value: `<:championking:1379728566127693855> ${prettyNumbers(profile.bestTrophies)}`,
        inline: true,
    }, 
    {
        name: 'War Stars',
        value: `<:star:1379105336174186536> ${prettyNumbers(profile.warStars)}`,
        inline: true,
    }, 
    {
        name: 'Troop Donations',
        value: `<:speedup:1379728033304281138> ${prettyNumbers(profile.achievements[14].value)}`,
        inline: true,
    }, 
    {
        name: 'Spell Donations',
        value: `<:haste:1379728520988590161> ${prettyNumbers(profile.achievements[23].value)}`,
        inline: true,
    }, 
    {
        name: 'Siege Donations',
        value: `<:wallwrecker:1379728829018542091> ${prettyNumbers(profile.achievements[40].value)}`,
        inline: true,
    }, 

    {
        name: 'Multiplayer Wins',
        value: `⚔️ ${prettyNumbers(profile.achievements[12].value)}`,
        inline: true,
    }, 
    {
        name: 'Multiplayer Defenses',
        value: `🛡️ ${prettyNumbers(profile.achievements[13].value)}`,
        inline: true,
    }, 
    {
        name: 'Clan Game Points',
        value: `<:clangames:1379105895153270855> ${prettyNumbers(profile.achievements[31].value)}`,
        inline: true,
    }, 

    {
        name: 'Builderhall Level',
        value: `<:bh:1379730296324362250> ${profile.builderHallLevel ? profile.builderHallLevel : 'No builder hall'}`,
        inline: true,
    }, 
    {
        name: 'Builder Trophies',
        value: `<:buildertrophy:1379728069262315612> ${prettyNumbers(profile.builderBaseTrophies)}`,
        inline: true,
    }, 
    {
        name: 'Builder Personal Best',
        value: `<:nightwitch:1379727984403021884> ${prettyNumbers(profile.bestBuilderBaseTrophies)}`,
        inline: true,
    });
    if (profile.legendStatistics?.legendTrophies) embed.addFields({name: 'Legend Trophies', value: `<:legendtrophy:1379105415656112229> ${prettyNumbers(profile.legendStatistics.legendTrophies)}`, inline: true})
    if (profile.legendStatistics?.bestSeason) embed.addFields({name: 'Best Legend Rank', value: `<:globe:1379730912664883241> ${prettyNumbers(profile.legendStatistics.bestSeason.rank)}`, inline: true})
    if (profile.legendStatistics?.bestBuilderBaseSeason) embed.addFields({name: 'Best Builder Rank', value: `<:globe:1379730912664883241> ${prettyNumbers(profile.legendStatistics.bestBuilderBaseSeason.rank)}`, inline: true})    
    if(verified) embed.setFooter({text: 'Verified under this account', iconURL: "https://media.discordapp.net/attachments/582092054264545280/935702845183918160/check-mark_2714-fe0f.png"})
    return embed
}

const getClanEmbed = (clan) => {
    const embed = new EmbedBuilder()
        .setTitle(`<:versusbattle:777311333649219594> ${clan.name} ${clan.tag}`)
        .setURL(`https://www.clashofstats.com/clans/${getURLClanName(clan)}-${getURLClanTag(clan)}/summary`)
        .setDescription(clan.description)
        .setThumbnail(clan.badgeUrls.medium)
        .setColor('#33E3FF')
        .addFields(
        {
            name: 'War wins',
            value: `:zap: ${prettyNumbers(clan.warWins)}`,
            inline: true
        },
        {
            name: 'War losses',
            value: `:dash: ${clan.warLosses ? prettyNumbers(clan.warLosses) : 'Private'}`,
            inline: true
        },
        {
            name: 'War league',
            value: `${getWarLeagueEmote(clan.warLeague.id)} ${clan.warLeague.name}`,
            inline: true
        }, 

        {
            name: 'Required trophies',
            value: `<:trophy:1379728059443449886> ${prettyNumbers(clan.requiredTrophies)}`,
            inline: true
        },
        {
            name: 'Clan trophies',
            value: `<:trophy:1379728059443449886> ${clan.clanPoints ? prettyNumbers(clan.clanPoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Members',
            value: `:bust_in_silhouette: ${prettyNumbers(clan.members)}/50`,
            inline: true
        },

        {
            name: 'Required builder cups',
            value: `<:buildertrophy:1379728069262315612> ${prettyNumbers(clan.requiredBuilderBaseTrophies)}`,
            inline: true
        },
        {
            name: 'Clan builder cups',
            value: `<:buildertrophy:1379728069262315612> ${clan.clanBuilderBasePoints ? prettyNumbers(clan.clanBuilderBasePoints) : 0}`,
            inline: true
        }, 
        {
            name: 'Language',
            value: `:speech_balloon: ${clan.chatLanguage ? prettyNumbers(clan.chatLanguage.name) : 'Not set'}`,
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
        
        if(clan.labels.length > 0) embed.setFooter({text: `${clan.labels[0].name}`, iconURL: `${clan.labels[0].iconUrls.small}` });
        return embed
}

const getLeagueEmote = (trophycount) => {
    if (trophycount >= 5000) return "<:legend:1379105324660818060>"
    if (trophycount >= 4100) return "<:titan:1379728163235434516>"
    if (trophycount >= 3200) return "<:champion:1379728151382458378>"
    if (trophycount >= 2600) return "<:master:1379728142134018079>"
    if (trophycount >= 2000) return "<:crystal:1379728132726194247>"
    if (trophycount >= 1400) return "<:goldrank:1379728119149363301>"
    if (trophycount >= 800) return "<:silver:1379728107023630417>"
    if (trophycount >= 400) return "<:bronze:1379728097644908554>"
    return "<:unranked:1379728083749175347>"
}

const getTownhallEmote = (thlvl) => {
    switch(thlvl) {
        case 17:
            return "<:th17:1379105644304535624>"
        case 16:
            return "<:th16:1379105633886015510>"
        case 15:
            return "<:th15:1379105622435565699>"
        case 14:
            return "<:th14:1379105609974284349>"
        case 13:
            return "<:th13:1379105577824817224>"
        case 12:
            return "<:th12:1379105568861458472>"
        case 11:
            return "<:th11:1379105529896636416>"
        case 10:
            return "<:th10:1379105521994432552>"
        case 9:
            return "<:th9:1379105513337520271>"
        default:
            return "<:th8:1379105497696833598>"
    }
}

function getWarLeagueEmote(warLeagueId){
    if (warLeagueId > 48000015) return "<:champion:1379728151382458378>"
    if (warLeagueId > 48000012) return "<:master:1379728142134018079>"
    if (warLeagueId > 48000009) return "<:crystal:1379728132726194247>"
    if (warLeagueId > 48000006) return "<:goldrank:1379728119149363301>"
    if (warLeagueId > 48000003) return "<:silver:1379728107023630417>"
    if (warLeagueId > 48000000) return "<:bronze:1379728097644908554>"
    else return "<:unranked:1379728083749175347>"
}

const prettyNumbers = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const getURLTag = (profile) => profile.tag.substr(1)
const getURLName = (profile) => encodeURIComponent(profile.name.replace(/\s+/g, '-').toLowerCase())
const getURLPlayerClanTag = (profile) => profile?.clan?.tag?.substr(1)
const getURLPlayerClanName = (profile) => encodeURIComponent(profile?.clan?.name?.replace(/\s+/g, '-').toLowerCase())
const getURLClanTag = (clan) => clan.tag.substr(1)
const getURLClanName = (clan) => encodeURIComponent(clan.name.replace(/[\s+]/g, '-').toLowerCase())
const isInClan = (profile) => !!profile.clan
const getTopMemberNames = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.name).join("\n"))
const getTopMemberTags = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.tag).join("\n"))
const getTopMemberTrophies = (clan) => fillEmptyString(getTopMembers(clan.memberList).map((member) => member.trophies).join("\n"))
const getTopMembers = (memberList) => memberList.slice(0, MAX_MEMBERS)

const fillEmptyString = (str) => str == '' ? '-' : str
module.exports = {
    getProfileEmbed,
    getClanEmbed
} 
