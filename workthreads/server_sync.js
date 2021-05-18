const express = require('express');
const encrypt = require('./encrypt');
const app = express();

app.get('/', (req, res, next) => {
  const enc = encrypt(req.query.text);
  res.status(200).send(enc);
});

app.listen(8080);