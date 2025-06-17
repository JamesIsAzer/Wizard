const { loadImage } = require('canvas');
const path = require('path');

// Image cache with proper LRU implementation
const imageCache = new Map();
const CACHE_SIZE_LIMIT = 100;
const cacheAccessOrder = new Map(); // Track access times for LRU

// Gradient cache with LRU
const gradientCache = new Map();
const gradientAccessOrder = new Map();
const GRADIENT_CACHE_LIMIT = 50;

// User render cache with cleanup
const renderCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
const USER_CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // Cleanup every 10 minutes
const MAX_USERS_IN_CACHE = 50;

// Cleanup old user caches periodically
setInterval(() => {
    cleanupUserCaches();
}, USER_CACHE_CLEANUP_INTERVAL);

function cleanupUserCaches() {
    const now = Date.now();
    const userIds = Array.from(renderCache.keys());
    
    // Remove expired entries
    for (const userId of userIds) {
        const userCache = renderCache.get(userId);
        const entries = Array.from(userCache.entries());
        
        // Remove expired entries from user cache
        for (const [key, cached] of entries) {
            if (cached.expiresAt <= now) {
                userCache.delete(key);
            }
        }
        
        // Remove empty user caches
        if (userCache.size === 0) {
            renderCache.delete(userId);
        }
    }
    
    // If still too many users, remove oldest
    if (renderCache.size > MAX_USERS_IN_CACHE) {
        const sortedUsers = userIds
            .map(userId => ({
                userId,
                lastAccess: Math.max(...Array.from(renderCache.get(userId).values()).map(v => v.expiresAt - CACHE_TTL_MS))
            }))
            .sort((a, b) => a.lastAccess - b.lastAccess);
        
        const usersToRemove = sortedUsers.slice(0, renderCache.size - MAX_USERS_IN_CACHE);
        usersToRemove.forEach(({ userId }) => renderCache.delete(userId));
    }
    
    // Force garbage collection if available
    if (global.gc) {
        global.gc();
    }
}

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

async function getCachedRender(userId, key, renderFunction, profileData) {
    const userCache = renderCache.get(userId) ?? new Map();

    const cached = userCache.get(key);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    try {
        // Do actual render
        const result = await renderFunction(profileData, key);

        // Cache result with expiration
        userCache.set(key, { 
            value: result, 
            expiresAt: now + CACHE_TTL_MS 
        });
        renderCache.set(userId, userCache);

        return result;
    } catch (error) {
        console.error(`Render function failed for key ${key}:`, error);
        throw error;
    }
}

const createOptimizedGradient = (ctx, key, x, y, width, height, stops, direction = 'vertical') => {
    const cacheKey = `${key}_${x}_${y}_${width}_${height}_${direction}_${JSON.stringify(stops)}`;
    const now = Date.now();
    
    // Check if gradient exists in cache
    if (gradientCache.has(cacheKey)) {
        // Update access time for LRU
        gradientAccessOrder.set(cacheKey, now);
        return gradientCache.get(cacheKey);
    }
    
    // Create new gradient
    let gradient;
    if (direction === 'horizontal') {
        gradient = ctx.createLinearGradient(x, y, x + width, y);
    } else {
        gradient = ctx.createLinearGradient(x, y, x, y + height);
    }
    
    stops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
    
    // LRU eviction when cache is full
    if (gradientCache.size >= GRADIENT_CACHE_LIMIT) {
        // Find least recently used
        let oldestKey = null;
        let oldestTime = now;
        
        for (const [key, time] of gradientAccessOrder) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            gradientCache.delete(oldestKey);
            gradientAccessOrder.delete(oldestKey);
        }
    }
    
    // Store in cache with access time
    gradientCache.set(cacheKey, gradient);
    gradientAccessOrder.set(cacheKey, now);
    
    return gradient;
};

