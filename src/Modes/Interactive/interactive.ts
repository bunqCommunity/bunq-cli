import chalk from "chalk";
// @ts-ignore
const { Select } = require("enquirer");
// @ts-ignore
const packageInfo: any = require("../../../package.json");

// interactive actions
import SetupApiKey from "./Actions/SetupApiKey";
import CreateMonetaryAccount from "./Actions/CreateMonetaryAccount";
import RequestSandboxFunds from "./Actions/RequestSandboxFunds";
import CallEndpoint from "./Actions/CallEndpoint";

import { writeLine, clearConsole, separatorChoiceOption, formatMoney } from "../../Utils";
import { DoneError } from "../../Errors";
import PrettyErrorHandler from "../../PrettyErrorHandler";

export default async bunqCLI => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${packageInfo.version} - interactive mode`));

    // do an initial run
    await SetupApiKey(bunqCLI, true);

    return nextCycle(bunqCLI);
};

const inputCycle = async (bunqCLI, firstRun = false) => {
    const isReady = !!bunqCLI.bunqJSClient.apiKey;
    const isSandbox = bunqCLI.bunqJSClient.Session.environment === "SANDBOX";

    if (firstRun) {
        writeLine("");
        await infoOutput(bunqCLI);
    }

    if (isReady) {
        const totalAccountBalance = bunqCLI.monetaryAccounts.reduce((total, account) => {
            const accountType = Object.keys(account)[0];
            const accountInfo = account[accountType];

            return total + parseFloat(accountInfo.balance.value);
        }, 0);

        writeLine(`User info: ${chalk.cyan(bunqCLI.user.display_name)}`);
        writeLine(`Monetary accounts: ${chalk.cyan(bunqCLI.monetaryAccounts.length)}`);
        writeLine(`Total account balance: ${chalk.cyan(formatMoney(totalAccountBalance))}`);
    } else {
        writeLine(`bunqJSClient status: ${chalk.yellow("Not ready!")}`);
    }
    writeLine(""); // end api info

    const choices = [];
    if (isReady) {
        choices.push({ message: "Use an API endpoint", value: "call-endpoint" });
        choices.push({ message: "Create a new monetary account", value: "create-monetary-account" });
        if (isSandbox) {
            choices.push({ message: "Add funds to sandbox account", value: "request-sandbox-funds" });
        }
    }
    choices.push({ message: isReady ? "Modify API key" : "Setup an API key", value: "setup-api-key" });
    choices.push(separatorChoiceOption());
    choices.push({ message: "Refresh", value: "refresh" });
    choices.push({ message: "Quit", value: "quit" });

    const result = await new Select({
        message: "What would you like to do",
        choices: choices
    }).run();

    clearConsole();
    switch (result) {
        case "call-endpoint":
            return CallEndpoint(bunqCLI);
            break;
        case "request-sandbox-funds":
            return RequestSandboxFunds(bunqCLI);
            break;
        case "create-monetary-account":
            return CreateMonetaryAccount(bunqCLI);
            break;
        case "setup-api-key":
            return SetupApiKey(bunqCLI);
            break;
        case "refresh":
            // do nothing and re-render
            return;
        case "quit":
            // break out of loop
            throw new DoneError();
            break;
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
