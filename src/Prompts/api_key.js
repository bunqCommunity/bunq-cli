const { Password, Select } = require("enquirer");

module.exports = async bunqJSClient => {
    const prompt = new Select({
        message: "No API key is set, would you like to enter one or have one generated for you?",
        choices: [
            { message: "Generate a new sandbox API key", value: "generate" },
            { message: "Enter a API key manually", value: "custom" }
        ]
    });

    const encryptionKeyType = await prompt.run();
    if (encryptionKeyType === "generate") {
        return bunqJSClient.api.sandboxUser.post();
    } else {
        const inputPrompt = new Password({
            message: "Enter a valid API key",
            validate: value => value || value.length === 64
        });

        return inputPrompt.run();
    }
};
