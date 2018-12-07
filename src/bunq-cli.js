const os = require("os");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const awaiting = require("awaiting");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;

const defaultSavePath = path.join(os.homedir(), "bunq-cli.json");
const defaultOutputLocationPath = path.join(os.homedir(), "bunq-cli-api-data");
const argv = require("./yargs")({ defaultSavePath, defaultOutputLocationPath });

// setup helpers
const getEndpoints = require("./getEndpoints");
const CustomStore = require("./customStore");

// result output handlers
const FileOutput = require("./OutputHandlers/FileOutput");
const ConsoleOutput = require("./OutputHandlers/ConsoleOutput");

// command modes
const InteractiveMode = require("./Modes/Interactive/interactive.js");
const CLIMode = require("./Modes/CLI/cli.js");

const { normalizePath, write, writeLine, startTime, endTimeFormatted } = require("./Utils");
const { BunqCLIError } = require("./Errors");

module.exports = async () => {
    const bunqCLI = {
        bunqJSClient: null,

        // pretty output message
        interactive: !argv.cli,

        // public/bunqJSClient storage handler and location details
        storage: null,
        saveLocation: false,
        saveData: false,

        // default to a handler which does nothing
        outputHandler: () => {},

        // api data output directory location
        outputLocation: false,
        outputData: false,

        argv: argv,
        endpoints: {},
        apiData: {}
    };

    // empty = default location, string = custom location, false/undefined = memory only
    if (argv.save) {
        if (typeof argv.save === "string" && argv.save === "true") {
            if (argv.save === "true") argv.save = true;
            if (argv.save === "false") argv.save = false;
        }

        // custom or default value if defined
        bunqCLI.saveLocation = argv.save !== true ? normalizePath(argv.save) : defaultSavePath;
        bunqCLI.saveData = true;
    }

    if (!bunqCLI.interactive && !argv.output) {
        argv.output = "console";
    }

    if (argv.output) {
        bunqCLI.outputData = true;

        if (argv.output === "file" || argv.output === "f") {
            const outputLocation = argv.outputLocation || false;

            // custom or default value if defined
            bunqCLI.outputLocation =
                outputLocation === true || outputLocation === false
                    ? defaultOutputLocationPath
                    : normalizePath(outputLocation);

            try {
                const directoryExists = fs.existsSync(bunqCLI.outputLocation);
                if (!directoryExists) {
                    fs.mkdirSync(bunqCLI.outputLocation);
                }
            } catch (ex) {
                throw new BunqCLIError(
                    `Failed to find or create the given output folder at: ${bunqCLI.outputLocation}`
                );
            }

            // setup a file handler
            bunqCLI.outputHandler = FileOutput(bunqCLI.outputLocation, bunqCLI.interactive);
        }
        if (argv.output === "console" || argv.output === "c") {
            if (bunqCLI.interactive) {
                // ignore console mode in interactive mode
                throw new BunqCLIError("The --output=console output mode is not supported in interactive mode!");
            }

            bunqCLI.outputHandler = ConsoleOutput(bunqCLI);
            bunqCLI.outputLocation = "console";
        }
    }

    bunqCLI.storage = CustomStore(bunqCLI.saveLocation);
    bunqCLI.bunqJSClient = new BunqJSClient(bunqCLI.storage);

    // gather a list of endpoints the user can choose from
    bunqCLI.endpoints = getEndpoints(bunqCLI);

    // Generic API requests
    bunqCLI.getUser = async (forceUpdate = false) => {
        write(chalk.yellow("Fetching users list ..."));
        const userStartTime = startTime();

        const users = await bunqCLI.bunqJSClient.getUsers(forceUpdate);
        bunqCLI.userType = Object.keys(users)[0];
        bunqCLI.user = users[bunqCLI.userType];

        writeLine(chalk.green(`Fetched a ${bunqCLI.userType} account (${endTimeFormatted(userStartTime)})`));
        return bunqCLI.user;
    };

    bunqCLI.getMonetaryAccounts = async (forceUpdate = false) => {
        if (!forceUpdate && bunqCLI.monetaryAccounts) {
            return bunqCLI.monetaryAccounts;
        }

        write(chalk.yellow(`Updating monetary account list ... `));
        const startTime2 = startTime();

        bunqCLI.monetaryAccounts = await bunqCLI.bunqJSClient.api.monetaryAccount.list(bunqCLI.user.id);

        writeLine(chalk.green(`Updated monetary accounts (${endTimeFormatted(startTime2)})`));

        await awaiting.delay(200);

        return bunqCLI.monetaryAccounts;
    };

    // Parse argument values for a LIST request
    bunqCLI.parseRequestOptions = () => {
        const requestOptions = {
            count: 200
        };
        if (argv.count) requestOptions.count = argv.count;
        if (argv.older_id) requestOptions.older_id = argv.older_id;
        if (argv.newer_id) requestOptions.newer_id = argv.newer_id;

        return requestOptions;
    };

    if (bunqCLI.interactive) {
        return InteractiveMode(bunqCLI);
    } else {
        return CLIMode(bunqCLI);
    }
};
