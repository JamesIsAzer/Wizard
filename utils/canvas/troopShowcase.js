const { createCanvas, loadImage, registerFont } = require('canvas');
const { 
  sectionTitleFont, 
  drawRoundedRectPath, 
  signature, 
  getFontPath, 
  getImagePath,
  getCachedImage, 
  createOptimizedGradient, 
  preloadImages, 
  setupCanvasContext,
  autoThrottleCacheClear
 } = require('./shared')

registerFont(getFontPath('Clash_Regular'), { family: 'ClashFont' });

const getTroopShowcaseImage = async (profile, key) => {
  const width = 2950;
  const height = 2050;
  const canvas = createCanvas(width, height);
   const ctx = setupCanvasContext(canvas.getContext('2d'));

  const gradient = createOptimizedGradient(
    ctx,
    'troops-showcase-bg',
    0,
    0,
    width,
    height,
    [
      { offset: 0, color: '#8c96af' },
      { offset: 1, color: '#6b7899' }
    ]
  );

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height);

  try {
    await heroSection(ctx, 50, 50, profile.heroes),
    await petSection(ctx, 50, 675, profile.troops),
    await troopSection(ctx, 850, 50, profile.troops),
    await spellSection(ctx, 2150, 50, profile.spells),
    await siegeMachineSection(ctx, 850, 1675, profile.troops),
    await signature(ctx, 50, 1750)
  } catch (err) {
    console.error('🛑 Failed to load image:', err);
    return null;
  }

  autoThrottleCacheClear();

  const buffer = canvas.toBuffer('image/png');
  const fileName = `player-profile-${key}.png`

  return { buffer, fileName }
};

const isMaxed = (list, name) => {
  const record = list.find(i => i.name == name)
  if (!record) return false
  return record.level == record.maxLevel
}

const isUnlocked = (list, name) => {
  const record = list.find(i => i.name == name)
  return !!record
}

const getLevel = (list, name) => {
  const record = list.find(i => i.name == name)
  if(!record) return 0
  return record.level
}

const getTroopData = (list, name) => {
  return {
    maxed: isMaxed(list, name),
    unlocked: isUnlocked(list, name),
    level: getLevel(list, name)
  }
}

const heroSection = async(ctx, x, y, heroes) => {
  const width = 750;  
  const height = 575;
  const radius = 25;

  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Heroes', x + 25, y + 80)

  const barbarianKing = getTroopData(heroes, "Barbarian King")
  const archerQueen = getTroopData(heroes, "Archer Queen")
  const minionPrince = getTroopData(heroes, "Minion Prince")
  const grandWarden = getTroopData(heroes, "Grand Warden")
  const royalChampion = getTroopData(heroes, "Royal Champion")

  await drawTroopIcon(barbarianKing.level, barbarianKing.unlocked, barbarianKing.maxed, ctx, 'Icon_HV_Hero_Barbarian_King', x + 25, y + 100),
  await drawTroopIcon(archerQueen.level, archerQueen.unlocked, archerQueen.maxed, ctx, 'Icon_HV_Hero_Archer_Queen', x + 275, y + 100),
  await drawTroopIcon(minionPrince.level, minionPrince.unlocked, minionPrince.maxed, ctx, 'Icon_HV_Hero_Minion_Prince', x + 525, y + 100),

  await drawTroopIcon(grandWarden.level, grandWarden.unlocked, grandWarden.maxed, ctx, 'Icon_HV_Hero_Grand_Warden', x + 25, y + 350),
  await drawTroopIcon(royalChampion.level, royalChampion.unlocked, royalChampion.maxed, ctx, 'Icon_HV_Hero_Royal_Champion', x + 275, y + 350)
}

