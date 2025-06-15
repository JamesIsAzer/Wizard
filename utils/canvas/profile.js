const { createCanvas, loadImage, registerFont } = require('canvas');
const { getImagePath, getFontPath, clashFont, tagFont, mapClanRoles, getTrophyLeagueImagePath, getLeagueName, drawRoundedRectPath, drawRightRoundedRectPath, getTownhallPath, clashFontScaled, formatDateYearMonth, signature, getAchievementStarsImagePath, formatNumberWithSpaces, getLastYearMonth } = require('./shared');

registerFont(getFontPath('Clash_Regular'), { family: 'ClashFont' });

const getProfileImage = async (profile, key) => {
    const hasLegendStats = !!(profile?.legendStatistics?.bestSeason)
    
    const width = 3500;
    const height = hasLegendStats ? 2550 : 2125;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e8e8e0';
    
    ctx.fillRect(0, 0, width, height);

    await nameCardSection(profile, ctx, 25, 25, ),
    await achievementsSection(profile.achievements, ctx, 75, hasLegendStats ? 1425 : 1000)

    if (hasLegendStats) {
        await legendLeagueSection(profile.legendStatistics, ctx, 25, 1000)
    }
    const buffer = canvas.toBuffer('image/png');
    const fileName = `player-profile-${key}.png`
    return { buffer, fileName };
};

const nameCardSection = async (profile, ctx, x, y) => {
    const width = 3450
    const height = 950
    const radius = 10
    
    const paddingTop = 75
    const paddingLeft = 75

    const gradient = ctx.createLinearGradient(x, y, x, y + height);

    gradient.addColorStop(0, '#8c96af'); 
    gradient.addColorStop(1, '#6b7899');

    ctx.fillStyle = gradient

    drawRoundedRectPath(ctx, x, y, width, height, radius); 

    ctx.fill()

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#6a7798';
    drawRoundedRectPath(ctx, x, y, width, height, radius); 
    ctx.stroke();

    dividerLine(ctx, x + paddingLeft + 1400, x + paddingLeft + 1400, y + paddingTop, y + paddingTop + 700)
    dividerLine(ctx, x + paddingLeft + 2300, x + paddingLeft + 2300, y + paddingTop, y + paddingTop + 700)

    await nameSection(profile, ctx, x + paddingLeft, y + paddingTop + 50),
    await clanSection(profile, ctx, x + paddingLeft + 1600, y + paddingTop + 100),
    await townhallSection(profile, ctx, x + paddingLeft + 2200, y + paddingTop, width, height)

    addSeasonalSection(profile, ctx, x, y, width, height, radius)
}

const addSeasonalSection = (profile, ctx, x, y, width, height, radius) => {
    const purpleHeight = 125;
    const purpleY = y + height - purpleHeight;

    ctx.beginPath();
    ctx.moveTo(x, purpleY);
    ctx.lineTo(x + width, purpleY);
    ctx.lineTo(x + width, purpleY + purpleHeight - radius);
    ctx.quadraticCurveTo(x + width, purpleY + purpleHeight, x + width - radius, purpleY + purpleHeight);
    ctx.lineTo(x + radius, purpleY + purpleHeight);
    ctx.quadraticCurveTo(x, purpleY + purpleHeight, x, purpleY + purpleHeight - radius);
    ctx.lineTo(x, purpleY);
    ctx.closePath();

    ctx.fillStyle = '#4e4d79';
    ctx.fill();

    ctx.fillStyle = '#7964a5';
    ctx.fillRect(x, purpleY + 3, width, 5);

    const troopsDonated = profile.donations
    const troopsReceived = profile.donationsReceived
    const attacksWon = profile.attackWins
    const defensesWon = profile.defenseWins
    
    drawPixelLine(ctx, 100, purpleY + 100, 500)
    clashFont(ctx, 'Troops donated:', 100, purpleY + 50, '50')
    seasonalStatBox(ctx, 625, purpleY + 20, troopsDonated)

    drawPixelLine(ctx, 900, purpleY + 100, 505)
    clashFont(ctx, 'Troops received:', 900, purpleY + 50, '50')
    seasonalStatBox(ctx, 1425, purpleY + 20, troopsReceived)

    drawPixelLine(ctx, 1815, purpleY + 100, 390)
    clashFont(ctx, 'Attacks won:', 1815, purpleY + 50, '50')
    seasonalStatBox(ctx, 2215, purpleY + 20, attacksWon)

    drawPixelLine(ctx, 2615, purpleY + 100, 440)
    clashFont(ctx, 'Defenses won:', 2615, purpleY + 50, '50')
    seasonalStatBox(ctx, 3065, purpleY + 20, defensesWon)
}

