require("dotenv").config();
import chalk from "chalk";

import BunqCLI from "./BunqCLI";

import BunqCLIError from "./Errors";

const bunqCLI = new BunqCLI();

bunqCLI
    .run()
    .then(() => process.exit())
    .catch(error => {
        if (error instanceof BunqCLIError) {
            console.error(chalk.red("\n" + error.message));
        } else if (error.response && error.response.data) {
            console.error(chalk.red("\nbunq API Error"));
            console.error(`URL: ${error.response.config.url}`);
            console.error(`Method: ${error.response.config.method}`);
            console.error(`Data: ${error.response.config.data}`);
            console.error(error.response.data);
        } else {
            console.error(error);
        }
        process.exit(1);
    });
