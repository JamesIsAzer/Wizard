const { loadImage } = require('canvas');
const path = require('path');

const imageCache = new Map();
const CACHE_SIZE_LIMIT = 100;
let cacheAccessOrder = new Map();
const CACHE_IDLE_TIME_MS = 60000;

const gradientCache = new Map();
const GRADIENT_CACHE_LIMIT = 50;

let lastCacheClearTime = Date.now();
let rendersSinceLastCheck = 0;

function autoThrottleCacheClear() {
    rendersSinceLastCheck++;

    const now = Date.now();
    const timeSinceLastClear = now - lastCacheClearTime;

    if (
        imageCache.size > CACHE_SIZE_LIMIT &&
        rendersSinceLastCheck >= 5 &&
        timeSinceLastClear > CACHE_IDLE_TIME_MS
    ) {
        clearCaches();
        lastCacheClearTime = Date.now();
        rendersSinceLastCheck = 0;
    }
}

const getCachedImage = async (imagePath) => {
    if (imageCache.has(imagePath)) {
        const image = imageCache.get(imagePath);
        imageCache.delete(imagePath);
        imageCache.set(imagePath, image); // move to end (most recently used)
        return image;
    }
    
    // LRU eviction when cache is full
    if (imageCache.size >= CACHE_SIZE_LIMIT) {
        const oldestKey = imageCache.keys().next().value;
        imageCache.delete(oldestKey);
    }
    
    try {
        const image = await loadImage(imagePath);
        imageCache.set(imagePath, image);
        cacheAccessOrder.set(imagePath, Date.now());
        return image;
    } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
        throw error; // Re-throw to let caller handle
    }
};

const createOptimizedGradient = (ctx, key, x, y, width, height, stops) => {
    // Create a unique cache key that includes all parameters that affect the gradient
    const cacheKey = `${key}_${x}_${y}_${width}_${height}_${JSON.stringify(stops)}`;
    
    // Check if gradient exists in cache
    if (gradientCache.has(cacheKey)) {
        return gradientCache.get(cacheKey);
    }
    
    // Create new gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    stops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
    
    // Cache management - remove oldest if cache is full
    if (gradientCache.size >= GRADIENT_CACHE_LIMIT) {
        const firstKey = gradientCache.keys().next().value;
        gradientCache.delete(firstKey);
    }
    
    // Store in cache
    gradientCache.set(cacheKey, gradient);
    
    return gradient;
};

const ALL_TROOP_IMAGES = [
  // Heroes
  'Icon_HV_Hero_Barbarian_King',
  'Icon_HV_Hero_Archer_Queen',
  'Icon_HV_Hero_Minion_Prince',
  'Icon_HV_Hero_Grand_Warden',
  'Icon_HV_Hero_Royal_Champion',
  
  // Pets
  'Icon_HV_Hero_Pets_LASSI',
  'Icon_HV_Hero_Pets_Electro_Owl',
  'Icon_HV_Hero_Pets_Mighty_Yak',
  'Icon_HV_Hero_Pets_Unicorn',
  'Icon_HV_Hero_Pets_Frosty',
  'Icon_HV_Hero_Pets_Diggy',
  'Icon_HV_Hero_Pets_Poison_Lizard',
  'Icon_HV_Hero_Pets_Phoenix',
  'Icon_HV_Hero_Pets_Spirit_Fox',
  'Icon_HV_Hero_Pets_Angry_Jelly',
  'Icon_HV_Hero_Pets_Sneezy',
  
  // Troops
  'Icon_HV_Barbarian',
  'Icon_HV_Archer',
  'Icon_HV_Giant',
  'Icon_HV_Goblin',
  'Icon_HV_Wall_Breaker',
  'Icon_HV_Balloon',
  'Icon_HV_Wizard',
  'Icon_HV_Healer',
  'Icon_HV_Dragon',
  'Icon_HV_P.E.K.K.A',
  'Icon_HV_Baby_Dragon',
  'Icon_HV_Miner',
  'Icon_HV_Electro_Dragon',
  'Icon_HV_Yeti',
  'Icon_HV_Dragon_Rider',
  'Icon_HV_Electro_Titan',
  'Icon_HV_Root_Rider',
  'Icon_HV_Thrower',
  'Icon_HV_Minion',
  'Icon_HV_Hog_Rider',
  'Icon_HV_Valkyrie',
  'Icon_HV_Golem',
  'Icon_HV_Witch',
  'Icon_HV_Lava_Hound',
  'Icon_HV_Bowler',
  'Icon_HV_Ice_Golem',
  'Icon_HV_Headhunter',
  'Icon_HV_Apprentice_Warden',
  'Icon_HV_Druid',
  'Icon_HV_Furnace',
  
  // Spells
  'Icon_HV_Spell_Lightning',
  'Icon_HV_Spell_Heal',
  'Icon_HV_Spell_Rage',
  'Icon_HV_Spell_Jump',
  'Icon_HV_Spell_Freeze',
  'Icon_HV_Spell_Clone',
  'Icon_HV_Spell_Invisibility',
  'Icon_HV_Spell_Recall',
  'Icon_HV_Spell_Revive',
  'Icon_HV_Dark_Spell_Poison',
  'Icon_HV_Dark_Spell_Earthquake',
  'Icon_HV_Dark_Spell_Haste',
  'Icon_HV_Dark_Spell_Skeleton',
  'Icon_HV_Dark_Spell_Bat',
  'Icon_HV_Dark_Spell_Overgrowth',
  
  // Siege Machines
  'Icon_HV_Siege_Machine_Wall_Wrecker',
  'Icon_HV_Siege_Machine_Battle_Blimp',
  'Icon_HV_Siege_Machine_Stone_Slammer',
  'Icon_HV_Siege_Machine_Siege_Barracks',
  'Icon_HV_Siege_Machine_Log_Launcher',
  'Icon_HV_Siege_Machine_Flame_Flinger',
  'Icon_HV_Siege_Machine_Battle_Drill',
  'Icon_HV_Siege_Machine_Troop_Launcher'
];

