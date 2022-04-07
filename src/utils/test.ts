const path = require('path');
const {parentPort,workerData } = require('worker_threads');
require('ts-node').register();
require(path.resolve(__dirname, workerData.path));
console.log('我是一个插件，其实我也是一个进程');

function factorial(n: number): number {
    if(n === 1 || n === 0){
        return 1;
    }
    return factorial(n - 1) * n;
}

parentPort.postMessage(
    factorial(workerData.value)
);