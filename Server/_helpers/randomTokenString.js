const crypto = require("crypto");

module.exports = randomTokenString;
/**
 * randomTokenString:
 */
function randomTokenString() {
    return crypto.randomBytes(10).toString('hex');
}


