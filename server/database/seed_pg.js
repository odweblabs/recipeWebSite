require('dotenv').config({ path: '../.env' });
const { withTransaction } = require('../utils/transaction');
const logger = require('../utils/logger');

const seedCategories = [
    'Aperatifler', 'Bakliyat Yemekleri', 'Bebekler İçin', 'Çocuklar İçin',
    'Çorba Tarifleri', 'Diyet Yemekleri', 'Dolma-Sarma Tarifleri',
    'Et Yemekleri', 'Hamur İşi Tarifleri', 'Hızlı Yemekler', 'İçecek Tarifleri',
    'Kahvaltılık Tarifler', 'Kurabiye Tarifleri', 'Makarna Tarifleri',
    'Pilav Tarifleri', 'Salata & Meze & Kanepe', 'Sandviç Tarifleri',
    'Sebze Yemekleri', 'Tatlı Tarifleri'
];

const runSeed = async () => {
    logger.info('Starting idempotent database seed...');
    try {
        await withTransaction(async (client) => {
            for (const cat of seedCategories) {
                // ON CONFLICT DO NOTHING makes it idempotent
                await client.query(`
                    INSERT INTO categories (name) 
                    VALUES ($1) 
                    ON CONFLICT (name) DO NOTHING
                `, [cat]);
            }
        });
        logger.info('Database seeded successfully.');
    } catch (err) {
        logger.error('Failed to seed database', { error: err.message });
    } finally {
        process.exit(0);
    }
};

runSeed();
