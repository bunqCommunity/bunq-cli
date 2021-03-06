import BunqCLI from "../../BunqCLI";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

import FilterParser from "../../InputHandlers/FilterParser";

const handle = async (bunqCLI: BunqCLI) => {
    const bunqJSClient = bunqCLI.bunqJSClient;

    if (!bunqCLI.user) await bunqCLI.getUser(true);

    const requestOptions = FilterParser(bunqCLI);
    bunqCLI.apiData.events = await bunqJSClient.api.event.list(bunqCLI.user.id, requestOptions);

    bunqCLI.outputHandler(bunqCLI.apiData.events);
};

const EventsCommand = new CommandLineBunqCLIModule();
EventsCommand.command = "events";
EventsCommand.message = "Fetches all events for the current user";
EventsCommand.handle = handle;
EventsCommand.yargs = yargs => {
    yargs.command(EventsCommand.command, EventsCommand.message);
    yargs.example("bunq-cli events --pretty --clean", "Quickly check the events for the account");
    yargs.example("bunq-cli events --output=file", "Output the direct API output into a new file");
};

export default EventsCommand;
