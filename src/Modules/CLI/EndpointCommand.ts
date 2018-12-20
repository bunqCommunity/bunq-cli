import BunqCLI from "../../BunqCLI";
import BunqCLIError from "../../Types/Errors";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

import FilterParser from "../../InputHandlers/FilterParser";
import MethodParser from "../../InputHandlers/MethodParser";

import EndpointUrlYargsHelper from "../../Yargs/EndpointUrlYargsHelper";

const handle = async (bunqCLI: BunqCLI) => {
    const bunqJSClient = bunqCLI.bunqJSClient;
    const argv = bunqCLI.argv;

    // always get the user info
    await bunqCLI.getUser();

    const params = FilterParser(bunqCLI);
    const method = MethodParser(argv.method, bunqCLI);
    const lowerCaseMethod = method.toLowerCase();
    let accountId: number | false = false;
    const eventId = argv.eventId || false;
    const endpoint = bunqCLI.cliCommands[1];

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

    if (typeof bunqJSClient.api[endpoint] === "undefined") {
        throw new BunqCLIError(`Endpoint (${endpoint}) not found or unsupported`);
    }
    if (typeof bunqJSClient.api[endpoint][lowerCaseMethod] === "undefined") {
        throw new BunqCLIError(
            `The method (${lowerCaseMethod}) for this endpoint (${endpoint}) not found or unsupported`
        );
    }

    const requestParameters = [];
    if (bunqCLI.user.id) requestParameters.push(bunqCLI.user.id);
    if (accountId) requestParameters.push(accountId);
    if (eventId) requestParameters.push(eventId);

    // get the expected argument count, optional arguments aren't counted!
    const argumentCount = bunqJSClient.api[endpoint][lowerCaseMethod].length;

    // check if the length is correc
    if (requestParameters.length !== argumentCount) {
        throw new BunqCLIError(
            `Invalid amount of arguments given, received ${
                requestParameters.length
            } and expected ${argumentCount}.\nDid you forget the --account/--account-id or --event-id argument?`
        );
    }

    // now add the optional parameters
    requestParameters.push(params);

    // call the actual endpoint
    let apiResult = await bunqJSClient.api[endpoint][lowerCaseMethod](...requestParameters);

    // store the data in memory
    if (!bunqCLI.apiData[endpoint]) bunqCLI.apiData[endpoint] = {};
    if (!bunqCLI.apiData[endpoint][method]) bunqCLI.apiData[endpoint][method] = {};
    bunqCLI.apiData[endpoint][method] = apiResult;

    // output the results
    bunqCLI.outputHandler(apiResult);
};

const EndpointCommand = new CommandLineBunqCLIModule();
EndpointCommand.command = "endpoint";
EndpointCommand.message = "Call an API endpoint";
EndpointCommand.handle = handle;
EndpointCommand.yargsAdvanced = yargsInner => {
    // run the helper function
    return EndpointUrlYargsHelper(EndpointCommand)(yargsInner);
};

export default EndpointCommand;
