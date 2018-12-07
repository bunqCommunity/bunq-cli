require("dotenv").config();
const chalk = require("chalk");
const bunqCLI = require("./src/bunq-cli");
const { BunqCLIError } = require("./src/Errors");

bunqCLI()
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
