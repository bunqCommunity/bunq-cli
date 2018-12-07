module.exports = ({ defaultSavePath, defaultOutputLocationPath }) => {
    const arguments = require("yargs")
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
            output:
                "Output type for API data, ignored if not defined. Default in interactive mode = false, default in CLI mode = console",
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

    // go through arguments and fix boolean values
    Object.keys(arguments).forEach(key => {
        const value = arguments[key];

        if (typeof value === "string") {
            switch (value) {
                case "true":
                    arguments[key] = true;
                    break;
                case "false":
                    arguments[key] = false;
                    break;
            }
        }
    });

    return arguments;
};
