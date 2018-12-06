module.exports = async bunqCLI => {
    if (!bunqCLI.monetaryAccounts) await bunqCLI.getMonetaryAccounts();

    bunqCLI.outputHandler(bunqCLI.monetaryAccounts);
};
