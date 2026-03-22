const path = require('path');
// Vercel'de env değişkenleri dashboard'dan gelir, lokalde .env dosyasından okunur
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env');
}

const pool = new Pool({
    connectionString: connectionString.replace('5432', '6543'),
    ssl: process.env.NODE_ENV === 'production' || process.env.VERCEL
        ? { rejectUnauthorized: false }
        : false,
    max: 5, // Allow concurrent queries without timeout starvation
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
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
