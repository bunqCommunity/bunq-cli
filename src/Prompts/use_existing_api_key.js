const { Select } = require("enquirer");

module.exports = async () => {
    const prompt = new Select({
        message: "Existing API key was found, use it or set new data?",
        choices: [{ message: "Use existing API key", value: true }, { message: "Set a new API key", value: false }]
    });

    return prompt.run();
};
