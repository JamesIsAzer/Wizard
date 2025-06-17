const { parentPort } = require('worker_threads');
const { preloadAllImages } = require('../canvas/shared');
const { getProfileImage } = require('../canvas/profile');
const { getTroopShowcaseImage } = require('../canvas/troopShowcase');

// Stream helper to convert stream into buffer
const streamToBuffer = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

parentPort.on('message', async ({ type, profile, key }) => {
    try {
        let canvas;
        if (type === 'profile') {
            canvas = await getProfileImage(profile, key);
        } else if (type === 'troop') {
            canvas = await getTroopShowcaseImage(profile, key);
        } else {
            throw new Error(`Unknown render type: ${type}`);
        }

        const stream = canvas.createPNGStream();
        const buffer = await streamToBuffer(stream);
        parentPort.postMessage({ success: true, result: { buffer, fileName: `${key}.png` } });
    } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
    }
});

// Preload images AFTER listener attached
(async () => {
    try {
        await preloadAllImages();
        console.log('Worker preload complete');
    } catch (err) {
        console.error('Preload failed', err);
    }
})();