const seasonalStatBox = (ctx, x, y, message) => {
    const width = 250
    const height = 90
    ctx.fillStyle = '#2e2c62';
    drawRoundedRectPath(ctx, x, y, width, height, 30)
    ctx.fill();
    clashFont(ctx, message, x + (width / 2), y + (height / 2), '50', true)
}

const drawPixelLine = (ctx, x, y, width) => {
    ctx.fillStyle = '#2e2e48';
    ctx.fillRect(x, y, width, 4);
    
    ctx.fillStyle = '#7a6296';
    ctx.fillRect(x, y + 4, width, 4);
}

const legendLeagueSection = async (legendStats, ctx, x, y) => {
    const bestSeason = legendStats.bestSeason
    const previousSeason = legendStats.previousSeason
    const legendTrophies = legendStats.legendTrophies

    const width = 3450
    const height = 400
    const radius = 10
    
    const paddingTop = 50
    const paddingLeft = 200

    const gradient = ctx.createLinearGradient(x, y, x, y + height);

    gradient.addColorStop(0, '#4d4379'); 
    gradient.addColorStop(1, '#6f659b');

    ctx.fillStyle = gradient

    drawRoundedRectPath(ctx, x, y, width, height, radius); 
    
    ctx.fill()

    const gradient1 = ctx.createLinearGradient(x, y + 50, x + width, y + 50);
    gradient1.addColorStop(0, 'rgba(148, 113, 210, 0)');    
    gradient1.addColorStop(0.5, 'rgba(148, 113, 210, 1)');    
    gradient1.addColorStop(1, 'rgba(148, 113, 210, 0)');    

    ctx.beginPath();
    ctx.strokeStyle = gradient1;
    ctx.lineWidth = 90;
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + width, y + 50);
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#493f75';
    drawRoundedRectPath(ctx, x, y, width, height, radius); 
    ctx.stroke();

    clashFont(ctx, 'Legend League Tournament', x + (width / 2), y + 50, '70', true)

    dividerLine(ctx, x + paddingLeft + 1000, x + paddingLeft + 1000, y + paddingTop + 75, y + paddingTop + 325, "#35304e", "#796fa5")
    dividerLine(ctx, x + paddingLeft + 2175, x + paddingLeft + 2175, y + paddingTop + 75, y + paddingTop + 325, "#35304e", "#796fa5")

    await trophyLegendarySection(bestSeason, ctx, x + paddingLeft, y + (paddingTop/2), 'Best'),
    await trophyLegendarySection(previousSeason, ctx, x + paddingLeft + 1100, y + (paddingTop/2), 'Previous'),
    await legendTrophySection(legendTrophies, ctx, x + paddingLeft + 2400, y + (paddingTop/2))
}

const trophyLegendarySection = async (season, ctx, x, y, type) => {
    const rank = season?.rank
    const trophies = season?.trophies
    const date = season?.id

    if (season) {
        const legendImagePath = getImagePath("Icon_HV_League_Legend");
        const legendImage = await loadImage(legendImagePath);

        ctx.drawImage(legendImage, x, y + 100, 250, 250);
        clashFontScaled(ctx, rank, x + 125, y + 220, 200, 160, true)
        clashFont(ctx, `${type}: ${formatDateYearMonth(date)}`, x + 275, y + 125, '50', false)
        statBanner(ctx, x + 275, y + 200, 150, 150, 'trophy', trophies, '#242135')
    }
    if (!season) {
        const unrankedImagePath = getImagePath("Icon_HV_League_None");
        const unrankedImage = await loadImage(unrankedImagePath);

        ctx.drawImage(unrankedImage, x, y + 100, 250, 250);

        clashFont(ctx, `Did not place`, x + 300, y + 250, '50', false, '#dde2ff')
        clashFont(ctx, `${type}: ${formatDateYearMonth(getLastYearMonth())}`, x + 275, y + 125, '50', false)
    }
    
}

const legendTrophySection = async (legendTrophies, ctx, x, y) => {
    clashFont(ctx, `Legend trophies:`, x, y + 125, '50', false)
    statBanner(ctx, x, y + 200, 150, 150, 'legendtrophy', legendTrophies, '#242135')
}

