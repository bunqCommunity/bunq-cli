const { BunqCLIError } = require("../Errors");

module.exports = (url, bunqCLI) => {
    if (typeof url !== "string") {
        throw new BunqCLIError("Invalid url given, not of type 'string'");
    }

    // url = url.replace("UserID", bunqCLI.user.id);
    url = url.replace("UserID", 6519);
    url = url.replace("UserId", 6519);

    // attempt to find an account matching the given account description
    const accountDescriptionMatches = url.match(/Account=([\w]*)/);
    if (accountDescriptionMatches) {
        const fullMatchString = accountDescriptionMatches[0];
        const accountDescription = accountDescriptionMatches[1];

        // attempt to find an account matching the account description
        const matchedAccount = bunqCLI.monetaryAccounts.find(monetaryAccount => {
            const accountType = Object.keys(monetaryAccount)[0];
            return monetaryAccount[accountType] === accountDescription;
        });

        if (!matchedAccount) {
            throw new BunqCLIError(
                `Invalid url given, no account found with description '${accountDescriptionMatches[1]}'`
            );
        }

        const accountType = Object.keys(matchedAccount)[0];
        const accountInfo = matchedAccount[accountType];

        // replace the entire section with the matched account ID
        url = url.replace(fullMatchString, accountInfo.id);
    }

    const accountType = Object.keys(bunqCLI.monetaryAccounts[0])[0];
    const firstAccount = bunqCLI.monetaryAccounts[0][accountType];

    // generic AccountID replace for the first monetary account
    url = url.replace("AccountID", firstAccount.id);
    url = url.replace("AccountId", firstAccount.id);

    // fix double slashes in path
    url = url.replace("//", "/");

    return url;
};
