const { createCanvas, loadImage, registerFont } = require('canvas');
const { getImagePath, getFontPath, clashFont, tagFont, mapClanRoles, getTrophyLeagueImagePath, getLeagueName, drawRoundedRectPath, drawRightRoundedRectPath, getTownhallPath, clashFontScaled, formatDateYearMonth, signature } = require('./shared');

registerFont(getFontPath('Clash_Regular'), { family: 'ClashFont' });

const getProfileImage = async (profile, key) => {
    const legends = true
    
    const width = 3500;
    const height = legends ? 2550 : 2125;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e8e8e0';
    
    ctx.fillRect(0, 0, width, height);

    await nameCardSection(ctx, 25, 25)
    if (legends) {
        await legendLeagueSection(ctx, 25, 1000)
    }
    await achievementsSection(ctx, 75, legends ? 1425 : 1000)
    const buffer = canvas.toBuffer('image/png');
    const fileName = `player-profile-${key}.png`
    return { buffer, fileName };
};

const nameCardSection = async (ctx, x, y) => {
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

    await nameSection(ctx, x + paddingLeft, y + paddingTop + 50)

    dividerLine(ctx, x + paddingLeft + 1400, x + paddingLeft + 1400, y + paddingTop, y + paddingTop + 700)

    await clanSection(ctx, x + paddingLeft + 1600, y + paddingTop + 100)

    dividerLine(ctx, x + paddingLeft + 2300, x + paddingLeft + 2300, y + paddingTop, y + paddingTop + 700)

    await townhallSection(ctx, x + paddingLeft + 2200, y + paddingTop)
    //await trophiesSection(ctx, x + paddingLeft + 2200, y + paddingTop + 50)

    addSeasonalSection(ctx, x, y, width, height, radius)
}

