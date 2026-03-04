const { pool } = require('./src/config/db');

async function checkMapping() {
    const client = await pool.connect();
    try {
        console.log('--- Kategoriler ---');
        const cats = await client.query('SELECT id, name FROM categories');
        console.table(cats.rows);

        console.log('\n--- Tariflerin Kategori Dağılımı ---');
        const stats = await client.query(`
            SELECT c.name as kategori_adi, COUNT(r.id) as tarif_sayisi
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id
            GROUP BY c.name
            ORDER BY tarif_sayisi DESC
        `);
        console.table(stats.rows);

        console.log('\n--- Kategorisi Boş Olan Tarif Sayısı ---');
        const nullCats = await client.query('SELECT COUNT(*) FROM recipes WHERE category_id IS NULL');
        console.log('Null category_id:', nullCats.rows[0].count);

    } catch (err) {
        console.error('Hata:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

checkMapping();
