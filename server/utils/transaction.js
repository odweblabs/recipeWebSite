const { pool } = require('../database');
const logger = require('./logger');

/**
 * Executes a callback within a managed PostgreSQL transaction.
 * Automatically handles BEGIN, COMMIT, and ROLLBACK.
 *
 * @param {Function} callback - Async function that receives the transaction `client`
 * @returns {Promise<any>} - The result of the callback
 */
const withTransaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Transaction failed, rolling back.', { error: error.message });
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { withTransaction };
