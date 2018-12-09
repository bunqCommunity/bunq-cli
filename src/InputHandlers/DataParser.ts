import BunqCLIError from "../Errors";

export default (dataInput, bunqCLI) => {
    if (!dataInput) return false;

    if (typeof dataInput !== "string") {
        throw new BunqCLIError("Invalid --data given, not of type 'string'");
    }

    try {
        return JSON.parse(dataInput);
    } catch (ex) {
        throw new BunqCLIError("Invalid --data given, failed to parse as JSON");
    }
};
