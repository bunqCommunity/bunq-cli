import BunqCLIError from "../Errors";

export default (url, bunqCLI) => {
    if (typeof url !== "string") {
        throw new BunqCLIError("Invalid url given, not of type 'string'");
    }

    url = url.replace("UserID", bunqCLI.user.id);

    // attempt to find an account matching the given account description
    const accountDescriptionMatches = url.match(/Account=([\w]*)/);
    if (accountDescriptionMatches) {
        const fullMatchString = accountDescriptionMatches[0];
        const accountDescription = accountDescriptionMatches[1];

        // attempt to find an account matching the account description
        const matchedAccount = bunqCLI.monetaryAccounts.find(monetaryAccount => {
            return monetaryAccount.description === accountDescription;
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


    // generic AccountID replace for the first monetary account
    const firstAccount = bunqCLI.monetaryAccounts[0];
    url = url.replace("AccountID", firstAccount.id);
    url = url.replace("AccountId", firstAccount.id);

    // fix double slashes in path
    url = url.replace("//", "/");

    return url;
};
