const { Select, Input } = require("enquirer");
const { randomHex } = require("../Utils");

module.exports = async () => {
    const prompt = new Select({
        message: "No encryption key is set, would you like to enter one or have one generated for you?",
        choices: [{ message: "Generate a new key", value: "generate" }, { message: "Enter a key", value: "custom" }]
    });

    const encryptionKeyType = await prompt.run();
    if (encryptionKeyType === "generate") {
        return randomHex(32);
    } else {
        const inputPrompt = new Input({
            message: "Enter a 16, 24 or 32 bit hex encoded encryption key"
        });

        return inputPrompt.run();
    }
};
