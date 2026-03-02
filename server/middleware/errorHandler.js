const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);
    if (err.stack) {
        logger.error(err.stack);
    }

    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: message
    });
};

module.exports = errorHandler;
