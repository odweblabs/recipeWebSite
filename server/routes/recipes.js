const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const multer = require('multer');
const path = require('path');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Configure Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Admin Statistics
router.get('/stats', adminOnly, async (req, res) => {
    try {
        const recipeCount = (await executeQuery('SELECT COUNT(*) as count FROM recipes'))[0].count;
        const userCount = (await executeQuery('SELECT COUNT(*) as count FROM users'))[0].count;
        const categoryCount = (await executeQuery('SELECT COUNT(*) as count FROM categories'))[0].count;
        const commentCount = (await executeQuery('SELECT COUNT(*) as count FROM comments'))[0].count;
        const favoriteCount = (await executeQuery('SELECT COUNT(*) as count FROM favorites'))[0].count;
        const ratingCount = (await executeQuery('SELECT COUNT(*) as count FROM ratings'))[0].count;
        const friendshipCount = (await executeQuery("SELECT COUNT(*) as count FROM friendships WHERE status = 'accepted'"))[0].count;

        // Today's activity
        const today = new Date().toISOString().split('T')[0];
        const todayRecipes = (await executeQuery("SELECT COUNT(*) as count FROM recipes WHERE DATE(created_at) = $1", [today]))[0].count;
        const todayUsers = (await executeQuery("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = $1", [today]))[0].count;
        const todayComments = (await executeQuery("SELECT COUNT(*) as count FROM comments WHERE DATE(created_at) = $1", [today]))[0].count;

        const recentUsers = await executeQuery('SELECT id, username, full_name, profile_image, created_at FROM users ORDER BY created_at DESC LIMIT 5');

        const recentRecipes = await executeQuery(`
            SELECT recipes.id, recipes.title, recipes.image_url, recipes.created_at,
                   categories.name as category_name,
                   users.username as chef_username, users.full_name as chef_name, users.profile_image as chef_image
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            ORDER BY recipes.created_at DESC LIMIT 5
        `);

        const recentComments = await executeQuery(`
            SELECT comments.id, comments.content, comments.created_at,
                   users.username, users.full_name, users.profile_image,
                   recipes.id as recipe_id, recipes.title as recipe_title,
                   ratings.score as rating
            FROM comments
            LEFT JOIN users ON comments.user_id = users.id
            LEFT JOIN recipes ON comments.recipe_id = recipes.id
            LEFT JOIN ratings ON comments.user_id = ratings.user_id AND comments.recipe_id = ratings.recipe_id
            ORDER BY comments.created_at DESC LIMIT 5
        `);

        // Top rated recipes
        const topRated = await executeQuery(`
            SELECT recipes.id, recipes.title, recipes.image_url,
                   ROUND(AVG(ratings.score), 1) as avg_rating,
                   COUNT(ratings.id) as rating_count
            FROM recipes
            INNER JOIN ratings ON recipes.id = ratings.recipe_id
            GROUP BY recipes.id
            ORDER BY avg_rating DESC, rating_count DESC
            LIMIT 5
        `);

        res.json({
            counts: {
                recipes: recipeCount,
                users: userCount,
                categories: categoryCount,
                comments: commentCount,
                favorites: favoriteCount,
                ratings: ratingCount,
                friendships: friendshipCount
            },
            today: {
                recipes: todayRecipes,
                users: todayUsers,
                comments: todayComments
            },
            recentUsers,
            recentRecipes,
            recentComments,
            topRated
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public Statistics for Homepage
router.get('/public-stats', async (req, res) => {
    try {
        const recipeCount = (await executeQuery('SELECT COUNT(*) as count FROM recipes'))[0].count;
        const userCount = (await executeQuery('SELECT COUNT(*) as count FROM users'))[0].count;

        const latestRecipes = await executeQuery(`
            SELECT recipes.id, recipes.title, recipes.image_url, recipes.created_at,
                   categories.name as category_name,
                   users.username as chef_username, users.full_name as chef_name, users.profile_image as chef_image
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            ORDER BY recipes.created_at DESC LIMIT 8
        `);

        const recentComments = await executeQuery(`
            SELECT comments.id, comments.content, comments.created_at,
                   users.username, users.full_name, users.profile_image,
                   recipes.id as recipe_id, recipes.title as recipe_title,
                   ratings.score as rating
            FROM comments
            LEFT JOIN users ON comments.user_id = users.id
            LEFT JOIN recipes ON comments.recipe_id = recipes.id
            LEFT JOIN ratings ON comments.user_id = ratings.user_id AND comments.recipe_id = ratings.recipe_id
            ORDER BY comments.created_at DESC LIMIT 6
        `);

        const topRated = await executeQuery(`
            SELECT recipes.id, recipes.title, recipes.image_url,
                   ROUND(AVG(ratings.score), 1) as avg_rating,
                   COUNT(ratings.id) as rating_count
            FROM recipes
            INNER JOIN ratings ON recipes.id = ratings.recipe_id
            GROUP BY recipes.id
            ORDER BY avg_rating DESC, rating_count DESC
            LIMIT 5
        `);

        res.json({
            counts: {
                recipes: recipeCount,
                users: userCount
            },
            latestRecipes,
            recentComments,
            topRated
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Chef's Recommendation
router.get('/recommendation', async (req, res) => {
    try {
        const settings = await executeQuery("SELECT value FROM site_settings WHERE key = 'chef_recommendation_id'");
        const recipeId = settings[0]?.value;

        if (!recipeId) {
            return res.json(null);
        }

        const results = await executeQuery(`
            SELECT 
                recipes.*, 
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                users.profile_image as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = $1
        `, [recipeId]);

        res.json(results[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Set Chef's Recommendation (Admin only)
router.post('/recommendation', adminOnly, async (req, res) => {
    const { recipeId } = req.body;
    try {
        await executeQuery(
            "INSERT INTO site_settings (key, value) VALUES ('chef_recommendation_id', $1) ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP",
            [recipeId.toString()]
        );
        res.json({ message: 'Şefin tavsiyesi güncellendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all recipes with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { limit = 50, offset = 0, category_id } = req.query;
        let sql = `
            SELECT 
                recipes.*, 
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                users.profile_image as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
        `;
        let params = [];
        let paramIndex = 1;

        let whereClauses = [];
        if (category_id) {
            whereClauses.push(`recipes.category_id = $${paramIndex++}`);
            params.push(category_id);
        }
        if (req.query.title) {
            const searchTerm = `%${req.query.title}%`;
            whereClauses.push(`(recipes.title ILIKE $${paramIndex} OR recipes.description ILIKE $${paramIndex} OR recipes.ingredients ILIKE $${paramIndex})`);
            params.push(searchTerm);
            paramIndex++;
        }

        if (whereClauses.length > 0) {
            sql += ` WHERE ` + whereClauses.join(' AND ');
        }

        sql += ` ORDER BY recipes.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++} `;
        params.push(parseInt(limit), parseInt(offset));

        const recipes = await executeQuery(sql, params);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET latest recipes
router.get('/latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;
        const recipes = await executeQuery(`
            SELECT 
                recipes.*, 
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                users.profile_image as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            ORDER BY recipes.created_at DESC
            LIMIT $1
        `, [limit]);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET total recipe count
router.get('/count', async (req, res) => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as count FROM recipes');
        res.json({ count: result[0].count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single recipe
router.get('/:id', async (req, res) => {
    try {
        const results = await executeQuery(`
            SELECT 
                recipes.*, 
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                users.profile_image as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE recipe_id = recipes.id) as rating_count,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = $1
        `, [req.params.id]);

        if (results.length === 0) return res.status(404).json({ error: 'Recipe not found' });
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rate a recipe
router.post('/:id/rate', authenticateToken, async (req, res) => {
    const { score } = req.body;
    const recipeId = req.params.id;
    const userId = req.user.id;

    if (!score || score < 1 || score > 5) {
        return res.status(400).json({ error: 'Puan 1-5 arasında olmalıdır' });
    }

    try {
        await executeQuery(`
            INSERT INTO ratings (user_id, recipe_id, score) 
            VALUES ($1, $2, $3) 
            ON CONFLICT(user_id, recipe_id) DO UPDATE SET score = excluded.score
        `, [userId, recipeId, score]);
        res.json({ message: 'Puanınız kaydedildi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Comment on a recipe
router.post('/:id/comment', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const recipeId = req.params.id;
    const userId = req.user.id;

    try {
        // Check if user is allowed to comment
        const users = await executeQuery('SELECT can_comment FROM users WHERE id = $1', [userId]);
        const user = users[0];

        if (user && user.can_comment === 0) {
            return res.status(403).json({ error: 'Yorum yapma yetkiniz kısıtlanmıştır.' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Yorum içeriği boş olamaz' });
        }

        await executeQuery('INSERT INTO comments (user_id, recipe_id, content) VALUES ($1, $2, $3)', [userId, recipeId, content]);
        res.json({ message: 'Yorumunuz eklendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET comments for a recipe
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await executeQuery(`
            SELECT comments.*, users.username, users.full_name, users.profile_image 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.recipe_id = $1 
            ORDER BY comments.created_at DESC
        `, [req.params.id]);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new recipe
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, servings, prep_time, cook_time } = req.body;
        let imageUrl = null;

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        }
        const finalCategoryId = category_id && category_id !== '' ? category_id : null;
        const finalServings = servings && servings !== '' ? parseInt(servings) : null;
        const userId = req.user.id;

        const info = await executeQuery(`
            INSERT INTO recipes (title, description, ingredients, instructions, category_id, user_id, image_url, servings, prep_time, cook_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
        `, [title, description, ingredients, instructions, finalCategoryId, userId, imageUrl, finalServings, prep_time, cook_time]);

        res.json({ id: info.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update recipe
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, servings, prep_time, cook_time } = req.body;
        const recipeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check ownership or admin status
        const recipes = await executeQuery('SELECT user_id FROM recipes WHERE id = $1', [recipeId]);
        const recipe = recipes[0];

        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        if (userRole !== 'admin' && recipe.user_id !== userId) {
            return res.status(403).json({ error: 'Bu işlemi yapmaya yetkiniz yok.' });
        }

        const finalServings = servings && servings !== '' ? parseInt(servings) : null;
        let sql = `UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, category_id = $5, servings = $6, prep_time = $7, cook_time = $8`;
        let params = [title, description, ingredients, instructions, category_id || null, finalServings, prep_time, cook_time];
        let paramIndex = 9;

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            sql += `, image_url = $${paramIndex++}`;
            params.push(`data:${req.file.mimetype};base64,${base64Image}`);
        }

        sql += ` WHERE id = $${paramIndex++}`;
        params.push(recipeId);

        await executeQuery(sql, params);

        res.json({ message: 'Recipe updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE recipe
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check ownership or admin status
        const recipes = await executeQuery('SELECT user_id FROM recipes WHERE id = $1', [recipeId]);
        const recipe = recipes[0];

        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        if (userRole !== 'admin' && recipe.user_id !== userId) {
            return res.status(403).json({ error: 'Bu işlemi yapmaya yetkiniz yok.' });
        }

        await executeQuery('DELETE FROM recipes WHERE id = $1', [recipeId]);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET recipes by user
router.get('/users/:id/recipes', async (req, res) => {
    try {
        const userId = req.params.id;
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;

        const recipes = await executeQuery(`
            SELECT 
                recipes.*, 
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                users.profile_image as chef_image,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count,
                (SELECT COUNT(*) FROM favorites WHERE recipe_id = recipes.id) as favorite_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.user_id = $1
            ORDER BY recipes.created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET comments by user
router.get('/users/:id/comments', async (req, res) => {
    try {
        const comments = await executeQuery(`
            SELECT 
                comments.*, 
                recipes.title as recipe_title,
                recipes.id as recipe_id
            FROM comments 
            JOIN recipes ON comments.recipe_id = recipes.id
            WHERE comments.user_id = $1
            ORDER BY comments.created_at DESC
        `, [req.params.id]);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update comment (Owner only)
router.put('/comments/:id', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const commentId = req.params.id;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Yorum içeriği boş olamaz' });
    }

    try {
        // Check ownership
        const comments = await executeQuery('SELECT user_id FROM comments WHERE id = $1', [commentId]);
        const comment = comments[0];

        if (!comment) return res.status(404).json({ error: 'Yorum bulunamadı.' });
        if (comment.user_id !== userId) return res.status(403).json({ error: 'Bu yorumu düzenleyemezsiniz.' });

        await executeQuery('UPDATE comments SET content = $1 WHERE id = $2', [content, commentId]);
        res.json({ message: 'Yorum güncellendi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE comment (Owner or Admin)
router.delete('/comments/:id', authenticateToken, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Check ownership
        const comments = await executeQuery('SELECT user_id FROM comments WHERE id = $1', [commentId]);
        const comment = comments[0];

        if (!comment) return res.status(404).json({ error: 'Yorum bulunamadı.' });

        if (userRole !== 'admin' && comment.user_id !== userId) {
            return res.status(403).json({ error: 'Bu yorumu silemezsiniz.' });
        }

        await executeQuery('DELETE FROM comments WHERE id = $1', [commentId]);
        res.json({ message: 'Yorum silindi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
