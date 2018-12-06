const chalk = require("chalk");

const useExistingApiKeyPrompt = require("../../../Prompts/use_existing_api_key");
const apiKeyPrompt = require("../../../Prompts/api_key");
const environmentPrompt = require("../../../Prompts/environment_prompt");
const deviceNamePrompt = require("../../../Prompts/device_name");
const encryptionKeyPrompt = require("../../../Prompts/encryption_key");

const { write, writeLine, clearConsole } = require("../../../Utils");

module.exports = async interactiveData => {
    writeLine(chalk.blue(`Setting up bunqJSClient`));

    const bunqJSClient = interactiveData.bunqJSClient;
    const saveData = interactiveData.saveData;
    const storage = interactiveData.storage;

    const storedApiKey = saveData === false ? false : storage.get("API_KEY");
    const storedEnvironment = saveData === false ? false : storage.get("ENVIRONMENT");
    const storedEncryptionKey = saveData === false ? false : storage.get("ENCRYPTION_KEY");
    const storedDeviceName = saveData === false ? false : storage.get("DEVICE_NAME");

    let API_KEY = process.env.API_KEY || storedApiKey;
    let ENVIRONMENT = process.env.ENVIRONMENT || storedEnvironment;
    let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || storedEncryptionKey;
    let DEVICE_NAME = process.env.DEVICE_NAME || storedDeviceName;

    if (API_KEY) {
        const useKey = await useExistingApiKeyPrompt();
        if (!useKey) API_KEY = "";
    }

    // check input values
    if (!ENVIRONMENT) ENVIRONMENT = await environmentPrompt(ENVIRONMENT);
    if (saveData) storage.set("ENVIRONMENT", ENVIRONMENT);

    if (!DEVICE_NAME) DEVICE_NAME = await deviceNamePrompt(DEVICE_NAME);
    if (saveData) storage.set("DEVICE_NAME", DEVICE_NAME);

    if (!ENCRYPTION_KEY) ENCRYPTION_KEY = await encryptionKeyPrompt(ENCRYPTION_KEY);
    if (saveData) storage.set("ENCRYPTION_KEY", ENCRYPTION_KEY);

    if (!API_KEY) API_KEY = await apiKeyPrompt(bunqJSClient);
    if (saveData) storage.set("API_KEY", API_KEY);

    const apiKeyPreview = ENVIRONMENT === "SANDBOX" ? API_KEY.substr(0, 16) : API_KEY.substr(0, 8);
    writeLine(`API Key starts with: ${chalk.cyan(apiKeyPreview)}`);
    writeLine(`Environment: ${chalk.cyan(ENVIRONMENT)}`);
    writeLine(`Device name: ${chalk.cyan(DEVICE_NAME)}`);
    writeLine(`Encryption key starts with: ${chalk.cyan(ENCRYPTION_KEY.substr(0, 8))}\n`);

    write(chalk.yellow("Setting up the bunqJSClient [0/4] -> running client"));

    await bunqJSClient.run(API_KEY, [], ENVIRONMENT, ENCRYPTION_KEY);
    bunqJSClient.setKeepAlive(false);
    write(chalk.yellow("Setting up the bunqJSClient [1/4] -> installation"));

    await bunqJSClient.install();
    write(chalk.yellow("Setting up the bunqJSClient [2/4] -> device registration"));

    await bunqJSClient.registerDevice(DEVICE_NAME);
    write(chalk.yellow("Setting up the bunqJSClient [3/4] -> session registration"));

    await bunqJSClient.registerSession();
    writeLine(chalk.green("Finished setting up the bunqJSClient"));

    write(chalk.yellow("Fetching users list ..."));
    const users = await bunqJSClient.getUsers(true);
    interactiveData.userType = Object.keys(users)[0];
    interactiveData.user = users[interactiveData.userType];
    writeLine(chalk.green(`Fetched a ${interactiveData.userType} account.`));

    write(chalk.yellow("Fetching monetary accounts ..."));
    interactiveData.monetaryAccounts = await bunqJSClient.api.monetaryAccount.list(interactiveData.user.id);
    writeLine(chalk.green(`Fetched ${interactiveData.monetaryAccounts.length} monetary accounts.\n`));

    writeLine("\n" + chalk.cyan("Finished setting up bunqJSClient."));
};
