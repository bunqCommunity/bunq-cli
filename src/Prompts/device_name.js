const { Input } = require("enquirer");

module.exports = async () => {
    const prompt = new Input({
        message: "Please enter a device name",
        initial: "My device"
    });

    return prompt.run();
};
