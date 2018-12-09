import BunqCLIError from "./Errors";
import chalk from "chalk";

export default error => {
    if (error instanceof BunqCLIError) {
        console.error(chalk.red("\n" + error.message));
    } else if (error.response && error.response.data) {
        console.error(chalk.red("\nbunq API Error"));
        console.error(`${error.response.config.method}: ${error.response.config.url}`);
        console.error(error.response.data);
    } else {
        console.error(error);
    }
};
