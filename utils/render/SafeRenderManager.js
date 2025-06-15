const { Worker } = require('worker_threads');
const path = require('path');

class SafeRenderManager {
    constructor() {
        this.workerPath = path.resolve(__dirname, './renderWorker.js');
        this.queuePromise = import('p-queue')
            .then(mod => new mod.default({ concurrency: 2 }));
    }

    async render(type, profile, key) {
        const queue = await this.queuePromise;
        return queue.add(() => this._runWorker(type, profile, key))
    }

    _runWorker(type, profile, key) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.workerPath);

            const timeout = setTimeout(() => {
                worker.terminate().then(() => {
                    reject(new Error('Render timed out'));
                }).catch(() => {
                    process.kill(worker.threadId);
                });
            }, 30 * 1000);

            worker.postMessage({ type, profile, key });

            worker.on('message', (msg) => {
                clearTimeout(timeout)
                if (msg.success) {
                    resolve(msg.result);
                } else {
                    reject(new Error(msg.error));
                }
            });

            worker.on('error', (err) => {
                clearTimeout(timeout)
                worker.terminate()
                reject(err);
            });

            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }
}

module.exports = new SafeRenderManager();
