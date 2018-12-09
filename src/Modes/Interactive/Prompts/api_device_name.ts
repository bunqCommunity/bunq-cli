const { Input } = require("enquirer");

export default async DEVICE_NAME => {
    const prompt = new Input({
        message: "Please enter a device name",
        initial: DEVICE_NAME ? DEVICE_NAME : "My device"
    });

    return prompt.run();
};