const petSection = async(ctx, x, y, pets) => {
  const width = 750;  
  const height = 1075; 
  const radius = 25;

  ctx.fillStyle = '#636e8f';
  drawRoundedRectPath(ctx, x, y, width, height, radius)
  ctx.fill()

  sectionTitleFont(ctx, 'Pets', x + 25, y + 80)

  const lassi = getTroopData(pets, "L.A.S.S.I")
  const mightyYak = getTroopData(pets, "Mighty Yak")
  const electroOwl = getTroopData(pets, "Electro Owl")
  const unicorn = getTroopData(pets, "Unicorn")
  const phoenix = getTroopData(pets, "Phoenix")
  const poisonLizard = getTroopData(pets, "Poison Lizard")
  const diggy = getTroopData(pets, "Diggy")
  const frosty = getTroopData(pets, "Frosty")
  const spiritFox = getTroopData(pets, "Spirit Fox")
  const angryJelly = getTroopData(pets, "Angry Jelly")
  const sneezy = getTroopData(pets, "Sneezy")
  
  await drawTroopIcon(lassi.level, lassi.unlocked, lassi.maxed, ctx, 'Icon_HV_Hero_Pets_LASSI', x + 25, y + 100),
  await drawTroopIcon(electroOwl.level, electroOwl.unlocked, electroOwl.maxed, ctx, 'Icon_HV_Hero_Pets_Electro_Owl', x + 275, y + 100),
  await drawTroopIcon(mightyYak.level, mightyYak.unlocked, mightyYak.maxed, ctx, 'Icon_HV_Hero_Pets_Mighty_Yak', x + 525, y + 100),
  await drawTroopIcon(unicorn.level, unicorn.unlocked, unicorn.maxed, ctx, 'Icon_HV_Hero_Pets_Unicorn', x + 25, y + 350),
  await drawTroopIcon(frosty.level, frosty.unlocked, frosty.maxed, ctx, 'Icon_HV_Hero_Pets_Frosty', x + 275, y + 350),
  await drawTroopIcon(diggy.level, diggy.unlocked, diggy.maxed, ctx, 'Icon_HV_Hero_Pets_Diggy', x + 525, y + 350),
  await drawTroopIcon(poisonLizard.level, poisonLizard.unlocked, poisonLizard.maxed, ctx, 'Icon_HV_Hero_Pets_Poison_Lizard', x + 25, y + 600),
  await drawTroopIcon(phoenix.level, phoenix.unlocked, phoenix.maxed, ctx, 'Icon_HV_Hero_Pets_Phoenix', x + 275, y + 600),
  await drawTroopIcon(spiritFox.level, spiritFox.unlocked, spiritFox.maxed, ctx, 'Icon_HV_Hero_Pets_Spirit_Fox', x + 525, y + 600),
  await drawTroopIcon(angryJelly.level, angryJelly.unlocked, angryJelly.maxed, ctx, 'Icon_HV_Hero_Pets_Angry_Jelly', x + 25, y + 850),
  await drawTroopIcon(sneezy.level, sneezy.unlocked, sneezy.maxed, ctx, 'Icon_HV_Hero_Pets_Sneezy', x + 275, y + 850)
}

