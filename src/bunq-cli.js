const argv = require("yargs").argv;

const InteractiveMode = require("./Modes/Interactive/interactive.js");
const CLIMode = require("./Modes/CLI/cli.js");

module.exports = async () => {
    if (!argv.cli) {
        return InteractiveMode();
    } else {
        return CLIMode();
    }
};
