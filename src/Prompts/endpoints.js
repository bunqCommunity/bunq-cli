const chalk = require("chalk");
const { AutoComplete } = require("enquirer");

module.exports = async endpoints => {
    const choices = [];
    Object.keys(endpoints).forEach(endpoint => {
        const endpointInfo = endpoints[endpoint];

        Object.keys(endpointInfo.methods).forEach(method => {
            const methodInfo = endpointInfo.methods[method];

            const basicName = `${endpointInfo.label} - ${method}`;
            let name = basicName;
            if (methodInfo.inputs) {
                name = `${basicName} [${methodInfo.inputs.join(", ")}]`;
            }

            choices.push({
                name: name,
                basicName: basicName,
                value: { endpoint: endpoint, method: method }
            });
        });
    });

    const prompt = new AutoComplete({
        message: "Which endpoint would you like to use? (Type to search)",
        limit: 7,
        format: value => chalk.yellow(prompt.focused.basicName),
        choices: choices
    });

    return prompt.run();
};
