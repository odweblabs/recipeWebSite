const { pool } = require('./src/config/db');

async function main() {
    try {
        const res = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        console.log(JSON.stringify(res.rows, null, 2));

        const res2 = await pool.query('SELECT id, title, category_id FROM recipes');
        const recipes = res2.rows;
        
        // Find chicken recipes in meat category
        const meatCat = res.rows.find(c => c.name.toLowerCase().includes('et'));
        if (meatCat) {
             const chickenInMeat = recipes.filter(r => r.category_id === meatCat.id && r.title.toLowerCase().includes('tavuk'));
             console.log(`\nFound ${chickenInMeat.length} chicken recipes in Meat category:`);
             chickenInMeat.forEach(r => console.log(`- ${r.title}`));
        }

        // Find sweet recipes in Dolma
        const dolmaCat = res.rows.find(c => c.name.toLowerCase().includes('dolma'));
        if (dolmaCat) {
             const sweets = recipes.filter(r => r.category_id === dolmaCat.id && (r.title.toLowerCase().includes('tatlı') || r.title.toLowerCase().includes('sarma') && r.title.toLowerCase().includes('tatli') || r.title.toLowerCase().includes('şeker') || r.title.toLowerCase().includes('irmik') || r.title.toLowerCase().includes('kadayıf')));
             console.log(`\nFound ${sweets.length} sweet recipes in Dolma category:`);
             sweets.forEach(r => console.log(`- ${r.title}`));
        }
        
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
main();
