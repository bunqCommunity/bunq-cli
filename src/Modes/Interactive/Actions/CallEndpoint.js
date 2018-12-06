const chalk = require("chalk");
const awaiting = require("awaiting");

const getEndpoints = require("../../../getEndpoints");
const endpointsPrompt = require("../../../Prompts/endpoints");
const monetaryAccountIdPrompt = require("../../../Prompts/monetary_account_id");

const { write, writeLine, clearConsole } = require("../../../Utils");
const FileOutput = require("../../../OutputHandlers/FileOutput");

module.exports = async interactiveData => {
    writeLine(chalk.blue(`Calling an API endpoint`));

    writeLine(chalk.yellow(`Not implemented yet!`));

    // const monetaryAccount2 = interactiveData.monetaryAccounts[0];
    // const monetaryAccount = monetaryAccount2[Object.keys(monetaryAccount2)[0]]
    //
    // const events = await interactiveData.bunqJSClient.api.event.list(interactiveData.user.id);
    // FileOutput(events);
    // const result = await interactiveData.bunqJSClient.api.noteText.list("mastercard-action", interactiveData.user.id, 366275, 20970760)
    // FileOutput(result, "note-text-list");
    // const result2 = await interactiveData.bunqJSClient.api.noteAttachment.list("mastercard-action", interactiveData.user.id, 366275, 20970760)
    // FileOutput(result2, "note-attachment-list");

    return await awaiting.delay(500);
};
