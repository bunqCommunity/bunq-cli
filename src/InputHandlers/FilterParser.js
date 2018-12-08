const { BunqCLIError } = require("../Errors");

module.exports = bunqCLI => {
    const argv = bunqCLI.argv;

    const requestOptions = {};

    if (argv.count) requestOptions.count = argv.count;
    if (argv.older_id) requestOptions.older_id = argv.older_id;
    if (argv.newer_id) requestOptions.newer_id = argv.newer_id;

    return requestOptions;
};
