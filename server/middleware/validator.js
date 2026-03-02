const logger = require('../utils/logger');

/**
 * Creates a validation middleware that enforces the presence of required fields.
 * Maintains backwards compatibility by returning exact 400 shapes.
 *
 * @param {string[]} requiredFields - Body parameter keys that must be present
 */
const validateBody = (requiredFields) => {
    return (req, res, next) => {
        const missing = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');

        if (missing.length > 0) {
            logger.warn('Validation failed', { missing, path: req.originalUrl });
            // Mimicking the old legacy error output shape for strict backward compatibility
            return res.status(400).json({ error: `${missing.join(', ')} is required` });
        }
        next();
    };
};

module.exports = { validateBody };
