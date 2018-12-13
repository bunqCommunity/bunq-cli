import chalk from "chalk";
import BunqCLI from "../../BunqCLI";
import MonetaryAccount from "../../Types/MonetaryAccount";
import { InteractiveBunqCLIModule } from "../../Types/BunqCLIModule";
import CounterpartyAlias from "@bunq-community/bunq-js-client/dist/Types/CounterpartyAlias";

import { writeLine, formatMoney, formatIban } from "../../Utils";

const handle = async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`View your monetary accounts`));
    writeLine("");

    const spacerString = "".padEnd(60, "─");
    const whiteSpacer = chalk.gray(spacerString);
    const graySpacer = chalk.gray(spacerString);

    const accountText = chalk.blue("Account") + "";
    const balanceText = chalk.blue("Balance") + "";
    const ibanText = chalk.blue("  Alias") + "";
    const accountColumnText = accountText.padEnd(30, " ");
    const balanceColumnText = balanceText.padStart(20, " ");
    const ibanColumnText = ibanText.padEnd(15, " ");

    const headerTemplate = `${accountColumnText}${balanceColumnText}${ibanColumnText}`;
    writeLine(headerTemplate);
    writeLine(whiteSpacer);

    bunqCLI.monetaryAccounts.forEach((monetaryAccount: MonetaryAccount) => {
        const prettyBalance = formatMoney(monetaryAccount.balance.value);

        const ibanAlias = monetaryAccount.alias.find((alias: CounterpartyAlias) => {
            return alias.type === "IBAN";
        });

        const accountColumn = chalk.cyan(monetaryAccount.description).padEnd(30, " ");
        const balanceColumn = prettyBalance.padStart(10, " ");
        const ibanColumn = formatIban(ibanAlias.value).padStart(20, " ");

        writeLine(`${accountColumn}${balanceColumn}  ${ibanColumn}`);
        monetaryAccount.alias.forEach((alias: CounterpartyAlias) => {
            if (alias.type === "IBAN") return;
            let prettyAliasType = alias.type;
            if (alias.type === "PHONE_NUMBER") prettyAliasType = "Phone number";
            if (alias.type === "EMAIL") prettyAliasType = "Email";

            writeLine(`${"".padEnd(2, " ")}${prettyAliasType.padEnd(30, " ")}${alias.value}`);
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
ViewMonetaryAccountsAction.type = "INTERACTIVE";

export default ViewMonetaryAccountsAction;
