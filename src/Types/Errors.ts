/**
 * Generic BunqCLIError which will output pretty messages
 */
export class BunqCLIError extends Error {}

/**
 * Used in interactive mode to break the infinite input loop
 */
export class DoneError extends BunqCLIError {}

export default BunqCLIError;
