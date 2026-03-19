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
                recipes.id, recipes.title, recipes.image_url, recipes.prep_time,
                recipes.cook_time, recipes.servings, recipes.category_id,
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as author_username,
                users.full_name as author_name,
                users.profile_image as author_image,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count,
                (SELECT COUNT(*) FROM favorites WHERE recipe_id = recipes.id) as favorite_count
            FROM recipes
            JOIN favorites ON recipes.id = favorites.recipe_id
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE favorites.user_id = $1
            ORDER BY favorites.created_at DESC
        `, [userId]);
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get who liked a user's recipes (for profile likes modal)
router.get('/recipe-likers/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const likers = await executeQuery(`
            SELECT 
                r.id as recipe_id,
                r.title as recipe_title,
                r.image_url as recipe_image,
                u.id as liker_id,
                u.username as liker_username,
                u.full_name as liker_name,
                u.profile_image as liker_image,
                f.created_at as liked_at
            FROM favorites f
            JOIN recipes r ON f.recipe_id = r.id
            JOIN users u ON f.user_id = u.id
            WHERE r.user_id = $1
            ORDER BY r.id, f.created_at DESC
        `, [userId]);
        
        // Group by recipe
        const grouped = {};
        for (const row of likers) {
            if (!grouped[row.recipe_id]) {
                grouped[row.recipe_id] = {
                    recipe_id: row.recipe_id,
                    recipe_title: row.recipe_title,
                    recipe_image: row.recipe_image,
                    likers: []
                };
            }
            grouped[row.recipe_id].likers.push({
                id: row.liker_id,
                username: row.liker_username,
                full_name: row.liker_name,
                profile_image: row.liker_image,
                liked_at: row.liked_at
            });
        }
        
        res.json(Object.values(grouped));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
