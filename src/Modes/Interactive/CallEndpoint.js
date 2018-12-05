// const path = require("path");
// const chalk = require("chalk");
// const BunqJSClient = require("@bunq-community/bunq-js-client").default;
// const argv = require("yargs").argv;
//
// const package = require("../../../package.json");
//
// const getEndpoints = require("../../getEndpoints");
// const endpointsPrompt = require("../../Prompts/endpoints");
// const monetaryAccountIdPrompt = require("../../Prompts/monetary_account_id");
//
// const writeLine = input => {
//     write(input);
//     process.stdout.write("\n");
// };
// const write = input => {
//     process.stdout.clearLine();
//     process.stdout.cursorTo(0);
//     process.stdout.write(input);
// };
// const clearConsole = () => console.log("\033[2J");
//
// module.exports = async (interactiveData) => {
// //     clearConsole();
// //
// // // get the endpoint the user wants to use
// //     const endpoint = await endpointsPrompt(endpoints);
// //
// // // get the monetary account the user wants to use
// //     const accountId = await monetaryAccountIdPrompt(monetaryAccounts);
// //
// //     write(chalk.yellow(`Fetching data from the ${endpoint} endpoint user: ${user.id} and account: ${accountId}`));
// // // call the endpoint with the user ID and account ID
// //     const result = await endpoints[endpoint](user.id, accountId);
// //     writeLine(chalk.green(`${result.length} results for the ${endpoint} endpoint.`));
//
// };
