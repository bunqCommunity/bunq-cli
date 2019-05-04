import BunqCLIModule, { CommandLineBunqCLIModule } from "../Types/BunqCLIModule";
import CompletionHelper from "./CompletionHelper";

const yargs = require("yargs");

const Yargs = ({ defaultSavePath, defaultOutputLocationPath }) => (modules: BunqCLIModule[]) => {
    yargs
        .env("BUNQ_CLI")
        .help("help")
        .scriptName("bunq-cli")
        .usage(
            `Interactive mode: bunq-cli 
Or use a command: bunq-cli <sub-command> [options]`
        )
        .wrap(Math.min(120, yargs.terminalWidth()))
        .epilogue("for more information, check the readme at https://github.com/bunqCommunity/bunq-cli")

        .group(["save", "output", "overwrite", "memory", "output-location", "pretty", "clean"], "General")
        .group(["apiKey", "deviceName", "encryptionKey", "environment"], "API details")

        .command("interactive", "Interactive mode")

        .describe({
            save: "Storage location for bunqJSClient data",
            output: "How to output the API data",
            memory: "Use memory only, overwrites the save option",
            overwrite: "Overwrite the stored API key data with the given info",
            "output-location": "Directory location for API output files",

            pretty: "Makes the JSON output more readable when outputting to console or files",
            clean: "Simplifies some API output like removing the Response wrapper",
            reset: "Resets the stored API keys",

            apiKey: "The bunq API key, creates a sandbox key by default",
            deviceName: "Device name to identify the API key",
            encryptionKey: "Encryption key for bunqJSClient, generates a random key by default",
            environment: "bunq API environment to use"
        })
        .default({
            save: defaultSavePath,
            output: "file",
            memory: false,
            overwrite: false,
            clean: false,
            reset: false,
            pretty: false,
            "output-location": defaultOutputLocationPath,

            apiKey: "generate",
            deviceName: "My device",
            environment: "SANDBOX"
        })
        .alias({
            save: "s",
            output: "o",
            apiKey: "api-key",
            deviceName: "device-name",
            encryptionKey: "encryption-key"
        })
        .normalize(["output-location"])
        .string(["apiKey", "deviceName", "encryptionKey"])
        .boolean(["memory", "overwrite", "clean", "pretty", "reset"])
        .choices({
            output: ["file", "console", false],
            environment: ["PRODUCTION", "SANDBOX"]
        });

    let argv = false;

    modules
        .filter((module: BunqCLIModule) => {
            return module instanceof CommandLineBunqCLIModule;
        })
        .forEach((module: CommandLineBunqCLIModule) => {
            if (module.yargsAdvanced) {
                // register the command and retrieve the nested argv object
                yargs.command(module.command, module.message, yargsInner => {
                    // get the argv values from the advanced command
                    argv = module.yargsAdvanced(yargsInner);
                });
            } else if (module.yargs) {
                // let the module modify the value
                module.yargs(yargs);
            } else {
                // standard command with only the command description
                yargs.command(module.command, module.message);
            }
        });

    CompletionHelper(yargs);

    // get the default arguments
    if (!argv) {
        argv = yargs.argv;
    }

    // go through arguments and fix boolean values
    Object.keys(argv).forEach(key => {
        const value = argv[key];

        if (typeof value === "string") {
            switch (value) {
                case "true":
                    argv[key] = true;
                    break;
                case "false":
                    argv[key] = false;
                    break;
            }
        }
    });

    return argv;
};

export default Yargs;
