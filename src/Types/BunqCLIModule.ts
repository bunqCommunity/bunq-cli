import BunqCLI from "../BunqCLI";

export type BunqCLIModuleType = "INTERACTIVE" | "CLI";
export type BunqCLIVisibilityTypes = "ALWAYS" | "AUTHENTICATED" | "SANDBOX";
export type BunqCLIModuleHandleCallable = (bunqCLI: BunqCLI, ...args: any[]) => Promise<any>;

class BunqCLIModule {
    // pretty name for interactive modules/help doc in cli mode
    public message: string;
    // a callable function
    public handle: BunqCLIModuleHandleCallable;
}

export class InteractiveBunqCLIModule extends BunqCLIModule {
    public type: BunqCLIModuleType = "INTERACTIVE";
    // string to identify the module in a switch statement
    public id: string;
    // when is the interactive action useable
    public visibility?: BunqCLIVisibilityTypes | BunqCLIVisibilityTypes[];
}

// to set the argv when a advanced command is matching
export type YargsAdvancedCallable = (argv: any) => void;

export class CommandLineBunqCLIModule extends BunqCLIModule {
    public type: BunqCLIModuleType = "CLI";
    // the actual sub command users have to enter to use this command
    public command: string;
    // if true, will be run without setting up the bunqjsclient
    public unauthenticated: boolean = false;
    // advanced function which returns a deeper nested argv object
    public yargsAdvanced?: (yargs: any) => any;
    // basic function which only expects the command to modify the yargs command list
    // useful for adding .option() commands for example
    public yargs?: (yargs: any) => any;
}

export default BunqCLIModule;
