const { pool } = require('../src/config/db');

async function recategorize() {
    console.log('🔍 Tarifler anahtar kelimelere göre yeniden kategorize ediliyor...');
    const client = await pool.connect();
    try {
        // Yeni bir kategori ekleyelim: Deniz Ürünleri
        await client.query("INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", ['Deniz Ürünleri']);

        const catRes = await client.query("SELECT id, name FROM categories");
        const categoryMap = {};
        catRes.rows.forEach(c => categoryMap[c.name] = c.id);

        const rules = [
            { keywords: ['balık', 'levrek', 'çipura', 'mezgit', 'palamut', 'somon', 'karides', 'kalamar', 'hamsi', 'istavrit', 'lüfer'], target: 'Deniz Ürünleri' },
            { keywords: ['fasulye', 'nohut', 'mercimek', 'bakla', 'bezelye', 'barbunya'], target: 'Bakliyat Yemekleri' },
            { keywords: ['dolma', 'sarma'], target: 'Dolma-Sarma Tarifleri' },
            { keywords: ['börek', 'poğaça', 'açma', 'pide', 'çörek', 'pizz', 'mantı', 'erişte'], target: 'Hamur İşi Tarifleri' },
            { keywords: ['kurabiye'], target: 'Kurabiye Tarifleri' },
            { keywords: ['makarna'], target: 'Makarna Tarifleri' },
            { keywords: ['pilav'], target: 'Pilav Tarifleri' },
            { keywords: ['sandviç', 'burger', 'tost'], target: 'Sandviç Tarifleri' },
            { keywords: ['sebze', 'bamya', 'ıspanak', 'pırasa', 'enginar', 'kereviz', 'taze fasulye', 'karnabahar', 'brokoli'], target: 'Sebze Yemekleri' },
            { keywords: ['hızlı', 'pratik', 'şipşak', '5 dk', '10 dk'], target: 'Hızlı Yemekler' },
            { keywords: ['bebek', 'mama', 'ek gıda'], target: 'Bebekler İçin' },
            { keywords: ['çocuk', 'beslenme çantası', 'okul', 'neşeli'], target: 'Çocuklar İçin' },
            { keywords: ['diyet', 'fit', 'zayıfla', 'kalori', 'şekersiz', 'unsuz'], target: 'Diyet Yemekleri' }
        ];

        let totalUpdated = 0;

        for (const rule of rules) {
            const targetId = categoryMap[rule.target];
            if (!targetId) {
                console.log(`⚠️ Kategori bulunamadı: ${rule.target}`);
                continue;
            }

            for (const kw of rule.keywords) {
                const res = await client.query(`
                    UPDATE recipes 
                    SET category_id = $1 
                    WHERE (title ILIKE $2 OR description ILIKE $2)
                `, [targetId, `%${kw}%`]);

                if (res.rowCount > 0) {
                    // console.log(`   ✅ '${kw}' kelimesiyle ${res.rowCount} tarif '${rule.target}' kategorisine taşındı.`);
                    totalUpdated += res.rowCount;
                }
            }
        }

        // Kalan 'Et Yemekleri' içindeki 'Köfte'leri de kontrol edebiliriz ama zaten çoğu et yemeğidir.

        console.log(`\n✨ İşlem tamam! Toplam ${totalUpdated} tarif doğru kategorisine taşındı.`);

    } catch (err) {
        console.error('❌ Hata:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

recategorize();
