import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import BunqJSClient from "@bunq-community/bunq-js-client";
import BunqCLIError from "./Types/Errors";
import MonetaryAccount from "./Types/MonetaryAccount";
import BunqCLIModule from "./Types/BunqCLIModule";

// argument parsing with some default values
const defaultSavePath = path.join(os.homedir(), "bunq-cli.json");
const defaultOutputLocationPath = path.join(os.homedir(), "bunq-cli-api-data");
import Yargs from "./Yargs/Yargs";
const yargsDefault: any = Yargs({ defaultSavePath, defaultOutputLocationPath });
import { normalizePath, write, writeLine, startTime, endTimeFormatted } from "./Utils";

// setup helpers
import Endpoints from "./Endpoints";
import CustomStore from "./CustomStore";

// result output handlers
import FileOutput from "./OutputHandlers/FileOutput";
import ConsoleOutput from "./OutputHandlers/ConsoleOutput";

// command modes
import InteractiveMode from "./Modes/Interactive";
import CLIMode from "./Modes/CLI";

// cli commands
import AccountsCommand from "./Modules/CLI/AccountsCommand";
import EndpointCommand from "./Modules/CLI/EndpointCommand";
import EventsCommand from "./Modules/CLI/EventsCommand";
import SandboxKeyCommand from "./Modules/CLI/SandboxKeyCommand";
import UrlCommand from "./Modules/CLI/UrlCommand";
import UserCommand from "./Modules/CLI/UserCommand";

// interactive actions
import SetupApiKeyAction from "./Modules/Interactive/SetupApiKeyAction";
import ViewMonetaryAccountsAction from "./Modules/Interactive/ViewMonetaryAccountsAction";
import CallEndpointAction from "./Modules/Interactive/CallEndpointAction";
import CreateMonetaryAccountAction from "./Modules/Interactive/CreateMonetaryAccountAction";
import RequestSandboxFundsAction from "./Modules/Interactive/RequestSandboxFundsAction";

export default class BunqCLI {
    public bunqJSClient: BunqJSClient;
    public argv: any;

    // pretty output message
    public interactive: boolean = false;
    public cliCommands: false | string[] = false;

    // public/bunqJSClient storage handler and location details
    public storage: any | null = null;
    public saveLocation: false | string = false;
    public saveData: boolean = false;

    // api data output directory location
    public outputLocation: string = "";
    public outputData: boolean = false;

    // current user details
    public userType: string = "UserPerson";
    public user: any | false = false;
    public monetaryAccounts: MonetaryAccount[] = [];
    public monetaryAccountsRaw: any[] = [];

    // default to a handler which does nothing
    public outputHandler: any = () => {};
    // the different endpoints directly supported by bunq-cli
    public endpoints: any = {};
    // stored api data in memory
    public apiData: any = {};

    private modules: BunqCLIModule[] = [];

    constructor() {
        this.setup();
    }

    /**
     * Run bunq-cli
     */
    public async run() {
        if (this.interactive) {
            return InteractiveMode(this);
        } else {
            return CLIMode(this);
        }
    }

