import BunqCLI from "../../BunqCLI";
import { CommandLineBunqCLIModule } from "../../Types/BunqCLIModule";

const handle = async (bunqCLI: BunqCLI) => {
    const apiKey = await bunqCLI.bunqJSClient.api.sandboxUser.post();

    bunqCLI.outputHandler(apiKey, "RAW");
};

const SandboxKeyCommand = new CommandLineBunqCLIModule();
SandboxKeyCommand.command = "create-key";
SandboxKeyCommand.message = "Creates a new Sandbox environment API key and outputs it";
SandboxKeyCommand.handle = handle;
SandboxKeyCommand.unauthenticated = true;

export default SandboxKeyCommand;
