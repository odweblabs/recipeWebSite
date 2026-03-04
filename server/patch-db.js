const { pool } = require('./src/config/db');

async function patch() {
    console.log('📝 Veritabanı şeması güncelleniyor...');
    const client = await pool.connect();
    try {
        await client.query(`
            ALTER TABLE recipes 
            ADD COLUMN IF NOT EXISTS servings INTEGER,
            ADD COLUMN IF NOT EXISTS prep_time INTEGER,
            ADD COLUMN IF NOT EXISTS cook_time INTEGER;
        `);
        console.log('✅ Şema başarıyla güncellendi.');
    } catch (err) {
        console.error('❌ Hata:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

patch();
