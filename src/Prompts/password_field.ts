const { Password } = require("enquirer");

export default async (type, initialValue = "") => {
    const prompt = new Password({
        message: `Please enter the ${type}`,
        initial: initialValue = ""
    });

    return prompt.run();
};
