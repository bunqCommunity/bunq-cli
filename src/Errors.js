const Errors = {};

/**
 * Generic BunqCLIError which will output pretty messages
 */
class BunqCLIError extends Error {
  constructor(props) {
    super(props);
  }
}

/**
 * Used in interactive mode to break the infinite input loop
 */
class DoneError extends BunqCLIError {
    constructor(props) {
        super(props);
    }
}

Errors.BunqCLIError = BunqCLIError;
Errors.DoneError = DoneError;

module.exports = Errors;
