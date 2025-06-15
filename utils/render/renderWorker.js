const { parentPort } = require('worker_threads');
const { getProfileImage } = require('../canvas/profile');
const { getTroopShowcaseImage } = require('../canvas/troopShowcase');

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
    } catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
});