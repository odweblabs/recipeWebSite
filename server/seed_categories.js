const { db } = require('./database');

const categories = [
    'Aperatifler',
    'Bakliyat Yemekleri',
    'Bebekler İçin',
    'Çocuklar İçin',
    'Çorba Tarifleri',
    'Diyet Yemekleri',
    'Dolma-Sarma Tarifleri',
    'Et Yemekleri',
    'Hamur İşi Tarifleri',
    'Hızlı Yemekler',
    'İçecek Tarifleri',
    'Kahvaltılık Tarifler',
    'Kurabiye Tarifleri',
    'Makarna Tarifleri',
    'Pilav Tarifleri',
    'Salata & Meze & Kanepe',
    'Sandviç Tarifleri',
    'Sebze Yemekleri',
    'Tatlı Tarifleri'
];

const seedCategories = () => {
    try {
        const stmt = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');

        console.log('Kategoriler ekleniyor...');
        db.transaction(() => {
            categories.forEach(cat => {
                stmt.run(cat);
            });
        })();

        console.log('Kategori güncelleme işlemi tamamlandı.');

        // Mevcut kategorileri listele
        const currentCategories = db.prepare('SELECT * FROM categories').all();
        console.log(`Toplam ${currentCategories.length} kategori mevcut.`);

    } catch (err) {
        console.error('Hata:', err);
    }
};

seedCategories();
