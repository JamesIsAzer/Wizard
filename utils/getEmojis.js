const emojis = require('../emojis.json');

const getLeagueEmote = (leagueName) => {
    const leagueNameCaps = leagueName.toUpperCase()
    if (leagueNameCaps.startsWith("LEGEND")) return emojis.legendleague
    if (leagueNameCaps.startsWith("ELECTRO")) return emojis.electrodragonleague
    if (leagueNameCaps.startsWith("DRAGON")) return emojis.dragonleague
    if (leagueNameCaps.startsWith("TITAN")) return emojis.titanleague
    if (leagueNameCaps.startsWith("PEKKA")) return emojis.pekkaleague
    if (leagueNameCaps.startsWith("GOLEM")) return emojis.golemleague
    if (leagueNameCaps.startsWith("WITCH")) return emojis.witchleague
    if (leagueNameCaps.startsWith("VALKYRIE")) return emojis.valkyrieleague
    if (leagueNameCaps.startsWith("WIZARD")) return emojis.wizardleague
    if (leagueNameCaps.startsWith("ARCHER")) return emojis.archerleague
    if (leagueNameCaps.startsWith("BARBARIAN")) return emojis.barbarianleague
    if (leagueNameCaps.startsWith("SKELETON")) return emojis.skeletonleague
    return emojis.unranked
}

function getWarLeagueEmote(warLeagueId){
    if (warLeagueId > 48000015) return emojis.champion
    if (warLeagueId > 48000012) return emojis.master
    if (warLeagueId > 48000009) return emojis.crystal
    if (warLeagueId > 48000006) return emojis.goldrank
    if (warLeagueId > 48000003) return emojis.silver
    if (warLeagueId > 48000000) return emojis.bronze
    else return emojis.unranked
}

module.exports = {
    getLeagueEmote,
    getWarLeagueEmote
} 
