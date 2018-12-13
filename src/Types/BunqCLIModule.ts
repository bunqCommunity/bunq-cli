import BunqCLI from "../BunqCLI";

export type BunqCLIModuleType = "INTERACTIVE" | "CLI";
export type BunqCLIVisibilityTypes = "ALWAYS" | "AUTHENTICATED" | "SANDBOX";
export type BunqCLIModuleHandleCallable = (bunqCLI: BunqCLI, ...args: any[]) => Promise<any>;

class BunqCLIModule {
    // string to identify the module
    public id: string;
    // a callable function
    public handle: BunqCLIModuleHandleCallable;
    // when is the interactive action useable
    public visibility?: BunqCLIVisibilityTypes | BunqCLIVisibilityTypes[];
    // interactive or cli
    public type: BunqCLIModuleType;
}

export class InteractiveBunqCLIModule extends BunqCLIModule {
    // pretty name for interactive modules
    public message: string;
}
export class CommandLineBunqCLIModule extends BunqCLIModule {
    // optional yargs handler to improve command line output
    public yargs?: any;
}

export default BunqCLIModule;