const addSeasonalSection = (ctx, x, y, width, height, radius) => {
    // Purple bottom section
    const purpleHeight = 125;
    const purpleY = y + height - purpleHeight;
    const purpleRadius = 10;

    ctx.beginPath();
    ctx.moveTo(x, purpleY);
    ctx.lineTo(x + width, purpleY);
    ctx.lineTo(x + width, purpleY + purpleHeight - radius);
    ctx.quadraticCurveTo(x + width, purpleY + purpleHeight, x + width - radius, purpleY + purpleHeight);
    ctx.lineTo(x + radius, purpleY + purpleHeight);
    ctx.quadraticCurveTo(x, purpleY + purpleHeight, x, purpleY + purpleHeight - radius);
    ctx.lineTo(x, purpleY);
    ctx.closePath();

    ctx.fillStyle = '#4e4d79';  // your purple color
    ctx.fill();

    ctx.fillStyle = '#7964a5';
    ctx.fillRect(x, purpleY + 3, width, 5);

    drawPixelLine(ctx, 100, purpleY + 100, 500)
    clashFont(ctx, 'Troops donated:', 100, purpleY + 50, '50')
    seasonalStatBox(ctx, 625, purpleY + 20, 40)

    drawPixelLine(ctx, 900, purpleY + 100, 505)
    clashFont(ctx, 'Troops received:', 900, purpleY + 50, '50')
    seasonalStatBox(ctx, 1425, purpleY + 20, 3242)

    drawPixelLine(ctx, 1815, purpleY + 100, 390)
    clashFont(ctx, 'Attacks won:', 1815, purpleY + 50, '50')
    seasonalStatBox(ctx, 2215, purpleY + 20, 1)

    drawPixelLine(ctx, 2615, purpleY + 100, 440)
    clashFont(ctx, 'Defenses won:', 2615, purpleY + 50, '50')
    seasonalStatBox(ctx, 3065, purpleY + 20, 10000)
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

const legendLeagueSection = async (ctx, x, y) => {
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

    await trophyLegendarySection(ctx, x + paddingLeft, y + (paddingTop/2), 'Best')
    await trophyLegendarySection(ctx, x + paddingLeft + 1100, y + (paddingTop/2), 'Previous')
    await legendTrophySection(ctx, x + paddingLeft + 2400, y + (paddingTop/2))
}

const trophyLegendarySection = async (ctx, x, y, type) => {
    const date = '2025-05'
    const rank = 3144
    const trophies = 5901

    const legendImagePath = getImagePath("Icon_HV_League_Legend");
    const legendImage = await loadImage(legendImagePath);
    ctx.drawImage(legendImage, x, y + 100, 250, 250);
    clashFontScaled(ctx, rank, x + 125, y + 220, 200, 160, true)

    clashFont(ctx, `${type}: ${formatDateYearMonth(date)}`, x + 275, y + 125, '50', false)
    statBanner(ctx, x + 275, y + 200, 150, 150, 'trophy', trophies, '#242135')
}

const legendTrophySection = async (ctx, x, y) => {
    const legendTrophies = 4444
    clashFont(ctx, `Legend trophies:`, x, y + 125, '50', false)
    statBanner(ctx, x, y + 200, 150, 150, 'legendtrophy', legendTrophies, '#242135')
}

const personalBestBanner = async (ctx, x, y, emblemWidth, emblemHeight, bestTrophies) => {
    const emblemCenterY = y + (emblemHeight / 2);
    const barHeight = 80;
    const barRadius = barHeight / 2;
    const barPadding = 20 + (emblemWidth / 2);
    const iconSize = 60;
    const spacingBetween = 20;

    // Draw the league emblem first
    const trophyLeagueEmblemPath = getTrophyLeagueImagePath(bestTrophies);
    const emblemImage = await loadImage(trophyLeagueEmblemPath);

    // Bar should start immediately after the emblem
    const barX = x + (emblemWidth / 2);
    const barY = emblemCenterY - (barHeight / 2);

    // Load trophy icon
    const trophyIconPath = getImagePath('trophy');
    const trophyIconImage = await loadImage(trophyIconPath);

    // Estimate bar width based on content (icon + trophies text)
    const text = bestTrophies.toString();
    ctx.font = '60px Clash'; // Adjust as needed to match clashFont
    const textWidth = ctx.measureText(text).width;

    const barWidth = barPadding + iconSize + spacingBetween + textWidth + 80;

    // Draw the rounded bar
    ctx.fillStyle = '#38385c';
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    // Draw the trophy icon inside the bar
    const iconX = barX + barPadding;
    const iconY = emblemCenterY - (iconSize / 2);
    ctx.drawImage(trophyIconImage, iconX, iconY, iconSize, iconSize);
    ctx.drawImage(emblemImage, x, y, emblemWidth, emblemHeight);

    // Draw best trophies text to the right of the icon
    const textX = iconX + iconSize + spacingBetween;
    const textY = emblemCenterY - 30
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

    // Draw the league emblem first
    const statImagePath = getImagePath(imageName);
    const statImage = await loadImage(statImagePath);

    // Bar should start immediately after the emblem
    const barX = x + (emblemWidth / 2);
    const barY = emblemCenterY - (barHeight / 2);

    // Estimate bar width based on content (icon + trophies text)
    const text = stat.toString();
    ctx.font = '70px Clash'; // Adjust as needed to match clashFont
    const textWidth = ctx.measureText(text).width;

    const barWidth = barPadding + iconSize + spacingBetween + textWidth + 80;

    // Draw the rounded bar
    ctx.fillStyle = statBgColour;
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    const iconX = barX + barPadding;
    ctx.drawImage(statImage, x, y, emblemWidth, emblemHeight);

    const textX = iconX + iconSize + spacingBetween;
    const textY = emblemCenterY - 30
    clashFont(ctx, stat, textX, textY, '70', false);
};

const leagueTrophyBanner = async (ctx, x, y, emblemWidth, emblemHeight, trophies, league) => {
    const lineStartFromEmblemX = x + (emblemWidth / 2);
    const lineEndX = x + emblemWidth + 750; // Extend lines further right and fade out
    const emblemCenterY = y + (emblemHeight / 2);
    const line1Y = emblemCenterY - 55; // Position above emblem center
    const gradient1 = ctx.createLinearGradient(lineStartFromEmblemX, 0, lineEndX, 0);
    gradient1.addColorStop(0, 'rgba(0, 0, 0, 0.8)');     // Fully opaque black at start
    gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');     // Fully transparent black at end

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

    const leagueName = getLeagueName(league)
    clashFont(ctx, leagueName, lineStartFromEmblemX + 200, line1Y - 28, '55', false)

    const trophyIconPath = getImagePath('trophy')
    const trophyIconImage = await loadImage(trophyIconPath);
    ctx.drawImage(trophyIconImage, lineStartFromEmblemX + 200, line2Y - 45, 90, 90);

    const trophyLeagueEmblemPath = getTrophyLeagueImagePath(trophies);

    const image = await loadImage(trophyLeagueEmblemPath);
    ctx.drawImage(image, x, y, emblemWidth, emblemHeight);

    clashFont(ctx, trophies, lineStartFromEmblemX + 310, line2Y - 35, '85', false)
}

const dividerLine = (ctx, x1, x2, y1, y2, c1 = "#5b5f80", c2 = "#abaec1") => {

    // Draw right line
    ctx.strokeStyle = c1;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 3);
    ctx.lineTo(x2, y2 - 3);
    ctx.stroke();

    // Draw left line
    ctx.strokeStyle = c2;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1-2, y1);
    ctx.lineTo(x2-2, y2);
    ctx.stroke();
}