let imagesPreloaded = false;

const preloadAllImages = async () => {
  if (imagesPreloaded) return;
  
  try {
    const imagePaths = ALL_TROOP_IMAGES.map(name => getImagePath(name));
    await preloadImages(imagePaths);
    imagesPreloaded = true;
    console.log('✅ All troop images preloaded successfully');
  } catch (error) {
    console.error('⚠️ Failed to preload some images:', error);
  }
};

const preloadImages = async (imagePaths) => {
    const uniquePaths = [...new Set(imagePaths)];
    const loadPromises = uniquePaths.map(path => getCachedImage(path));
    return Promise.all(loadPromises);
};

const clearCaches = () => {
    // More aggressive cleanup based on usage patterns
    if (imageCache.size > 80) {
        const sortedByAccess = [...cacheAccessOrder.entries()]
            .sort((a, b) => a[1] - b[1]);
        
        // Remove oldest 30% of entries
        const toRemove = Math.floor(sortedByAccess.length * 0.3);
        for (let i = 0; i < toRemove; i++) {
            const key = sortedByAccess[i][0];
            imageCache.delete(key);
            cacheAccessOrder.delete(key);
        }
    }
    
    if (gradientCache.size > 50) {
        gradientCache.clear();
    }
    
    // Force garbage collection hint
    if (global.gc) {
        global.gc();
    }
};

const setupCanvasContext = (ctx) => {
    // Enable hardware acceleration hints
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Set default text properties once
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '40px ClashFont';
    
    return ctx;
};

const sectionTitleFont = (ctx, message, x, y, fontSize = '80', outline = 2) => {
    ctx.font = `${fontSize}px ClashFont`;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    // Add shadow
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Stroke (black border)
    ctx.lineWidth = outline;
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

const signature = async (ctx, x, y, outline) => {
  const imagePath = path.join(__dirname, '..', 'assets', 'images', 'CreatorLogo.png');

  const image = await loadImage(imagePath);

  ctx.drawImage(image, x + 50, y + 75, 150, 150);

  sectionTitleFont(ctx, 'Azer', x + 250, y + 200, '150', outline)
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

const getLastYearMonth = () => {
    const now = new Date();
    
    now.setMonth(now.getMonth() - 1);
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based

    return `${year}-${month}`;
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
    formatNumberWithSpaces,
    getLastYearMonth,
    getCachedImage,
    createOptimizedGradient,
    preloadImages,
    setupCanvasContext,
    autoThrottleCacheClear,
    preloadAllImages
};