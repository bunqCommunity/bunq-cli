import UrlCommand from "./Commands/Url";
import UserCommand from "./Commands/User";
import EventsCommand from "./Commands/Events";
import AccountsCommand from "./Commands/Accounts";
import EndpointCommand from "./Commands/Endpoint";

import BunqCLIError from "../../Errors";
import { randomHex } from "../../Utils";

export default async bunqCLI => {
    const argv = bunqCLI.argv;
    const bunqJSClient = bunqCLI.bunqJSClient;
    const saveData = bunqCLI.saveData;
    const storage = bunqCLI.storage;

    // attempt to get stored data if saveData is true
    let API_KEY = saveData === false ? false : storage.get("API_KEY");
    let ENVIRONMENT = saveData === false ? false : storage.get("ENVIRONMENT");
    let ENCRYPTION_KEY = saveData === false ? false : storage.get("ENCRYPTION_KEY");
    let DEVICE_NAME = saveData === false ? false : storage.get("DEVICE_NAME");

    // if overwrite or no API key set
    if (argv.overwrite || !API_KEY) {
        if (argv.apiKey) API_KEY = argv.apiKey;
        if (argv.environment) ENVIRONMENT = argv.environment;
        if (argv.encryptionKey) ENCRYPTION_KEY = argv.encryptionKey;
        if (argv.deviceName) DEVICE_NAME = argv.deviceName;
    }

    if (!ENCRYPTION_KEY) {
        ENCRYPTION_KEY = randomHex(32);
    }

    // get argument > stored value > default
    if (API_KEY === "generate" && DEVICE_NAME === "SANDBOX") {
        API_KEY = await bunqJSClient.api.sandboxUser.post();
    }

    // final fallback in case no key is set
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

    switch (bunqCLI.cliCommands[0]) {
        case "user":
            return UserCommand(bunqCLI);
        case "accounts":
            return AccountsCommand(bunqCLI);
        case "events":
            return EventsCommand(bunqCLI);
        case "endpoint":
            return EndpointCommand(bunqCLI);
        case "url":
            return UrlCommand(bunqCLI);
    }

    throw new BunqCLIError("No command given");
};
