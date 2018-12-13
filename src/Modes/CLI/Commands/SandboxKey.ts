export default async bunqCLI => {
    const apiKey = await bunqCLI.bunqJSClient.api.sandboxUser.post();

    bunqCLI.outputHandler(apiKey, "RAW");
};
