const { Input } = require("enquirer");

module.exports = async (type, initialValue = "") => {
    const prompt = new Input({
        message: `Please enter the ${type}`,
        initial: initialValue
    });

    return prompt.run();
};
