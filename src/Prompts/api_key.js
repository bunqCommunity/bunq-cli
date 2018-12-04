const { Input, Select } = require("enquirer");

module.exports = async (initialApiKey = "") => {
    const apiKeyPrompt = new Input({
        message: "Please enter a  API key",
        initial: initialApiKey
    });

    return apiKeyPrompt.run();
};

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
        const inputPrompt = new Input({
            message: "Enter a valid API key"
        });

        return inputPrompt.run();
    }
};
