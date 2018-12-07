const chalk = require("chalk");
const awaiting = require("awaiting");

const monetaryAccountIdPrompt = require("../Prompts/select_monetary_account_id");

const { write, writeLine, startTime, endTimeFormatted } = require("../../../Utils");

module.exports = async bunqCLI => {
    writeLine(chalk.blue(`Requesting sandbox funds`));
    writeLine("");

    const accountId = await monetaryAccountIdPrompt(bunqCLI.monetaryAccounts);
    if (!accountId) return;

    writeLine("");
    write(chalk.yellow(`Requesting money from sugar daddy for account: ${accountId} ... `));
    const startTime1 = startTime();
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

    const timePassedLabel1 = endTimeFormatted(startTime1);
    writeLine(chalk.green(`Requested money for account: '${accountId}' (${timePassedLabel1})`));

    // when completed, update the stored monetary accounts list
    await bunqCLI.getMonetaryAccounts(true);

    return await awaiting.delay(250);
};
