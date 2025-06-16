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
        this.NUM_WORKERS = 1;
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
            // Increase max listeners to prevent warnings
            worker.setMaxListeners(20);
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
            let isResolved = false;

            const timeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(new Error('Render timed out after 15 seconds'));
                }
            }, 15 * 1000);

            const messageHandler = (msg) => {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    if (msg.success) {
                        resolve(msg.result);
                    } else {
                        reject(new Error(msg.error));
                    }
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

            // Cleanup function to remove all listeners and clear timeout
            const cleanup = () => {
                clearTimeout(timeout);
                worker.off('message', messageHandler);
                worker.off('error', errorHandler);
                worker.off('exit', exitHandler);
            };

            // Add all event listeners
            worker.on('message', messageHandler);
            worker.on('error', errorHandler);
            worker.on('exit', exitHandler);

            // Send the message to worker
            try {
                worker.postMessage({ type, profile, key });
            } catch (err) {
                if (!isResolved) {
                    isResolved = true;
                    cleanup();
                    reject(err);
                }
            }
        });
    }

    _getNextWorker() {
        const worker = this.workerPool[this.workerIndex];
        this.workerIndex = (this.workerIndex + 1) % this.workerPool.length;
        return worker;
    }

    // Recreate a worker if it becomes unresponsive
    async _recreateWorker(index) {
        try {
            // Terminate the old worker
            await this.workerPool[index].terminate();
        } catch (err) {
            console.warn('Error terminating worker:', err.message);
        }

        // Create a new worker
        const newWorker = new Worker(this.workerPath);
        newWorker.setMaxListeners(20);
        this.workerPool[index] = newWorker;
        console.log(`Recreated worker at index ${index}`);
    }

    async cleanup() {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        
        if (this.queue) {
            this.queue.pause();
            this.queue.clear();
        }
        
        const terminationPromises = this.workerPool.map(async (worker, index) => {
            try {
                // Remove all listeners before terminating
                worker.removeAllListeners();
                await worker.terminate();
            } catch (err) {
                console.warn(`Error terminating worker ${index}:`, err.message);
            }
        });
        
        await Promise.allSettled(terminationPromises);
        this.workerPool = [];
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
            queueInitialized: this.queueInitialized,
            workerListenerCounts: this.workerPool.map((worker, i) => ({
                index: i,
                listenerCount: worker.listenerCount('message') + worker.listenerCount('error') + worker.listenerCount('exit')
            }))
        };
    }

    // Health check method to recreate problematic workers
    async healthCheck() {
        if (this.isShuttingDown) return;

        for (let i = 0; i < this.workerPool.length; i++) {
            const worker = this.workerPool[i];
            const totalListeners = worker.listenerCount('message') + 
                                 worker.listenerCount('error') + 
                                 worker.listenerCount('exit');
            
            // If a worker has too many listeners, recreate it
            if (totalListeners > 15) {
                console.warn(`Worker ${i} has ${totalListeners} listeners, recreating...`);
                await this._recreateWorker(i);
            }
        }
    }
}

// Create singleton instance
const renderManager = new SafeRenderManager();

// Optional: Set up periodic health checks
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        renderManager.healthCheck().catch(err => {
            console.error('Health check failed:', err);
        });
    }, 60000); // Check every minute
}

// Export both the instance and a shutdown method
module.exports = renderManager;
module.exports.shutdown = () => renderManager.shutdown();