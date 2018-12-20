import chalk from "chalk";
import BunqCLI from "../../BunqCLI";
import { InteractiveBunqCLIModule } from "../../Types/BunqCLIModule";
import CounterpartyAlias from "@bunq-community/bunq-js-client/dist/Types/CounterpartyAlias";

import { formatIban, writeLine } from "../../Utils";

const basicLine = (key, value) => {
    let leftString = key.padEnd(20, " ");
    writeLine(chalk.blue(leftString) + chalk.cyan(value));
};

const handle = async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`View your user info`));
    writeLine("");

    const userInfo = await bunqCLI.getUser(true);

    writeLine("");
    console.dir(userInfo, { depth: null });
    writeLine("");
    writeLine("");
    writeLine("");

    const spacerString = "".padEnd(40, "─");
    const whiteSpacer = chalk.gray(spacerString);
    const graySpacer = chalk.gray(spacerString);

    basicLine(userInfo.display_name, `ID: ${userInfo.id}`);
    writeLine(graySpacer);

    writeLine(chalk.blue("Aliasses"));
    userInfo.alias.forEach((alias: CounterpartyAlias) => {
        let prettyAliasType = alias.type;
        if (alias.type === "IBAN") prettyAliasType = `🏦   ${formatIban(alias.value)}`;
        if (alias.type === "PHONE_NUMBER") prettyAliasType = `📱   ${alias.value}`;
        if (alias.type === "EMAIL") prettyAliasType = `✉️   ${alias.value}`;

        writeLine(`  ${prettyAliasType}`);
    });

    writeLine(whiteSpacer);

    basicLine("Public nick name", userInfo.public_nick_name);

    writeLine(graySpacer);
    writeLine("");
};

const ViewUserAction = new InteractiveBunqCLIModule();
ViewUserAction.id = "view-user-action";
ViewUserAction.message = "View your user info";
ViewUserAction.handle = handle;
ViewUserAction.visibility = "AUTHENTICATED";

export default ViewUserAction;
