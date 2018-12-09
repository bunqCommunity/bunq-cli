import * as os from "os";
import * as path from "path";
import chalk from "chalk";
const crypto = require("crypto");
const qrcode = require("qrcode-terminal");

export const randomHex = length => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

/** Raw stdout writing */
export const writeRaw = input => process.stdout.write(input);

/** Write to stdout and add a newline */
export const writeLine = input => {
    write(input);
    process.stdout.write("\n");
};

/** Write to stdout but put cursor back so the line can easily be overwritten */
export const write = input => {
    // @ts-ignore
    process.stdout.clearLine();
    // @ts-ignore
    process.stdout.cursorTo(0);
    writeRaw(input);
};

export const clearConsole = () => {
    process.stdout.write("\x1B[2J\x1B[0f");
};

export const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const normalizePath = inputPath => {
    if (inputPath[0] === "/" || inputPath[1] === ":") {
        // likely an absolute path
    } else if (inputPath[0] === "~") {
        inputPath = path.join(os.homedir(), inputPath.substr(1, inputPath.length));
    } else {
        inputPath = path.join(process.cwd(), inputPath);
    }

    return inputPath;
};

/**
 * Outputs a QR code to the console
 * @param text
 * @param errorLevel
 */
export const displayQr = (text, errorLevel = "L") => {
    qrcode.setErrorLevel(errorLevel);
    console.log("");
    qrcode.generate(text);
};

/**
 * Format money with currency and spacing
 * @param moneyNumber
 */
export const formatMoney = moneyNumber => {
    moneyNumber = parseFloat(moneyNumber);

    return moneyNumber.toLocaleString("nl", {
        currency: "EUR",
        style: "currency",
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * Adds space every fourth character for IBAN numbers
 * @param iban
 * @returns {string}
 */
export const formatIban = iban => {
    const ret = [];
    let len;

    for (let i = 0, len = iban.length; i < len; i += 4) {
        ret.push(iban.substr(i, 4));
    }

    return ret.join(" ");
};

/**
 * A spacer choice for enquirer
 */
export const separatorChoiceOption = () => ({ value: chalk.grey("─────────"), role: "separator" });

/**
 * Timing helpers
 */
export const startTime = () => process.hrtime();
export const endTimeFormatted = startTime => {
    const endTime = process.hrtime(startTime);
    let timePassedLabel = `${endTime[1] / 1000000}ms`;
    if (endTime[0] > 0) {
        timePassedLabel = `${endTime[0]}s ${timePassedLabel}`;
    }
    return timePassedLabel;
};