const achievementBanner = async (ctx, x, y, cellHeight, cellWidth, achievementTitle, achievementIcon, achievement) => {
    const achievementStars = achievement.stars
    const achievementValue = achievement.value
    
    const achievementIconWidth = 150
    const achievementIconHeight = 150
    
    const barHeight = 80;
    const barRadius = barHeight / 5;
    const barPadding = (achievementIconWidth / 2) + 20;
    const spacingBetween = 20;

    const starsWidth = 288;
    const starsHeight = 115;
    const starsX = x + 30;
    const starsY = y + (cellHeight / 2) - (starsHeight / 2);

    const xFromStatIcon = x + starsWidth + 70;

    const achievementIconPath = getImagePath(achievementIcon);
    const achievementIconImage = await loadImage(achievementIconPath);
    const starsImagePath = getAchievementStarsImagePath(achievementStars);
    const starsImage = await loadImage(starsImagePath);

    const iconY = y + (cellHeight / 2) - (achievementIconHeight / 2) + 10;
    const iconCenterY = iconY + (achievementIconHeight / 2) + 10

    const barX = xFromStatIcon + (achievementIconWidth / 2);
    const barY = iconCenterY - (barHeight / 2);


    ctx.font = '60px Clash';
    const text = formatNumberWithSpaces(achievementValue.toString())
    const textWidth = ctx.measureText(text).width;

    const barWidth = Math.max(
        barPadding + spacingBetween + textWidth + 20,
        cellWidth - starsWidth - (achievementIconWidth/2) - 300
    )

    ctx.fillStyle = '#38385c';
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    const iconX = barX + barPadding;

    ctx.drawImage(achievementIconImage, xFromStatIcon, iconY, achievementIconWidth, achievementIconHeight);

    ctx.drawImage(starsImage, starsX, starsY, starsWidth, starsHeight);

    const textX = iconX + spacingBetween;
    const textY = iconCenterY - 30;
    clashFont(ctx, achievementTitle, iconX, textY - 55, '40', false);
    clashFont(ctx, text, textX, textY, '60', false);
};

// for later
const personalBestBanner = async (ctx, x, y, emblemWidth, emblemHeight, bestTrophies, cellHeight) => {
    const barHeight = 80;
    const barRadius = barHeight / 5;
    const barPadding = (emblemWidth / 2) + 20;
    const spacingBetween = 20;

    const starsWidth = 288;
    const starsHeight = 115;
    const starY = y + (cellHeight / 2) - (starsHeight / 2);

    const xFromStatIcon = x + starsWidth + 70;

    const trophyLeagueEmblemPath = getTrophyLeagueImagePath(bestTrophies);
    const emblemImage = await loadImage(trophyLeagueEmblemPath);
    const starsImagePath = getImagePath('3star');
    const starsImage = await loadImage(starsImagePath);

    // Proper emblem vertical centering
    const emblemY = y + (cellHeight / 2) - (emblemHeight / 2);
    const emblemCenterY = emblemY + (emblemHeight / 2);

    // Bar Y calculation now based on corrected emblemCenterY
    const barX = xFromStatIcon + (emblemWidth / 2);
    const barY = emblemCenterY - (barHeight / 2);

    ctx.font = '60px Clash';
    const text = bestTrophies.toString();
    const textWidth = ctx.measureText(text).width;
    const barWidth = barPadding + spacingBetween + textWidth + 40;

    ctx.fillStyle = '#38385c';
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    // Trophy icon inside bar
    const iconX = barX + barPadding;

    ctx.drawImage(emblemImage, xFromStatIcon, emblemY, emblemWidth, emblemHeight);

    // Star image centered in cell
    ctx.drawImage(starsImage, x + 30, starY, starsWidth, starsHeight);

    // Trophies text
    const textX = iconX + spacingBetween;
    const textY = emblemCenterY - 30;
    clashFont(ctx, 'Personal best:', iconX, textY - 55, '40', false);
    clashFont(ctx, bestTrophies, textX, textY, '60', false);
};

