const express = require('express');
const { WorkerPool } = require('./pool');

const app = express();

const pool = new WorkerPool('./task.js', 4);

app.get('/', (req, res) => {
  const plainText = req.query.text;

  pool.runWithArg(plainText, (err, enc) => {
    if (err) return console.error(err);
    return res.status(200).send(enc);
  });
});

app.listen(8080);
