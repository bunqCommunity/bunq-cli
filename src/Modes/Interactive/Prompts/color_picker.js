const chalk = require("chalk")
const { AutoComplete } = require("enquirer");

module.exports = async (initialColor = "#2550b0") => {
    const prompt = new AutoComplete({
        message: `Pick a color`,
        choices: [
            { message: chalk.hex("#2550b0")("▉ Cerulean blue"), value: "#2550b0" },
            { message: chalk.hex("#00ffff")("▉ Aqua"), value: "#00ffff" },
            { message: chalk.hex("#000000")("▉ Black"), value: "#000000" },
            { message: chalk.hex("#0000ff")("▉ Blue"), value: "#0000ff" },
            { message: chalk.hex("#ff00ff")("▉ Fuchsia"), value: "#ff00ff" },
            { message: chalk.hex("#808080")("▉ Gray"), value: "#808080" },
            { message: chalk.hex("#008000")("▉ Green"), value: "#008000" },
            { message: chalk.hex("#00ff00")("▉ Lime"), value: "#00ff00" },
            { message: chalk.hex("#800000")("▉ Maroon"), value: "#800000" },
            { message: chalk.hex("#000080")("▉ Navy"), value: "#000080" },
            { message: chalk.hex("#808000")("▉ Olive"), value: "#808000" },
            { message: chalk.hex("#800080")("▉ Purple"), value: "#800080" },
            { message: chalk.hex("#ff0000")("▉ Red"), value: "#ff0000" },
            { message: chalk.hex("#c0c0c0")("▉ Silver"), value: "#c0c0c0" },
            { message: chalk.hex("#008080")("▉ Teal"), value: "#008080" },
            { message: chalk.hex("#ffffff")("▉ White"), value: "#ffffff" },
            { message: chalk.hex("#ffff00")("▉ Yellow"), value: "#ffff00" }
        ],
        initial: initialColor
    });

    return prompt.run();
};
