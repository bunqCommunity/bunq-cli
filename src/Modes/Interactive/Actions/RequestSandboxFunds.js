const chalk = require("chalk");
const awaiting = require("awaiting");

const monetaryAccountIdPrompt = require("../../../Prompts/monetary_account_id");

const { write, writeLine, clearConsole } = require("../../../Utils");

module.exports = async interactiveData => {
    writeLine(chalk.blue(`Requesting sandbox funds`));

    const accountId = await monetaryAccountIdPrompt(interactiveData.monetaryAccounts);
    if (!accountId) return;

    write(chalk.yellow(`Requesting money from sugar daddy for account: ${accountId} ... `));
    await interactiveData.bunqJSClient.api.requestInquiry.post(
        interactiveData.user.id,
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
    interactiveData.monetaryAccounts = await interactiveData.bunqJSClient.api.monetaryAccount.list(
        interactiveData.user.id
    );
    writeLine(chalk.green(`Updated monetary accounts!`));

    return await awaiting.delay(500);
};
