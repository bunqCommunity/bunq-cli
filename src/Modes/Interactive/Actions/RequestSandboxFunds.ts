import chalk from "chalk";
import * as awaiting from "awaiting";
import BunqCLI from "../../../BunqCLI";

import monetaryAccountIdPrompt from "../Prompts/select_monetary_account_id";

import { write, writeLine, startTime, endTimeFormatted } from "../../../Utils";

export default async (bunqCLI: BunqCLI) => {
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
    writeLine("");

    // when completed, update the stored monetary accounts list
    await bunqCLI.getMonetaryAccounts(true);

    writeLine("");

    return await awaiting.delay(250);
};
