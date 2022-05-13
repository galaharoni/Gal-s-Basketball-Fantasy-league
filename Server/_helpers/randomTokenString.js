const crypto = require("crypto");

module.exports = randomTokenString;

function randomTokenString() {
    return crypto.randomBytes(10).toString('hex');
}


