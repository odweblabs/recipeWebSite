const { db } = require('./server/database.js');

const missingCategories = [
    'Pasta Tarifleri',
    'Kek Tarifleri',
    'Balık ve Deniz Ürünleri',
    'Kış Hazırlıkları & Reçel',
    'Kür ve Detoks Tarifleri'
];

let added = 0;
for (const cat of missingCategories) {
    try {
        const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
        stmt.run(cat);
        console.log(`Added category: ${cat}`);
        added++;
    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            console.log(`Category already exists: ${cat}`);
        } else {
            console.error(`Error adding ${cat}:`, err.message);
        }
    }
}

console.log(`Total added: ${added}`);