const troopSection = async(ctx, x, y, troops) => {
  const width = 1250; 
  const height = 1575;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)
  ctx.fill()

  sectionTitleFont(ctx, 'Troops', x + 25, y + 80)

  const barbarian = getTroopData(troops, "Barbarian")
  const archer = getTroopData(troops, "Archer")
  const giant = getTroopData(troops, "Giant")
  const goblin = getTroopData(troops, "Goblin")
  const wallBreaker = getTroopData(troops, "Wall Breaker")
  const balloon = getTroopData(troops, "Balloon")
  const wizard = getTroopData(troops, "Wizard")
  const healer = getTroopData(troops, "Healer")
  const dragon = getTroopData(troops, "Dragon")
  const pekka = getTroopData(troops, "P.E.K.K.A")
  const babyDragon = getTroopData(troops, "Baby Dragon")
  const miner = getTroopData(troops, "Miner")
  const electroDragon = getTroopData(troops, "Electro Dragon")
  const yeti = getTroopData(troops, "Yeti")
  const dragonRider = getTroopData(troops, "Dragon Rider")
  const electroTitan = getTroopData(troops, "Electro Titan")
  const rootRider = getTroopData(troops, "Root Rider")
  const thrower = getTroopData(troops, "Thrower")
  const minion = getTroopData(troops, "Minion")
  const hogRider = getTroopData(troops, "Hog Rider")
  const valkyrie = getTroopData(troops, "Valkyrie")
  const golem = getTroopData(troops, "Golem")
  const witch = getTroopData(troops, "Witch")
  const lavaHound = getTroopData(troops, "Lava Hound")
  const bowler = getTroopData(troops, "Bowler")
  const iceGolem = getTroopData(troops, "Ice Golem")
  const headhunter = getTroopData(troops, "Headhunter")
  const apprenticeWarden = getTroopData(troops, "Apprentice Warden")
  const druid = getTroopData(troops, "Druid")
  const furnace = getTroopData(troops, "Furnace")

  await drawTroopIcon(barbarian.level, barbarian.unlocked, barbarian.maxed, ctx, 'Icon_HV_Barbarian', x + 25, y + 100),
  await drawTroopIcon(archer.level, archer.unlocked, archer.maxed, ctx, 'Icon_HV_Archer', x + 275, y + 100),
  await drawTroopIcon(giant.level, giant.unlocked, giant.maxed, ctx, 'Icon_HV_Giant', x + 525, y + 100),
  await drawTroopIcon(goblin.level, goblin.unlocked, goblin.maxed, ctx, 'Icon_HV_Goblin', x + 775, y + 100),
  await drawTroopIcon(wallBreaker.level, wallBreaker.unlocked, wallBreaker.maxed, ctx, 'Icon_HV_Wall_Breaker', x + 1025, y + 100),
    
  await drawTroopIcon(balloon.level, balloon.unlocked, balloon.maxed, ctx, 'Icon_HV_Balloon', x + 25, y + 350),
  await drawTroopIcon(wizard.level, wizard.unlocked, wizard.maxed, ctx, 'Icon_HV_Wizard', x + 275, y + 350),
  await drawTroopIcon(healer.level, healer.unlocked, healer.maxed, ctx, 'Icon_HV_Healer', x + 525, y + 350),
  await drawTroopIcon(dragon.level, dragon.unlocked, dragon.maxed, ctx, 'Icon_HV_Dragon', x + 775, y + 350),
  await drawTroopIcon(pekka.level, pekka.unlocked, pekka.maxed, ctx, 'Icon_HV_P.E.K.K.A', x + 1025, y + 350),
    
  await drawTroopIcon(babyDragon.level, babyDragon.unlocked, babyDragon.maxed, ctx, 'Icon_HV_Baby_Dragon', x + 25, y + 600),
  await drawTroopIcon(miner.level, miner.unlocked, miner.maxed, ctx, 'Icon_HV_Miner', x + 275, y + 600),
  await drawTroopIcon(electroDragon.level, electroDragon.unlocked, electroDragon.maxed, ctx, 'Icon_HV_Electro_Dragon', x + 525, y + 600),
  await drawTroopIcon(yeti.level, yeti.unlocked, yeti.maxed, ctx, 'Icon_HV_Yeti', x + 775, y + 600),
  await drawTroopIcon(dragonRider.level, dragonRider.unlocked, dragonRider.maxed, ctx, 'Icon_HV_Dragon_Rider', x + 1025, y + 600),

  await drawTroopIcon(electroTitan.level, electroTitan.unlocked, electroTitan.maxed, ctx, 'Icon_HV_Electro_Titan', x + 25, y + 850),
  await drawTroopIcon(rootRider.level, rootRider.unlocked, rootRider.maxed, ctx, 'Icon_HV_Root_Rider', x + 275, y + 850),
  await drawTroopIcon(thrower.level, thrower.unlocked, thrower.maxed, ctx, 'Icon_HV_Thrower', x + 525, y + 850),
  await drawTroopIcon(minion.level, minion.unlocked, minion.maxed, ctx, 'Icon_HV_Minion', x + 775, y + 850),
  await drawTroopIcon(hogRider.level, hogRider.unlocked, hogRider.maxed, ctx, 'Icon_HV_Hog_Rider', x + 1025, y + 850),

  await drawTroopIcon(valkyrie.level, valkyrie.unlocked, valkyrie.maxed, ctx, 'Icon_HV_Valkyrie', x + 25, y + 1100),
  await drawTroopIcon(golem.level, golem.unlocked, golem.maxed, ctx, 'Icon_HV_Golem', x + 275, y + 1100),
  await drawTroopIcon(witch.level, witch.unlocked, witch.maxed, ctx, 'Icon_HV_Witch', x + 525, y + 1100),
  await drawTroopIcon(lavaHound.level, lavaHound.unlocked, lavaHound.maxed, ctx, 'Icon_HV_Lava_Hound', x + 775, y + 1100),
  await drawTroopIcon(bowler.level, bowler.unlocked, bowler.maxed, ctx, 'Icon_HV_Bowler', x + 1025, y + 1100),

  await drawTroopIcon(iceGolem.level, iceGolem.unlocked, iceGolem.maxed, ctx, 'Icon_HV_Ice_Golem', x + 25, y + 1350),
  await drawTroopIcon(headhunter.level, headhunter.unlocked, headhunter.maxed, ctx, 'Icon_HV_Headhunter', x + 275, y + 1350),
  await drawTroopIcon(apprenticeWarden.level, apprenticeWarden.unlocked, apprenticeWarden.maxed, ctx, 'Icon_HV_Apprentice_Warden', x + 525, y + 1350),
  await drawTroopIcon(druid.level, druid.unlocked, druid.maxed, ctx, 'Icon_HV_Druid', x + 775, y + 1350),
  await drawTroopIcon(furnace.level, furnace.unlocked, furnace.maxed, ctx, 'Icon_HV_Furnace', x + 1025, y + 1350)
}

