import BunqCLIError from "../../../Errors";

import FilterParser from "../../../InputHandlers/FilterParser";
import MethodParser from "../../../InputHandlers/MethodParser";

export default async bunqCLI => {
    const bunqJSClient = bunqCLI.bunqJSClient;
    const argv = bunqCLI.argv;

    // always get the user info
    await bunqCLI.getUser();

    const params = FilterParser(bunqCLI);
    const method = MethodParser(argv.method, bunqCLI);
    const lowerCaseMethod = method.toLowerCase();
    let accountId = false;
    const eventId = argv.eventId || false;

    if (argv.account || argv.accountId) {
        // get the latest account list
        await bunqCLI.getMonetaryAccounts(true);

        bunqCLI.monetaryAccounts.forEach(account => {
            if (argv.accountId && account.id === parseFloat(argv.accountId)) {
                accountId = account.id;
            }
            if (argv.account && account.description === argv.account) {
                accountId = account.id;
            }
        });
        if (!accountId) {
            throw new BunqCLIError(`No account found for the given account description/ID`);
        }
    }

    if (typeof bunqJSClient.api[argv.endpoint] === "undefined") {
        throw new BunqCLIError(`Endpoint (${argv.endpoint}) not found or unsupported`);
    }
    if (typeof bunqJSClient.api[argv.endpoint][lowerCaseMethod] === "undefined") {
        throw new BunqCLIError(
            `The method (${lowerCaseMethod}) for this endpoint (${argv.endpoint}) not found or unsupported`
        );
    }

    const requestParameters = [];
    if (bunqCLI.user.id) requestParameters.push(bunqCLI.user.id);
    if (accountId) requestParameters.push(accountId);
    if (eventId) requestParameters.push(eventId);

    // get the expected argument count, optional arguments aren't counted!
    const argumentCount = bunqJSClient.api[argv.endpoint][lowerCaseMethod].length;

    // check if the length is correc
    if (requestParameters.length !== argumentCount) {
        throw new BunqCLIError(
            `Invalid amount of arguments given, received ${
                requestParameters.length
            } and expected ${argumentCount}. Did you forget toe accountId or eventId argument?`
        );
    }

    // now add the optional parameters
    requestParameters.push(params);

    // call the actual endpoint
    let apiResult = await bunqJSClient.api[argv.endpoint][lowerCaseMethod](...requestParameters);

    // store the data in memory
    if (!bunqCLI.apiData[argv.endpoint]) bunqCLI.apiData[argv.endpoint] = {};
    if (!bunqCLI.apiData[argv.endpoint][method]) bunqCLI.apiData[argv.endpoint][method] = {};
    bunqCLI.apiData[argv.endpoint][method] = apiResult;

    // output the results
    bunqCLI.outputHandler(apiResult);
};
