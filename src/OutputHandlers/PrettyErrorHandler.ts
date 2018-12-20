import BunqCLIError, { DoneError } from "../Types/Errors";
import chalk from "chalk";

export default error => {
    if (error instanceof DoneError) {
        throw error;
    }

    if (error instanceof BunqCLIError) {
        console.error(chalk.red("\n" + error.message));
        return true;
    }

    if (error.response && error.response.data) {
        console.error("");
        console.error(chalk.red("bunq API Error"));
        console.error(`${error.response.config.method.toUpperCase()}: ${error.response.config.url}`);
        console.error(error.response.data);
        console.error("");
        return true;
    }
    if (error.code && error.code === "ENOTFOUND") {
        console.error("");
        console.error(chalk.red("bunq API seems unreachable"));
        console.error("");
        return true;
    }

    return false;
};
