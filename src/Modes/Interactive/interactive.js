const stdin = process.stdin;
const path = require("path");
const chalk = require("chalk");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const package = require("../../../package.json");

const getEndpoints = require("../../getEndpoints");
const CustomStore = require("../../customStore");

const SetupApiKey = require("./SetupApiKey");
const CallEndpoint = require("./CallEndpoint");

const { write, writeLine, clearConsole } = require("../../Utils");

class DoneError extends Error {
    constructor(props) {
        super(props);
    }
}

module.exports = async () => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));

    const interactiveData = {
        storage: null,
        storageLocation: false,
        bunqJSClient: null,
        argv: argv,
        saveData: false,
        endpoints: {},
        apiData: {}
    };

    // empty = default location, string = custom location, false/undefined = memory only
    if (argv.save) {
        // custom or default value if defined
        interactiveData.storageLocation =
            argv.save !== true
                ? argv.save
                : path.join(process.cwd(), "bunq-cli-storage.json");
        interactiveData.saveData = true;
    }

    interactiveData.customStore = CustomStore(interactiveData.storageLocation);
    interactiveData.bunqJSClient = new BunqJSClient(interactiveData.customStore);

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
        writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`) + "\n");

        let storageString = "in memory";
        if (interactiveData.storageLocation) {
            storageString = `at ${chalk.cyan(interactiveData.storageLocation)}`;
        }
        writeLine(`Storing data ${storageString}`);
        writeLine(`bunqJSClient status: ${isReady ? chalk.green("ready") : chalk.yellow("Not ready")}\n`);

        writeLine(`What would you like to do?`);
        if (!isReady) {
            writeLine(`${chalk.cyan("s")} - Setup an API key`);
        } else {
            // writeLine(`${chalk.cyan("e")} - Use API endpoint`);
        }

        writeLine(`\n${chalk.cyan("q")} - to quit`);

        const handleTest = (handler) => {
            clearConsole();
            stdin.removeListener("data", inputListener);
            return resolve(handler(interactiveData));
        }

        const inputListener = key => {
            // q or ctrl+c
            if (key === "\u0003" || key === "q") {
                return reject(new DoneError());
            }

            if (key === "s") {
                return handleTest(SetupApiKey);
            }
            // if (key === "e") {
            //     return handleTest(CallEndpoint);
            // }

            // process.stdout.write(key);
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
