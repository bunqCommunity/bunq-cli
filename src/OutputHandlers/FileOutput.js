const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const { writeLine } = require("../Utils");

module.exports = (directory = false, interactive = false) => {
    if (!directory) return process.cwd();

    return (apiResponse, type = "generic") => {
        const fileName = `${new Date().getTime()}-${type}.json`;
        const fullPath = path.join(directory, fileName);

        fs.writeFileSync(fullPath, JSON.stringify(apiResponse, null, "\t"));

        if (interactive) writeLine(`Wrote file to: ${chalk.cyan(fullPath)}`);
    };
};
