const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');

// GET recipe image by ID
router.get('/recipe/:id', async (req, res) => {
    try {
        const recipes = await executeQuery('SELECT image_url FROM recipes WHERE id = $1', [req.params.id]);
        if (!recipes[0] || !recipes[0].image_url) {
            return res.status(404).json({ error: 'Recipe image not found' });
        }
        
        const imageUrl = recipes[0].image_url;
        
        // If it is a base64 Data URI, parse and send it as binary
        if (imageUrl.startsWith('data:')) {
            const commaIndex = imageUrl.indexOf(',');
            if (commaIndex !== -1) {
                const metadata = imageUrl.substring(0, commaIndex);
                const base64Data = imageUrl.substring(commaIndex + 1);
                const mimeMatch = metadata.match(/^data:([^;]+);/);
                const mimeType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : 'application/octet-stream';

                const buffer = Buffer.from(base64Data, 'base64');
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
                return res.send(buffer);
            }
        }
        
        // If it's a URL, redirect or return the URL (fallback)
        if (imageUrl.startsWith('http')) {
            return res.redirect(imageUrl);
        }
        
        // Default relative path fallback
        res.redirect(imageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user profile image by ID
router.get('/user/:id', async (req, res) => {
    try {
        const users = await executeQuery('SELECT profile_image FROM users WHERE id = $1', [req.params.id]);
        if (!users[0] || !users[0].profile_image) {
            return res.status(404).json({ error: 'User image not found' });
        }
        
        const imageUrl = users[0].profile_image;
        
        // If it is a base64 Data URI, parse and send it as binary
        if (imageUrl.startsWith('data:')) {
            const commaIndex = imageUrl.indexOf(',');
            if (commaIndex !== -1) {
                const metadata = imageUrl.substring(0, commaIndex);
                const base64Data = imageUrl.substring(commaIndex + 1);
                const mimeMatch = metadata.match(/^data:([^;]+);/);
                const mimeType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : 'application/octet-stream';

                const buffer = Buffer.from(base64Data, 'base64');
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
                return res.send(buffer);
            }
        }
        
        // If it's a URL, redirect
        if (imageUrl.startsWith('http')) {
            return res.redirect(imageUrl);
        }
        
        // Default relative path fallback
        res.redirect(imageUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
