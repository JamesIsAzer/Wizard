const { createCanvas, loadImage, registerFont } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');

registerFont(path.join(__dirname, '..', 'assets', 'fonts', 'Clash_Regular.otf'), {
  family: 'ClashFont'
});

const getProfileImage = async (profile, verified) => {
  const width = 2950;
  const height = 2050;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';

  const gradient = ctx.createLinearGradient(0, 0, 0, 0 + height);

  gradient.addColorStop(0, '#8c96af'); 
  gradient.addColorStop(1, '#6b7899');
  ctx.fillStyle = gradient

  ctx.fillRect(0, 0, width, height);

  try {
    await heroSection(ctx, 50, 50)
    await petSection(ctx, 50, 675)
    await troopSection(ctx, 850, 50)
    await spellSection(ctx, 2150, 50)
    await siegeMachineSection(ctx, 850, 1675)
  } catch (err) {
    console.error('🛑 Failed to load image:', err);
    return null;
  }

  const buffer = canvas.toBuffer('image/png');
  return new AttachmentBuilder(buffer, { name: 'canvas-test-image.png' });
};

const heroSection = async(ctx, x, y) => {
  const width = 750;  // Enough for 3 columns
  const height = 575; // Enough for 2 rows
  const radius = 25;

  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Heroes', x + 25, y + 80)

  
  const tasks = [
    drawTroopIcon(100, true, true, ctx, 'Icon_HV_Hero_Barbarian_King.png', x + 25, y + 100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Hero_Archer_Queen.png', x + 275, y + 100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Hero_Grand_Warden.png', x + 525, y + 100),

    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Hero_Royal_Champion.png', x + 25, y + 350),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Hero_Minion_Prince.png', x + 275, y + 350)
  ]
  
  await Promise.all(tasks)
}

const petSection = async(ctx, x, y) => {
  const width = 750;  
  const height = 1075; 
  const radius = 25;

  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Pets', x + 25, y + 80)

  
  const tasks = [
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Hero_Pets_LASSI.png', x + 25, y + 100),
    drawTroopIcon(5, true, false, ctx, 'Icon_HV_Hero_Pets_Electro_Owl.png', x + 275, y + 100),
    drawTroopIcon(3, true, false, ctx, 'Icon_HV_Hero_Pets_Mighty_Yak.png', x + 525, y + 100),

    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Unicorn.png', x + 25, y + 350),
    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Frosty.png', x + 275, y + 350),
    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Diggy.png', x + 525, y + 350),

    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Poison_Lizard.png', x + 25, y + 600),
    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Phoenix.png', x + 275, y + 600),
    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Spirit_Fox.png', x + 525, y + 600),

    drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Angry_Jelly.png', x + 25, y + 850),
    //drawTroopIcon(6, true, false, ctx, 'Icon_HV_Hero_Pets_Sneezy.png', x + 25, y + 850)
  ]
  
  await Promise.all(tasks)
}

const troopSection = async(ctx, x, y) => {
  const width = 1250; 
  const height = 1575;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Troops', x + 25, y + 80)

  const tasks = [
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Barbarian.png', x + 25, y + 100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Archer.png', x + 275, y + 100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Giant.png', x + 525, y + 100),
    drawTroopIcon(7, false, false, ctx, 'Icon_HV_Goblin.png', x + 775, y + 100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Wall_Breaker.png', x + 1025, y + 100),
    
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Balloon.png', x + 25, y + 350),
    drawTroopIcon(7, false, false, ctx, 'Icon_HV_Wizard.png', x + 275, y + 350),
    drawTroopIcon(7, true, false,ctx, 'Icon_HV_Healer.png', x + 525, y + 350),
    drawTroopIcon(7, true, false,ctx, 'Icon_HV_Dragon.png', x + 775, y + 350),
    drawTroopIcon(7, false, false, ctx, 'Icon_HV_P.E.K.K.A.png', x + 1025, y + 350),
    
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Baby_Dragon.png', x + 25, y + 600),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Miner.png', x + 275, y + 600),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Electro_Dragon.png', x + 525, y + 600),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Yeti.png', x + 775, y + 600),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Dragon_Rider.png', x + 1025, y + 600),

    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Electro_Titan.png', x + 25, y + 850),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Root_Rider.png', x + 275, y + 850),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Thrower.png', x + 525, y + 850),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Minion.png', x + 775, y + 850),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Hog_Rider.png', x + 1025, y + 850),

    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Valkyrie.png', x + 25, y + 1100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Golem.png', x + 275, y + 1100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Witch.png', x + 525, y + 1100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Lava_Hound.png', x + 775, y + 1100),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Bowler.png', x + 1025, y + 1100),

    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Ice_Golem.png', x + 25, y + 1350),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Headhunter.png', x + 275, y + 1350),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Apprentice_Warden.png', x + 525, y + 1350),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Druid.png', x + 775, y + 1350),
    drawTroopIcon(7, true, false, ctx, 'Icon_HV_Furnace.png', x + 1025, y + 1350),
  ]

  await Promise.all(tasks)
}

