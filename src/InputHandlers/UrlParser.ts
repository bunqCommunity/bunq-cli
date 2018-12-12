import BunqCLIError from "../Errors";
import BunqCLI from "../BunqCLI";

export default (url, bunqCLI: BunqCLI) => {
    if (typeof url !== "string") {
        throw new BunqCLIError("Invalid url given, not of type 'string'");
    }

    url = url.replace("UserID", bunqCLI.user.id);
    url = url.replace("UserId", bunqCLI.user.id);

    // attempt to find an account matching the given account description
    const accountDescriptionMatches = url.match(/Account='?([\w ]*)'?[\/|\z]?/);

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

        // replace the entire section with the matched account ID
        url = url.replace(fullMatchString, matchedAccount.id);
    }

    // fix double slashes in path
    url = url.replace("//", "/");

    // append v1 to url if possible
    if (url.startsWith("/") && !url.startsWith("/v1")) url = `/v1${url}`;

    return url;
};
