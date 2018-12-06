const chalk = require("chalk");
const awaiting = require("awaiting");

const getEndpoints = require("../../getEndpoints");
const endpointsPrompt = require("../../Prompts/endpoints");
const monetaryAccountIdPrompt = require("../../Prompts/monetary_account_id");

const { write, writeLine, clearConsole } = require("../../Utils");

module.exports = async interactiveData => {
    writeLine(chalk.blue(`Calling an API endpoint`));

    writeLine(chalk.yellow(`Not implemented yet!`));

    return await awaiting.delay(1000);
};
