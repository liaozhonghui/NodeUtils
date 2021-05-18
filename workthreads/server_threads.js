const express = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const encrypt = require('./encrypt');

if (isMainThread) {
  const app = express();

  app.get('/', (req, res, next) => {
    const worker = new Worker(__filename, { workerData: req.query.text });

    worker.once('message', (enc) => {
      res.status(200).send(enc);
    });
    worker.once('error', err => {
      console.log('error touched.');
      console.error(err);
      throw err;
    });
  });

  app.listen(8080);
} else {
  const enc = encrypt(workerData);
  parentPort.postMessage(enc);
}
