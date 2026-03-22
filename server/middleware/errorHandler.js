const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);
    if (err.stack) {
        logger.error(err.stack);
    }

    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Sanitize error message in production for 500 errors
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal Server Error';
    }

    res.status(statusCode).json({
        error: message
    });
};

module.exports = errorHandler;
