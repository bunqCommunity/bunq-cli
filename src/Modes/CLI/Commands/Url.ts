import BunqCLI from "../../../BunqCLI";

import FilterParser from "../../../InputHandlers/FilterParser";
import UrlParser from "../../../InputHandlers/UrlParser";
import DataParser from "../../../InputHandlers/DataParser";
import MethodParser from "../../../InputHandlers/MethodParser";

export default async (bunqCLI: BunqCLI) => {
    const bunqJSClient = bunqCLI.bunqJSClient;
    const argv = bunqCLI.argv;

    await bunqCLI.getUser(true);
    await bunqCLI.getMonetaryAccounts(true);

    const parsedMethod = MethodParser(argv.method, bunqCLI);
    const method = parsedMethod === "LIST" ? "GET" : parsedMethod;
    const urlInput = bunqCLI.cliCommands[1];
    const data = DataParser(argv.data, bunqCLI);
    const url = UrlParser(urlInput, bunqCLI);
    const params = FilterParser(bunqCLI);

    const result = await bunqJSClient.ApiAdapter.request(
        url,
        method,
        data,
        {},
        {
            axiosOptions: {
                params: params
            }
        }
    );

    bunqCLI.outputHandler(result.data);
};
