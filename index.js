#!/usr/bin/env node

require("dotenv").config();
const bunqCLI = require("./src/bunq-cli");

bunqCLI()
    .then(() => {
        process.exit();
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