const getCachedImage = async (imagePath) => {
    const now = Date.now();
    
    if (imageCache.has(imagePath)) {
        // Update access time for LRU
        cacheAccessOrder.set(imagePath, now);
        return imageCache.get(imagePath);
    }
    
    // LRU eviction when cache is full
    if (imageCache.size >= CACHE_SIZE_LIMIT) {
        // Find least recently used
        let oldestKey = null;
        let oldestTime = now;
        
        for (const [key, time] of cacheAccessOrder) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            imageCache.delete(oldestKey);
            cacheAccessOrder.delete(oldestKey);
        }
    }
    
    try {
        const image = await loadImage(imagePath);
        imageCache.set(imagePath, image);
        cacheAccessOrder.set(imagePath, now);
        return image;
    } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
        throw error;
    }
};

// Enhanced canvas cleanup
const createCanvasWithCleanup = (createCanvas, width, height) => {
    const canvas = createCanvas(width, height);
    const originalCtx = canvas.getContext('2d');
    
    // Wrap the canvas to add cleanup method
    canvas.cleanup = function() {
        // Clear the canvas
        originalCtx.clearRect(0, 0, width, height);
        
        // Reset context state
        originalCtx.restore();
        originalCtx.save();
        
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }
    };
    
    return canvas;
};

// Memory-conscious buffer conversion
const streamToBufferSafe = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalLength = 0;
        
        stream.on('data', (chunk) => {
            chunks.push(chunk);
            totalLength += chunk.length;
        });
        
        stream.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks, totalLength);
                // Clear chunks array to free memory
                chunks.length = 0;
                resolve(buffer);
            } catch (error) {
                reject(error);
            }
        });
        
        stream.on('error', reject);
    });
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

// Enhanced preload with memory management
const preloadImages = async (imagePaths) => {
    const uniquePaths = [...new Set(imagePaths)];
    const batchSize = 10; // Process in batches to avoid memory spikes
    
    for (let i = 0; i < uniquePaths.length; i += batchSize) {
        const batch = uniquePaths.slice(i, i + batchSize);
        const loadPromises = batch.map(path => getCachedImage(path));
        
        try {
            await Promise.all(loadPromises);
        } catch (error) {
            console.error(`Failed to preload batch ${i}-${i + batchSize}:`, error);
        }
        
        // Small delay between batches to prevent memory pressure
        if (i + batchSize < uniquePaths.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
};

// Clear all caches (useful for testing/debugging)
const clearAllCaches = () => {
    imageCache.clear();
    cacheAccessOrder.clear();
    gradientCache.clear();
    gradientAccessOrder.clear();
    renderCache.clear();
    
    if (global.gc) {
        global.gc();
    }
};

// Get cache statistics
const getCacheStats = () => {
    return {
        images: {
            size: imageCache.size,
            limit: CACHE_SIZE_LIMIT
        },
        gradients: {
            size: gradientCache.size,
            limit: GRADIENT_CACHE_LIMIT
        },
        users: {
            size: renderCache.size,
            limit: MAX_USERS_IN_CACHE,
            totalRenderCaches: Array.from(renderCache.values()).reduce((sum, cache) => sum + cache.size, 0)
        }
    };
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
    getCachedRender,
    createOptimizedGradient,
    getCachedImage,
    preloadImages,
    createCanvasWithCleanup,
    streamToBufferSafe,
    clearAllCaches,
    getCacheStats,
    cleanupUserCaches,
    getAchievementStarsImagePath,
    getImagePath,
    signature,
    drawRightRoundedRectPath,
    drawRoundedRectPath,
    tagFont,
    formatNumberWithSpaces,
    clashFontScaled,
    clashFont,
    sectionTitleFont,
    getTrophyLeagueImagePath,
    getLastYearMonth,
    getTownhallPath,
    getFontPath,
    mapClanRoles,
    getLeagueName,
    formatDateYearMonth,
    preloadAllImages,
    setupCanvasContext
};