import {Worker} from 'worker_threads';
import path from 'path';
import {AsyncResource} from 'async_hooks';
import {EventEmitter} from 'events';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource{

    constructor(callback){
        super('WorkerPoolTaskInfo');
        this.callback = callback;

    }
    done(err,result){

    }
    
}


export default class WorkerPool extends EventEmitter {
    constructor(numThreads:any) {
        super();
        this.numThreads = numThreads;
        this.workers = [];
        this.freeWorkers = [];
        this.tasks = [];

        for (let i = 0; i < numThreads; i++)
            this.addNewWorker();

        // Any time the kWorkerFreedEvent is emitted, dispatch
        // the next task pending in the queue, if any.
        this.on(kWorkerFreedEvent, () => {
            if (this.tasks.length > 0) {
                const { task, callback } = this.tasks.shift();
                this.runTask(task, callback);
            }
        });
    }


//
// const worker = new Worker('./test.js', {
//     workerData: {
//         value:15,
//         path: './test.js'
//     }
// });
//
// worker.on('message',(result:any) => {
//     console.log(result);
// })


