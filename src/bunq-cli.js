const os = require("os");
const fs = require("fs");
const path = require("path");

const defaultSavePath = path.join(os.homedir(), "bunq-cli.json");
const defaultOutputLocationPath = path.join(os.homedir(), "bunq-cli-api-data");

const argv = require("yargs")
    .alias({ save: "s" })
    .env("BUNQ_CLI")
    .boolean(["user", "accounts", "events"])
    .string([])

    .group(["save", "output", "outputLocation"], "General")
    // .group([], "Interactive mode options")
    .group(["user", "accounts", "events", "endpoint"], "CLI mode commands - only use 1 at a time")
    .group(["method", "older-id", "newer-id", "count", "data"], "CLI options")

    .coerce({
        data: JSON.parse
    })

    .default({
        save: false,
        output: false,
        method: "LIST",
        count: 200,
        save: defaultSavePath,
        outputLocation: defaultOutputLocationPath
    })

    .choices({
        output: ["file", "f", "console", "c", false]
    })

    .describe({
        save: "Storage location for bunqJSClient data, ignored if not defined",
        output: "Output type for API data, ignored if not defined",
        outputLocation: "Directory location for API output, ignored if 'output' not defined",
        user: "fetches the User object",
        accounts: "fetches all monetary accounts",
        events: "fetches the events for the user",
        endpoint: "a specific endpoint you want to call",
        method: "HTTP method, defaults to LIST",
        count: "Amount of items to returns between 1 and 200",
        "older-id": "Only return events newer than this event ID",
        "newer-id": "Only return events older than this event ID",
        data: "JSON data as a string for POST/PUT requests"
    })

    .example("bunq-cli --save", "The default interactive mode which saves bunqJSClient data for fast re-runs")
    .example("bunq-cli --cli --output=c --accounts", "Outputs the monetary accounts into the console")
    .example(
        "bunq-cli --cli --output --events",
        "Outputs the user events into a new file in the --storage-location directory"
    )

    .epilogue("for more information, check the readme at https://github.com/bunqCommunity/bunq-cli")
    .help("help").argv;

const BunqJSClient = require("@bunq-community/bunq-js-client").default;

// setup helpers
const getEndpoints = require("./getEndpoints");
const CustomStore = require("./customStore");
const FileOutput = require("./OutputHandlers/FileOutput");
const ConsoleOutput = require("./OutputHandlers/ConsoleOutput");

const { normalizePath } = require("./Utils");

// command modes
const InteractiveMode = require("./Modes/Interactive/interactive.js");
const CLIMode = require("./Modes/CLI/cli.js");

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
        // custom or default value if defined
        bunqCLI.saveLocation = argv.save !== true ? normalizePath(argv.save) : defaultSavePath;
        bunqCLI.saveData = true;
    }

    if (argv.output) {
        if (argv.output === "file" || argv.output === "f") {
            const outputLocation = argv.outputLocation || false;

            // custom or default value if defined
            bunqCLI.outputLocation =
                outputLocation === true || outputLocation === false
                    ? defaultOutputLocationPath
                    : normalizePath(outputLocation);
            bunqCLI.outputData = true;

            try {
                const directoryExists = fs.existsSync(bunqCLI.outputLocation);
                if (!directoryExists) {
                    fs.mkdirSync(bunqCLI.outputLocation);
                }
            } catch (ex) {
                throw new Error(`Failed to find or create the given output folder at: ${bunqCLI.outputLocation}`);
            }

            // setup a file handler
            bunqCLI.outputHandler = FileOutput(bunqCLI.outputLocation, bunqCLI.interactive);
        }
        if (argv.output === "console" || argv.output === "c") {
            bunqCLI.outputHandler = ConsoleOutput(bunqCLI);
        }
    }

    bunqCLI.storage = CustomStore(bunqCLI.saveLocation);
    bunqCLI.bunqJSClient = new BunqJSClient(bunqCLI.storage);

    // gather a list of endpoints the user can choose from
    bunqCLI.endpoints = getEndpoints(bunqCLI);

    if (bunqCLI.interactive) {
        return InteractiveMode(bunqCLI);
    } else {
        return CLIMode(bunqCLI);
    }
};
