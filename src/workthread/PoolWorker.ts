import { Worker } from 'worker_threads';

export class PoolWorker extends Worker{

    private _ready: boolean = false;

    constructor(...args: ConstructorParameters<typeof Worker>) {
        super(...args);
    }

    get ready(): boolean {
        return this._ready;
    }

}