const crypto = require("crypto");

module.exports = {
    randomHex : length => {
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
    }
}