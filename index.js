#!/usr/bin/env node

require("dotenv").config();
const bunqCLI = require("./src/bunq-cli");

bunqCLI()
    .then(() => process.exit())
    .catch(error => {
        if (error.response && error.response.data) {
            console.error("API Error");
            console.error(error.response.data);
        } else {
            console.error(error);
        }
        process.exit(1);
    });
