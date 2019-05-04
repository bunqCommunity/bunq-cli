import chalk from "chalk";
import BunqCLI from "../../BunqCLI";
import MonetaryAccount from "../../Types/MonetaryAccount";
import { InteractiveBunqCLIModule } from "../../Types/BunqCLIModule";
import CounterpartyAlias from "@bunq-community/bunq-js-client/dist/Types/CounterpartyAlias";

import { writeLine, formatMoney, formatIban } from "../../Utils";
import { accountTypeFormatter } from "../../HumanOutputFormatters";

const handle = async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`View your monetary accounts`));
    writeLine("");

    await bunqCLI.getMonetaryAccounts(true);

    const spacerString = "".padEnd(50, "─");
    const whiteSpacer = chalk.gray(spacerString);
    const graySpacer = chalk.gray(spacerString);

    const accountText = chalk.blue("Account") + "";
    const balanceText = chalk.blue("Balance") + "";
    const ibanText = chalk.blue("  Type") + "";
    const accountColumnText = accountText.padEnd(30, " ");
    const balanceColumnText = balanceText.padStart(20, " ");
    const ibanColumnText = ibanText.padEnd(15, " ");

    const headerTemplate = `${accountColumnText}${balanceColumnText}${ibanColumnText}`;
    writeLine(headerTemplate);
    writeLine(whiteSpacer);

    bunqCLI.monetaryAccounts.forEach((monetaryAccount: MonetaryAccount) => {
        const prettyBalance = formatMoney(monetaryAccount.balance.value);

        const accountColumn = chalk.cyan(monetaryAccount.description).padEnd(30, " ");
        const balanceColumn = prettyBalance.padStart(10, " ");
        const typeColumn = accountTypeFormatter(monetaryAccount.accountType).padStart(10, " ");

        writeLine(`${accountColumn}${balanceColumn}  ${typeColumn}`);
        monetaryAccount.alias.forEach((alias: CounterpartyAlias) => {
            let prettyAliasType = alias.type;
            if (alias.type === "IBAN") prettyAliasType = `🏦   ${formatIban(alias.value)}`;
            if (alias.type === "PHONE_NUMBER") prettyAliasType = `📱   ${alias.value}`;
            if (alias.type === "EMAIL") prettyAliasType = `✉️   ${alias.value}`;

            writeLine(`  ${prettyAliasType}`);
        });

        writeLine(graySpacer);
    });
    writeLine("");
};

const ViewMonetaryAccountsAction = new InteractiveBunqCLIModule();
ViewMonetaryAccountsAction.id = "view-monetary-accounts-action";
ViewMonetaryAccountsAction.message = "View your monetary accounts";
ViewMonetaryAccountsAction.handle = handle;
ViewMonetaryAccountsAction.visibility = "AUTHENTICATED";

export default ViewMonetaryAccountsAction;
