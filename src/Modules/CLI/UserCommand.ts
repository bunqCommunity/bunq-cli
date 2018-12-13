import BunqCLI from "../../BunqCLI";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

const handle = async (bunqCLI: BunqCLI) => {
    if (!bunqCLI.user) await bunqCLI.getUser(true);

    bunqCLI.outputHandler(bunqCLI.user);
};

const UserCommand = new CommandLineBunqCLIModule();
UserCommand.command = "user";
UserCommand.message = "Fetches the User info";
UserCommand.handle = handle;

export default UserCommand;
