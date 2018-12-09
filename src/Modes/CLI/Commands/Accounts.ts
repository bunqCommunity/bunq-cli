export default async bunqCLI => {
    if (!bunqCLI.monetaryAccounts) await bunqCLI.getMonetaryAccounts();

    bunqCLI.outputHandler(bunqCLI.monetaryAccounts);
};
