import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

import { writeLine } from "../Utils";

export default (directory = "", interactive = false) => {
    if (!directory) return process.cwd();

    return (apiResponse, type = "JSON", label = "generic") => {
        const fileName = `${new Date().getTime()}-${label}.json`;
        const fullPath = path.join(directory, fileName);

        fs.writeFileSync(fullPath, JSON.stringify(apiResponse, null, "\t"));

        if (interactive) writeLine(`Wrote file to: ${chalk.cyan(fullPath)}`);
    };
};
