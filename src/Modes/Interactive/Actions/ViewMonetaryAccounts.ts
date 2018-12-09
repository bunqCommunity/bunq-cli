import chalk from "chalk";
import BunqCLI from "../../../BunqCLI";
import MonetaryAccount from "../../../Types/MonetaryAccount";
import CounterpartyAlias from "@bunq-community/bunq-js-client/dist/Types/CounterpartyAlias";

import { writeLine, formatMoney, formatIban } from "../../../Utils";

export default async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`View your monetary accounts`));
    writeLine("");

    const spacerString = chalk.gray("".padEnd(60, "─"));

    const accountText = chalk.cyan("Account") + "";
    const balanceText = chalk.gray(" Balance") + "";
    const ibanText = chalk.gray(" IBAN") + "";
    const accountColumnText = accountText.padEnd(30, " ");
    const balanceColumnText = balanceText.padStart(20, " ");
    const ibanColumnText = ibanText.padEnd(15, " ");

    const headerTemplate = `${accountColumnText}${balanceColumnText}${ibanColumnText}`;
    writeLine(headerTemplate);
    writeLine(spacerString);

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

        writeLine(spacerString);
    });
    writeLine("");
};
