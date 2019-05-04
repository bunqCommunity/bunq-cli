// @ts-ignore
const { Select } = require("enquirer");

export default async (description, choices) => {
    const prompt = new Select({
        message: description,
        choices: choices
    });

    return prompt.run();
};
