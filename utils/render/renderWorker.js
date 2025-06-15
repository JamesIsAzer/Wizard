const { parentPort } = require('worker_threads');
const { getProfileImage } = require('../canvas/profile');
const { getTroopShowcaseImage } = require('../canvas/troopShowcase');
const { preloadAllImages } = require('../canvas/shared');

(async () => {
  await preloadAllImages();
  console.log("Worker preload complete");
})();

// Add memory monitoring
const monitorMemory = () => {
    const used = process.memoryUsage();
    const memMB = Math.round(used.heapUsed / 1024 / 1024);
    
    // If memory usage is too high, force garbage collection
    if (memMB > 100 && global.gc) { // Adjust threshold as needed
        global.gc();
    }
    
    return memMB;
};

// Set up uncaught exception handler
process.on('uncaughtException', (error) => {
    console.error('Worker uncaught exception:', error);
    parentPort.postMessage({ success: false, error: error.message });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Worker unhandled rejection:', reason);
    parentPort.postMessage({ success: false, error: reason.toString() });
    process.exit(1);
});

parentPort.on('message', async ({ type, profile, key }) => {
    try {
        // Monitor initial memory
        const initialMem = monitorMemory();
        
        let result;
        
        if (type === 'profile') {
            result = await getProfileImage(profile, key);
        } else if (type === 'troop') {
            result = await getTroopShowcaseImage(profile, key);
        } else {
            throw new Error(`Unknown render type: ${type}`);
        }

        // Monitor final memory and cleanup if needed
        const finalMem = monitorMemory();
        
        // Log memory usage for debugging
        if (finalMem > initialMem + 50) {
            console.warn(`High memory usage in worker: ${finalMem}MB (increased by ${finalMem - initialMem}MB)`);
        }

        parentPort.postMessage({ success: true, result });
        
        // Force cleanup after successful render
        if (global.gc) {
            global.gc();
        }
        
    } catch (error) {
        console.error('Worker render error:', error);
        parentPort.postMessage({ success: false, error: error.message });
    }
});