    /**
     * Basic input parsing before starting the client
     */
    private setup() {
        // CLI commands
        this.modules.push(UserCommand);
        this.modules.push(AccountsCommand);
        this.modules.push(EventsCommand);
        this.modules.push(SandboxKeyCommand);
        this.modules.push(EndpointCommand);
        this.modules.push(UrlCommand);

        // Interactive commands, order matters for these!
        this.modules.push(ViewMonetaryAccountsAction);
        this.modules.push(CallEndpointAction);
        this.modules.push(CreateMonetaryAccountAction);
        this.modules.push(RequestSandboxFundsAction);
        this.modules.push(SetupApiKeyAction);

        // parse the yargs helpers and arguments
        this.argv = yargsDefault(this.modules);

        // check if we're in interactive mode or CLI mode and parse arguments acordingly
        this.interactive = this.argv._.length === 0 || this.argv._.includes("interactive");
        if (!this.interactive) {
            this.cliCommands = this.argv._;
        }
        if (!this.interactive && !this.argv.output) {
            this.argv.output = "console";
        }

        // bunqjsclient save/output settings
        if (!this.argv.memory) {
            // custom or default value if defined
            this.saveLocation = this.argv.save !== true ? normalizePath(this.argv.save) : defaultSavePath;
            this.saveData = true;
        }

        // api output settings
        if (this.argv.output) {
            this.outputData = true;

            if (this.argv.output === "file" || this.argv.output === "f") {
                const outputLocation = this.argv.outputLocation || false;

                // custom or default value if defined
                this.outputLocation =
                    outputLocation === true || outputLocation === false
                        ? defaultOutputLocationPath
                        : normalizePath(outputLocation);

                try {
                    const directoryExists = fs.existsSync(this.outputLocation);
                    if (!directoryExists) {
                        fs.mkdirSync(this.outputLocation);
                    }
                } catch (ex) {
                    throw new BunqCLIError(
                        `Failed to find or create the given output folder at: ${this.outputLocation}`
                    );
                }

                // setup a file handler
                this.outputHandler = FileOutput(this);
            }
            if (this.argv.output === "console" || this.argv.output === "c") {
                if (this.interactive) {
                    // ignore console mode in interactive mode
                    throw new BunqCLIError("The --output=console output mode is not supported in interactive mode!");
                }

                this.outputHandler = ConsoleOutput(this);
                this.outputLocation = "console";
            }
        }

        // setup the actual bunqjsclient and endpoints
        this.storage = CustomStore(this.saveLocation);
        this.bunqJSClient = new BunqJSClient(this.storage);

        this.endpoints = Endpoints(this);
    }

    /**
     * @param forceUpdate
     */
    public async getUser(forceUpdate = false) {
        if (this.interactive) write(chalk.yellow("Fetching users list ..."));
        const userStartTime = startTime();

        const users = await this.bunqJSClient.getUsers(forceUpdate);
        this.userType = Object.keys(users)[0];
        this.user = users[this.userType];

        if (this.interactive)
            writeLine(chalk.green(`Fetched a ${this.userType} account (${endTimeFormatted(userStartTime)})`));
        return this.user;
    }

    /**
     * @param forceUpdate
     */
    public async getMonetaryAccounts(forceUpdate = false) {
        if (!forceUpdate && this.hasMonetaryAccounts) {
            return this.monetaryAccounts;
        }

        if (!this.user) await this.getUser(true);

        if (this.interactive) write(chalk.yellow(`Updating monetary account list ... `));
        const startTime2 = startTime();

        // check API
        this.monetaryAccountsRaw = await this.bunqJSClient.api.monetaryAccount.list(this.user.id);

        // filter out inactive accounts
        this.monetaryAccounts = this.monetaryAccountsRaw
            .filter(account => {
                const accountType = Object.keys(account)[0];
                return account[accountType].status === "ACTIVE";
            })
            .map(account => {
                const accountType = Object.keys(account)[0];
                const parsedMonetaryAccount: MonetaryAccount = {
                    accountType: accountType,
                    ...account[accountType]
                };

                return parsedMonetaryAccount;
            });

        if (this.interactive) writeLine(chalk.green(`Updated monetary accounts (${endTimeFormatted(startTime2)})`));
        return this.monetaryAccounts;
    }

    public get hasMonetaryAccounts(): boolean {
        return this.monetaryAccounts.length > 0;
    }

    public checkModuleVisibility = permission => {
        const isReady = !!this.bunqJSClient.apiKey;
        const isSandbox = this.bunqJSClient.Session.environment === "SANDBOX";

        switch (permission) {
            case "ALWAYS":
                return true;
            case "SANDBOX":
                return isSandbox;
            case "AUTHENTICATED":
                return isReady;
        }
        return false;
    };
}
