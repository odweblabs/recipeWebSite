const { pool } = require('./src/config/db');

async function seedCategories() {
    console.log('🌱 Eski kategoriler yükleniyor...');
    const client = await pool.connect();
    try {
        const categories = [
            'Aperatifler', 'Bakliyat Yemekleri', 'Bebekler İçin', 'Çocuklar İçin',
            'Çorba Tarifleri', 'Diyet Yemekleri', 'Dolma-Sarma Tarifleri',
            'Et Yemekleri', 'Hamur İşi Tarifleri', 'Hızlı Yemekler', 'İçecek Tarifleri',
            'Kahvaltılık Tarifler', 'Kurabiye Tarifleri', 'Makarna Tarifleri',
            'Pilav Tarifleri', 'Salata & Meze & Kanepe', 'Sandviç Tarifleri',
            'Sebze Yemekleri', 'Tatlı Tarifleri'
        ];

        for (const cat of categories) {
            await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [cat]);
        }

        console.log('✅ Tüm kategoriler başarıyla eklendi.');
    } catch (err) {
        console.error('❌ Hata:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedCategories();
