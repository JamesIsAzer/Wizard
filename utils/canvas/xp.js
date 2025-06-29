const { createCanvas, registerFont } = require('canvas');
const { getImagePath, getFontPath, clashFont, tagFont, mapClanRoles, getTrophyLeagueImagePath, getLeagueName, drawRoundedRectPath, drawRightRoundedRectPath, getTownhallPath, clashFontScaled, formatDateYearMonth, signature, getAchievementStarsImagePath, formatNumberWithSpaces, getLastYearMonth, getCachedImage, createOptimizedGradient, preloadImages, setupCanvasContext, createCanvasWithCleanup } = require('./shared');
const { streamToBuffer } = require('../streamHelpers');

registerFont(getFontPath('Clash_Regular'), { family: 'ClashFont' });

const getXpImage = async (expLevel, key) => {
    const width = 214;
    const height = 214;
    const canvas = createCanvasWithCleanup(createCanvas, width, height);
    try {
        const ctx = setupCanvasContext(canvas.getContext('2d'))

        const imagePath = getImagePath('xp_thumbnail');

        const image = await getCachedImage(imagePath);
        
        ctx.drawImage(image, 0, 0, width, height);
        
        clashFont(ctx, expLevel, 107, 107, '70', true)

        const buffer = await streamToBuffer(canvas.createPNGStream());
        const fileName = `${key}.png`
        return { buffer, fileName };
    } finally { canvas.cleanup() }
};

module.exports = { getXpImage };