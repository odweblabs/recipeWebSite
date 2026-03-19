const { pool } = require('./src/config/db');

async function migrateCategories() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('1. Splitting Tavuk Yemekleri out of Et Yemekleri...');
        await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', ['Tavuk Yemekleri']);
        
        let extRes = await client.query('SELECT id FROM categories WHERE name = $1', ['Tavuk Yemekleri']);
        let tavukId = extRes.rows[0].id;

        const moveTavuk = await client.query('UPDATE recipes SET category_id = $1 WHERE category_id = 16 AND title ILIKE \'%tavuk%\'', [tavukId]);
        console.log(`Moved ${moveTavuk.rowCount} recipes from Et to Tavuk Yemekleri.`);

        console.log('2. Removing Bebekler İçin and moving its recipes to Çocuklar İçin...');
        const moveBebek = await client.query('UPDATE recipes SET category_id = 12 WHERE category_id = 11');
        console.log(`Moved ${moveBebek.rowCount} recipes from Bebekler to Çocuklar.`);
        await client.query('DELETE FROM categories WHERE id = 11');

        console.log('3. Fixing Sweet recipes in Dolma/Sarma to Tatlı Tarifleri...');
        const moveSweets = await client.query('UPDATE recipes SET category_id = 27 WHERE category_id = 15 AND (title ILIKE \'%kadayıf%\' OR title ILIKE \'%paşa sarması%\' OR title ILIKE \'%tatlı%\')');
        console.log(`Moved ${moveSweets.rowCount} recipes from Dolma to Tatlı Tarifleri.`);

        console.log('4. Capitalizing turşu...');
        await client.query('UPDATE categories SET name = \'Turşu Tarifleri\' WHERE id = 8');

        console.log('5. Adding a few fresh categories, including Ana Yemekler...');
        const newCats = [
            'Ana Yemekler',
            'Zeytinyağlılar',
            'Sokak Lezzetleri',
            'Yöresel Tarifler',
            'Vegan Yemekler'
        ];
        
        for (const name of newCats) {
            // Check if exists because ON CONFLICT might not work if there's no unique constraint on name
            const check = await client.query('SELECT id FROM categories WHERE name = $1', [name]);
            if (check.rows.length === 0) {
                await client.query('INSERT INTO categories (name) VALUES ($1)', [name]);
            }
        }
        console.log('Added new categories: Ana Yemekler, Zeytinyağlılar, Sokak Lezzetleri, Yöresel Tarifler, Vegan Yemekler');

        await client.query('COMMIT');
        console.log('Migration completed successfully!');
    } catch(err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        client.release();
        process.exit(0);
    }
}

migrateCategories();
