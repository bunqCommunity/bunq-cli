import BunqCLI from "../../BunqCLI";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

const handle = async (bunqCLI: BunqCLI) => {
    if (!bunqCLI.hasMonetaryAccounts) await bunqCLI.getMonetaryAccounts(true);

    bunqCLI.outputHandler(bunqCLI.monetaryAccountsRaw);
};

const AccountsCommand = new CommandLineBunqCLIModule();
AccountsCommand.command = "accounts";
AccountsCommand.message = "Fetches all monetary accounts for the current User";
AccountsCommand.handle = handle;
AccountsCommand.yargs = yargs => {
    yargs.command(AccountsCommand.command, AccountsCommand.message);
    yargs.example("bunq-cli accounts", "Outputs the monetary accounts into the console");
};

export default AccountsCommand;
