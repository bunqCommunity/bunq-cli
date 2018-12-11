// @ts-ignore
const { NumberPrompt } = require("enquirer");

export default async customIdText => {
    const prompt = new NumberPrompt({
        message: `Please enter the ${customIdText}`
    });

    return prompt.run();
};
