require("dotenv").config();

import BunqCLI from "./BunqCLI";
import PrettyErrorHandler from "./PrettyErrorHandler";

const bunqCLI = new BunqCLI();
bunqCLI
    .run()
    .then(() => process.exit())
    .catch(error => {
        PrettyErrorHandler(error);
        process.exit(1);
    });
