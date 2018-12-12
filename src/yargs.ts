const yargs = require("yargs");

const yargsResult = ({ defaultSavePath, defaultOutputLocationPath }) => {
    let argv = {};

    const EndpointUrlSubCommand = type => yargs => {
        const methodChoices = type === "url" ? ["LIST", "GET", "POST", "PUT"] : ["LIST", "GET"];

        argv = yargs
            .help("help")
            .completion("completion")
            .usage(`bunq-cli cli ${type} <${type}> [options]`)
            .wrap(Math.min(120, yargs.terminalWidth()))
            .demandCommand(1, 1, `Please provide the ${type} you would like to use`)
            .epilogue(`The different options for the ${type} CLI subcommand`)

            .group(["save", "output", "outputLocation"], "General")

            .alias({
                eventId: "event-id",
                accountId: "account-id",
                olderId: "older-id",
                newerId: "newer-id"
            })
            .choices({
                method: methodChoices
            })
            .default({
                method: "LIST",
                count: 200
            })

            .describe({
                method: "HTTP method, defaults to LIST",
                count: "Amount of items to returns between 1 and 200",
                olderId: "Only return events newer than this event ID",
                newerId: "Only return events older than this event ID",
                data: "JSON data as a string for POST/PUT requests",

                account: "Account description of the account to use in API calls",
                accountId: "Account ID of the account to use in API calls",
                eventId: "Event ID of the even to do a API call for"
            })

            .example(
                "bunq-cli url /user/UserID/monetary-accounts/Account=Shopping/payment --count=50",
                "Outputs up to 50 payments for the current User and the 'Shopping' account"
            )
            .example(
                "bunq-cli endpoint bunqMeTab --count=50",
                "Outputs up to 50 payments for the current User and the 'Shopping' account"
            ).argv;
    };

    argv = yargs
        .env("BUNQ_CLI")
        .help("help")
        .scriptName("bunq-cli")
        .completion("completion")
        .usage(
            `Interactive mode: bunq-cli 
Or use a command: bunq-cli <sub-command> [options]`
        )
        .wrap(Math.min(120, yargs.terminalWidth()))
        .epilogue("for more information, check the readme at https://github.com/bunqCommunity/bunq-cli")

        .group(["save", "output", "overwrite", "memory", "outputLocation"], "General")
        .group(["apiKey", "deviceName", "encryptionKey", "environment"], "API details")

        .command("interactive", "Interactive mode")
        .command("user", "Get the user info")
        .command("accounts", "Fetches all monetary accounts")
        .command("events", "Fetches the events for the user")
        .command("url", "Send a request directly for a given url", EndpointUrlSubCommand("url"))
        .command(
            "endpoint",
            "Simplified way to call standard GET and LIST endpoints",
            EndpointUrlSubCommand("endpoint")
        )

        .describe({
            save: "Storage location for bunqJSClient data",
            output: "How to output the API data",
            memory: "Use memory only, overwrites the save option",
            overwrite: "Overwrite the stored API key data with the given info",
            outputLocation: "Directory location for API output files",

            pretty: "Makes the JSON output more readable when outputting to console or files",
            clean: "Simplifies some API output like removing the Response wrapper",

            apiKey: "The bunq API key, creates a sandbox key by default",
            deviceName: "Device name to identify the API key",
            encryptionKey: "Encryption key for bunqJSClient, generates a random key by default",
            environment: "bunq API environment to use"
        })
        .default({
            save: defaultSavePath,
            output: false,
            memory: false,
            overwrite: false,
            clean: false,
            pretty: false,
            outputLocation: defaultOutputLocationPath,

            apiKey: "generate",
            deviceName: "My device",
            environment: "SANDBOX"
        })
        .alias({
            save: "s",
            output: "o",
            outputLocation: "output-location",
            apiKey: "api-key",
            deviceName: "device-name",
            encryptionKey: "encryption-key"
        })
        .normalize(["outputLocation"])
        .string(["apiKey", "deviceName", "encryptionKey"])
        .boolean(["memory", "overwrite", "clean", "pretty"])
        .choices({
            output: ["file", "console", false],
            environment: ["PRODUCTION", "SANDBOX"]
        })

        .example("bunq-cli accounts", "Outputs the monetary accounts into the console")
        .example(
            "bunq-cli events ---output=file",
            "Outputs the user events into a new file in the --output-location directory"
        ).argv;

    // go through arguments and fix boolean values
    Object.keys(argv).forEach(key => {
        const value = argv[key];

        if (typeof value === "string") {
            switch (value) {
                case "true":
                    argv[key] = true;
                    break;
                case "false":
                    argv[key] = false;
                    break;
            }
        }
    });

    return argv;
};

export default yargsResult;
