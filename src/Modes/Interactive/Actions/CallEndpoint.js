const chalk = require("chalk");
const awaiting = require("awaiting");

const endpointsPrompt = require("../../../Prompts/endpoints");
const monetaryAccountIdPrompt = require("../../../Prompts/monetary_account_id");

const { write, writeLine } = require("../../../Utils");

module.exports = async bunqCLI => {
    writeLine(chalk.blue(`Calling an API endpoint`));
    writeLine(chalk.yellow(`Not implemented yet`));
    return awaiting.delay(500);

    const selectedEndpoint = await endpointsPrompt(bunqCLI.endpoints);
    const endpoint = bunqCLI.endpoints[selectedEndpoint];

    console.log(endpoint);

    // write(chalk.yellow(`Fetching events`));
    // const events = await bunqCLI.bunqJSClient.api.event.list(bunqCLI.user.id);
    // bunqCLI.outputHandler(events, "list-event");
    // writeLine(chalk.green(`Fetched ${events.length} events!`));
    //
    // bunqCLI.api.events = events;
    //
    //
    // const accountId = await monetaryAccountIdPrompt(bunqCLI.monetaryAccounts);
    // const monetaryAccount = bunqCLI.monetaryAccounts.find(account => {
    //     const accountType = Object.keys(account)[0];
    //     return account[accountType].id === accountId;
    // });
    //
    // console.log(accountId, monetaryAccount);
};
