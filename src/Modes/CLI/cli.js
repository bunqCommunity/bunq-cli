const chalk = require("chalk");
const UserCommand = require("./Commands/User");
const EventsCommand = require("./Commands/Events");
const AccountsCommand = require("./Commands/Accounts");

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

    bunqCLI.getUser = async () => {
        const users = await bunqJSClient.getUsers(true);
        bunqCLI.userType = Object.keys(users)[0];
        bunqCLI.user = users[bunqCLI.userType];
    };
    bunqCLI.getMonetaryAccounts = async () => {
        bunqCLI.monetaryAccounts = await bunqJSClient.api.monetaryAccount.list(bunqCLI.user.id);
    };

    bunqCLI.parseRequestOptions = () => {
        const requestOptions = {
            count: 200
        };
        if (argv.count) requestOptions.count = argv.count;
        if (argv.older_id) requestOptions.older_id = argv.older_id;
        if (argv.newer_id) requestOptions.newer_id = argv.newer_id;

        return requestOptions;
    };

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
        console.log(chalk.red("Not implemented yet"));
        return;
    }

    // exclude all unused/excluded arguments for debug purposes
    // const { save, cli, $0, _, output, outputLocation, ...otherArguments } = argv;
    // console.log(otherArguments);
};
