const { parentPort } = require('worker_threads');
const { preloadAllImages } = require('../canvas/shared');
const { getProfileImage } = require('../canvas/profile');
const { getTroopShowcaseImage } = require('../canvas/troopShowcase');

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log it
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Log and decide whether to exit gracefully
    process.exit(1);
});

// Always register listener immediately
parentPort.on('message', async ({ type, profile, key }) => {
    try {
        let result;

        if (type === 'profile') {
            result = await getProfileImage(profile, key);
        } else if (type === 'troop') {
            result = await getTroopShowcaseImage(profile, key);
        } else {
            throw new Error(`Unknown render type: ${type}`);
        }

        parentPort.postMessage({ success: true, result });
    } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
    }
});

// Only preload AFTER the listener is attached
(async () => {
    try {
        await preloadAllImages();
        console.log('Worker preload complete');
    } catch (err) {
        console.error('Preload failed', err);
    }
})();