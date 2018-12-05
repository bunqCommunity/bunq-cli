const { Input } = require("enquirer");

module.exports = async DEVICE_NAME => {
    const prompt = new Input({
        message: "Please enter a device name",
        initial: "My device",
        initialValue: DEVICE_NAME ? DEVICE_NAME : ""
    });

    return prompt.run();
};
