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
| --save   | `string`    | false | Storage location for the bunqJSClient data, enabling this will significantly speed up future calls. Empty input will use `$HOME/bunq-cli.json` |
| --output    | `file`   | false | How to output the API data, empty input will use `file`  |
| --output-location    | `string`   | false | If `output` is file, decide where the files are stored. Has to be a directory which defaults to `$HOME/bunq-cli-api-data`  |


<!--| --cli    | boolean        | false |A silent alternative for CLI usage - not yet implemented | -->

## Screenshot

![Example usage gif](./assets/bunq-cli.gif)