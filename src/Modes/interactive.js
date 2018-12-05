const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const package = require("../../package.json");

const getEndpoints = require("../getEndpoints");
const CustomStore = require("../customStore");

const apiKeyPrompt = require("../Prompts/api_key");
const environmentPrompt = require("../Prompts/environment_prompt");
const deviceNamePrompt = require("../Prompts/device_name");
const encryptionKeyPrompt = require("../Prompts/encryption_key");
const endpointsPrompt = require("../Prompts/endpoints");
const monetaryAccountIdPrompt = require("../Prompts/monetary_account_id");

const writeLine = input => {
    write(input);
    process.stdout.write("\n");
};
const write = input => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(input);
};
const clearConsole = () => console.log("\033[2J");

module.exports = async () => {
    clearConsole();
    writeLine(chalk.blue(`bunq-cli v${package.version} - interactive mode`));

    // empty = default location, string = custom location, false/undefined = memory only
    const storageLocation = argv.output ? argv.output : path.join(process.cwd(), "bunq-cli-storage.json");

    const customStore = CustomStore(storageLocation);
    const bunqJSClient = new BunqJSClient(customStore);
    writeLine(`Storing data at ${chalk.cyan(storageLocation)}`);

    // gather a list of endpoints the user can choose from
    const endpoints = getEndpoints(bunqJSClient);

    const storedApiKey = customStore.get("API_KEY");
    const storedEnvironment = customStore.get("ENVIRONMENT");
    const storedEncryptionKey = customStore.get("ENCRYPTION_KEY");
    const storedDeviceName = customStore.get("DEVICE_NAME");

    let API_KEY = process.env.API_KEY || storedApiKey;
    let ENVIRONMENT = process.env.ENVIRONMENT || storedEnvironment;
    let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || storedEncryptionKey;
    let DEVICE_NAME = process.env.DEVICE_NAME || storedDeviceName;

    // check input values
    if (!API_KEY) API_KEY = await apiKeyPrompt(bunqJSClient);
    if (!ENVIRONMENT) ENVIRONMENT = await environmentPrompt();
    if (!DEVICE_NAME) DEVICE_NAME = await deviceNamePrompt();
    if (!ENCRYPTION_KEY) ENCRYPTION_KEY = await encryptionKeyPrompt();

    customStore.set("API_KEY", API_KEY);
    customStore.set("ENVIRONMENT", ENVIRONMENT);
    customStore.set("ENCRYPTION_KEY", ENCRYPTION_KEY);
    customStore.set("DEVICE_NAME", DEVICE_NAME);

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
    const userType = Object.keys(users)[0];
    const user = users[userType];
    writeLine(chalk.green(`Fetched a ${userType} account.`));

    write(chalk.yellow("Fetching monetary accounts ..."));
    const monetaryAccounts = await bunqJSClient.api.monetaryAccount.list(user.id);
    writeLine(chalk.green(`Fetched ${monetaryAccounts.length} monetary accounts.\n`));

    // get the endpoint the user wants to use
    const endpoint = await endpointsPrompt(endpoints);

    // get the monetary account the user wants to use
    const accountId = await monetaryAccountIdPrompt(monetaryAccounts);

    write(chalk.yellow(`Fetching data from the ${endpoint} endpoint user: ${user.id} and account: ${accountId}`));
    // call the endpoint with the user ID and account ID
    const result = await endpoints[endpoint](user.id, accountId);
    writeLine(chalk.green(`${result.length} results for the ${endpoint} endpoint.`));

    writeLine("\n" + chalk.cyan("Finished."));
};
