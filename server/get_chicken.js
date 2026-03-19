const { pool } = require('./src/config/db');

async function main() {
    try {
        const res2 = await pool.query('SELECT id, title, category_id FROM recipes WHERE title ILIKE \'%tavuk%\'');
        const recipes = res2.rows;
        
        console.log(`\nFound ${recipes.length} chicken recipes across all categories:`);
        recipes.forEach(r => console.log(`- [Cat ${r.category_id}] ${r.title}`));

        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
main();
