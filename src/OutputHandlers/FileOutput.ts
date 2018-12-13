import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import BunqCLI from "../BunqCLI";

import { cleanupData, writeLine } from "../Utils";

export default (bunqCLI: BunqCLI) => {
    return (apiResponse, type = "JSON", label = "generic") => {
        const fileName = `${new Date().getTime()}-${label}.json`;
        const fullPath = path.join(bunqCLI.outputLocation, fileName);

        if (bunqCLI.argv.clean) {
            apiResponse = cleanupData(apiResponse);
        }

        fs.writeFileSync(fullPath, JSON.stringify(apiResponse, null, "\t"));

        if (bunqCLI.interactive) writeLine(`Wrote file to: ${chalk.cyan(fullPath)}`);
    };
};
