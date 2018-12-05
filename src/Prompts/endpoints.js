const { Select } = require("enquirer");

module.exports = async endpoints => {
    const prompt = new Select({
        message: "Which endpoint would you like to use?",
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
