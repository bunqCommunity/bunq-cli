import { CommandLineBunqCLIModule } from "../Types/BunqCLIModule";

const EndpointUrlYargsHelper = (module: CommandLineBunqCLIModule) => yargs => {
    const command = module.command;
    const methodChoices = command === "url" ? ["LIST", "GET", "POST", "PUT"] : ["LIST", "GET"];

    const subYargs = yargs
        .help("help")
        .completion("completion")
        .usage(`bunq-cli ${command} <${command}> [options]`)
        .wrap(Math.min(120, yargs.terminalWidth()))
        .demandCommand(1, 1, `Please provide the ${command} you would like to use`)
        .epilogue(`The different options for the ${command} CLI subcommand`)

        .group(["save", "output", "outputLocation"], "General")

        .command(module.command, module.message)

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
        });

    if (command === "url") {
        subYargs.example(
            "bunq-cli url /user/UserID/monetary-accounts/Account=Shopping/payment --count=50",
            "Outputs up to 50 payments for the current User and the 'Shopping' account"
        );
    } else {
        subYargs.example(
            "bunq-cli endpoint bunqMeTab --count=50",
            "Outputs up to 50 payments for the current User and the 'Shopping' account"
        );
    }

    return subYargs.argv;
};

export default EndpointUrlYargsHelper;
