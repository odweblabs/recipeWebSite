const { pool } = require('./database');

async function limitLikes() {
    console.log('🧹 Admin beğenileri 600\'e düşürülüyor...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Admin'in tüm beğenilerini temizle
        console.log('🗑️ Mevcut beğeniler temizleniyor...');
        await client.query("DELETE FROM favorites WHERE recipe_id IN (SELECT id FROM recipes WHERE user_id = 2)");

        // 2. Sadece 600 adet beğeni ekle
        // İlk 600 test kullanıcısının adminin en son (veya rastgele bir) tarifini beğenmesini sağlayalım
        console.log('🆕 600 yeni beğeni ekleniyor...');
        await client.query(`
            INSERT INTO favorites (user_id, recipe_id)
            SELECT u.id, r.id
            FROM (SELECT id FROM users WHERE username LIKE 'testuser%' LIMIT 600) as u
            CROSS JOIN (SELECT id FROM recipes WHERE user_id = 2 LIMIT 1) as r
            ON CONFLICT DO NOTHING;
        `);

        await client.query('COMMIT');
        console.log('✅ Admin beğenileri başarıyla 600\'e düşürüldü!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ HATA:', err.message);
    } finally {
        client.release();
        process.exit(0);
    }
}

limitLikes();
