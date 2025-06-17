const { Worker } = require('worker_threads');
const path = require('path');
const PQueue = require('p-queue').default;
const pLimit = require('p-limit');

class SafeRenderManager {
    constructor() {
        this.workerPath = path.resolve(__dirname, './renderWorker.js');
        this.NUM_WORKERS = 1;
        this.workerPool = [];
        this.workerIndex = 0;
        this.isShuttingDown = false;
        this.queue = new PQueue({ concurrency: 1, interval: 100, intervalCap: 2 });
        this.globalLimiter = pLimit(1);
        this.initWorkerPool();
    }

    initWorkerPool() {
        for (let i = 0; i < this.NUM_WORKERS; i++) {
            const worker = new Worker(this.workerPath);
            worker.setMaxListeners(20);
            this.workerPool.push(worker);
        }
    }

    async render(type, profile, key) {
        if (this.isShuttingDown) throw new Error('Render manager shutting down');
        return this.globalLimiter(() => this.queue.add(() => this._runWorker(type, profile, key)));
    }

    _runWorker(type, profile, key) {
        return new Promise((resolve, reject) => {
            const worker = this._getNextWorker();
            let isResolved = false;

            const timeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(new Error('Worker timeout'));
                }
            }, 15000);

            const cleanup = () => {
                clearTimeout(timeout);
                worker.off('message', messageHandler);
                worker.off('error', errorHandler);
                worker.off('exit', exitHandler);
            };

            const messageHandler = (msg) => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    if (msg.success) resolve(msg.result);
                    else reject(new Error(msg.error));
                }
            };

            const errorHandler = (err) => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(err);
                }
            };

            const exitHandler = (code) => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(new Error(`Worker exited with code ${code}`));
                }
            };

            worker.on('message', messageHandler);
            worker.on('error', errorHandler);
            worker.on('exit', exitHandler);
            worker.postMessage({ type, profile, key });
        });
    }

    _getNextWorker() {
        const worker = this.workerPool[this.workerIndex];
        this.workerIndex = (this.workerIndex + 1) % this.workerPool.length;
        return worker;
    }

    async shutdown() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        this.queue.pause();
        this.queue.clear();
        await Promise.allSettled(this.workerPool.map(w => w.terminate()));
        console.log('Worker pool cleaned up.');
    }
}

module.exports = new SafeRenderManager();