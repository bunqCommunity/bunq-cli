import BunqCLI from "../../../BunqCLI";

export default async (bunqCLI: BunqCLI) => {
    if (!bunqCLI.hasMonetaryAccounts) await bunqCLI.getMonetaryAccounts(true);

    bunqCLI.outputHandler(bunqCLI.monetaryAccountsRaw);
};
