require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

// Path is explicitly hardcoded to fulfill requirements
const DATA_FILE_PATH = path.resolve(__dirname, '../data/recipes_groq_cleaned.json');

const runSeed = async () => {
    console.log('----------------------------------------------------');
    console.log(`[START] Initiating Database Seed from: ${DATA_FILE_PATH}`);
    console.log('----------------------------------------------------');

    let client;
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            throw new Error(`Data file not found at ${DATA_FILE_PATH}`);
        }

        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const recipes = JSON.parse(rawData);

        console.log(`[INFO] Successfully parsed JSON. Found ${recipes.length} records.`);

        client = await pool.connect();

        // Begin Transaction
        await client.query('BEGIN');
        console.log('[INFO] Transaction STARTED');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const recipe of recipes) {
            const query = `
         INSERT INTO groq_recipes (
            tarif_adi, 
            kategori, 
            porsiyon, 
            hazirlik_suresi_dk, 
            pisirme_suresi_dk, 
            zorluk, 
            pisirme_yontemi, 
            malzemeler, 
            yapilis_adimlari, 
            _source
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (tarif_adi) DO NOTHING;
       `;

            const values = [
                recipe.tarif_adi,
                recipe.kategori || null,
                recipe.porsiyon || null,
                recipe.hazirlik_suresi_dk || null,
                recipe.pisirme_suresi_dk || null,
                recipe.zorluk || null,
                JSON.stringify(recipe.pisirme_yontemi || []),
                JSON.stringify(recipe.malzemeler || []),
                JSON.stringify(recipe.yapilis_adimlari || []),
                JSON.stringify(recipe._source || {})
            ];

            const result = await client.query(query, values);
            if (result.rowCount > 0) {
                insertedCount++;
            } else {
                skippedCount++;
            }
        }

        // Commit Transaction
        await client.query('COMMIT');
        console.log('[INFO] Transaction COMMITTED');
        console.log(`[SUCCESS] Seed complete. Inserted: ${insertedCount}. Skipped (Duplicates): ${skippedCount}.`);

    } catch (err) {
        if (client) {
            // Rollback Transaction on error
            await client.query('ROLLBACK');
            console.error('[ERROR] Transaction ROLLED BACK due to an error.');
        }
        console.error(`[FATAL] Seeding failed: ${err.message}`);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
        console.log('----------------------------------------------------');
        console.log('[END] Database Connection Closed.');
        console.log('----------------------------------------------------');
        process.exit(0);
    }
};

runSeed();
