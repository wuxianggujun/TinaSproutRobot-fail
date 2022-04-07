const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
// 设置好处
let code = `console.log('test')`;
// 使用 eval 代码执行
// let worekr = new Worker(code,{
//     eval:true
// });

let caos = new Worker(code,{
    workerData: {
        website:"villainhr.com"
    }
})

let {website} =caos.workerData;
console.log(website);
