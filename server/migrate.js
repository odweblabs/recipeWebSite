const { db } = require('./database');

try {
    console.log('Migrating database...');

    // Add servings column
    try {
        db.prepare('ALTER TABLE recipes ADD COLUMN servings INTEGER').run();
        console.log('Added servings column.');
    } catch (err) {
        if (!err.message.includes('duplicate column')) console.error(err.message);
    }

    // Add prep_time column
    try {
        db.prepare('ALTER TABLE recipes ADD COLUMN prep_time TEXT').run();
        console.log('Added prep_time column.');
    } catch (err) {
        if (!err.message.includes('duplicate column')) console.error(err.message);
    }

    // Add cook_time column
    try {
        db.prepare('ALTER TABLE recipes ADD COLUMN cook_time TEXT').run();
        console.log('Added cook_time column.');
    } catch (err) {
        if (!err.message.includes('duplicate column')) console.error(err.message);
    }

    console.log('Migration complete.');
} catch (err) {
    console.error('Migration failed:', err);
}
