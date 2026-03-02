require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Database connection check on startup
const initDb = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database (Centralized).');
        client.release();
    } catch (err) {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1);
    }
};

module.exports = { pool, initDb };
