const yargs = require("yargs");
const fs= require("fs");

const yargsResult = ({ defaultSavePath, defaultOutputLocationPath }) => {
    let argv = {};

    const EndpointUrlSubCommand = type => yargs => {
        const methodChoices = type === "url" ? ["LIST", "GET", "POST", "PUT"] : ["LIST", "GET"];

        argv = yargs
            .usage(`$0 cli ${type} <${type}> [options]`)
            .wrap(Math.min(120, yargs.terminalWidth()))

            .completion("completion")

            // more targeted auto completion
            // .completion("completion", function(current, argv) {
            //     // 'current' is the current command being completed.
            //     // 'argv' is the parsed arguments so far.
            //     // simply return an array of completions.
            //
            //     console.log(current);
            //
            //     return current;
            // })

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
                "$0 cli url /user/UserID/monetary-accounts/Account=Shopping/payment --count=50",
                "Outputs up to 50 payments for the current User and the 'Shopping' account"
            )
            .example(
                "$0 cli endpoint bunqMeTab --count=50",
                "Outputs up to 50 payments for the current User and the 'Shopping' account"
            )

            .group(["save", "output", "outputLocation"], "General")

            .help("help", `Show help for the CLI ${type} sub command`)

            .epilogue(`The different options for the ${type} CLI subcommand`).argv;
    };

    argv = yargs
        .usage("$0 <sub-command>")
        .wrap(Math.min(120, yargs.terminalWidth()))
        .env("BUNQ_CLI")
        .help("help")
        .completion("completion")

        .command("interactive", "Interactive mode")

        .command("user", "Get the user info")
        .command("accounts", "Fetches all monetary accounts")
        .command("events", "Fetches the events for the user")
        .command(
            "endpoint",
            "Simplified way to call standard GET and LIST endpoints",
            EndpointUrlSubCommand("endpoint")
        )
        .command("url", "Send a request directly for a given url", EndpointUrlSubCommand("url"))

        .example("$0 cli accounts", "Outputs the monetary accounts into the console")
        .example(
            "$0 cli events ---output=file",
            "Outputs the user events into a new file in the --output-location directory"
        )

        .group(["save", "output", "outputLocation"], "General")

        .alias({
            save: "s",
            output: "o",
            outputLocation: "output-location"
        })
        .normalize(["outputLocation"])
        .choices({
            output: ["file", "console", false]
        })
        .default({
            save: defaultSavePath,
            output: false,
            outputLocation: defaultOutputLocationPath
        })
        .describe({
            save: "Storage location for bunqJSClient data, ignored if not defined",
            output: "How to output the API data",
            outputLocation: "Directory location for API output files"
        })

        .example("$ --save", "The default interactive mode which saves bunqJSClient data for fast re-runs")

        .epilogue("for more information, check the readme at https://github.com/bunqCommunity/bunq-cli")

        .argv;

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
