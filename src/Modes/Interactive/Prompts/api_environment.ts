// @ts-ignore
const { Select } = require("enquirer");

export default async ENVIRONMENT => {
    const prompt = new Select({
        message: "Which environment would you like to use?",
        choices: [{ message: "Sandbox", value: "SANDBOX" }, { message: "Production", value: "PRODUCTION" }],
        initial: ENVIRONMENT ? ENVIRONMENT : ""
    });

    return prompt.run();
};
