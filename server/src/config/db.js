const path = require('path');
// Vercel'de env değişkenleri dashboard'dan gelir, lokalde .env dosyasından okunur
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL;

// If DATABASE_URL is in 'psql -h ...' format, convert it to URI
if (connectionString && connectionString.startsWith('psql')) {
    const hostMatch = connectionString.match(/-h\s+([^\s]+)/);
    const portMatch = connectionString.match(/-p\s+(\d+)/);
    const dbMatch = connectionString.match(/-d\s+([^\s]+)/);
    const userMatch = connectionString.match(/-U\s+([^\s]+)/);

    if (hostMatch && userMatch && dbMatch) {
        const host = hostMatch[1];
        const port = portMatch ? portMatch[1] : '5432';
        const db = dbMatch[1];
        const user = userMatch[1];
        const password = process.env.DB_PASSWORD;
        if (password) {
            connectionString = `postgresql://${user}:${password}@${host}:${port}/${db}`;
        } else {
            // Fallback if password isn't set separately
            connectionString = `postgresql://${user}@${host}:${port}/${db}`;
        }
    }
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' || process.env.VERCEL
        ? { rejectUnauthorized: false }
        : false,
    max: 1, // Serverless için tek bağlantı
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
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
