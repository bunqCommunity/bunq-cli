import { CommandLineBunqCLIModule } from "../Types/BunqCLIModule";
import BunqCLIError from "../Errors";
import { randomHex } from "../Utils";

import AccountsCommand from "../Modules/CLI/AccountsCommand";
import EndpointCommand from "../Modules/CLI/EndpointCommand";
import EventsCommand from "../Modules/CLI/EventsCommand";
import SandboxKeyCommand from "../Modules/CLI/SandboxKeyCommand";
import UrlCommand from "../Modules/CLI/UrlCommand";
import UserCommand from "../Modules/CLI/UserCommand";

export default async bunqCLI => {
    const argv = bunqCLI.argv;
    const bunqJSClient = bunqCLI.bunqJSClient;
    const saveData = bunqCLI.saveData;
    const storage = bunqCLI.storage;
    const subCommand = bunqCLI.cliCommands[0];

    // register the modules in order
    bunqCLI.modules.push(AccountsCommand);
    bunqCLI.modules.push(EndpointCommand);
    bunqCLI.modules.push(EventsCommand);
    bunqCLI.modules.push(SandboxKeyCommand);
    bunqCLI.modules.push(UrlCommand);
    bunqCLI.modules.push(UserCommand);

    // filter out commands for the given sub command
    const foundCommand: CommandLineBunqCLIModule | null = bunqCLI.modules.find((module: CommandLineBunqCLIModule) => {
        return module.command === subCommand;
    });

    if (!foundCommand) throw new BunqCLIError("No command given");

    // run the command without setting up authentication first
    if (foundCommand.unauthenticated) {
        return foundCommand.handle(bunqCLI);
    }

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
    if (!API_KEY) throw new Error("No API key set as --api-key option or BUNQ_CLI_API_KEY environment value");

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

    // run the actual command after authentication
    return foundCommand.handle(bunqCLI);
};
