const { pool } = require('./database');

async function getInfo() {
    const client = await pool.connect();
    try {
        const cats = await client.query('SELECT * FROM categories');
        console.log('CATEGORIES:');
        console.log(JSON.stringify(cats.rows, null, 2));

        const settings = await client.query("SELECT * FROM site_settings WHERE key = 'chef_recommendation_id'");
        console.log('CHEF RECO:');
        console.log(JSON.stringify(settings.rows, null, 2));
    } finally {
        client.release();
        process.exit();
    }
}

getInfo();
