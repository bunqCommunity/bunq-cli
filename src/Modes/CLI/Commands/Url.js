const { BunqCLIError } = require("../../../Errors");

const FilterParser = require("../../../InputHandlers/FilterParser");
const UrlParser = require("../../../InputHandlers/UrlParser");
const DataParser = require("../../../InputHandlers/DataParser");
const MethodParser = require("../../../InputHandlers/MethodParser");

module.exports = async bunqCLI => {
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
