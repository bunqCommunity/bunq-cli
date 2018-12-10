import PaginationOptions from "@bunq-community/bunq-js-client/dist/Types/PaginationOptions";
import BunqCLI from "../BunqCLI";

export default (bunqCLI: BunqCLI) => {
    const argv = bunqCLI.argv;

    const requestOptions: PaginationOptions = {};

    if (argv.count) requestOptions.count = argv.count;
    if (argv.older_id) requestOptions.older_id = argv.older_id;
    if (argv.newer_id) requestOptions.newer_id = argv.newer_id;

    return requestOptions;
};
