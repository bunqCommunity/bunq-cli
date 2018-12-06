const os = require("os");
const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;

const { normalizePath } = require("./Utils");

const InteractiveMode = require("./Modes/Interactive/interactive.js");
const CLIMode = require("./Modes/CLI/cli.js");
const FileOutput = require("./OutputHandlers/FileOutput");

module.exports = async () => {
    const bunqCLI = {
        bunqJSClient: null,

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
        bunqCLI.saveLocation = argv.save !== true ? normalizePath(argv.save) : path.join(os.homedir(), "bunq-cli.json");
        bunqCLI.saveData = true;
    }

    if (argv.output || argv.output === "file") {
        const outputLocation = argv.outputLocation || false;

        // custom or default value if defined
        bunqCLI.outputLocation =
            outputLocation === true || outputLocation === false
                ? path.join(os.homedir(), "bunq-cli-api-data")
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
        bunqCLI.outputHandler = FileOutput(bunqCLI.outputHandler);
    }

    if (!argv.cli) {
        return InteractiveMode(bunqCLI);
    } else {
        return CLIMode(bunqCLI);
    }
};
