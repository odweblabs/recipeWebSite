const { db } = require('./database');

const mappings = [
    { id: 5, keywords: ['Çorba'] },
    { id: 8, keywords: ['Et', 'Tavuk', 'Kebap', 'Köfte', 'Kıyma', 'Pirzola', 'Antrikot', 'Bonfile', 'Kavurma', 'Şiş', 'Burger', 'Nugget', 'Kanat', 'Dolma', 'Sarma'] },
    { id: 19, keywords: ['Tatlı', 'Kek', 'Pasta', 'Kurabiye', 'Sütlaç', 'Muhallebi', 'Baklava', 'Kadayıf', 'Helva', 'Turta', 'Brownie'] },
    { id: 9, keywords: ['Börek', 'Poğaça', 'Ekmek', 'Hamur', 'Açma', 'Simit', 'Pide', 'Lahmacun', 'Gözleme'] },
    { id: 14, keywords: ['Makarna', 'Spagetti', 'Erişte', 'Mantı', 'Lazanya'] },
    { id: 18, keywords: ['Sebze', 'Zeytinyağlı', 'Bamya', 'Fasulye', 'Pırasa', 'Karnabahar', 'Ispanak', 'Kabak', 'Patlıcan', 'Bezelye', 'Enginar', 'Kereviz', 'Türlü', 'Musakka'] },
    { id: 15, keywords: ['Pilav'] },
    { id: 16, keywords: ['Salata', 'Meze', 'Cacık', 'Humus', 'Tarator', 'Ezme', 'Şakşuka'] },
    { id: 12, keywords: ['Kahvaltı', 'Omlet', 'Menemen', 'Krep', 'Pankek', 'Mıhlama', 'Kuymak'] },
    { id: 11, keywords: ['İçecek', 'Limonata', 'Ayran', 'Şerbet', 'Smoothie', 'Kokteyl', 'Kahve', 'Çay'] },
    { id: 1, keywords: ['Aperatif', 'Atıştırmalık', 'Kıtır', 'Cips', 'Kanepe'] },
    { id: 2, keywords: ['Nohut', 'Mercimek', 'Barbunya', 'Bakla'] }
];

const sync = () => {
    console.log('--- Kategori Senkronizasyonu Başladı ---');

    let totalUpdated = 0;

    // Fetch recipes that are either in a general category (39) or have no specific mapping yet
    const recipes = db.prepare('SELECT id, title FROM recipes').all();
    console.log(`Toplam ${recipes.length} tarif taranıyor...`);

    const updateStmt = db.prepare('UPDATE recipes SET category_id = ? WHERE id = ?');

    db.transaction(() => {
        for (const recipe of recipes) {
            let matchedId = null;
            const titleUpper = recipe.title.toLowerCase();

            for (const mapping of mappings) {
                if (mapping.keywords.some(kw => titleUpper.includes(kw.toLowerCase()))) {
                    matchedId = mapping.id;
                    break;
                }
            }

            if (matchedId) {
                updateStmt.run(matchedId, recipe.id);
                totalUpdated++;
            }
        }
    })();

    console.log(`--- İşlem Tamamlandı ---`);
    console.log(`Toplam Güncellenen Tarif: ${totalUpdated}`);
};

try {
    sync();
} catch (err) {
    console.error('Hata:', err);
}
