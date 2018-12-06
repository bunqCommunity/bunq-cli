const fs = require("fs");

module.exports = (directory = false) => {
    if (!directory) {
    }
    return (apiResponse, type = "generic") => {
        const fileName = `${new Date().getTime()}-${type}.json`;

        fs.writeFileSync(`${process.cwd()}/${fileName}`, JSON.stringify(apiResponse));
    };
};
