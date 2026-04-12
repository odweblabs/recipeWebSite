const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');

// Helper to generate XML for sitemap
const generateSitemapXml = (recipes, baseUrl) => {
    const urls = [
        { loc: baseUrl, changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/recipes`, changefreq: 'daily', priority: '0.8' },
        { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.7' },
        { loc: `${baseUrl}/categories`, changefreq: 'monthly', priority: '0.6' }
    ];

    recipes.forEach(recipe => {
        let date = new Date().toISOString().split('T')[0];
        try {
            const rawDate = recipe.updated_at || recipe.created_at;
            if (rawDate) {
                const parsedDate = new Date(rawDate);
                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString().split('T')[0];
                }
            }
        } catch (e) {}

        urls.push({
            loc: `${baseUrl}/recipes/${recipe.id}`,
            lastmod: date,
            changefreq: 'weekly',
            priority: '0.6'
        });
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
};

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const recipes = await executeQuery('SELECT id, created_at FROM recipes ORDER BY created_at DESC');
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        
        const sitemap = generateSitemapXml(recipes, baseUrl);
        
        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (err) {
        console.error('Sitemap generation error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// Utility to ping Google (optional but requested)
router.get('/ping-google', async (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    
    try {
        // Note: Google's direct ping endpoint is deprecated but often still used in simple scripts
        // Standard practice now is using Search Console API, but for this request we'll provide 
        // a simple documented way or a placeholder for future implementation.
        // await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
        res.json({ success: true, message: 'Google Sitemap Ping placeholder executed', url: sitemapUrl });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