const spellSection = async (ctx, x, y, spells) => {
  const width = 750; 
  const height = 1325;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)
  ctx.fill()

  sectionTitleFont(ctx, 'Spells', x + 25, y + 80)

  const lightning = getTroopData(spells, "Lightning Spell")
  const heal = getTroopData(spells, "Healing Spell")
  const rage = getTroopData(spells, "Rage Spell")
  const jump = getTroopData(spells, "Jump Spell")
  const freeze = getTroopData(spells, "Freeze Spell")
  const clone = getTroopData(spells, "Clone Spell")
  const invisibility = getTroopData(spells, "Invisibility Spell")
  const recall = getTroopData(spells, "Recall Spell")
  const revive = getTroopData(spells, "Revive Spell")
  const poison = getTroopData(spells, "Poison Spell")
  const earthquake = getTroopData(spells, "Earthquake Spell")
  const haste = getTroopData(spells, "Haste Spell")
  const skeleton = getTroopData(spells, "Skeleton Spell")
  const bat = getTroopData(spells, "Bat Spell")
  const overgrowth = getTroopData(spells, "Overgrowth Spell")

  await drawTroopIcon(lightning.level, lightning.unlocked, lightning.maxed, ctx, 'Icon_HV_Spell_Lightning', x + 25, y + 100),
  await drawTroopIcon(heal.level, heal.unlocked, heal.maxed, ctx, 'Icon_HV_Spell_Heal', x + 275, y + 100),
  await drawTroopIcon(rage.level, rage.unlocked, rage.maxed, ctx, 'Icon_HV_Spell_Rage', x + 525, y + 100),
  await drawTroopIcon(jump.level, jump.unlocked, jump.maxed, ctx, 'Icon_HV_Spell_Jump', x + 25, y + 350),
  await drawTroopIcon(freeze.level, freeze.unlocked, freeze.maxed, ctx, 'Icon_HV_Spell_Freeze', x + 275, y + 350),
  await drawTroopIcon(clone.level, clone.unlocked, clone.maxed, ctx, 'Icon_HV_Spell_Clone', x + 525, y + 350),
  await drawTroopIcon(invisibility.level, invisibility.unlocked, invisibility.maxed, ctx, 'Icon_HV_Spell_Invisibility', x + 25, y + 600),
  await drawTroopIcon(recall.level, recall.unlocked, recall.maxed, ctx, 'Icon_HV_Spell_Recall', x + 275, y + 600),
  await drawTroopIcon(revive.level, revive.unlocked, revive.maxed, ctx, 'Icon_HV_Spell_Revive', x + 525, y + 600),
  await drawTroopIcon(poison.level, poison.unlocked, poison.maxed, ctx, 'Icon_HV_Dark_Spell_Poison', x + 25, y + 850),
  await drawTroopIcon(earthquake.level, earthquake.unlocked, earthquake.maxed, ctx, 'Icon_HV_Dark_Spell_Earthquake', x + 275, y + 850),
  await drawTroopIcon(haste.level, haste.unlocked, haste.maxed, ctx, 'Icon_HV_Dark_Spell_Haste', x + 525, y + 850),
  await drawTroopIcon(skeleton.level, skeleton.unlocked, skeleton.maxed, ctx, 'Icon_HV_Dark_Spell_Skeleton', x + 25, y + 1100),
  await drawTroopIcon(bat.level, bat.unlocked, bat.maxed, ctx, 'Icon_HV_Dark_Spell_Bat', x + 275, y + 1100),
  await drawTroopIcon(overgrowth.level, overgrowth.unlocked, overgrowth.maxed, ctx, 'Icon_HV_Dark_Spell_Overgrowth', x + 525, y + 1100)
}

