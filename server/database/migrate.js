require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../database');
const logger = require('../utils/logger');

const runMigrations = async () => {
    logger.info('Starting database migrations...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Ensure migrations table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename TEXT UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const executedMigrations = (await client.query('SELECT filename FROM migrations')).rows.map(m => m.filename);
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        let applied = 0;
        for (const file of files) {
            if (!executedMigrations.includes(file)) {
                logger.info(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await client.query(sql);
                await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
                applied++;
            }
        }

        await client.query('COMMIT');
        logger.info(`Migrations finished. ${applied} applied.`);
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error('Migration failed, rolled back.', { error: err.message });
        process.exit(1);
    } finally {
        client.release();
        pool.end();
    }
};

runMigrations();
