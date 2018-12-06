const { AutoComplete } = require("enquirer");

module.exports = async endpoints => {
    const choices = [];
    Object.keys(endpoints).forEach(endpoint => {
        const endpointInfo = endpoints[endpoint];

        Object.keys(endpointInfo.methods).forEach(method => {
            const methodInfo = endpointInfo.methods[method];

            const methodInputs = methodInfo.inputs || [];
            const methodText = methodInputs.length > 0 ? `[${methodInputs.join(", ")}]` : "";
            const name = `${method}: ${endpointInfo.label}`;
            const message = `${name} ${methodText}`;

            choices.push({
                message: message,
                name: name,
                value: methodInfo
            });
        });
    });

    choices.sort((choiceA, choiceB) => {
        return choiceA.message < choiceB.message ? -1 : 1;
    });

    const prompt = new AutoComplete({
        message: "Which endpoint would you like to use? (Type to search)",
        hint: "Use arrow-keys, <return> to submit",
        limit: 7,
        choices: choices
    });

    return prompt.run();
};
