module.exports = bunqJSClient => {
    return {
        event: {
            label: "Events",
            methods: {
                LIST: {
                    handler: userId => bunqJSClient.api.event.list(userId),
                    inputs: ["userId"]
                }
            }
        },
        masterCardAction: {
            label: "MasterCardAction",
            methods: {
                GET: {
                    handler: (userId, accountId, masterCardActionId) =>
                        bunqJSClient.api.masterCardAction.list(userId, accountId, masterCardActionId),
                    inputs: ["userId", "accountId", "masterCardActionId"]
                },
                LIST: {
                    handler: (userId, accountId) => bunqJSClient.api.masterCardAction.list(userId, accountId),
                    inputs: ["userId", "accountId"]
                }
            }
        }
        // payment: {
        //     label: "Payments",
        //     methods: {
        //         LIST: (userId, accountId) => bunqJSClient.api.payment.list(userId, accountId)
        //     }
        // },
        // bunqMeTabs: {
        //     label: "BunqMeTab",
        //     methods: {
        //         LIST: (userId, accountId) => bunqJSClient.api.bunqMeTabs.list(userId, accountId)
        //     }
        // },
        // requestResponse: {
        //     label: "RequestResponse",
        //     methods: {
        //         LIST: (userId, accountId) => bunqJSClient.api.requestResponse.list(userId, accountId)
        //     }
        // },
        // requestInquiry: {
        //     label: "RequestInquiry",
        //     methods: {
        //         LIST: (userId, accountId) => bunqJSClient.api.requestInquiry.list(userId, accountId)
        //     }
        // },
        // requestInquiryBatch: {
        //     label: "RequestInquiryBatch",
        //     methods: {
        //         LIST: (userId, accountId) => bunqJSClient.api.requestInquiryBatch.list(userId, accountId)
        //     }
        // }
    };
};