const spellSection = async (ctx, x, y) => {
  const width = 750; 
  const height = 1325;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Spells', x + 25, y + 80)

  const tasks = [
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Lightning.png', x + 25, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Heal.png', x + 275, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Rage.png', x + 525, y + 100),

    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Jump.png', x + 25, y + 350),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Freeze.png', x + 275, y + 350),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Clone.png', x + 525, y + 350),

    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Invisibility.png', x + 25, y + 600),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Recall.png', x + 275, y + 600),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Spell_Revive.png', x + 525, y + 600),

    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Poison.png', x + 25, y + 850),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Earthquake.png', x + 275, y + 850),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Haste.png', x + 525, y + 850),

    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Skeleton.png', x + 25, y + 1100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Bat.png', x + 275, y + 1100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Dark_Spell_Overgrowth.png', x + 525, y + 1100)
  ]
  
  await Promise.all(tasks)

}

const siegeMachineSection = async (ctx, x, y) => {
  const width = 2050; 
  const height = 350;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Siege Machines', x + 25, y + 80)

  const tasks = [
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Wall_Wrecker.png', x + 25, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Battle_Blimp.png', x + 275, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Stone_Slammer.png', x + 525, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Siege_Barracks.png', x + 775, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Log_Launcher.png', x + 1025, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Flame_Flinger.png', x + 1275, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Battle_Drill.png', x + 1525, y + 100),
    drawTroopIcon(5, true, true, ctx, 'Icon_HV_Siege_Machine_Troop_Launcher.png', x + 1775, y + 100)
  ]
  
  await Promise.all(tasks)

}

const drawTroopIcon = async (troopLevel, unlocked, max, ctx, imageName, x, y) => {
    
  const imagePath = path.join(__dirname, '..', 'assets', 'images', imageName);

  const image = await loadImage(imagePath);

  drawTroopIconDisplay(troopLevel, unlocked, max, ctx, image, x, y, );
}

const drawTroopIconDisplay = (troopLevel, unlocked, max, ctx, image, x, y) => {
    const radius = 10
    const borderColor = '#000000'
    const borderWidth = 1
    const width = 200
    const height = 200

    // drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    drawRoundedRectPath(ctx, x, y, width, height, radius); 
    ctx.fillStyle = '#586282'; // Outer box fill
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Now draw inner lighter box with padding
    const paddingTop = 2;
    const paddingSides = 2;

    const innerX = x + paddingSides;
    const innerY = y + paddingTop;
    const innerWidth = width - paddingSides * 2;
    const innerHeight = height - paddingTop - paddingSides; // adjust bottom padding if needed
    const innerRadius = radius / 2; // smaller rounding for inner box

    drawRoundedRectPath(ctx, innerX, innerY, innerWidth, innerHeight, innerRadius)

    ctx.fillStyle = '#9898cd'; // lighter color for inner box
    ctx.fill();

    // Second: draw the image INSIDE clipped area
    ctx.save();
    ctx.clip(); // Clip to the same rounded rect
    
    if (unlocked) {
      // Normal colored image
      ctx.drawImage(image, x, y, width, height);
    } else {
      // Draw image first
      ctx.drawImage(image, x, y, width, height);

      // Apply grayscale by manipulating pixel data
      const imageData = ctx.getImageData(x, y, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.3 * r + 0.59 * g + 0.11 * b;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
          // alpha remains the same
      }

      ctx.putImageData(imageData, x, y);
    }

    const LevelBoxWidth = 60;
    const LevelBoxHeight = 60;
    const LevelBoxPadding = 6;

    if (unlocked) {
      drawLevelBox(
        ctx,
        troopLevel,
        x + LevelBoxPadding,
        y + height - LevelBoxHeight - LevelBoxPadding,
        LevelBoxWidth,
        LevelBoxHeight,
        8,
        max
      );
    }

    ctx.restore();
}

function drawLevelBox(ctx, number, x, y, width, height, radius, max) {
  // Draw base box
  drawRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = max ? '#E4A23F' : '#393939';
  ctx.fill();

  // Inner shadow bevel effect (simulate by dark overlay gradient)
  const bevelInset = 2;
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  ctx.save();
  drawRoundedRectPath(ctx, x + bevelInset, y + bevelInset, width - bevelInset * 2, height - bevelInset * 2, radius - 1);
  ctx.clip();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Outer border glow
  ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  drawRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.stroke();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Draw level number
  ctx.font = `${height * 0.6}px ClashFont`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(number, x + width / 2, y + height / 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(number, x + width / 2, y + height / 2);

  // Reset shadow after text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

const sectionTitleFont = (ctx, message, x, y) => {
  ctx.font = '80px ClashFont';
  //ctx.textAlign = 'center';
  //ctx.textBaseline = 'middle';

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

const signature = (ctx, x, y) => {

}

module.exports = { getProfileImage };