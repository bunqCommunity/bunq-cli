import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import BunqJSClient from "@bunq-community/bunq-js-client";
import BunqCLIError from "./Errors";
import MonetaryAccount from "./Types/MonetaryAccount";
import { normalizePath, write, writeLine, startTime, endTimeFormatted } from "./Utils";

// argument parsing with some default values
const defaultSavePath = path.join(os.homedir(), "bunq-cli.json");
const defaultOutputLocationPath = path.join(os.homedir(), "bunq-cli-api-data");
import yargs from "./yargs";
const argv: any = yargs({ defaultSavePath, defaultOutputLocationPath });

// setup helpers
import Endpoints from "./Endpoints";
import CustomStore from "./CustomStore";

// result output handlers
import FileOutput from "./OutputHandlers/FileOutput";
import ConsoleOutput from "./OutputHandlers/ConsoleOutput";

// command modes
import InteractiveMode from "./Modes/Interactive/interactive";
import CLIMode from "./Modes/CLI/cli";

export default class BunqCLI {
    public bunqJSClient: BunqJSClient;
    public argv: any;

    // pretty output message
    public interactive: boolean = false;

    // public/bunqJSClient storage handler and location details
    public storage: any | null = null;
    public saveLocation: false | string = false;
    public saveData: boolean = false;

    // api data output directory location
    public outputLocation: string = "";
    public outputData: boolean = false;

    // current user details
    public userType: string = "UserPerson";
    public user: any = {};
    public monetaryAccounts: MonetaryAccount[] = [];

    // default to a handler which does nothing
    public outputHandler: any = () => {};

    // the different endpoints directly supported by bunq-cli
    public endpoints: any = {};

    // stored api data in memory
    public apiData: any = {};

    constructor() {
        this.argv = argv;
        this.interactive = !argv.cli;

        this.setup();
    }

    /**
     * Basic input parsing before starting the client
     */
    private setup() {
        if (!this.interactive && !this.argv.output) {
            this.argv.output = "console";
        }

        // bunqjsclient save/output settings
        if (this.argv.save) {
            if (typeof this.argv.save === "string" && this.argv.save === "true") {
                if (this.argv.save === "true") this.argv.save = true;
                if (this.argv.save === "false") this.argv.save = false;
            }

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
                this.outputHandler = FileOutput(this.outputLocation, this.interactive);
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
     * Run bunq-cli
     */
    public async run() {
        if (this.interactive) {
            return InteractiveMode(this);
        } else {
            return CLIMode(this);
        }
    }

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

    public async getMonetaryAccounts(forceUpdate = false) {
        if (!forceUpdate && this.monetaryAccounts) {
            return this.monetaryAccounts;
        }

        if (!this.user) {
            await this.getUser();
        }

        if (this.interactive) write(chalk.yellow(`Updating monetary account list ... `));
        const startTime2 = startTime();

        // check API
        const monetaryAccounts = await this.bunqJSClient.api.monetaryAccount.list(this.user.id);

        // filter out inactive accounts
        this.monetaryAccounts = monetaryAccounts
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
}
