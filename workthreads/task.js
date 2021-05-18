const { wrapAsWorker } = require('./pool');
const encrypt = require('./encrypt');

wrapAsWorker(encrypt);
