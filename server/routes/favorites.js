const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Toggle favorite
router.post('/toggle/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    try {
        const existings = await executeQuery('SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
        const existing = existings[0];

        if (existing) {
            await executeQuery('DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
            res.json({ isFavorited: false });
        } else {
            await executeQuery('INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
            res.json({ isFavorited: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove favorite (Explicit DELETE)
router.delete('/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    try {
        const result = await executeQuery('DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
        if (result.changes > 0) {
            res.json({ message: 'Favorilerden kaldırıldı' });
        } else {
            res.status(404).json({ error: 'Favori bulunamadı' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if a recipe is favorited
router.get('/check/:recipeId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    try {
        const existings = await executeQuery('SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
        res.json({ isFavorited: existings.length > 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all favorites for current user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await executeQuery(`
            SELECT recipes.*, categories.name as category_name, 1 as is_favorited
            FROM recipes
            JOIN favorites ON recipes.id = favorites.recipe_id
            LEFT JOIN categories ON recipes.category_id = categories.id
            WHERE favorites.user_id = $1
        `, [userId]);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get favorites for a specific user (public - for profile pages)
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const favorites = await executeQuery(`
            SELECT 
                recipes.*, 
                categories.name as category_name,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count,
                (SELECT COUNT(*) FROM favorites WHERE recipe_id = recipes.id) as favorite_count
            FROM recipes
            JOIN favorites ON recipes.id = favorites.recipe_id
            LEFT JOIN categories ON recipes.category_id = categories.id
            WHERE favorites.user_id = $1
            ORDER BY favorites.created_at DESC
        `, [userId]);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
