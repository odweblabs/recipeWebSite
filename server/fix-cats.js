const { pool } = require('./src/config/db');

async function fixCategories() {
    console.log('🔄 Kategori eşleştirmeleri güncelleniyor...');
    const client = await pool.connect();
    try {
        const mappings = {
            'çorba': 'Çorba Tarifleri',
            'ana yemek': 'Et Yemekleri', // Genelde ana yemekler et yemeği oluyor bu datada
            'tatlı': 'Tatlı Tarifleri',
            'salata': 'Salata & Meze & Kanepe',
            'kahvaltı': 'Kahvaltılık Tarifler',
            'atıştırmalık': 'Aperatifler',
            'içecek': 'İçecek Tarifleri'
        };

        for (const [oldName, newName] of Object.entries(mappings)) {
            console.log(`📡 '${oldName}' -> '${newName}' aktarılıyor...`);

            // Yeni kategori ID'sini bul
            const targetRes = await client.query('SELECT id FROM categories WHERE name = $1', [newName]);
            const oldRes = await client.query('SELECT id FROM categories WHERE name = $1', [oldName]);

            if (targetRes.rows[0] && oldRes.rows[0]) {
                const targetId = targetRes.rows[0].id;
                const oldId = oldRes.rows[0].id;

                // Tarifleri güncelle
                const updateRes = await client.query('UPDATE recipes SET category_id = $1 WHERE category_id = $2', [targetId, oldId]);
                console.log(`   ✅ ${updateRes.rowCount} tarif güncellendi.`);

                // Eski kategoriyi sil (opsiyonel ama temizlik iyidir)
                await client.query('DELETE FROM categories WHERE id = $1', [oldId]);
            }
        }

        console.log('\n✨ Tüm eşleştirmeler başarıyla tamamlandı.');
    } catch (err) {
        console.error('❌ Hata:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

fixCategories();
