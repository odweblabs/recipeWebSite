const { db } = require('./server/database.js');

const categories = db.prepare('SELECT id, name FROM categories').all();

const getId = (name) => {
    const cat = categories.find(c => c.name === name);
    return cat ? cat.id : null;
};

const map = {
    'Pasta Tarifleri': ['Pasta', 'Malaga', 'Trileçe', 'Magnolia', 'Tartolet', 'Supangle', 'Ekler', 'Şekerpare', 'Ekler'],
    'Kek Tarifleri': ['Kek', 'Brownie'],
    'Balık ve Deniz Ürünleri': ['Hamsi', 'Palamut', 'Balık'],
    'Kış Hazırlıkları & Reçel': ['Marmelat', 'Pestil', 'Turşu', 'Zeytin'],
    'Kür ve Detoks Tarifleri': ['Kür', 'Detoks', 'Suyu', 'Yağ Yakıcı', 'Göbek Erit', 'Zayıflat', 'Şurup', 'Horlama', 'Kereviz Sapı Suyu', 'Altın Süt', 'Yeşil Kahve', 'Kilo Verdi']
};

const recipes = db.prepare('SELECT id, title FROM recipes').all();
let updated = 0;

for (const recipe of recipes) {
    let newCategoryId = null;

    for (const [catName, keywords] of Object.entries(map)) {
        const catId = getId(catName);
        if (!catId) continue;

        for (const word of keywords) {
            if (recipe.title.toLowerCase().includes(word.toLowerCase())) {
                newCategoryId = catId;
                break;
            }
        }
        if (newCategoryId) break;
    }

    if (newCategoryId) {
        // Find if its current category is already this, or something else
        const currentCat = db.prepare('SELECT category_id FROM recipes WHERE id = ?').get(recipe.id);
        if (currentCat && currentCat.category_id !== newCategoryId) {
            db.prepare('UPDATE recipes SET category_id = ? WHERE id = ?').run(newCategoryId, recipe.id);
            console.log(`Updated "${recipe.title}" to category ID ${newCategoryId}`);
            updated++;
        }
    }
}

console.log(`Finished mapping categories! Updated ${updated} recipes.`);
