module.exports = async bunqCLI => {
    const bunqJSClient = bunqCLI.bunqJSClient;

    if (!bunqCLI.user) await bunqCLI.getUser();

    const requestOptions = bunqCLI.parseRequestOptions();
    bunqCLI.apiData.events = await bunqJSClient.api.event.list(bunqCLI.user.id, requestOptions);

    bunqCLI.outputHandler(bunqCLI.apiData.events);
};
