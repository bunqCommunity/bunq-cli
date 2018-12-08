const UrlCommand = require("./Commands/Url");
const UserCommand = require("./Commands/User");
const EventsCommand = require("./Commands/Events");
const AccountsCommand = require("./Commands/Accounts");

const { BunqCLIError } = require("../../Errors");

module.exports = async bunqCLI => {
    const argv = bunqCLI.argv;
    const bunqJSClient = bunqCLI.bunqJSClient;
    const saveData = bunqCLI.saveData;
    const storage = bunqCLI.storage;

    const storedApiKey = saveData === false ? false : storage.get("API_KEY");
    const storedEnvironment = saveData === false ? false : storage.get("ENVIRONMENT");
    const storedEncryptionKey = saveData === false ? false : storage.get("ENCRYPTION_KEY");
    const storedDeviceName = saveData === false ? false : storage.get("DEVICE_NAME");

    let API_KEY = argv.apiKey || storedApiKey;
    if (API_KEY === "generate") {
        API_KEY = await bunqJSClient.api.sandboxUser.post();
    }
    const ENVIRONMENT = argv.environment || storedEnvironment || "SANDBOX";
    const ENCRYPTION_KEY = argv.encryptionKey || storedEncryptionKey || randomHex(32);
    const DEVICE_NAME = argv.deviceName || storedDeviceName || "My bunq-cli device";

    if (!API_KEY) throw new Error("No API key set as --api-key option or BUNQ_CLI_API_KEY environment");

    // check input values
    if (saveData) storage.set("ENVIRONMENT", ENVIRONMENT);
    if (saveData) storage.set("DEVICE_NAME", DEVICE_NAME);
    if (saveData) storage.set("ENCRYPTION_KEY", ENCRYPTION_KEY);

    if (saveData) {
        // only store sandbox keys
        if (ENVIRONMENT === "SANDBOX" && API_KEY.startsWith("sandbox")) {
            storage.set("API_KEY", API_KEY);
        } else {
            // remove api key/encryption from storage if environment isn't production
            storage.remove("API_KEY");
            storage.remove("ENCRYPTION_KEY");
        }
    }

    // setup the bunqJSClient
    await bunqJSClient.run(API_KEY, [], ENVIRONMENT, ENCRYPTION_KEY);
    bunqJSClient.setKeepAlive(false);
    await bunqJSClient.install();
    await bunqJSClient.registerDevice(DEVICE_NAME);
    await bunqJSClient.registerSession();

    if (argv.user) {
        return UserCommand(bunqCLI);
    }

    if (argv.accounts) {
        return AccountsCommand(bunqCLI);
    }

    if (argv.events) {
        return EventsCommand(bunqCLI);
    }

    if (argv.endpoint) {
        throw new BunqCLIError("Not implemented yet");
    }

    if (argv.url) {
        return UrlCommand(bunqCLI);
        throw new BunqCLIError("Not implemented yet");
    }

    throw new BunqCLIError("No command given");
};
