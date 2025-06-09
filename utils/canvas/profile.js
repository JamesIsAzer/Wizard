const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');

registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'Clash_Regular.otf'), {
  family: 'ClashFont'
});

const getProfileImage = async (profile, key) => {
    const canvas = createCanvas(2950, 2050);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2950, 2050);
    const buffer = canvas.toBuffer('image/png');
    const fileName = `player-profile-${key}.png`
    return { buffer, fileName };
};

module.exports = { getProfileImage };