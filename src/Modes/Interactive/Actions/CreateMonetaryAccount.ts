import chalk from "chalk";
import * as awaiting from "awaiting";

import selectMonetaryAccountTypePrompt from "../Prompts/select_monetary_account_type";
import genericStringPrompt from "../Prompts/generic_string_prompt";
import colorPickerPrommpt from "../Prompts/color_picker";

import { write, writeLine, startTime, endTimeFormatted } from "../../../Utils";

export default async bunqCLI => {
    writeLine(chalk.blue(`Creating a new monetary account`));
    writeLine("");

    const description = await genericStringPrompt("account description");
    if (!description) return;

    const accountType = await selectMonetaryAccountTypePrompt();
    if (!accountType) return;

    let savingsGoal = false;
    if (accountType === "savings") {
        savingsGoal = await genericStringPrompt("savings goal amount", "500");
        if (!savingsGoal) return;
    }

    const dailyLimit = await genericStringPrompt("daily limit", "500");
    if (!dailyLimit) return;

    const accountColor = await colorPickerPrommpt();
    if (!accountColor) return;

    writeLine("");
    write(chalk.yellow(`Attempting to create the ${accountType} account ... `));
    const startTime1 = startTime();

    if (accountType === "regular") {
        await bunqCLI.bunqJSClient.api.monetaryAccountBank.post(
            bunqCLI.user.id,
            "EUR",
            description,
            dailyLimit + "",
            accountColor
        );
    }
    if (accountType === "savings") {
        await bunqCLI.bunqJSClient.api.monetaryAccountSavings.post(
            bunqCLI.user.id,
            "EUR",
            description,
            dailyLimit + "",
            accountColor,
            savingsGoal + ""
        );
    }

    const timePassedLabel1 = endTimeFormatted(startTime1);
    writeLine(chalk.green(`Created the ${accountType} account: (${timePassedLabel1})`));

    // when completed, update the stored monetary accounts list
    await bunqCLI.getMonetaryAccounts(true);

    return await awaiting.delay(250);
};
