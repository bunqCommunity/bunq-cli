// @ts-ignore
const { Select, Password } = require("enquirer");
import { randomHex } from "../Utils";

export default async ENCRYPTION_KEY => {
    const prompt = new Select({
        message: "No encryption key is set, would you like to enter one or have one generated for you?",
        choices: [{ message: "Generate a new key", value: "generate" }, { message: "Enter a key", value: "custom" }]
    });

    const encryptionKeyType = await prompt.run();
    if (encryptionKeyType === "generate") {
        return randomHex(32);
    } else {
        const inputPrompt = new Password({
            message: "Enter a 16, 24 or 32 bit hex encoded encryption key",
            initial: ENCRYPTION_KEY ? ENCRYPTION_KEY : ""
        });

        return inputPrompt.run();
    }
};
