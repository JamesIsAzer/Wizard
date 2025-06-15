const { Worker } = require('worker_threads');
const path = require('path');

class SafeRenderManager {
    constructor() {
        this.workerPath = path.resolve(__dirname, './renderWorker.js');
    }

    render(type, profile, key) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.workerPath);
            worker.postMessage({ type, profile, key });

            worker.on('message', (msg) => {
                if (msg.success) {

                    resolve(msg.result);

                } else {
                    reject(new Error(msg.error));
                }
            });

            worker.on('error', (err) => {
                reject(err);
            });

            worker.on('exit', (code) => {
                worker.terminate()
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }
}

module.exports = new SafeRenderManager();
