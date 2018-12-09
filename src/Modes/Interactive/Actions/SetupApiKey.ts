import chalk from "chalk";
import BunqCLI from "../../../BunqCLI";

import useExistingApiKeyPrompt from "../Prompts/api_key_use_existing";
import apiKeyPrompt from "../Prompts/api_key";
import environmentPrompt from "../Prompts/api_environment";
import deviceNamePrompt from "../Prompts/api_device_name";
import encryptionKeyPrompt from "../Prompts/api_encryption_key";

import { write, writeLine } from "../../../Utils";

export default async (bunqCLI:BunqCLI , skipExistingQuestion = false) => {
    writeLine(chalk.blue(`Setting up bunqJSClient`));
    writeLine("");

    const bunqJSClient = bunqCLI.bunqJSClient;
    const saveData = bunqCLI.saveData;
    const storage = bunqCLI.storage;
    const argv = bunqCLI.argv;

    const storedApiKey = saveData === false ? false : storage.get("API_KEY");
    const storedEnvironment = saveData === false ? false : storage.get("ENVIRONMENT");
    const storedEncryptionKey = saveData === false ? false : storage.get("ENCRYPTION_KEY");
    const storedDeviceName = saveData === false ? false : storage.get("DEVICE_NAME");

    let API_KEY = argv.apiKey || storedApiKey;
    let ENVIRONMENT = argv.environment || storedEnvironment;
    let ENCRYPTION_KEY = argv.encryptionKey || storedEncryptionKey;
    let DEVICE_NAME = argv.deviceName || storedDeviceName;

    if (!skipExistingQuestion) {
        let newKeyWasSet = false;
        if (API_KEY) {
            const useKey = await useExistingApiKeyPrompt();
            if (useKey === "new") {
                API_KEY = await apiKeyPrompt(bunqJSClient);
                newKeyWasSet = true;
            }
        } else {
            API_KEY = await apiKeyPrompt(bunqJSClient);
            newKeyWasSet = true;
        }

        // check input values
        if (!ENVIRONMENT || newKeyWasSet) ENVIRONMENT = await environmentPrompt(ENVIRONMENT);
        if (saveData) storage.set("ENVIRONMENT", ENVIRONMENT);

        if (!DEVICE_NAME || newKeyWasSet) DEVICE_NAME = await deviceNamePrompt(DEVICE_NAME);
        if (saveData) storage.set("DEVICE_NAME", DEVICE_NAME);

        if (!ENCRYPTION_KEY || newKeyWasSet) ENCRYPTION_KEY = await encryptionKeyPrompt(ENCRYPTION_KEY);
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
    }

    if (API_KEY) {
        const apiKeyPreview = ENVIRONMENT === "SANDBOX" ? API_KEY.substr(0, 16) : API_KEY.substr(0, 8);
        writeLine(`API Key starts with: ${chalk.cyan(apiKeyPreview)}`);
        writeLine(`Environment: ${chalk.cyan(ENVIRONMENT)}`);
        writeLine(`Device name: ${chalk.cyan(DEVICE_NAME)}`);
        writeLine(`Encryption key starts with: ${chalk.cyan(ENCRYPTION_KEY.substr(0, 8))}\n`);

        write(chalk.yellow("Setting up the bunqJSClient [0/4] -> running client"));

        // enable wildcard in sandbox mode
        const PERMITTED_IPS = [];
        if (ENVIRONMENT === "SANDBOX") {
            PERMITTED_IPS.push("*");
        }

        await bunqJSClient.run(API_KEY, PERMITTED_IPS, ENVIRONMENT, ENCRYPTION_KEY);
        bunqJSClient.setKeepAlive(false);
        write(chalk.yellow("Setting up the bunqJSClient [1/4] -> installation"));

        await bunqJSClient.install();
        write(chalk.yellow("Setting up the bunqJSClient [2/4] -> device registration"));

        await bunqJSClient.registerDevice(DEVICE_NAME);
        write(chalk.yellow("Setting up the bunqJSClient [3/4] -> session registration"));

        await bunqJSClient.registerSession();
        writeLine(chalk.green("Finished setting up bunqJSClient."));
        writeLine("");

        await bunqCLI.getUser(true);
        await bunqCLI.getMonetaryAccounts(true);

        writeLine("");
    }
};
