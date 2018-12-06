const os = require("os");
const path = require("path");
const chalk = require("chalk");
const crypto = require("crypto");
const qrcode = require("qrcode-terminal");

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
Utils.writeRaw = input => process.stdout.write(input);
Utils.write = input => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    Utils.writeRaw(input);
};
Utils.clearConsole = () => process.stdout.write("\033c\033[3J");

Utils.normalizePath = inputPath => {
    if (inputPath[0] === "/" || inputPath[1] === ":") {
        // likely an absolute path
    } else if (inputPath[0] === "~") {
        inputPath = path.join(os.homedir(), inputPath.substr(1, inputPath.length));
    } else {
        inputPath = path.join(os.homedir(), inputPath);
    }

    return inputPath;
};

Utils.displayQr = (text, errorLevel = "L") => {
    qrcode.setErrorLevel(errorLevel);
    console.log("");
    qrcode.generate(text);
};

Utils.formatMoney = moneyNumber => {
    return moneyNumber.toLocaleString("nl", {
        currency: "EUR",
        style: "currency",
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

Utils.separatorChoiceOption = () => ({ value: chalk.grey("─────────"), role: "separator" });

Utils.startTime = () => process.hrtime();
Utils.endTime = startTime => process.hrtime(startTime);
Utils.endTimeFormatted = startTime => {
    const endTime = Utils.endTime(startTime);
    let timePassedLabel = `${endTime[1] / 1000000}ms`;
    if (endTime[0] > 0) {
        timePassedLabel = `${endTime[0]}s ${timePassedLabel}`;
    }
    return timePassedLabel;
};

module.exports = Utils;
