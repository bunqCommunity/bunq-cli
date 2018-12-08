module.exports = ({ defaultSavePath, defaultOutputLocationPath }) => {
    const arguments = require("yargs")
        .alias({
            save: "s",
            cli: "c",
            eventId: "event",
            account: "older-id",
            olderId: "older-id",
            newerId: "newer-id"
        })
        .env("BUNQ_CLI")
        .boolean(["user", "accounts", "events"])
        .string(["endpoint", "url"])
        .normalize(["outputLocation"])

        .group(["cli", "save", "output", "outputLocation"], "General")
        // .group([], "Interactive mode options")
        .group(["user", "accounts", "events", "endpoint", "url"], "CLI mode commands - only use 1 at a time")
        .group(["method", "olderId", "newerId", "count", "data", "account", "accountId", "eventId"], "CLI options")

        .default({
            save: false,
            output: false,
            method: "LIST",
            count: 200,
            save: defaultSavePath,
            outputLocation: defaultOutputLocationPath
        })

        .choices({
            output: ["file", "f", "console", "c", false],
            method: ["LIST", "GET", "POST", "PUT", "DELETE"]
        })

        .describe({
            cli: "CLI mode for a non-interactive usage",
            save: "Storage location for bunqJSClient data, ignored if not defined",
            output:
                "Output type for API data, ignored if not defined. Default in interactive mode = false, default in CLI mode = console",
            outputLocation: "Directory location for API output, ignored if 'output' not defined",

            user: "fetches the User object",
            accounts: "fetches all monetary accounts",
            events: "fetches the events for the user",
            endpoint: "a specific endpoint you want to call",
            url: "send a request directly for a given url, combine with --data, --method and the LIST options",

            method: "HTTP method, defaults to LIST",
            count: "Amount of items to returns between 1 and 200",
            olderId: "Only return events newer than this event ID",
            newerId: "Only return events older than this event ID",
            data: "JSON data as a string for POST/PUT requests",

            account: "Account description of the account to use in API calls",
            accountId: "Account ID of the account to use in API calls",
            eventId: "Event ID of the even to do a API call for"
        })

        .example("bunq-cli --save", "The default interactive mode which saves bunqJSClient data for fast re-runs")
        .example("bunq-cli --cli --accounts", "Outputs the monetary accounts into the console")
        .example(
            "bunq-cli -c --events ---output=file",
            "Outputs the user events into a new file in the --storage-location directory"
        )
        .example(
            "bunq-cli -c --url /v1/user/UserID/monetary-accounts/Account=Shopping/payment --count=50",
            "Outputs up to 50 payments for the current User and the 'Shopping' account"
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
