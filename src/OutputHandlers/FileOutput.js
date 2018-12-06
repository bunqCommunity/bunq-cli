const fs = require("fs");

module.exports = (directory = false) => {
    if (!directory) return process.cwd();

    return (apiResponse, type = "generic") => {
        const fileName = `${new Date().getTime()}-${type}.json`;

        fs.writeFileSync(`${directory}/${fileName}`, JSON.stringify(apiResponse, null, "\t"));
    };
};
