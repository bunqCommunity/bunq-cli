const { NumberPrompt } = require("enquirer");

module.exports = async customIdText => {
    const prompt = new NumberPrompt({
        message: `Please enter the ${customIdText}`
    });

    return prompt.run();
};
