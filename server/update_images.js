const { executeQuery } = require('./database');

async function updateImages() {
    try {
        const result = await executeQuery("UPDATE recipes SET image_url = '/images/kitchen-illustration.png'");
        console.log(`Successfully updated ${result.changes} recipes.`);
        process.exit(0);
    } catch (err) {
        console.error('Error updating images:', err);
        process.exit(1);
    }
}

updateImages();
