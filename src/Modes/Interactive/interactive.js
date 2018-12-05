const stdin = process.stdin;
const path = require("path");
const chalk = require("chalk");
const axios = require("axios");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const package = require("../../../package.json");

const getEndpoints = require("../../getEndpoints");
const CustomStore = require("../../customStore");

const SetupApiKey = require("./SetupApiKey");
const CallEndpoint = require("./CallEndpoint");

const { write, writeLine, clearConsole, normalizePath } = require("../../Utils");

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

    // set stdin mode
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    return nextCycle(interactiveData);
};

const inputCycle = async interactiveData => {
    return new Promise((resolve, reject) => {
        const isReady = !!interactiveData.bunqJSClient.apiKey;

        clearConsole();

        const storageText = interactiveData.saveLocation
            ? `at ${chalk.cyan(interactiveData.saveLocation)}`
            : "in memory";
        const readyStatusText = isReady ? chalk.green("ready") : chalk.yellow("Not ready");

        writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));
        writeLine("");
        writeLine(`Storing data ${storageText}`);
        writeLine(`bunqJSClient status: ${readyStatusText}\n`);

        writeLine(`What would you like to do?`);
        if (!isReady) {
            writeLine(`${chalk.cyan("s")} - Setup an API key`);
        } else {
            writeLine(`${chalk.cyan("e")} - Use API endpoint`);
        }

        writeLine(`\n${chalk.cyan("q")} - to quit`);

        const handleTest = handler => {
            clearConsole();
            stdin.removeListener("data", inputListener);
            return resolve(handler(interactiveData));
        };

        const inputListener = key => {
            // q or ctrl+c
            if (key === "\u0003" || key === "q") {
                return reject(new DoneError());
            }

            if (key === "s") return handleTest(SetupApiKey);
            if (key === "e") return handleTest(CallEndpoint);
        };
        stdin.on("data", inputListener);
    });
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
