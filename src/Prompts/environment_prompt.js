const { Select } = require("enquirer");

module.exports = async ENVIRONMENT => {
    const prompt = new Select({
        message: "Which environment would you like to use?",
        choices: [{ message: "Sandbox", value: "SANDBOX" }, { message: "Production", value: "PRODUCTION" }],
        initialValue: ENVIRONMENT ? ENVIRONMENT : ""
    });

    return prompt.run();
};
