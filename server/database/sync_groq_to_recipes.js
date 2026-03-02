require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { pool } = require('../src/config/db');

const CATEGORY_MAP = {
    'içecek': 'İçecek Tarifleri',
    'kahvaltı': 'Kahvaltılık Tarifler',
    'çorba': 'Çorba Tarifleri',
    'atıştırmalık': 'Aperatifler',
    'ana yemek': 'Ana Yemekler',
    'turşu': 'Salata & Meze & Kanepe',
    'salata': 'Salata & Meze & Kanepe',
    'tatlı': 'Tatlı Tarifleri'
};

const runSync = async () => {
    console.log('[START] Syncing groq_recipes to main recipes table...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Fetch categories to map names to IDs
        const catRes = await client.query('SELECT id, name FROM categories');
        const dbCategories = catRes.rows.reduce((acc, row) => {
            acc[row.name] = row.id;
            return acc;
        }, {});

        // Add 'Ana Yemekler' if it's missing (it wasn't in the default list)
        if (!dbCategories['Ana Yemekler']) {
            const res = await client.query("INSERT INTO categories (name) VALUES ('Ana Yemekler') ON CONFLICT DO NOTHING RETURNING id");
            if (res.rows.length > 0) dbCategories['Ana Yemekler'] = res.rows[0].id;
            else dbCategories['Ana Yemekler'] = (await client.query("SELECT id FROM categories WHERE name='Ana Yemekler'")).rows[0].id;
        }

        const groqRecipes = await client.query('SELECT * FROM groq_recipes');
        console.log(`Found ${groqRecipes.rows.length} recipes in groq_recipes table.`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const recipe of groqRecipes.rows) {
            // Textual formatting: ingredients and instructions
            let ingredientsText = '';
            if (recipe.malzemeler && Array.isArray(recipe.malzemeler)) {
                ingredientsText = recipe.malzemeler.map(m => `${m.miktar || ''} ${m.birim || ''} ${m.isim || ''}`.trim()).join('\n');
            }

            let instructionsText = '';
            if (recipe.yapilis_adimlari && Array.isArray(recipe.yapilis_adimlari)) {
                instructionsText = recipe.yapilis_adimlari.join('\n');
            }

            // Defaults if empty
            ingredientsText = ingredientsText || 'Malzemeler belirtilmemiş.';
            instructionsText = instructionsText || 'Yapılış anlatımı belirtilmemiş.';

            const targetCategoryName = CATEGORY_MAP[recipe.kategori] || 'Aperatifler';
            const categoryId = dbCategories[targetCategoryName] || null;

            // description can contain timing / portion data
            const descParts = [];
            if (recipe.porsiyon) descParts.push(`Porsiyon: ${recipe.porsiyon}`);
            if (recipe.hazirlik_suresi_dk) descParts.push(`Hazırlık: ${recipe.hazirlik_suresi_dk} dk`);
            if (recipe.pisirme_suresi_dk) descParts.push(`Pişirme: ${recipe.pisirme_suresi_dk} dk`);
            if (recipe.zorluk) descParts.push(`Zorluk: ${recipe.zorluk}`);
            const descriptionText = descParts.join(' | ');

            const query = `
                INSERT INTO recipes (title, description, ingredients, instructions, category_id, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING; -- Normally title isn't UNIQUE in recipes, but we'll check via SELECT
            `;

            // Wait, recipes title is NOT unique in the schema. We must check existence manually.
            const existCheck = await client.query('SELECT id FROM recipes WHERE title = $1', [recipe.tarif_adi]);

            if (existCheck.rows.length === 0) {
                await client.query(`
                    INSERT INTO recipes (title, description, ingredients, instructions, category_id, image_url)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [
                    recipe.tarif_adi,
                    descriptionText,
                    ingredientsText,
                    instructionsText,
                    categoryId,
                    null // default no image
                ]);
                insertedCount++;
            } else {
                skippedCount++;
            }
        }

        await client.query('COMMIT');
        console.log(`[SUCCESS] Sync complete! Inserted: ${insertedCount}. Skipped (Duplicates): ${skippedCount}.`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[ERROR] Failed to sync data', err.stack);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        process.exit(0);
    }
}

runSync();
