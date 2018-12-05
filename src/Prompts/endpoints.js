const { AutoComplete } = require("enquirer");

module.exports = async endpoints => {
    const prompt = new AutoComplete({
        message: "Which endpoint would you like to use?",
        limit: 7,
        choices: Object.keys(endpoints).map(endpointKey => {
            const endpoint = endpoints[endpointKey];
            return {
                label: `${endpoint.label} methods: ${Object.keys(endpoint.methods).join(", ")}`,
                value: endpointKey
            };
        })
    });

    return prompt.run();
};
