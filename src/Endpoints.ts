import * as awaiting from "awaiting";
import BunqCLI from "./BunqCLI";
import customInputIdPrompt from "./Modes/Interactive/Prompts/custom_input_id";
import monetaryAccountIdPrompt from "./Modes/Interactive/Prompts/select_monetary_account_id";
import { capitalizeFirstLetter } from "./Utils";

class Endpoint {
    private _bunqCLI: BunqCLI;
    private _label: string;
    private _handler: any;
    private _inputs: any[];
    private _parsedInputs: any[] = [];

    constructor(bunqCLI, label, handler, inputs) {
        this._bunqCLI = bunqCLI;
        this._label = label;
        this._handler = handler;
        this._inputs = inputs;
    }

    public get handler() {
        return this._handler;
    }
    public get label() {
        return this._label;
    }
    public get inputs() {
        return this._inputs;
    }
    public get parsedInputs() {
        return this._parsedInputs;
    }

    /**
     * Goes through the inputs and requests/fetches the values
     * @returns {Promise<void>}
     */
    public prepare = async () => {
        this._parsedInputs = await this.getInputs();
    };

    /**
     * Calls the actual endpoint using the prepared input values
     * @returns {Promise<*>}
     */
    public handle = async () => {
        return this._handler(...this._parsedInputs);
    };

    /**
     * Goes through the inputs and runs the inputHandler
     * @returns {Promise<*>}
     */
    public getInputs = async () => {
        return awaiting.map(this._inputs, 1, this.inputHandler);
    };

    /**
     * Decides what to do based on the inputKey value
     * @param inputKey
     * @returns {Promise<*>}
     */
    public inputHandler = async inputKey => {
        switch (inputKey) {
            case "userId":
                return this._bunqCLI.user.id;
            case "accountId":
                return monetaryAccountIdPrompt(this._bunqCLI.monetaryAccounts);
            default:
                return customInputIdPrompt(inputKey);
        }
    };
}

export default bunqCLI => {
    const bunqJSClient = bunqCLI.bunqJSClient;

    /**
     * Endpoints in this list will autoload with:
     * LIST: defaultInputlist
     * GET: defaultInputlist + endpointNameId
     */
    const defaultEndpointList = [
        "payment",
        "masterCardAction",
        "bunqMeTab",
        "requestInquiry",
        "requestResponse",
        "requestInquiryBatch",
        "draftPayment",
        "schedulePayment",
        "schedulePaymentBatch",
        "shareInviteBankInquiry"
    ];

    /**
     * Default values given to an endpoint
     * @type {string[]}
     */
    const defaultInputList = ["userId", "accountId"];

    const factory = (label, handler, inputs = []): Endpoint => {
        return new Endpoint(bunqCLI, label, handler, inputs);
    };

    const endpoints = {
        event: {
            label: "Events",
            methods: {
                LIST: factory("list-event", userId => bunqJSClient.api.event.list(userId), ["userId"])
            }
        },
        user: {
            label: "User",
            methods: {
                LIST: factory("list-user", () => bunqJSClient.api.user.list())
            }
        },
        monetaryAccount: {
            label: "MonetaryAccount",
            methods: {
                LIST: factory("list-monetaryAccount", userId => bunqJSClient.api.monetaryAccount.list(userId), [
                    "userId"
                ])
            }
        },
        monetaryAccountBank: {
            label: "MonetaryAccountBank",
            methods: {
                LIST: factory("list-monetaryAccountBank", userId => bunqJSClient.api.monetaryAccountBank.list(userId), [
                    "userId"
                ])
            }
        },
        monetaryAccountJoint: {
            label: "MonetaryAccountJoint",
            methods: {
                LIST: factory(
                    "list-monetaryAccountJoint",
                    userId => bunqJSClient.api.monetaryAccountJoint.list(userId),
                    ["userId"]
                )
            }
        },
        monetaryAccountSavings: {
            label: "MonetaryAccountSavings",
            methods: {
                LIST: factory(
                    "list-monetaryAccountSavings",
                    userId => bunqJSClient.api.monetaryAccountSavings.list(userId),
                    ["userId"]
                )
            }
        },
        card: {
            label: "Card",
            methods: {
                LIST: factory("list-card", userId => bunqJSClient.api.card.list(userId), ["userId"])
            }
        }
    };

    defaultEndpointList.forEach(defaultEndpoint => {
        if (!endpoints[defaultEndpoint]) {
            endpoints[defaultEndpoint] = {
                label: capitalizeFirstLetter(defaultEndpoint),
                methods: {}
            };
        }
        if (!endpoints[defaultEndpoint].methods.LIST) {
            if (bunqJSClient.api[defaultEndpoint] && bunqJSClient.api[defaultEndpoint].list) {
                endpoints[defaultEndpoint].methods.LIST = factory(
                    `list-${defaultEndpoint}`,
                    (userId, accountId) => bunqJSClient.api[defaultEndpoint].list(userId, accountId),
                    defaultInputList
                );
            }
        }
        if (!endpoints[defaultEndpoint].methods.GET) {
            if (bunqJSClient.api[defaultEndpoint] && bunqJSClient.api[defaultEndpoint].get) {
                endpoints[defaultEndpoint].methods.GET = factory(
                    `get-${defaultEndpoint}`,
                    (userId, accountId, defaultEndpointId) =>
                        bunqJSClient.api[defaultEndpoint].get(userId, accountId, defaultEndpointId),
                    [...defaultInputList, `${defaultEndpoint}Id`]
                );
            }
        }
    });

    return endpoints;
};
