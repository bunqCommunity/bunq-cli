// @ts-ignore
const { Select } = require("enquirer");

export default async () => {
    const prompt = new Select({
        message: "Which type of monetary account would you like to use?",
        choices: [{ message: "Regular", value: "regular" }, { message: "Savings", value: "savings" }]
    });

    return prompt.run();
};
