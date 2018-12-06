const awaiting = require("awaiting");
const customInputIdPrompt = require("./Prompts/custom_input_id");
const monetaryAccountIdPrompt = require("./Prompts/monetary_account_id");

class Endpoint {
    constructor(bunqCLI, label, handler, inputs) {
        this._bunqCLI = bunqCLI;
        this._label = label;
        this._handler = handler;
        this._inputs = inputs;
        this._parsedInputs = [];

        this.handle = this.handle.bind(this);
        this.getInputs = this.getInputs.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
    }

    get handler() {
        return this._handler;
    }
    get label() {
        return this._label;
    }
    get inputs() {
        return this._inputs;
    }
    get parsedInputs() {
        return this._parsedInputs;
    }

    /**
     * Goes through the inputs and requests/fetches the values
     * @returns {Promise<void>}
     */
    async prepare() {
        this._parsedInputs = await this.getInputs();
    }

    /**
     * Calls the actual endpoint using the prepared input values
     * @returns {Promise<*>}
     */
    async handle() {
        return this._handler(...this.parsedInputs);
    }

    /**
     * Goes through the inputs and runs the inputHandler
     * @returns {Promise<*>}
     */
    async getInputs() {
        return awaiting.map(this.inputs, 1, this.inputHandler);
    }

    /**
     * Decides what to do based on the inputKey value
     * @param inputKey
     * @returns {Promise<*>}
     */
    async inputHandler(inputKey) {
        switch (inputKey) {
            case "userId":
                return this._bunqCLI.user.id;
            case "accountId":
                return monetaryAccountIdPrompt(this._bunqCLI.monetaryAccounts);
            default:
                return customInputIdPrompt(inputKey);
        }
    }
}

module.exports = bunqCLI => {
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

    const factory = (label, handler, inputs = defaultInputList) => {
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
                LIST: factory("list-user", () => bunqJSClient.api.user.list(), [])
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
                label: defaultEndpoint,
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
