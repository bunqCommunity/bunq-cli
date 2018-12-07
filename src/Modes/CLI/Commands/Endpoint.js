module.exports = async bunqCLI => {
    if (!bunqCLI.user) await bunqCLI.getUser();
    if (!bunqCLI.monetaryAccounts) await bunqCLI.getMonetaryAccounts();

    const requestOptions = {
        count: 200
    };
    if (argv.count) requestOptions.count = argv.count;
    if (argv.older_id) requestOptions.older_id = argv.older_id;
    if (argv.newer_id) requestOptions.newer_id = argv.newer_id;

    if (typeof bunqJSClient.api[argv.endpoint] === "undefined")
        throw new Error("Endpoint not found or unsupported");

    bunqCLI.apiData.events = await bunqJSClient.api.event.list(bunqCLI.user.id, requestOptions);

    bunqCLI.outputHandler(bunqCLI.apiData.events);
};
