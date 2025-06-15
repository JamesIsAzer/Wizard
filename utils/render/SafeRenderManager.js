const { Worker } = require('worker_threads');
const path = require('path');

class SafeRenderManager {
    constructor() {
        this.workerPath = path.resolve(__dirname, './renderWorker.js');
        this.queue = null;
        this.queueInitialized = false;
        
        // Track active workers for cleanup
        this.workerPool = [];      // The actual worker pool
        this.workerIndex = 0;      // Round robin index
        this.NUM_WORKERS = 4;
        this.isShuttingDown = false;
        
        // Initialize queue lazily
        this.initQueue();
        this.initWorkerPool();
    }

    async initQueue() {
        if (this.queueInitialized) return;
        const mod = await import('p-queue');
        this.queue = new mod.default({ 
            concurrency: 1,
            interval: 100,
            intervalCap: 2
        });
        this.queueInitialized = true;
    }

    initWorkerPool() {
        for (let i = 0; i < this.NUM_WORKERS; i++) {
            const worker = new Worker(this.workerPath);
            this.workerPool.push(worker);
        }
    }

    async render(type, profile, key) {
        if (this.isShuttingDown) {
            throw new Error('Render manager is shutting down');
        }

        await this.initQueue();
        return this.queue.add(() => this._runWorker(type, profile, key));
    }

    _runWorker(type, profile, key) {
        return new Promise((resolve, reject) => {
            const worker = this._getNextWorker();

            const timeout = setTimeout(() => {
                reject(new Error('Render timed out after 15 seconds'));
            }, 15 * 1000);

            const messageHandler = (msg) => {
                clearTimeout(timeout);
                worker.off('message', messageHandler);
                if (msg.success) {
                    resolve(msg.result);
                } else {
                    reject(new Error(msg.error));
                }
            };

            const errorHandler = (err) => {
                clearTimeout(timeout);
                worker.off('error', errorHandler);
                reject(err);
            };

            worker.on('message', messageHandler);
            worker.on('error', errorHandler);

            worker.postMessage({ type, profile, key });
        });
    }

    _getNextWorker() {
        const worker = this.workerPool[this.workerIndex];
        this.workerIndex = (this.workerIndex + 1) % this.workerPool.length;
        return worker;
    }

    async cleanup() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        if (this.queue) {
            this.queue.pause();
            this.queue.clear();
        }
        const terminationPromises = this.workerPool.map(worker => worker.terminate());
        await Promise.allSettled(terminationPromises);
        console.log('Worker pool cleaned up.');
    }

    // Method to gracefully shutdown the manager
    async shutdown() {
        await this.cleanup();
    }

    // Get status of the manager
    getStatus() {
        return {
            isShuttingDown: this.isShuttingDown,
            activeWorkers: this.workerPool.length,
            queueInitialized: this.queueInitialized
        };
    }
}

// Create singleton instance
const renderManager = new SafeRenderManager();

// Export both the instance and a shutdown method
module.exports = renderManager;
module.exports.shutdown = () => renderManager.shutdown();