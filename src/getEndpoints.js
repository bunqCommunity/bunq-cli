module.exports = bunqJSClient => {
    return {
        payment: {
            label: "Payments",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.payment.list(userId, accountId)
            }
        },
        masterCardAction: {
            label: "MasterCardAction",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.masterCardAction.list(userId, accountId)
            }
        },
        bunqMeTabs: {
            label: "BunqMeTab",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.bunqMeTabs.list(userId, accountId)
            }
        },
        requestResponse: {
            label: "RequestResponse",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.requestResponse.list(userId, accountId)
            }
        },
        requestInquiry: {
            label: "RequestInquiry",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.requestInquiry.list(userId, accountId)
            }
        },
        requestInquiryBatch: {
            label: "RequestInquiryBatch",
            methods: {
                LIST: (userId, accountId) => bunqJSClient.api.requestInquiryBatch.list(userId, accountId)
            }
        }
    };
};
