const { db } = require('./database');

try {
    console.log('Migrating database for favorites...');

    const favoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER,
        recipe_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
      );
    `;

    db.exec(favoritesTable);
    console.log('Favorites table created.');

    console.log('Migration complete.');
} catch (err) {
    console.error('Migration failed:', err);
}
