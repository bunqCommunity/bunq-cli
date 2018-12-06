const chalk = require("chalk");

const endpointsPrompt = require("../../../Prompts/endpoints");

const { write, writeLine } = require("../../../Utils");

module.exports = async bunqCLI => {
    writeLine(chalk.blue(`Calling an API endpoint`));

    const selectedEndpoint = await endpointsPrompt(bunqCLI.endpoints);

    // preapre the inputs
    await selectedEndpoint.prepare();

    writeLine("");
    write(chalk.yellow(`Fetching the endpoint ...`));

    const startTime = process.hrtime();

    // call the endpoint with the actual input values
    const apiEndpointResponse = await selectedEndpoint.handle();

    const endTime = process.hrtime(startTime);
    let timePassedLabel = `${endTime[1] / 1000000}ms`;
    if (endTime[0] > 0) {
        timePassedLabel = `${endTime[0]}s ${timePassedLabel}`;
    }

    writeLine(chalk.green(`Fetched the endpoint! (${timePassedLabel})`));

    // write to file if possible
    bunqCLI.outputHandler(apiEndpointResponse, selectedEndpoint.label);
};
