const path = require("path");
const chalk = require("chalk");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const { Select } = require("enquirer");

const package = require("../../../package.json");

// setup helpers
const getEndpoints = require("../../getEndpoints");
const CustomStore = require("../../customStore");

// interactive actions
const SetupApiKey = require("./Actions/SetupApiKey");
const RequestSandboxFunds = require("./Actions/RequestSandboxFunds");
const CallEndpoint = require("./Actions/CallEndpoint");

const { write, writeLine, clearConsole, normalizePath, separatorChoiceOption } = require("../../Utils");

class DoneError extends Error {
    constructor(props) {
        super(props);
    }
}

module.exports = async () => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));

    const interactiveData = {
        bunqJSClient: null,

        storage: null,
        saveLocation: false,
        saveData: false,

        outputLocation: false,
        outputData: false,

        argv: argv,
        endpoints: {},
        apiData: {}
    };

    // empty = default location, string = custom location, false/undefined = memory only
    if (argv.save) {
        // custom or default value if defined
        interactiveData.saveLocation =
            argv.save !== true ? normalizePath(argv.save) : path.join(process.cwd(), "bunq-cli-storage.json");
        interactiveData.saveData = true;
    }
    if (argv.output) {
        // custom or default value if defined
        interactiveData.outputLocation =
            argv.output !== true ? normalizePath(argv.output) : path.join(process.cwd(), "bunq-cli-files");
        interactiveData.outputData = true;
    }

    interactiveData.storage = CustomStore(interactiveData.saveLocation);
    interactiveData.bunqJSClient = new BunqJSClient(interactiveData.storage);

    // gather a list of endpoints the user can choose from
    interactiveData.endpoints = getEndpoints(interactiveData.bunqJSClient);

    return nextCycle(interactiveData);
};

const inputCycle = async interactiveData => {
    const isReady = !!interactiveData.bunqJSClient.apiKey;
    const isSandbox = interactiveData.bunqJSClient.Session.environment === "SANDBOX";

    const storageText = interactiveData.saveLocation ? `at ${chalk.cyan(interactiveData.saveLocation)}` : "in memory";
    const readyStatusText = isReady ? chalk.green("ready") : chalk.yellow("Not ready");

    writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));
    writeLine("");
    writeLine(`Storing data ${storageText}`);
    writeLine(`bunqJSClient status: ${readyStatusText}`);
    if (isReady) {
        writeLine(`User info: ${interactiveData.user.display_name}`);
        writeLine(`Monetary accounts: ${interactiveData.monetaryAccounts.length}`);
    }

    // end info section with newline
    writeLine("");

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

    switch (result) {
        case "call-endpoint":
            clearConsole();
            return CallEndpoint(interactiveData);
            break;
        case "request-sandbox-funds":
            clearConsole();
            return RequestSandboxFunds(interactiveData);
            break;
        case "setup-api-key":
            clearConsole();
            return SetupApiKey(interactiveData);
            break;
        case "quit":
            // break out of loop
            throw new DoneError();
            break;
        default:
            // default to a clear console to prevent duplicate prompts
            clearConsole();
            break;
    }
};

// infinitly loops while waiting
const nextCycle = async interactiveData => {
    try {
        // wait for this cycle to finished
        await inputCycle(interactiveData);
    } catch (ex) {
        if (ex instanceof DoneError) {
            writeLine(chalk.green("\nFinished"));
            return;
        }
        throw ex;
    }

    // go to next cycle once that finishes
    return nextCycle(interactiveData);
};
