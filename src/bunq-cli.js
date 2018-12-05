const argv = require("yargs").argv;

const InteractiveMode = require("./Modes/interactive.js");
const CLIMode = require("./Modes/cli.js");

module.exports = async () => {
    if (!argv.cli) {
        return InteractiveMode();
    } else {
        return CLIMode();
    }
};
