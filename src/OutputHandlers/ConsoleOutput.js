const { writeRaw } = require("../Utils");

module.exports = bunqCLI => {
    return (data, type = "JSON", label = "") => {
        switch (type) {
            case "RAW":
                if (typeof data === "string") {
                    write(data);
                } else {
                    write(data.toString());
                }
                break;
            case "JSON":
            default:
                if (bunqCLI.argv.pretty) {
                    let prettySpacer = "\t";
                    if (bunqCLI.argv.pretty !== true) {
                        prettySpacer = bunqCLI.argv.pretty;
                    }

                    writeRaw(JSON.stringify(data, null, prettySpacer));
                } else {
                    writeRaw(JSON.stringify(data));
                }
                break;
        }
    };
};
