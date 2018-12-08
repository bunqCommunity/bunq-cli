const { BunqCLIError } = require("../Errors");

module.exports = (methodInput, bunqCLI) => {
    if (!methodInput) {
        return "GET";
    }
    if (typeof methodInput !== "string") {
        throw new BunqCLIError("Invalid --method given, not of type 'string'");
    }

    // to uppercase
    methodInput = methodInput.toUpperCase();

    switch (methodInput) {
        case "DELETE":
        case "PUT":
        case "POST":
        case "LIST":
        case "GET":
            return methodInput;
    }

    throw new BunqCLIError(`Invalid --method given, '${methodInput}' not recognized`);
};
