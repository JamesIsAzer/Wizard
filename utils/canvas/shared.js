const { loadImage } = require('canvas');
const path = require('path');

const sectionTitleFont = (ctx, message, x, y, fontSize = '80') => {
    ctx.font = `${fontSize}px ClashFont`;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    // Add shadow
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Stroke (black border)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(message, x, y);

    // Fill (white text)
    ctx.fillStyle = '#ffffff';
    ctx.fillText(message, x, y);

    // Reset shadow (optional cleanup)
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
};

const clashFontScaled = (ctx, message, x, y, maxWidth, maxHeight, centered = false) => {
    let fontSize = maxHeight; 
    ctx.font = `${fontSize}px ClashFont`;

    while (true) {
        const metrics = ctx.measureText(message);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        if (textWidth <= maxWidth && textHeight <= maxHeight) {
            break;
        }

        fontSize -= 1;
        if (fontSize <= 5) break;

        ctx.font = `${fontSize}px ClashFont`; // Update the font after shrinking
    }

    // Now draw with the final font size
    clashFont(ctx, message, x, y, fontSize, centered);
}

const formatNumberWithSpaces = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const clashFont = (ctx, message, x, y, fontSize = '80', centered = false, colour = '#FFFFFF') => {
    ctx.font = `${fontSize}px ClashFont, Arial, sans-serif`;

    if (centered) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    } else {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
    }

    const shadowOffsetX = 0;
    const shadowOffsetY = 6;        
    ctx.fillStyle = '#000000';
    ctx.fillText(message, x + shadowOffsetX, y + shadowOffsetY);

    // Thicker Border
    ctx.lineWidth = 6;            
    ctx.strokeStyle = '#000000';
    ctx.strokeText(message, x, y);

    // Fill (white or yellowish)
    ctx.fillStyle = colour;    
    ctx.fillText(message, x, y);
}

const tagFont = (ctx, message, x, y, fontSize = '50', centered = false) => {
    ctx.font = `${fontSize}px ClashFont`;

    if (centered) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    } else {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
    }

    const shadowOffsetX = 0;
    const shadowOffsetY = 4;        
    ctx.fillStyle = '#000000';
    ctx.fillText(message, x + shadowOffsetX, y + shadowOffsetY);

    // Thicker Border
    ctx.lineWidth = 4;            
    ctx.strokeStyle = '#000000';
    ctx.strokeText(message, x, y);

    // Fill (white or yellowish)
    ctx.fillStyle = '#CCCCCC';    
    ctx.fillText(message, x, y);
}

const drawRoundedRectPath = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

const drawRightRoundedRectPath = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y); // close left edge without rounding
    ctx.closePath();
}

const signature = async (ctx, x, y) => {
  const imagePath = path.join(__dirname, '..', 'assets', 'images', 'creatorLogo.png');

  const image = await loadImage(imagePath);

  ctx.drawImage(image, x + 50, y + 75, 150, 150);

  sectionTitleFont(ctx, 'Azer', x + 250, y + 200, '150')
}

const getImagePath = (imageName) => {
    return path.join(__dirname, '..', 'assets', 'images', `${imageName}.png`);
}

const getAchievementStarsImagePath = (achievementStars) => {
    return getImagePath(`${achievementStars}star`)
}

const getTrophyLeagueImagePath = (trophies) => {
    if (trophies >= 5000) return getImagePath('Icon_HV_League_Legend')
    if (trophies >= 4100) return getImagePath('Icon_HV_League_Titan')
    if (trophies >= 3200) return getImagePath('Icon_HV_League_Champion')
    if (trophies >= 2600) return getImagePath('Icon_HV_League_Master')
    if (trophies >= 2000) return getImagePath('Icon_HV_League_Crystal')
    if (trophies >= 1400) return getImagePath('Icon_HV_League_Gold')
    if (trophies >= 800) return getImagePath('Icon_HV_League_Silver')
    if (trophies >= 400) return getImagePath('Icon_HV_League_Bronze')
    return getImagePath('Icon_HV_League_None')
}

const getTownhallPath = (townhallLevel) => {
    const townhallCapped = Math.min(17, townhallLevel)
    return getImagePath(`Building_HV_Town_Hall_level_${townhallCapped}`)
}

const getFontPath = (fontName) => {
    return path.join(__dirname, '..', 'assets', 'fonts', `${fontName}.otf`);
}

const mapClanRoles = (clanRole) => {
    if (clanRole == "member") return "Member"
    if (clanRole == "admin") return "Elder"
    if (clanRole == "coLeader") return "Co-leader"
    if (clanRole == "leader") return "Leader"
    return clanRole
}

const getLeagueName = (league) => {
    if (league == null) return "Unranked"
    return league.name
}

const formatDateYearMonth = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1); // JS months are 0-based
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${year}`;
}

module.exports = { 
    sectionTitleFont, 
    drawRoundedRectPath, 
    drawRightRoundedRectPath,
    signature,
    getImagePath,
    getFontPath,
    getTownhallPath,
    getAchievementStarsImagePath,
    clashFont,
    tagFont,
    mapClanRoles,
    getTrophyLeagueImagePath,
    getLeagueName,
    formatDateYearMonth,
    clashFontScaled,
    formatNumberWithSpaces
};