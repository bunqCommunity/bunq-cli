const FilterParser = require("../../../InputHandlers/FilterParser");

module.exports = async bunqCLI => {
    const bunqJSClient = bunqCLI.bunqJSClient;

    if (!bunqCLI.user) await bunqCLI.getUser();

    const requestOptions = FilterParser(bunqCLI);
    bunqCLI.apiData.events = await bunqJSClient.api.event.list(bunqCLI.user.id, requestOptions);

    bunqCLI.outputHandler(bunqCLI.apiData.events);
};
