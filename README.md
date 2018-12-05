# bunq-cli

Work in progress

## Setup
```bash
$ yarn
$ ./index.js
```
Optional file location
```bash
$ ./index.js --save ./custom-storage-location.json
```

## Options

| Option   | Type       | Default | Info   |
| ------- | -------- | -----|------ |
| --save   | boolean    | false | Storage location for the bunqJSClient data, enabling this will significantly speed up future calls. If defined with no input, it'll fallback to `${workingDirectory}/bunq-cli-storage.json` |
| --out    | `console`, `file`, `true`   | false | How to output the API data  |
| --cli    | boolean        | false |A silent alternative for CLI usage - not yet implemented |

## Screenshot

![Example screenshot](https://i.imgur.com/JrBIKa9.png)