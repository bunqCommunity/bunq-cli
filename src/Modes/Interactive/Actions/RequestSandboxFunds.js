const chalk = require("chalk");
const awaiting = require("awaiting");

const monetaryAccountIdPrompt = require("../../../Prompts/monetary_account_id");

const { write, writeLine, clearConsole } = require("../../../Utils");

module.exports = async bunqCLI => {
    writeLine(chalk.blue(`Requesting sandbox funds`));

    const accountId = await monetaryAccountIdPrompt(bunqCLI.monetaryAccounts);
    if (!accountId) return;

    write(chalk.yellow(`Requesting money from sugar daddy for account: ${accountId} ... `));
    await bunqCLI.bunqJSClient.api.requestInquiry.post(
        bunqCLI.user.id,
        accountId,
        "Money pleaseee",
        {
            currency: "EUR",
            value: "500.00"
        },
        {
            type: "EMAIL",
            value: "sugardaddy@bunq.com"
        }
    );
    writeLine(chalk.green(`Requested money for account: ${accountId}`));

    // when completed, update the stored monetary accounts list
    write(chalk.yellow(`Updating monetary account list ... `));
    bunqCLI.monetaryAccounts = await bunqCLI.bunqJSClient.api.monetaryAccount.list(bunqCLI.user.id);
    writeLine(chalk.green(`Updated monetary accounts!`));

    return await awaiting.delay(500);
};
