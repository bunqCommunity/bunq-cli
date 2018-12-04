const { Select } = require("enquirer");

module.exports = async endpoints => {
    const prompt = new Select({
        message: "Which endpoint would you like to use?",
        choices: Object.keys(endpoints)
    });

    return prompt.run();
};
