require("dotenv").config();

import BunqCLI from "./BunqCLI";
import PrettyErrorHandler from "./PrettyErrorHandler";

const bunqCLI = new BunqCLI();
bunqCLI
    .run()
    .then(() => process.exit())
    .catch(error => {
        const showedPrettyError = PrettyErrorHandler(error);
        if (!showedPrettyError) console.error(error);

        process.exit(1);
    });