const statBanner = async (ctx, x, y, emblemWidth, emblemHeight, imageName, stat, statBgColour = '#38385c') => {
    const emblemCenterY = y + (emblemHeight / 2);
    const barHeight = 100;
    const barRadius = barHeight / 4;
    const barPadding = 20 + (emblemWidth / 2);
    const iconSize = 60;
    const spacingBetween = 20;

    const statImagePath = getImagePath(imageName);
    const statImage = await loadImage(statImagePath);

    const barX = x + (emblemWidth / 2);
    const barY = emblemCenterY - (barHeight / 2);

    const text = stat.toString();
    ctx.font = '70px Clash'; 
    const textWidth = ctx.measureText(text).width;

    const barWidth = barPadding + iconSize + spacingBetween + textWidth + 80;

    ctx.fillStyle = statBgColour;
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    const iconX = barX + barPadding;
    ctx.drawImage(statImage, x, y, emblemWidth, emblemHeight);

    const textX = iconX + iconSize + spacingBetween;
    const textY = emblemCenterY - 30
    clashFont(ctx, stat, textX, textY, '70', false);
};

const leagueTrophyBanner = async (ctx, x, y, emblemWidth, emblemHeight, trophies, league, rank) => {
    const lineStartFromEmblemX = x + (emblemWidth / 2);
    const lineEndX = x + emblemWidth + 750; 
    const emblemCenterY = y + (emblemHeight / 2);
    const line1Y = emblemCenterY - 55; 
    const gradient1 = ctx.createLinearGradient(lineStartFromEmblemX, 0, lineEndX, 0);
    gradient1.addColorStop(0, 'rgba(0, 0, 0, 0.8)');   
    gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');     

    ctx.beginPath();
    ctx.strokeStyle = gradient1;
    ctx.lineWidth = 90;
    ctx.moveTo(lineStartFromEmblemX, line1Y);
    ctx.lineTo(lineEndX, line1Y);
    ctx.stroke();
    ctx.closePath();

    const line2Y = emblemCenterY + 50; 
    const gradient2 = ctx.createLinearGradient(lineStartFromEmblemX, 0, lineEndX, 0);
    gradient2.addColorStop(0, 'rgba(118, 82, 178, 1)'); 
    gradient2.addColorStop(0.5, 'rgba(101, 82, 166, 1)'); 
    gradient2.addColorStop(1, 'rgba(101, 82, 166, 0)'); 

    ctx.beginPath();
    ctx.strokeStyle = gradient2;
    ctx.lineWidth = 110;
    ctx.moveTo(lineStartFromEmblemX, line2Y);
    ctx.lineTo(lineEndX, line2Y);
    ctx.stroke();
    ctx.closePath();

    const leagueName = league ? getLeagueName(league) : 'Unranked'
    clashFont(ctx, leagueName, lineStartFromEmblemX + 200, line1Y - 28, '55', false)

    const trophyIconPath = getImagePath('trophy')
    const trophyIconImage = await loadImage(trophyIconPath);
    ctx.drawImage(trophyIconImage, lineStartFromEmblemX + 200, line2Y - 45, 90, 90);

    const unrankedEmblemPath = getImagePath('Icon_HV_League_None');

    const emblemImage = league ? await loadImage(league.iconUrls.medium) :
        await loadImage(unrankedEmblemPath);

    ctx.drawImage(emblemImage, x, y, emblemWidth, emblemHeight);

    // TODO - Get Supercell to fix currentSeason.rank
    if(false) {
        const rankX = x + (emblemWidth/2)
        const rankY = y + (emblemHeight/2) + 10
        clashFontScaled(ctx, rank, rankX, rankY, emblemWidth * 0.4, emblemHeight * 0.4, true)
    }

    clashFont(ctx, trophies, lineStartFromEmblemX + 310, line2Y - 35, '85', false)
}

const dividerLine = (ctx, x1, x2, y1, y2, c1 = "#5b5f80", c2 = "#abaec1") => {

    ctx.strokeStyle = c1;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 3);
    ctx.lineTo(x2, y2 - 3);
    ctx.stroke();

    ctx.strokeStyle = c2;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1-2, y1);
    ctx.lineTo(x2-2, y2);
    ctx.stroke();
}

const townhallSection = async (profile, ctx, x, y) => {
    const townhallImageWidth = 610
    const townhallLevel = profile.townHallLevel
    const townhallImagePath = getTownhallPath(townhallLevel);
    const townhallImage = await loadImage(townhallImagePath);

    const shineImagePath = getImagePath('shine');
    const shineImage = await loadImage(shineImagePath);

    ctx.drawImage(shineImage, x + 130, y - 150, townhallImageWidth + 400, townhallImageWidth + 400);
    ctx.drawImage(townhallImage, x + 330, y + 50, townhallImageWidth, townhallImageWidth);
}

