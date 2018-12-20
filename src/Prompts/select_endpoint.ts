// @ts-ignore
const { AutoComplete } = require("enquirer");

export default async endpoints => {
    const choices = [];
    Object.keys(endpoints).forEach(endpoint => {
        const endpointInfo = endpoints[endpoint];

        Object.keys(endpointInfo.methods).forEach(method => {
            const methodInfo = endpointInfo.methods[method];

            const methodInputs = methodInfo.inputs || [];
            const methodText = methodInputs.length > 0 ? `[${methodInputs.join(", ")}]` : "";
            const name = `${method} ${endpointInfo.label}`;
            const message = `${name} ${methodText}`;

            choices.push({
                message: message,
                name: name,
                value: `${endpoint}|${method}`
            });
        });
    });

    choices.sort((choiceA, choiceB) => {
        return choiceA.message < choiceB.message ? -1 : 1;
    });

    const prompt = new AutoComplete({
        message: "Which endpoint would you like to use? (Type to search)",
        format: () => {
            if (prompt.focused) {
                return prompt.style(prompt.focused.name);
            }
            return prompt.style("No matches");
        },
        result: value => {
            if (!prompt.focused) return value;
            return prompt.focused.value;
        },
        choices: choices
    });

    const selectedEndpoint: string = await prompt.run();

    // split the selected endpoint
    const splitParts = selectedEndpoint.split("|");

    return endpoints[splitParts[0]].methods[splitParts[1]];
};
