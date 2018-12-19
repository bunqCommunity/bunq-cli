import chalk from "chalk";
const { Select } = require("enquirer");
const packageInfo: any = require("../../package.json");

import { DoneError } from "../Errors";
import { InteractiveBunqCLIModule } from "../Types/BunqCLIModule";
import SetupApiKeyAction from "../Modules/Interactive/SetupApiKeyAction";

import { writeLine, clearConsole, separatorChoiceOption, formatMoney } from "../Utils";
import PrettyErrorHandler from "../PrettyErrorHandler";

export default async bunqCLI => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${packageInfo.version} - interactive mode`));

    // do an initial run
    await SetupApiKeyAction.handle(bunqCLI, true);

    return nextCycle(bunqCLI);
};

const inputCycle = async (bunqCLI, firstRun = false) => {
    const isReady = !!bunqCLI.bunqJSClient.apiKey;

    if (firstRun) {
        writeLine("");
        await infoOutput(bunqCLI);
    }

    if (isReady) {
        const totalAccountBalance = bunqCLI.monetaryAccounts.reduce((total, account) => {
            return total + parseFloat(account.balance.value);
        }, 0);
        writeLine(`User info: ${chalk.cyan(bunqCLI.user.display_name)}`);
        writeLine(`Monetary accounts: ${chalk.cyan(bunqCLI.monetaryAccounts.length)}`);
        writeLine(`Total account balance: ${chalk.cyan(formatMoney(totalAccountBalance))}`);
    } else {
        writeLine(`bunqJSClient status: ${chalk.yellow("Not ready!")}`);
    }
    writeLine(""); // end api info

    // filter out modules based on the visibility setting
    const allowedModules = bunqCLI.modules.filter((module: InteractiveBunqCLIModule) => {
        if (module instanceof InteractiveBunqCLIModule) {
            if (Array.isArray(module.visibility)) {
                return module.visibility.every(bunqCLI.checkModuleVisibility);
            }
            return bunqCLI.checkModuleVisibility(module.visibility);
        }
        return false;
    });

    const choices = [];
    allowedModules.forEach((allowedModule: InteractiveBunqCLIModule) => {
        choices.push({ message: allowedModule.message, value: allowedModule.id });
    });

    choices.push(separatorChoiceOption());
    choices.push({ message: "Refresh", value: "refresh" });
    choices.push({ message: "Quit", value: "quit" });

    const result = await new Select({
        message: "What would you like to do",
        choices: choices
    }).run();

    clearConsole();

    // standard hard coded choices
    switch (result) {
        case "refresh":
            // do nothing and re-render
            return;
        case "quit":
            // break out of loop
            throw new DoneError();
        default:
            // check the modules
            const foundModule = bunqCLI.modules.find((module: InteractiveBunqCLIModule) => {
                return module.id === result;
            });
            if (foundModule) {
                // call the module if found
                return foundModule.handle(bunqCLI);
            }
    }
};

const infoOutput = async bunqCLI => {
    const storageText = bunqCLI.saveLocation ? `at ${chalk.cyan(bunqCLI.saveLocation)}` : "in memory";

    writeLine(`Storing bunqJSClient data ${storageText}`);
    if (bunqCLI.outputData) {
        writeLine(`Outputting API data in ${chalk.cyan(bunqCLI.outputLocation)}`);
    }
    writeLine(""); // end bunq-cli
};

// infinitly loops while waiting
const nextCycle = async (bunqCLI, firstRun = false) => {
    try {
        // wait for this cycle to finished
        await inputCycle(bunqCLI, firstRun);
    } catch (error) {
        // check if a DoneError was thrown to break the loop
        if (error instanceof DoneError) {
            writeLine(chalk.green("\nFinished"));
            return;
        }

        // attempt to write out a pretty error
        const prettyError = PrettyErrorHandler(error);

        // if no pretty error was completed, rethrow the error
        if (!prettyError) throw error;
    }

    // go to next cycle once that finishes
    return nextCycle(bunqCLI);
};
