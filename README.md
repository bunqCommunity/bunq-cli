# bunq-cli
An unofficial and open source CLI tool to quickly test API requests with the bunq API.

Either test API requests interactively or use it directly in other command line tools and cronjobs.

![Example usage gif](./assets/bunq-cli.gif)

## Features

 - Create and add funds to sandbox accounts within seconds
 - Send API requests and output to console or files as JSON

## Installation
Clone and run `yarn` or`npm install`

## Usage
Run with node
```bash
$ node index.js
```

Optional file location
```bash
$ node index.js --save ./custom-storage-location.json
```

Using `yarn link` to act as an actual command:
```bash
$ yarn link
$ bunq-cli --save
```

## Options
Any environment variables starting with `BUNQ_CLI_` will be parsed as input parameters. Some examples of this are:

  - `BUNQ_CLI_API_KEY=some-key-value` instead of `--api-key`
  - `BUNQ_CLI_DEVICE_NAME=some-key-value` instead of `--device-name`
  - `BUNQ_CLI_SAVE=true` instead of `--save`

## Generic options
These are the most basic options that you'll need. If `--save` or `-s` isn't defined, bunqJSClient will do everything in memory without writing data to a file. Subsequent API calls will be faster if you do use this option since it won't have to setup a new API session with bunq.

| Option   | Input Type       | Default | Info   |
| ------- | -------- | -----|------ |
| -s/--save   | `string`    | false | Storage location for the bunqJSClient data, enabling this will significantly speed up future calls. Empty input will use `$HOME/bunq-cli.json` |
| --output    | `file`   | false | How to output the API data, empty input will use `file`.  |
| --output-location    | `string`   | false | If `output` is file, decide where the files are stored. Has to be a directory which defaults to `$HOME/bunq-cli-api-data`  |

## CLI mode options
For scripts/quick data fetching use the `--cli` option which makes sure that bunq-cli won't start in interactive mode. By default the `--output` mode is set to `console` in CLI mode.

These options are planned but NOT all implemented yet

### Upper level commands
Only one of these can be defined

 - `--user` fetches the User object.
 - `--accounts` fetches all monetary accounts for the current User object.
 - `--events` fetches all events using the `/user/{userId}/event` endpoint.
 - `--endpoint` a specific endpoint you want to call. Only a few basic LIST and GET endpoints are supported by this, run it without a value to view the list of supported shorthand endpoints
 - `--url` a specific URL you wish to call.
 
### Optional parameters 

 - `--method` defaults to "LIST"
 - `--data` a string with JSON which is the data that well be sent in POST/PUT requests
 - `--count`, `--older-id` and `--newer-id` for filtering LIST requests like described in the bunq docs
 - `--account`/`--account-id` to define which MonetaryAccount should be used, required for most LIST endpoints
 - `--event-id` to define which object should be fetched, required for most GET endpoints.
 - `--pretty` Whether to prettify the JSON output or not. You can give it a string to use as spacer, defaults to 2 spaces, use '\t' to format with tabs for example

