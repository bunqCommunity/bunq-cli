import BunqCLIError from "../../../Errors";

import FilterParser from "../../../InputHandlers/FilterParser";
import UrlParser from "../../../InputHandlers/UrlParser";
import DataParser from "../../../InputHandlers/DataParser";
import MethodParser from "../../../InputHandlers/MethodParser";

export default async bunqCLI => {
    const bunqJSClient = bunqCLI.bunqJSClient;
    const argv = bunqCLI.argv;

    await bunqCLI.getUser();
    await bunqCLI.getMonetaryAccounts();

    const parsedMethod = MethodParser(argv.method, bunqCLI);
    const method = parsedMethod === "LIST" ? "GET" : parsedMethod;
    const data = DataParser(argv.data, bunqCLI);
    const url = UrlParser(argv.url, bunqCLI);
    const params = FilterParser(bunqCLI);

    const result = await bunqJSClient.ApiAdapter.request(
        url,
        method,
        data,
        {},
        {
            params: params
        }
    );

    bunqCLI.outputHandler(result.data);
};
