const { AutoComplete } = require("enquirer");

module.exports = async endpoints => {
    const choices = [];
    Object.keys(endpoints).forEach(endpoint => {
        const endpointInfo = endpoints[endpoint];

        Object.keys(endpointInfo.methods).forEach(method => {
            const methodInfo = endpointInfo.methods[method];

            const methodInputs = methodInfo.inputs || [];
            const name = `${method}: ${endpointInfo.label}`;
            const message = `${name} [${methodInputs.join(", ")}]`;

            choices.push({
                message: message,
                name: name,
                value: methodInfo
            });
        });
    });

    const prompt = new AutoComplete({
        message: "Which endpoint would you like to use? (Type to search)",
        hint: "Use arrow-keys, <return> to submit",
        limit: 7,
        choices: choices
    });

    return prompt.run();
};
