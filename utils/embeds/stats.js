const { MessageEmbed } = require('discord.js')

const getProfileEmbed = (profile, verified) => {
    const embed = new MessageEmbed()
    .setTitle(`${getLeagueEmote(profile.trophies)} ${profile.name} ${profile.tag}`)
    .setURL(`https://www.clashofstats.com/players/${getURLName(profile)}-${getURLTag(profile)}/summary`)
    .setColor('#33E3FF')
    .addFields(
    // general
    {
        name: 'Townhall Level',
        value: `${getTownhallEmote(profile.townHallLevel)} ${profile.townHallLevel}`,
        inline: true,
    },
    {
        name: 'Exp Level',
        value: `<:xp:935754903882702938> ${prettyNumbers(profile.expLevel)}`,
        inline: true,
    },
    {
        name: 'Clan',
        value: `<a:looking_for_clanmates:584303569809834005> ${isInClan(profile) ? "No clan found" : `[${profile.clan.name}](https://www.clashofstats.com/clans/${getURLClanName(player)}-${getURLClanTag(player)}/summary)`}`,
        inline: true,
    }, 
    // trophies
    {
        name: 'Trophies',
        value: `<:trophy:927704647089676369> ${prettyNumbers(profile.trophies)}`,
        inline: true,
    }, 
    {
        name: 'Personal Best',
        value: `<:ChampionKing:834433636756750367> ${prettyNumbers(profile.bestTrophies)}`,
        inline: true,
    }, 
    {
        name: 'War Stars',
        value: `<:star:927704564914860052> ${prettyNumbers(profile.warStars)}`,
        inline: true,
    }, 

    // donations
    {
        name: 'Troop Donations',
        value: `<:speedup:927704617981190205> ${prettyNumbers(profile.achievements[14].value)}`,
        inline: true,
    }, 
    {
        name: 'Spell Donations',
        value: `<:haste:927704540621463643> ${prettyNumbers(profile.achievements[23].value)}`,
        inline: true,
    }, 
    {
        name: 'Siege Donations',
        value: `<:wallwrecker:935755961220616192> ${prettyNumbers(profile.achievements[40].value)}`,
        inline: true,
    }, 

    // wins
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
        value: `<:clangames:927703762561286176> ${prettyNumbers(profile.achievements[31].value)}`,
        inline: true,
    }, 


    // builder base
    {
        name: 'Builderhall Level',
        value: `<:bh:341677900698877952> ${profile.builderHallLevel ? profile.builderHallLevel : 'No builder hall'}`,
        inline: true,
    }, 
    {
        name: 'Builder Trophies',
        value: `<:versustrophy:927704667960528926> ${prettyNumbers(profile.versusTrophies)}`,
        inline: true,
    }, 
    {
        name: 'Builder Personal Best',
        value: `<:nightwitch:316157731297820672> ${prettyNumbers(profile.bestVersusTrophies)}`,
        inline: true,
    });
    if (profile.legendStatistics?.legendTrophies) embed.addFields({name: 'Legend Trophies', value: `<:legend_trophy:935757690020429844> ${prettyNumbers(profile.legendStatistics.legendTrophies)}`, inline: true})
    if (profile.legendStatistics?.bestSeason) embed.addFields({name: 'Best Legend Rank', value: `<:globe:777311138789851167> ${prettyNumbers(profile.legendStatistics.bestSeason.rank)}`, inline: true})
    if (profile.legendStatistics?.bestVersusSeason) embed.addFields({name: 'Best Builder Rank', value: `<:globe:777311138789851167> ${prettyNumbers(profile.legendStatistics.bestVersusSeason.rank)}`, inline: true})    
    if(verified) embed.setFooter({text: 'Verified under this account', iconURL: "https://media.discordapp.net/attachments/582092054264545280/935702845183918160/check-mark_2714-fe0f.png"})
    return embed
}

const getLeagueEmote = (trophycount) => {
    if (trophycount >= 5000) return "<:legend:590895411284410407>"
    if (trophycount >= 4100) return "<:titan:613349333584052237>"
    if (trophycount >= 3200) return "<:champion:613349285852872725>"
    if (trophycount >= 2600) return "<:master:613349394724552712>"
    if (trophycount >= 2000) return "<:crystal:613349239271063553>"
    if (trophycount >= 1400) return "<:gold:613349361715249182>"
    if (trophycount >= 800) return "<:silver:613349425317806085>"
    if (trophycount >= 400) return "<:bronze:613349202528960534>"
    return "<:unranked:935678512822616074>"
}

const getTownhallEmote = (thlvl) => {
    if (thlvl == 14) return "<:th14:829099837034070027>"
    if (thlvl == 13) return "<:th13:651100997367627823>"
    if (thlvl == 12) return "<:th12:451408476426469387>"
    if (thlvl == 11) return "<:th11:288436090665172992>"
    if (thlvl == 10) return "<:th10:288436059203829770>"
    if (thlvl == 9) return "<:th9:288436023573086211>"
    else return "<:th8:936511388849934356>"
}

const prettyNumbers = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const getURLTag = (profile) => profile.tag.substr(1)
const getURLName = (profile) => profile.name.replace(/\s+/g, '-').toLowerCase()
const getURLClanTag = (profile) => profile?.clan?.tag?.substr(1)
const getURLClanName = (profile) => profile?.clan?.name?.replace(/\s+/g, '-').toLowerCase()
const isInClan = (profile) => !!profile.clan

module.exports = {
    getProfileEmbed
} 
