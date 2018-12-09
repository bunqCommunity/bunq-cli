// @ts-ignore
const { Select } = require("enquirer");

export default async () => {
    const prompt = new Select({
        message: "Existing API key was found, use it or set new data?",
        choices: [
            { name: "", message: "Use existing API key", value: true },
            { message: "Set a new API key", value: "new" }
        ]
    });

    return prompt.run();
};
