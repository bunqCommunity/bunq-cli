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

    const defaultInputList = ["userId", "accountId"];
    const factory = (label, handler, inputs = defaultInputList) => {
        return new Endpoint(bunqCLI, label, handler, inputs);
    };

    return {
        event: {
            label: "Events",
            methods: {
                LIST: factory("list-event", userId => bunqJSClient.api.event.list(userId), ["userId"])
            }
        },
        masterCardAction: {
            label: "MasterCardAction",
            methods: {
                GET: factory(
                    "list-masterCardAction",
                    (userId, accountId, masterCardActionId) =>
                        bunqJSClient.api.masterCardAction.list(userId, accountId, masterCardActionId),
                    [...defaultInputList, "masterCardActionId"]
                ),
                LIST: factory("list-masterCardAction", (userId, accountId) =>
                    bunqJSClient.api.masterCardAction.list(userId, accountId)
                )
            }
        },
        payment: {
            label: "Payments",
            methods: {
                GET: factory(
                    "get-payment",
                    (userId, accountId, paymentId) => bunqJSClient.api.payment.list(userId, accountId, paymentId),
                    [...defaultInputList, "paymentId"]
                ),
                LIST: factory("list-payment", (userId, accountId) => bunqJSClient.api.payment.list(userId, accountId))
            }
        }
        // bunqMeTabs:
        // requestResponse:
        // requestInquiry:
        // requestInquiryBatch:
    };
};
