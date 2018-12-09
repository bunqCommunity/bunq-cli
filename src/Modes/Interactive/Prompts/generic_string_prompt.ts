// @ts-ignore
const { Input } = require("enquirer");

export default async (type, initialValue = "") => {
    const prompt = new Input({
        message: `Please enter the ${type}`,
        initial: initialValue
    });

    return prompt.run();
};
