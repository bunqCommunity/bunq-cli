const BunqJSClient = require("@bunq-community/bunq-js-client").default;
const argv = require("yargs").argv;

const getEndpoints = require("../getEndpoints");
const CustomStore = require("../customStore");
const { randomHex } = require("../Utils");

module.exports = async () => {
    console.log("\nNot implemented");
    return;
    // empty = default location or false/undefined = memory only
    const storageLocation = argv.save || false;

    const customStore = CustomStore(storageLocation);
    const bunqJSClient = new BunqJSClient(customStore);

    let API_KEY = argv.apiKey || process.env.BUNQ_CLI_API_KEY;
    if (API_KEY === "generate") {
        API_KEY = await bunqJSClient.api.sandboxUser.post();
    }
    let ENVIRONMENT = argv.env || process.env.BUNQ_CLI_ENVIRONMENT || "SANDBOX";
    let ENCRYPTION_KEY = argv.key || process.env.BUNQ_CLI_ENCRYPTION_KEY || randomHex(32);
    let DEVICE_NAME = argv.device || process.env.BUNQ_CLI_DEVICE_NAME || "My Device";

    if (!API_KEY) throw new Error("No API_KEY set as --api-key option or BUNQ_CLI_API_KEY environment");

    // await bunqJSClient.run(API_KEY, [], ENVIRONMENT, ENCRYPTION_KEY);
    // bunqJSClient.setKeepAlive(false);
    // await bunqJSClient.install();
    // await bunqJSClient.registerDevice(DEVICE_NAME);
    // await bunqJSClient.registerSession();

    console.log(API_KEY);
    console.log(ENVIRONMENT);
    console.log(ENCRYPTION_KEY);
    console.log(DEVICE_NAME);

    const endpoints = getEndpoints(bunqJSClient);

    console.log("\nNot implemented");
};