const clanSection = async(profile, ctx, x, y) => {
    const clan = profile.clan
    const emblemWidth = 500
    const emblemHeight = 500
    
    if (clan) {
        const clanEmblem = await loadImage(clan.badgeUrls.medium)    
        clashFont(ctx, clan.name, x + (emblemWidth / 2), y, '75', true)
        ctx.drawImage(clanEmblem, x, y + 50, emblemWidth, emblemHeight); 
    }
    if (!clan) clashFont(ctx, 'No Clan', x + (emblemWidth / 2), y, '75', true)
}

const nameSection = async (profile, ctx, x, y) => {
    const username = profile.name
    const playerTag = profile.tag
    const clanRole = profile.role
    const league = profile?.league
    const trophies = profile.trophies
    const expLevel = profile.expLevel

    const imagePath = getImagePath('xp');

    const image = await loadImage(imagePath);

    ctx.drawImage(image, x, y - 10, 200, 200);

    clashFont(ctx, expLevel, x + 100, y + 90, '90', true)

    clashFont(ctx, username, x + 250, y - 30, '100', false)
    tagFont(ctx, playerTag, x + 250, y + 95, '75', false)

    if(clanRole)
        clashFont(ctx, mapClanRoles(clanRole), x + 250, y + 190, '75', false)

    const rank = profile?.legendStatistics?.currentSeason?.rank

    await leagueTrophyBanner(ctx, x + 100, y + 300, 350, 350, trophies, league, rank)
}

const achievementsSection = async (achievements, ctx, x, y) =>  {
    const goldLooted = achievements[5]
    const troopDonations = achievements[14]
    const obstaclesRemoved = achievements[3]
    const clanGamePoints = achievements[31]

    const elixirLooted = achievements[6]
    const spellDonations = achievements[23]
    const seasonChallengePts = achievements[35]
    const warStars = achievements[20]
    const successfulAttacks = achievements[12]

    const darkElixirLooted = achievements[16]
    const siegeDonations = achievements[40]
    const campaignMapStars = achievements[1]
    const clanWarLeagueStars = achievements[33]
    const successfulDefenses = achievements[13]

    await achievementCell(ctx, x, y, 'Gold looted', 'gold', goldLooted),
    await achievementCell(ctx, x, y + 225, 'Troop donations', 'troopdonation', troopDonations),
    await achievementCell(ctx, x, y + 450, 'Obstacles removed', 'obstaclesremoved', obstaclesRemoved),
    await achievementCell(ctx, x, y + 675, 'Clan games points', 'clangames', clanGamePoints),

    await achievementCell(ctx, x + 1125, y, 'Elixir looted', 'elixir', elixirLooted),
    await achievementCell(ctx, x + 1125, y + 225, 'Spell donations', 'spelldonation', spellDonations),
    await achievementCell(ctx, x + 1125, y + 450, 'Season challenge pts', 'goldpass', seasonChallengePts),
    await achievementCell(ctx, x + 1125, y + 675, 'War stars', 'warstar', warStars),
    await achievementCell(ctx, x + 1125, y + 900, 'Successful attacks', 'multiplayerattack', successfulAttacks),
        
    await achievementCell(ctx, x + 2250, y, 'Dark elixir looted', 'darkelixir', darkElixirLooted),
    await achievementCell(ctx, x + 2250, y + 225, 'Siege donations', 'siegemachinedonation', siegeDonations),
    await achievementCell(ctx, x + 2250, y + 450, 'Campaign map stars', 'campaigner', campaignMapStars),
    await achievementCell(ctx, x + 2250, y + 675, 'Clan war league stars', 'cwlstar', clanWarLeagueStars),
    await achievementCell(ctx, x + 2250, y + 900, 'Successful defenses', 'shield', successfulDefenses)

    await signature(ctx, x + 100, y + 850, 6)
}

const achievementCell = async (ctx, x, y, achievementTitle, achievementIcon, achievement) => {
    const width = 1100
    const height = 200
    const radius = 30
    drawRoundedRectPath(ctx, x, y, width, height, radius)

    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, '#a8adb0');
    gradient.addColorStop(1, '#9ca5b0');

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    reflection(ctx, x + 25, y + 25, width - 50, (height / 2) - 25)

    await achievementBanner(ctx, x, y, height, width, achievementTitle, achievementIcon, achievement)
}

const reflection = (ctx, x, y, width, height) => {
    const radius = 20
    drawRoundedRectPath(ctx, x, y, width, height, radius)

    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');     // Fully opaque black at start
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)'); 

    ctx.fillStyle = gradient;
    ctx.fill();
}

module.exports = { getProfileImage };