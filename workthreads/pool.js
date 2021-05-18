const { EventEmitter } = require('events');
const { Worker, parentPort, MessageChannel } = require('worker_threads');


const WORKER_STATUS = {
  IDLE: Symbol('idle'),
  BUSY: Symbol('busy')
};
module.exports.WorkerPool = class WorkerPool extends EventEmitter {
  constructor(script, size) {
    super();
    this.script = script;
    this.size = size;
    this.pool = [],
      this._initialize();
  }
  _initialize() {
    for (let i = 0; i < this.size; i++) {
      const worker = new Worker(this.script);
      this.pool.push({
        stauts: WORKER_STATUS.IDLE,
        worker
      });
      worker.once('exit', () => {
        this.emit('Worker ${worker.threadId} terminated');
      });
    }
  }

  getIdleWorker() {
    const idleWorker = this.pool.find(w => w.status === WORKER_STATUS.IDLE);
    if (idleWorker) return idleWorker.worker;
    return this.pool[Math.floor(Math.random() * this.size)].worker;
  }

  setWorkerIdle(worker) {
    const currWorker = this.pool.find(w => w.worker === worker);
    if (currWorker) currWorker.status = WORKER_STATUS.IDLE;
  }

  setWorkerBusy(worker) {
    const currWorker = this.pool.find(w => w.worker === worker);
    if (currWorker) currWorker.status = WORKER_STATUS.BUSY;
  }

  runWithArg(data, cb) {
    const worker = this.getIdleWorker();
    this.setWorkerBusy(worker);
    const { port1, port2 } = new MessageChannel();

    worker.postMessage({ data, port: port1 }, [port1]);
    port2.once('message', (result) => {
      this.setWorkerIdle(worker);
      cb(null, result);
    });
    port2.once('error', (err) => {
      this.setWorkerIdle(worker);
      cb(err);
    });
  }
};

module.exports.wrapAsWorker = (workerFunc) => {
  parentPort.on('message', ({ data, port }) => {
    const result = workerFunc(data);
    port.postMessage(result);
  });
};

