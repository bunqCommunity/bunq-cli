# bunq-cli

Work in progress

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

| Option   | Input Type       | Default | Info   |
| ------- | -------- | -----|------ |
| -s/--save   | `string`    | false | Storage location for the bunqJSClient data, enabling this will significantly speed up future calls. Empty input will use `$HOME/bunq-cli.json` |
| --output    | `file`   | false | How to output the API data, empty input will use `file`.  |
| --output-location    | `string`   | false | If `output` is file, decide where the files are stored. Has to be a directory which defaults to `$HOME/bunq-cli-api-data`  |

## CLI mode options
For scripts/quick data fetching use the `--cli` option which makes sure that bunq-cli won't start in interactive mode. The options mentioned above can still be used.

These options are planned but NOT all implemented yet

### Upper level commands
Only one of these can be defined

 - `--user` fetches the User object.
 - `--accounts` fetches all monetary accounts for the current User object.
 - `--events` fetches all events using the `/user/{userId}/event` endpoint.
 - `--endpoint` a specific endpoint you want to call.
 
### Optional parameters 

 - `--method` defaults to "LIST"
 - `--data` a string with JSON which is the data that well be sent in POST/PUT requests
 - `--count`, `--older-id` and `--newer-id` for filtering LIST requests like described in the bunq docs
 - `--account`/`--account-id` to define which MonetaryAccount should be used, required for most LIST endpoints
 - `--event-id` to define which object should be fetched, required for most GET endpoints.
 - `--pretty` Whether to prettify the JSON output or not. You can give it a string to use as spacer, defaults to '\t', use '  ' to format with 2 spaces for example

<!--| --cli    | boolean        | false |A silent alternative for CLI usage - not yet implemented | -->

## Screenshot

![Example usage gif](./assets/bunq-cli.gif)