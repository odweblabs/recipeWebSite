const { executeQuery } = require('./database');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node apply_migration.js <migration_file_path>');
        process.exit(1);
    }

    const migrationFile = args[0];
    const migrationPath = path.isAbsolute(migrationFile) ? migrationFile : path.join(__dirname, migrationFile);

    if (!fs.existsSync(migrationPath)) {
        console.error(`Migration file not found: ${migrationPath}`);
        process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    try {
        console.log(`Applying migration: ${path.basename(migrationPath)}...`);
        // Split by semicolon and filter out empty statements if needed, 
        // but executeQuery usually handles multiple statements if they are valid SQL.
        await executeQuery(sql);
        console.log('Migration applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error applying migration:', err);
        process.exit(1);
    }
}

applyMigration();
