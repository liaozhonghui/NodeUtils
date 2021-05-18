const bcrypt = require('bcrypt');

module.exports = (plainText) => {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(plainText, salt);
    return hash;
};

