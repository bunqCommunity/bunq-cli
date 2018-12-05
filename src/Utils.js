const path = require("path");
const crypto = require("crypto");

let Utils = {};

Utils.randomHex = length => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

Utils.writeLine = input => {
    Utils.write(input);
    process.stdout.write("\n");
};
Utils.write = input => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(input);
};
Utils.clearConsole = () => console.log("\033[2J");

Utils.normalizePath = inputPath => {
    if (inputPath[0] === "/" || inputPath[1] === ":") {
        // likely an absolute path
    } else {
        inputPath = path.join(process.cwd(), inputPath);
    }

    return inputPath;
};

module.exports = Utils;