const townhallSection = async (ctx, x, y) => {
    const townhallImageWidth = 610
    const townhallLevel = 17
    const townhallImagePath = getTownhallPath(townhallLevel);
    const townhallImage = await loadImage(townhallImagePath);

    //clashFont(ctx, `Townhall ${townhallLevel}`, x + 350 + (townhallImageWidth / 2), y, '75', true)
    ctx.drawImage(townhallImage, x + 300, y + 50, townhallImageWidth, townhallImageWidth);
}

const clanSection = async(ctx, x, y) => {
    const clanEmblem = await loadImage("https://api-assets.clashofclans.com/badges/512/u-ublBXwZlpr16QFdwXPtsCBSkwTXCTkOMYx0gg9cUY.png")

    const emblemWidth = 500
    const emblemHeight = 500

    clashFont(ctx, 'Cool Clan', x + (emblemWidth / 2), y, '75', true)
    
    ctx.drawImage(clanEmblem, x, y + 50, emblemWidth, emblemHeight); 
}

const nameSection = async (ctx, x, y) => {
    const imagePath = getImagePath('xp');

    const image = await loadImage(imagePath);

    ctx.drawImage(image, x, y - 10, 200, 200);

    clashFont(ctx, '247', x + 100, y + 90, '90', true)

    clashFont(ctx, 'JamesJamesJames', x + 250, y - 30, '100', false)
    tagFont(ctx, '#VP0QG80Y', x + 250, y + 95, '75', false)

    clashFont(ctx, mapClanRoles('coLeader'), x + 250, y + 190, '75', false)

    const league = {name: "Legend League"}
    const trophies = 5600
    await leagueTrophyBanner(ctx, x + 100, y + 300, 350, 350, trophies, league)

    //await labels(ctx, x + 250, y + 350)
    
}

const achievementsSection = async (ctx, x, y) =>  {
    achievementCell(ctx, x, y)
    achievementCell(ctx, x, y + 225)
    achievementCell(ctx, x, y + 450)
    achievementCell(ctx, x, y + 675)
    //achievementCell(ctx, x, y + 900)

    await signature(ctx, x + 100, y + 850)

    achievementCell(ctx, x + 1125, y)
    achievementCell(ctx, x + 1125, y + 225)
    achievementCell(ctx, x + 1125, y + 450)
    achievementCell(ctx, x + 1125, y + 675)
    achievementCell(ctx, x + 1125, y + 900)

    achievementCell(ctx, x + 2250, y)
    achievementCell(ctx, x + 2250, y + 225)
    achievementCell(ctx, x + 2250, y + 450)
    achievementCell(ctx, x + 2250, y + 675)
    achievementCell(ctx, x + 2250, y + 900)

}

const achievementCell = (ctx, x, y) => {
    const width = 1100
    const height = 200
    const radius = 30
    drawRoundedRectPath(ctx, x, y, width, height, radius)

    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, '#a8adb0');
    gradient.addColorStop(1, '#9ca5b0');

    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke outline (white)
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    reflection(ctx, x + 25, y + 25, width - 50, (height / 2) - 25)
}

const reflection = (ctx, x, y, width, height) => {
    const radius = 20
    drawRoundedRectPath(ctx, x, y, width, height, radius)

    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');     // Fully opaque black at start
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)'); 

    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fill();
}

const labels = async (ctx, x, y) => {
    const badgeWidth = 200;
    const badgeHeight = 200;
    const badgeSpacing = 25;

    const tasks = [
        loadImage("https://api-assets.clashofclans.com/labels/64/u-VKK5y0hj0U8B1xdawjxNcXciv-fwMK3VqEBWCn1oM.png"),
        loadImage("https://api-assets.clashofclans.com/labels/64/PcgplBTQo2W_PXYqMi0i6g6nrNMjzCM8Ipd_umSnuHw.png"),
        loadImage("https://api-assets.clashofclans.com/labels/64/8Q08M2dj1xz1Zx-sAre6QO14hOX2aiEvg-FaGGSX-7M.png")
    ]
    
    const images = await Promise.all(tasks)

    images.forEach((image, index) => {
        ctx.drawImage(image, x + (index * (badgeWidth + badgeSpacing)), y, badgeWidth, badgeHeight); 
    }) 
}


module.exports = { getProfileImage };