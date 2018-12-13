import chalk from "chalk";
import BunqCLI from "../../BunqCLI";
import { InteractiveBunqCLIModule } from "../../Types/BunqCLIModule";

import selectEndpointPrompt from "../../Prompts/select_endpoint";

import { write, writeLine, startTime, endTimeFormatted } from "../../Utils";

const handle = async (bunqCLI: BunqCLI) => {
    writeLine(chalk.blue(`Calling an API endpoint`));
    writeLine("");

    const selectedEndpoint = await selectEndpointPrompt(bunqCLI.endpoints);

    // prepare the selected endpoint
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
    writeLine("");
};

const CallEndpointAction = new InteractiveBunqCLIModule();
CallEndpointAction.id = "call-api-endpoint-action";
CallEndpointAction.message = "Call an API endpoint";
CallEndpointAction.handle = handle;
CallEndpointAction.visibility = "AUTHENTICATED";
CallEndpointAction.type = "INTERACTIVE";

export default CallEndpointAction;
