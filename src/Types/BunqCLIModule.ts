export type BunqCLIModuleType = "INTERACTIVE" | "CLI";

export type BunqCLIVisibilityTypes = "ALWAYS" | "AUTHENTICATED" | "";

interface BunqCLIModule {
    [key: string]: any;
    // string to identify the module
    id: string;
    // a callable function
    handle: any;
    // when is the interactive action useable
    visibility?: BunqCLIVisibilityTypes | BunqCLIVisibilityTypes[];
    // interactive or cli
    type: BunqCLIModuleType;
    // list of modules this one depends on
    depends_on?: string[];
}

export default BunqCLIModule;
