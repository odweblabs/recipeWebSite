/**
 * Wraps async controller functions to catch exceptions and route them to the Express error handler.
 * Eliminates the need for repetitive try/catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