const siegeMachineSection = async (ctx, x, y, siegeMachines) => {
  const width = 2050; 
  const height = 350;
  const radius = 30;
  ctx.fillStyle = '#636e8f';

  drawRoundedRectPath(ctx,x, y, width, height, radius)

  ctx.fill()

  sectionTitleFont(ctx, 'Siege Machines', x + 25, y + 80)

  const wallWrecker = getTroopData(siegeMachines, "Wall Wrecker")
  const battleBlimp = getTroopData(siegeMachines, "Battle Blimp")
  const stoneSlammer = getTroopData(siegeMachines, "Stone Slammer")
  const siegeBarracks = getTroopData(siegeMachines, "Siege Barracks")
  const logLauncher = getTroopData(siegeMachines, "Log Launcher")
  const flameFlinger = getTroopData(siegeMachines, "Flame Flinger")
  const battleDrill = getTroopData(siegeMachines, "Battle Drill")
  const troopLauncher = getTroopData(siegeMachines, "Troop Launcher")

  await drawTroopIcon(wallWrecker.level, wallWrecker.unlocked, wallWrecker.maxed, ctx, 'Icon_HV_Siege_Machine_Wall_Wrecker', x + 25, y + 100),
  await drawTroopIcon(battleBlimp.level, battleBlimp.unlocked, battleBlimp.maxed, ctx, 'Icon_HV_Siege_Machine_Battle_Blimp', x + 275, y + 100),
  await drawTroopIcon(stoneSlammer.level, stoneSlammer.unlocked, stoneSlammer.maxed, ctx, 'Icon_HV_Siege_Machine_Stone_Slammer', x + 525, y + 100),
  await drawTroopIcon(siegeBarracks.level, siegeBarracks.unlocked, siegeBarracks.maxed, ctx, 'Icon_HV_Siege_Machine_Siege_Barracks', x + 775, y + 100),
  await drawTroopIcon(logLauncher.level, logLauncher.unlocked, logLauncher.maxed, ctx, 'Icon_HV_Siege_Machine_Log_Launcher', x + 1025, y + 100),
  await drawTroopIcon(flameFlinger.level, flameFlinger.unlocked, flameFlinger.maxed, ctx, 'Icon_HV_Siege_Machine_Flame_Flinger', x + 1275, y + 100),
  await drawTroopIcon(battleDrill.level, battleDrill.unlocked, battleDrill.maxed, ctx, 'Icon_HV_Siege_Machine_Battle_Drill', x + 1525, y + 100),
  await drawTroopIcon(troopLauncher.level, troopLauncher.unlocked, troopLauncher.maxed, ctx, 'Icon_HV_Siege_Machine_Troop_Launcher', x + 1775, y + 100)
}

const drawTroopIcon = async (troopLevel, unlocked, max, ctx, imageName, x, y) => {
  const imagePath = getImagePath(imageName);
  
  try {
    const image = await getCachedImage(imagePath); // Use cached loading
    drawTroopIconDisplay(troopLevel, unlocked, max, ctx, image, x, y);
  } catch (error) {
    console.error(`Failed to load cached image ${imageName}:`, error);
    // Fallback to original loading if cache fails
    try {
      const image = await loadImage(imagePath);
      drawTroopIconDisplay(troopLevel, unlocked, max, ctx, image, x, y);
    } catch (fallbackError) {
      console.error(`Fallback image loading also failed for ${imageName}:`, fallbackError);
    }
  }
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
  const bevelStops = [
    { offset: 0, color: 'rgba(0, 0, 0, 0.25)' },
    { offset: 0.5, color: 'rgba(0, 0, 0, 0)' }
  ];

  const bevelGradient = createOptimizedGradient(
    ctx, 
    'bevel', 
    x, 
    y, 
    width, 
    height, 
    bevelStops
  );

  ctx.save();
  drawRoundedRectPath(ctx, x + bevelInset, y + bevelInset, width - bevelInset * 2, height - bevelInset * 2, radius - 1);
  ctx.clip();
  ctx.fillStyle = bevelGradient;
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

module.exports = { getTroopShowcaseImage };