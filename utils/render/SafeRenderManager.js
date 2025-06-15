const { Worker } = require('worker_threads');
const path = require('path');

class SafeRenderManager {
    constructor() {
        this.workerPath = path.resolve(__dirname, './renderWorker.js');
        this.queue = null;
        this.queueInitialized = false;
        
        // Track active workers for cleanup
        this.activeWorkers = new Set();
        this.isShuttingDown = false;
        
        // Track cleanup state
        this.cleanupHandlersRegistered = false;
        
        // Initialize queue lazily
        this.initQueue();
    }

    async initQueue() {
        if (this.queueInitialized) return;
        
        try {
            const mod = await import('p-queue');
            this.queue = new mod.default({ 
                concurrency: 1,
                interval: 100,
                intervalCap: 2
            });
            this.queueInitialized = true;
            
            // Only register cleanup handlers once
            if (!this.cleanupHandlersRegistered) {
                this.registerCleanupHandlers();
                this.cleanupHandlersRegistered = true;
            }
        } catch (error) {
            console.error('Failed to initialize queue:', error);
            throw error;
        }
    }

    registerCleanupHandlers() {
        const cleanup = () => {
            if (!this.isShuttingDown) {
                this.cleanup().then(() => process.exit(0));
            }
        };

        process.on('SIGTERM', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGHUP', cleanup);
        
        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            this.cleanup().then(() => process.exit(1));
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            this.cleanup().then(() => process.exit(1));
        });
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
            if (this.isShuttingDown) {
                reject(new Error('Render manager is shutting down'));
                return;
            }

            const worker = new Worker(this.workerPath);
            this.activeWorkers.add(worker);

            // Shorter timeout for VPS resource management
            const timeout = setTimeout(() => {
                this._terminateWorker(worker);
                reject(new Error('Render timed out after 15 seconds'));
            }, 15 * 1000);

            worker.postMessage({ type, profile, key });

            worker.on('message', (msg) => {
                clearTimeout(timeout);
                this._cleanupWorker(worker);
                
                if (msg.success) {
                    resolve(msg.result);
                } else {
                    reject(new Error(msg.error));
                }
            });

            worker.on('error', (err) => {
                clearTimeout(timeout);
                this._terminateWorker(worker);
                reject(err);
            });

            worker.on('exit', (code) => {
                clearTimeout(timeout);
                this._cleanupWorker(worker);
                
                if (code !== 0 && !this.isShuttingDown) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }

    _terminateWorker(worker) {
        if (this.activeWorkers.has(worker)) {
            worker.terminate().catch(() => {
                // Force kill if terminate fails
                try {
                    if (worker.threadId) {
                        process.kill(worker.threadId, 'SIGKILL');
                    }
                } catch (e) {
                    // Worker already dead, ignore
                }
            });
            this.activeWorkers.delete(worker);
        }
    }

    _cleanupWorker(worker) {
        this.activeWorkers.delete(worker);
    }

    async cleanup() {
        if (this.isShuttingDown) return;
        
        console.log('Cleaning up render workers...');
        this.isShuttingDown = true;
        
        // Stop accepting new work
        if (this.queue) {
            this.queue.pause();
            this.queue.clear();
        }
        
        // Terminate all active workers
        const terminationPromises = Array.from(this.activeWorkers).map(worker => 
            worker.terminate().catch(() => {})
        );
        
        if (terminationPromises.length > 0) {
            await Promise.allSettled(terminationPromises);
        }
        
        this.activeWorkers.clear();
        
        // Force cleanup of queue resources
        if (this.queue) {
            try {
                // Clear any remaining tasks
                this.queue.clear();
                // Set queue to null to free resources
                this.queue = null;
            } catch (e) {
                // Ignore cleanup errors
            }
        }
        
        console.log('Render workers cleaned up.');
        
        // Force exit after a short delay to ensure cleanup
        setTimeout(() => {
            if (process.env.NODE_ENV !== 'test') {
                process.exit(0);
            }
        }, 100);
    }

    // Method to gracefully shutdown the manager
    async shutdown() {
        await this.cleanup();
    }

    // Get status of the manager
    getStatus() {
        return {
            isShuttingDown: this.isShuttingDown,
            activeWorkers: this.activeWorkers.size,
            queueInitialized: this.queueInitialized
        };
    }
}

// Create singleton instance
const renderManager = new SafeRenderManager();

// Export both the instance and a shutdown method
module.exports = renderManager;
module.exports.shutdown = () => renderManager.shutdown();