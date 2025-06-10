const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');
const { getImagePath, getFontPath, sectionTitleFont, clashFont, tagFont, mapClanRoles, getTrophyLeagueImagePath, getLeagueName, drawRoundedRectPath, drawRightRoundedRectPath } = require('./shared');

registerFont(getFontPath('Clash_Regular'), { family: 'ClashFont' });

const getProfileImage = async (profile, key) => {
    const width = 3500;
    const height = 2050;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e8e8e0';
    
    ctx.fillRect(0, 0, width, height);

    await nameCardSection(ctx, 50, 50)
    const buffer = canvas.toBuffer('image/png');
    const fileName = `player-profile-${key}.png`
    return { buffer, fileName };
};

const nameCardSection = async (ctx, x, y) => {
    const width = 3400
    const height = 800
    const radius = 80
    
    const paddingTop = 50
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

    await clanSection(ctx, x + paddingLeft + 1500, y + paddingTop + 50)

    dividerLine(ctx, x + paddingLeft + 2100, x + paddingLeft + 2100, y + paddingTop, y + paddingTop + 700)

    await trophiesSection(ctx, x + paddingLeft + 2200, y + paddingTop + 50)
}

const trophiesSection = async (ctx, x, y) => {
    const league = {name: "Champion League I"}
    const trophies = 3365
    const bestTrophies = 5500
    const warStars = 2913
    await leagueTrophyBanner(ctx, x, y, 300, 300, trophies, league)
    await personalBestBanner(ctx, x + 300, y + 300, 150, 150, bestTrophies)  
    await warStarsWonBanner(ctx, x + 300, y + 500, 150, 150, warStars)  
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

const warStarsWonBanner = async (ctx, x, y, emblemWidth, emblemHeight, warStars) => {
    const emblemCenterY = y + (emblemHeight / 2);
    const barHeight = 80;
    const barRadius = barHeight / 2;
    const barPadding = 20 + (emblemWidth / 2);
    const iconSize = 60;
    const spacingBetween = 20;

    // Draw the league emblem first
    const warStarImagePath = getImagePath("warstar");
    const warStarImage = await loadImage(warStarImagePath);

    // Bar should start immediately after the emblem
    const barX = x + (emblemWidth / 2);
    const barY = emblemCenterY - (barHeight / 2);

    // Estimate bar width based on content (icon + trophies text)
    const text = warStars.toString();
    ctx.font = '60px Clash'; // Adjust as needed to match clashFont
    const textWidth = ctx.measureText(text).width;

    const barWidth = barPadding + iconSize + spacingBetween + textWidth + 80;

    // Draw the rounded bar
    ctx.fillStyle = '#38385c';
    drawRightRoundedRectPath(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    const iconX = barX + barPadding;
    ctx.drawImage(warStarImage, x, y, emblemWidth, emblemHeight);

    const textX = iconX + iconSize + spacingBetween;
    const textY = emblemCenterY - 30
    clashFont(ctx, 'War stars:', iconX, textY - 55, '40', false);
    clashFont(ctx, warStars, textX, textY, '60', false);
};

const leagueTrophyBanner = async (ctx, x, y, emblemWidth, emblemHeight, trophies, league) => {
    const lineStartFromEmblemX = x + (emblemWidth / 2);
    const lineEndX = x + emblemWidth + 700; // Extend lines further right and fade out
    const emblemCenterY = y + (emblemHeight / 2);
    const line1Y = emblemCenterY - 50; // Position above emblem center
    const gradient1 = ctx.createLinearGradient(lineStartFromEmblemX, 0, lineEndX, 0);
    gradient1.addColorStop(0, 'rgba(0, 0, 0, 0.8)');     // Fully opaque black at start
    gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');     // Fully transparent black at end

    ctx.beginPath();
    ctx.strokeStyle = gradient1;
    ctx.lineWidth = 80;
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
    clashFont(ctx, leagueName, lineStartFromEmblemX + 450, line1Y, '50', true)

    const trophyIconPath = getImagePath('trophy')
    const trophyIconImage = await loadImage(trophyIconPath);
    ctx.drawImage(trophyIconImage, lineStartFromEmblemX + 200, line2Y - 45, 90, 90);

    const trophyLeagueEmblemPath = getTrophyLeagueImagePath(trophies);

    const image = await loadImage(trophyLeagueEmblemPath);
    ctx.drawImage(image, x, y, emblemWidth, emblemHeight);

    clashFont(ctx, trophies, lineStartFromEmblemX + 310, line2Y - 35, '80', false)
}

const dividerLine = (ctx, x1, x2, y1, y2) => {

    // Draw right line
    ctx.strokeStyle = "#5b5f80";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 3);
    ctx.lineTo(x2, y2 - 3);
    ctx.stroke();

    // Draw left line
    ctx.strokeStyle = "#abaec1";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1-2, y1);
    ctx.lineTo(x2-2, y2);
    ctx.stroke();
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

    ctx.drawImage(image, x, y + 20, 200, 200);

    clashFont(ctx, '247', x + 100, y + 120, '90', true)

    clashFont(ctx, 'JamesJamesJames', x + 250, y, '100', false)
    tagFont(ctx, '#VP0QG80Y', x + 250, y + 125, '75', false)

    clashFont(ctx, mapClanRoles('coLeader'), x + 250, y + 225, '75', false)
    await labels(ctx, x + 250, y + 350)
    
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