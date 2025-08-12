/**
 * Wrapper function to handle asynchronous middleware errors.
 * @deprecated Express 5 natively supports async middleware
 * @param {Function} fn - The asynchronous function to be handled.
 * @returns {Function} A new function that executes the provided function and catches any errors.
 */
const asyncHandler = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    }
}
//MIGHTDO: create various custom error classes with preset response (validationError, unuthenticatedError, unuserorizedError, etc.)
/**
 * Custom error class for handling response errors.
 * @extends Error
 */
class responseError extends Error {
    /**
     * Creates an instance of responseError.
     * @param {number} statusCode - The HTTP status code.
     * @param {string} message - The error message.
     * @param {Error} [error] - An optional error object for additional context.
     */
    constructor(statusCode, message, error) {
        super(message);
        this.error = error;
        this.statusCode = parseInt(statusCode) || 500;
        this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    }
}

export { asyncHandler, responseError }
