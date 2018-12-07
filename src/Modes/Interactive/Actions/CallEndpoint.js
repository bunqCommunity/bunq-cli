const chalk = require("chalk");

const selectEndpointPrompt = require("../Prompts/select_endpoint");

const { write, writeLine, startTime, endTimeFormatted } = require("../../../Utils");

module.exports = async bunqCLI => {
    writeLine(chalk.blue(`Calling an API endpoint`));
    writeLine("");

    const selectedEndpoint = await selectEndpointPrompt(bunqCLI.endpoints);

    // preapre the inputs
    await selectedEndpoint.prepare();

    writeLine("");
    write(chalk.yellow(`Fetching the endpoint ...`));

    const startTime1 = startTime();

    // call the endpoint with the actual input values
    const apiEndpointResponse = await selectedEndpoint.handle();

    const timePassedLabel = endTimeFormatted(startTime1);
    writeLine(chalk.green(`Fetched the endpoint! (${timePassedLabel})`));

    // write to file if possible
    bunqCLI.outputHandler(apiEndpointResponse, "JSON", selectedEndpoint.label);
};
