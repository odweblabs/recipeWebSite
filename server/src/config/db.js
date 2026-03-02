const path = require('path');
// Vercel'de env değişkenleri dashboard'dan gelir, lokalde .env dosyasından okunur
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' || process.env.VERCEL
        ? { rejectUnauthorized: false }
        : false
});

// Database connection check on startup
const initDb = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database (Centralized).');
        client.release();
        return true;
    } catch (err) {
        console.error('Database connection error:', err.message);
        return false;
    }
};

module.exports = { pool, initDb };
