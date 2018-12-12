export default async bunqCLI => {
    if (!bunqCLI.hasMonetaryAccounts) await bunqCLI.getMonetaryAccounts(true);

    bunqCLI.outputHandler(bunqCLI.monetaryAccounts);
};
