const chalk = require("chalk");
const { Select } = require("enquirer");

const package = require("../../../package.json");

// interactive actions
const SetupApiKey = require("./Actions/SetupApiKey");
const RequestSandboxFunds = require("./Actions/RequestSandboxFunds");
const CallEndpoint = require("./Actions/CallEndpoint");

const { write, writeLine, clearConsole, normalizePath, separatorChoiceOption, formatMoney } = require("../../Utils");

class DoneError extends Error {
    constructor(props) {
        super(props);
    }
}

module.exports = async bunqCLI => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));

    bunqCLI.interactive = true;

    // do an initial run
    await SetupApiKey(bunqCLI, true);

    return nextCycle(bunqCLI);
};

const inputCycle = async bunqCLI => {
    const isReady = !!bunqCLI.bunqJSClient.apiKey;
    const isSandbox = bunqCLI.bunqJSClient.Session.environment === "SANDBOX";

    const storageText = bunqCLI.saveLocation ? `at ${chalk.cyan(bunqCLI.saveLocation)}` : "in memory";
    const readyStatusText = isReady ? chalk.green("ready") : chalk.yellow("Not ready");

    writeLine("");
    writeLine(`Storing bunqJSClient data ${storageText}`);
    if (bunqCLI.outputData) {
        writeLine(`Outputting API data in ${chalk.cyan(bunqCLI.outputLocation)}`);
    }
    writeLine(`bunqJSClient status: ${readyStatusText}`);
    writeLine(""); // end bunq-cli

    if (isReady) {
        const totalAccountBalance = bunqCLI.monetaryAccounts.reduce((total, account) => {
            const accountType = Object.keys(account)[0];
            const accountInfo = account[accountType];

            return total + parseFloat(accountInfo.balance.value);
        }, 0);

        writeLine(`User info: ${bunqCLI.user.display_name}`);
        writeLine(`Monetary accounts: ${bunqCLI.monetaryAccounts.length}`);
        writeLine(`Total account balance: ${formatMoney(totalAccountBalance)}`);
    }
    writeLine(""); // end api info

    const choices = [];
    if (isReady) {
        choices.push({ message: "Use an API endpoint", value: "call-endpoint" });
        if (isSandbox) {
            choices.push({ message: "Add funds to sandbox account", value: "request-sandbox-funds" });
        }
    }
    choices.push({ message: isReady ? "Modify API key" : "Setup an API key", value: "setup-api-key" });
    choices.push(separatorChoiceOption());
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
        case "setup-api-key":
            return SetupApiKey(bunqCLI);
            break;
        case "quit":
            // break out of loop
            throw new DoneError();
            break;
    }
};

// infinitly loops while waiting
const nextCycle = async bunqCLI => {
    try {
        // wait for this cycle to finished
        await inputCycle(bunqCLI);
    } catch (ex) {
        if (ex instanceof DoneError) {
            writeLine(chalk.green("\nFinished"));
            return;
        }
        throw ex;
    }

    // go to next cycle once that finishes
    return nextCycle(bunqCLI);
};
