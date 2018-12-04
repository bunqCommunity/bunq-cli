const path = require("path");
const chalk = require("chalk");
const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const package = require("../package.json");

const CustomStore = require("./custom_store");
const apiKeyPrompt = require("./Prompts/api_key");
const environmentPrompt = require("./Prompts/environment_prompt");
const deviceNamePrompt = require("./Prompts/device_name");
const encryptionKeyPrompt = require("./Prompts/encryption_key");
const endpointsPrompt = require("./Prompts/endpoints");
const monetaryAccountIdPrompt = require("./Prompts/monetary_account_id");

const defaultErrorHandler = error => {
    if (error.response) {
        throw error.response.data;
    }
    throw error;
};

const writeLine = (input, clearLine = false) => {
    if (clearLine) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    } else {
        process.stdout.write("\n");
    }
    process.stdout.write(input);
};

module.exports = async () => {
    console.log(chalk.blue(`bunq-cli v${package.version}`));

    // empty = default location, string = custom location, false/undefined = memory only
    const storageLocation = argv.o ? argv.o : path.join(process.cwd(), "bunq-cli-storage.json");

    const customStore = CustomStore(storageLocation);
    const bunqJSClient = new BunqJSClient(customStore);
    writeLine(`Storing data at ${storageLocation}`);

    // gather a list of endpoints the user can choose from
    const endpoints = {
        payment: (userId, accountId) => bunqJSClient.api.payment.list(userId, accountId),
        masterCardAction: (userId, accountId) => bunqJSClient.api.masterCardAction.list(userId, accountId),
        bunqMeTabs: (userId, accountId) => bunqJSClient.api.bunqMeTabs.list(userId, accountId),
        requestResponse: (userId, accountId) => bunqJSClient.api.requestResponse.list(userId, accountId),
        requestInquiry: (userId, accountId) => bunqJSClient.api.requestInquiry.list(userId, accountId),
        requestInquiryBatch: (userId, accountId) => bunqJSClient.api.requestInquiryBatch.list(userId, accountId)
    };

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
    writeLine(`API Key starts with: ${apiKeyPreview}`);
    writeLine(`Environment: ${ENVIRONMENT}`);
    writeLine(`Device name: ${DEVICE_NAME}`);
    writeLine(`Encryption key starts with: ${ENCRYPTION_KEY.substr(0, 8)}\n`);

    writeLine(chalk.yellow("Setting up the bunqJSClient [0/4] -> running client"));

    await bunqJSClient.run(API_KEY, [], ENVIRONMENT, ENCRYPTION_KEY).catch(exception => {
        throw exception;
    });
    bunqJSClient.setKeepAlive(false);
    writeLine(chalk.yellow("Setting up the bunqJSClient [1/4] -> installation"), true);

    await bunqJSClient.install().catch(defaultErrorHandler);
    writeLine(chalk.yellow("Setting up the bunqJSClient [2/4] -> device registration"), true);

    await bunqJSClient.registerDevice(DEVICE_NAME).catch(defaultErrorHandler);
    writeLine(chalk.yellow("Setting up the bunqJSClient [3/4] -> session registration"), true);

    await bunqJSClient.registerSession().catch(defaultErrorHandler);
    writeLine(chalk.green("Finished setting up the bunqJSClient"), true);

    writeLine(chalk.yellow("Fetching users list ..."));
    const users = await bunqJSClient.getUsers(true);
    const userType = Object.keys(users)[0];
    const user = users[userType];
    writeLine(chalk.green(`Fetched a ${userType} account.`), true);

    writeLine(chalk.yellow("Fetching monetary accounts ..."));
    const monetaryAccounts = await bunqJSClient.api.monetaryAccount.list(user.id);
    writeLine(chalk.green(`Fetched ${monetaryAccounts.length} monetary accounts.\n`), true);

    // get the endpoint the user wants to use
    const endpoint = await endpointsPrompt(endpoints);

    // get the monetary account the user wants to use
    const accountId = await monetaryAccountIdPrompt(monetaryAccounts);

    writeLine(chalk.yellow(`Fetching data from the ${endpoint} endpoint user: ${user.id} and account: ${accountId}`));
    // call the endpoint with the user ID and account ID
    const result = await endpoints[endpoint](user.id, accountId);
    writeLine(chalk.green(`${result.length} results for the ${endpoint} endpoint.`), true);

    writeLine("\n" + chalk.cyan("Finished."));
};
