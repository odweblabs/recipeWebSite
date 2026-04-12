const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const multer = require('multer');
const path = require('path');
const { authenticateToken, adminOnly } = require('../middleware/auth');
const { optimizeImage } = require('../utils/imageProcessor');

// Configure Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Admin Statistics
router.get('/stats', adminOnly, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [
            recipeCountResult,
            userCountResult,
            categoryCountResult,
            commentCountResult,
            favoriteCountResult,
            ratingCountResult,
            friendshipCountResult,
            todayRecipesResult,
            todayUsersResult,
            todayCommentsResult,
            recentUsers,
            recentRecipes,
            recentComments,
            topRated
        ] = await Promise.all([
            executeQuery('SELECT COUNT(*) as count FROM recipes'),
            executeQuery('SELECT COUNT(*) as count FROM users'),
            executeQuery('SELECT COUNT(*) as count FROM categories'),
            executeQuery('SELECT COUNT(*) as count FROM comments'),
            executeQuery('SELECT COUNT(*) as count FROM favorites'),
            executeQuery('SELECT COUNT(*) as count FROM ratings'),
            executeQuery("SELECT COUNT(*) as count FROM friendships WHERE status = 'accepted'"),
            executeQuery("SELECT COUNT(*) as count FROM recipes WHERE DATE(created_at) = $1", [today]),
            executeQuery("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = $1", [today]),
            executeQuery("SELECT COUNT(*) as count FROM comments WHERE DATE(created_at) = $1", [today]),
            executeQuery(`
                SELECT id, username, full_name, 
                       CASE WHEN profile_image LIKE 'data:%' THEN '/api/images/user/' || id ELSE profile_image END as profile_image,
                       created_at 
                FROM users ORDER BY created_at DESC LIMIT 5
            `),
            executeQuery(`
                SELECT recipes.id, recipes.title, 
                       CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                       recipes.created_at,
                       categories.name as category_name,
                       users.username as chef_username, users.full_name as chef_name, 
                       CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image
                FROM recipes
                LEFT JOIN categories ON recipes.category_id = categories.id
                LEFT JOIN users ON recipes.user_id = users.id
                ORDER BY recipes.created_at DESC LIMIT 5
            `),
            executeQuery(`
                SELECT comments.id, comments.content, comments.created_at,
                       users.username, users.full_name, 
                       CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as profile_image,
                       recipes.id as recipe_id, recipes.title as recipe_title,
                       ratings.score as rating
                FROM comments
                LEFT JOIN users ON comments.user_id = users.id
                LEFT JOIN recipes ON comments.recipe_id = recipes.id
                LEFT JOIN ratings ON comments.user_id = ratings.user_id AND comments.recipe_id = ratings.recipe_id
                ORDER BY comments.created_at DESC LIMIT 5
            `),
            executeQuery(`
                SELECT recipes.id, recipes.title, 
                       CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                       ROUND(AVG(ratings.score), 1) as avg_rating,
                       COUNT(ratings.id) as rating_count
                FROM recipes
                INNER JOIN ratings ON recipes.id = ratings.recipe_id
                GROUP BY recipes.id
                ORDER BY avg_rating DESC, rating_count DESC
                LIMIT 5
            `)
        ]);

        res.json({
            counts: {
                recipes: recipeCountResult[0].count,
                users: userCountResult[0].count,
                categories: categoryCountResult[0].count,
                comments: commentCountResult[0].count,
                favorites: favoriteCountResult[0].count,
                ratings: ratingCountResult[0].count,
                friendships: friendshipCountResult[0].count
            },
            today: {
                recipes: todayRecipesResult[0].count,
                users: todayUsersResult[0].count,
                comments: todayCommentsResult[0].count
            },
            recentUsers,
            recentRecipes,
            recentComments,
            topRated
        });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// Public Statistics for Homepage
router.get('/public-stats', async (req, res) => {
    try {
        const [
            recipeCountResult,
            userCountResult,
            latestRecipes,
            recentComments,
            topRated
        ] = await Promise.all([
            executeQuery('SELECT COUNT(*) as count FROM recipes'),
            executeQuery('SELECT COUNT(*) as count FROM users'),
            executeQuery(`
                SELECT recipes.id, recipes.title, 
                       CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                       recipes.created_at,
                       categories.name as category_name,
                       users.username as chef_username, users.full_name as chef_name, 
                       CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image
                FROM recipes
                LEFT JOIN categories ON recipes.category_id = categories.id
                LEFT JOIN users ON recipes.user_id = users.id
                ORDER BY recipes.created_at DESC LIMIT 8
            `),
            executeQuery(`
                SELECT comments.id, comments.content, comments.created_at,
                       users.username, users.full_name, 
                       CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as profile_image,
                       recipes.id as recipe_id, recipes.title as recipe_title,
                       ratings.score as rating
                FROM comments
                LEFT JOIN users ON comments.user_id = users.id
                LEFT JOIN recipes ON comments.recipe_id = recipes.id
                LEFT JOIN ratings ON comments.user_id = ratings.user_id AND comments.recipe_id = ratings.recipe_id
                ORDER BY comments.created_at DESC LIMIT 6
            `),
            executeQuery(`
                SELECT recipes.id, recipes.title, 
                       CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                       ROUND(AVG(ratings.score), 1) as avg_rating,
                       COUNT(ratings.id) as rating_count
                FROM recipes
                INNER JOIN ratings ON recipes.id = ratings.recipe_id
                GROUP BY recipes.id
                ORDER BY avg_rating DESC, rating_count DESC
                LIMIT 5
            `)
        ]);

        res.json({
            counts: {
                recipes: recipeCountResult[0].count,
                users: userCountResult[0].count
            },
            latestRecipes,
            recentComments,
            topRated
        });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
                recipes.id, recipes.title, recipes.description,
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time, recipes.cook_time, recipes.servings, recipes.category_id, 
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = $1
        `, [recipeId]);

        res.json(results[0] || null);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET all recipes with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { limit = 50, offset = 0, category_id } = req.query;
        let sql = `
            SELECT 
                recipes.id, recipes.title, 
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time, 
                recipes.cook_time, recipes.servings, recipes.category_id, recipes.youtube_url, 
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
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
            const searchTerms = req.query.title.split(/\s+/).filter(t => t.trim() !== '');
            if (searchTerms.length > 0) {
                const termClauses = searchTerms.map(term => {
                    const searchTerm = `%${term}%`;
                    params.push(searchTerm);
                    const idx = paramIndex++;
                    return `(recipes.title ILIKE $${idx} OR recipes.ingredients ILIKE $${idx} OR recipes.description ILIKE $${idx})`;
                });
                whereClauses.push(`(${termClauses.join(' AND ')})`);
            }
        }

        if (whereClauses.length > 0) {
            sql += ` WHERE ` + whereClauses.join(' AND ');
        }

        sql += ` ORDER BY recipes.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++} `;
        params.push(parseInt(limit), parseInt(offset));

        const recipes = await executeQuery(sql, params);
        res.json(recipes);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET latest recipes
router.get('/latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;
        const recipes = await executeQuery(`
            SELECT 
                recipes.id, recipes.title, 
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time,
                recipes.cook_time, recipes.servings, recipes.category_id, recipes.youtube_url,
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET metadata for WhatToCook
router.get('/what-to-cook-metadata', async (req, res) => {
    try {
        const sql = `
            SELECT 
                recipes.id, recipes.prep_time, recipes.cook_time, recipes.servings, recipes.category_id,
                categories.name as category_name
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
        `;
        const recipes = await executeQuery(sql);
        res.json(recipes);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// POST bulk fetch recipes
router.post('/bulk', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json([]);
        }

        const safeIds = ids.slice(0, 50).filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));
        if (safeIds.length === 0) return res.json([]);

        const placeholders = safeIds.map((_, i) => `$${i + 1}`).join(',');

        const sql = `
            SELECT 
                recipes.id, recipes.title, 
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time,
                recipes.cook_time, recipes.servings, recipes.category_id, recipes.youtube_url,
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id IN (${placeholders})
        `;
        const recipes = await executeQuery(sql, safeIds);
        res.json(recipes);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET total recipe count
router.get('/count', async (req, res) => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as count FROM recipes');
        res.json({ count: result[0].count });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET current user's recipes (Optimized for dashboard)
router.get('/my/recipes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await executeQuery(`
            SELECT 
                recipes.id, recipes.title, recipes.image_url, recipes.created_at,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count,
                (SELECT COUNT(*) FROM favorites WHERE recipe_id = recipes.id) as favorite_count
            FROM recipes 
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [userId]);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET comments left on current user's recipes
router.get('/my/comments', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const comments = await executeQuery(`
            SELECT 
                comments.*, 
                recipes.title as recipe_title,
                users.username as commenter_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as commenter_image
            FROM comments 
            JOIN recipes ON comments.recipe_id = recipes.id
            JOIN users ON comments.user_id = users.id
            WHERE recipes.user_id = $1
            ORDER BY comments.created_at DESC
        `, [userId]);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single recipe
router.get('/:id', async (req, res) => {
    try {
        const results = await executeQuery(`
            SELECT 
                recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions,
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time, recipes.cook_time, recipes.servings, recipes.category_id, recipes.youtube_url, 
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
                (SELECT AVG(score) FROM ratings WHERE recipe_id = recipes.id) as avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE recipe_id = recipes.id) as rating_count,
                (SELECT COUNT(*) FROM comments WHERE recipe_id = recipes.id) as comment_count
            FROM recipes 
            LEFT JOIN categories ON recipes.category_id = categories.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE recipes.id = $1
        `, [req.params.id]);
        
        if (results.length === 0) return res.status(404).json({ error: 'Recipe not found' });
        
        // Fetch all images for this recipe
        const images = await executeQuery('SELECT image_url FROM recipe_images WHERE recipe_id = $1 ORDER BY id ASC', [req.params.id]);
        
        const recipeData = {
            ...results[0],
            images: images.map(img => img.image_url)
        };
        
        res.json(recipeData);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// GET comments for a recipe
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await executeQuery(`
            SELECT comments.*, users.username, users.full_name, 
                   CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as profile_image
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.recipe_id = $1 
            ORDER BY comments.created_at DESC
        `, [req.params.id]);
        res.json(comments);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// POST new recipe
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, servings, prep_time, cook_time, youtube_url } = req.body;
        const files = req.files || [];
        const optimizedImages = [];
        
        for (const file of files) {
            const optimizedBase64 = await optimizeImage(file.buffer);
            optimizedImages.push(optimizedBase64);
        }
        
        const recipeImageUrl = optimizedImages.length > 0 ? optimizedImages[0] : null;
        const finalCategoryId = category_id && category_id !== '' ? category_id : null;
        const finalServings = servings && servings !== '' ? parseInt(servings) : null;
        const finalPrepTime = prep_time && prep_time !== '' ? parseInt(prep_time) : null;
        const finalCookTime = cook_time && cook_time !== '' ? parseInt(cook_time) : null;
        const userId = req.user.id;
        
        const info = await executeQuery(`
            INSERT INTO recipes (title, description, ingredients, instructions, category_id, user_id, image_url, servings, prep_time, cook_time, youtube_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
        `, [title, description, ingredients, instructions, finalCategoryId, userId, recipeImageUrl, finalServings, finalPrepTime, finalCookTime, youtube_url || null]);
        
        const recipeId = info[0]?.id || info.lastInsertRowid;
        
        // Save all images to recipe_images table
        for (const imageUrl of optimizedImages) {
            await executeQuery('INSERT INTO recipe_images (recipe_id, image_url) VALUES ($1, $2)', [recipeId, imageUrl]);
        }

        // Trigger notification to all users about the new recipe (Non-blocking background task)
        (async () => {
            try {
                const users = await executeQuery('SELECT id FROM users WHERE id != $1 AND (notifications_paused IS FALSE OR notifications_paused IS NULL)', [userId]);
                const recipientIds = users.map(u => u.id);

                if (recipientIds.length > 0) {
                    const notifTitle = 'Yeni Tarif Eklendi!';
                    const notifMessage = `"${title}" adlı yeni bir tarif paylaşıldı. Hemen göz atın!`;

                    // Batch inserts to stay well within Postgres parameter limits (max 65535, but let's be conservative)
                    const BATCH_SIZE = 500;
                    for (let i = 0; i < recipientIds.length; i += BATCH_SIZE) {
                        const batch = recipientIds.slice(i, i + BATCH_SIZE);
                        const values = [];
                        const placeholders = [];
                        let pIndex = 1;

                        batch.forEach(rId => {
                            placeholders.push(`($${pIndex++}, $${pIndex++}, $${pIndex++}, $${pIndex++}, $${pIndex++})`);
                            values.push(rId, 'new_recipe', notifTitle, notifMessage, recipeId);
                        });

                        const notifQuery = `INSERT INTO notifications (user_id, type, title, message, related_id) VALUES ${placeholders.join(', ')}`;
                        await executeQuery(notifQuery, values);
                    }
                }
            } catch (notifErr) {
                console.error('Failed to send new recipe notifications:', notifErr);
            }
        })();

        // Ping Google after success (runs in background)
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        fetch(`http://www.google.com/ping?sitemap=${encodeURIComponent(baseUrl + '/sitemap.xml')}`).catch(() => {});

        res.json({ id: recipeId });
        // NOTE: Standard fetch is native in Node 18+, so no extra imports needed.
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// PUT update recipe
router.put('/:id', authenticateToken, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, servings, prep_time, cook_time, youtube_url } = req.body;
        const recipeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const files = req.files || [];
        
        // Check ownership or admin status
        const recipes = await executeQuery('SELECT user_id FROM recipes WHERE id = $1', [recipeId]);
        const recipe = recipes[0];
        
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        
        if (userRole !== 'admin' && recipe.user_id !== userId) {
            return res.status(403).json({ error: 'Bu işlemi yapmaya yetkiniz yok.' });
        }
        
        const finalServings = servings && servings !== '' ? parseInt(servings) : null;
        const finalPrepTime = prep_time && prep_time !== '' ? parseInt(prep_time) : null;
        const finalCookTime = cook_time && cook_time !== '' ? parseInt(cook_time) : null;
        
        let sql = `UPDATE recipes SET title = $1, description = $2, ingredients = $3, instructions = $4, category_id = $5, servings = $6, prep_time = $7, cook_time = $8, youtube_url = $9`;
        let params = [title, description, ingredients, instructions, category_id || null, finalServings, finalPrepTime, finalCookTime, youtube_url || null];
        let paramIndex = 10;
        
        if (files.length > 0) {
            const optimizedImages = [];
            for (const file of files) {
                const optimizedBase64 = await optimizeImage(file.buffer);
                optimizedImages.push(optimizedBase64);
            }
            
            sql += `, image_url = $${paramIndex++}`;
            params.push(optimizedImages[0]); // Primary image
            
            // For updates, we clear old images and set new ones for simplicity and consistency
            await executeQuery('DELETE FROM recipe_images WHERE recipe_id = $1', [recipeId]);
            for (const imageUrl of optimizedImages) {
                await executeQuery('INSERT INTO recipe_images (recipe_id, image_url) VALUES ($1, $2)', [recipeId, imageUrl]);
            }
        }
        
        sql += ` WHERE id = $${paramIndex++}`;
        params.push(recipeId);
        
        await executeQuery(sql, params);

        res.json({ message: 'Recipe updated successfully' });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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

        // Cleanup: remove related records that might have FK constraints
        // Most of these should be covered by ON DELETE CASCADE but we do it explicitly for safety
        await executeQuery('DELETE FROM recipe_images WHERE recipe_id = $1', [recipeId]);
        await executeQuery('DELETE FROM comments WHERE recipe_id = $1', [recipeId]);
        await executeQuery('DELETE FROM ratings WHERE recipe_id = $1', [recipeId]);
        await executeQuery('DELETE FROM favorites WHERE recipe_id = $1', [recipeId]);
        await executeQuery('DELETE FROM menu_recipes WHERE recipe_id = $1', [recipeId]);
        
        // Remove from site_settings if it was the chef recommendation
        await executeQuery("UPDATE site_settings SET value = NULL WHERE key = 'chef_recommendation_id' AND value = $1", [recipeId.toString()]);

        const deleteResult = await executeQuery('DELETE FROM recipes WHERE id = $1', [recipeId]);
        
        if (deleteResult.changes === 0) {
            return res.status(404).json({ error: 'Tarif silinirken bir sorun oluştu veya tarif zaten silinmiş.' });
        }

        res.json({ message: 'Tarif başarıyla silindi' });
    } catch (err) {
        console.error('[ADMIN DELETE ERROR]', err);
        res.status(500).json({ error: 'Tarif silinirken veritabanı hatası oluştu: ' + err.message });
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
                recipes.id, recipes.title, 
                CASE WHEN recipes.image_url LIKE 'data:%' THEN '/api/images/recipe/' || recipes.id ELSE recipes.image_url END as image_url,
                recipes.prep_time, recipes.cook_time, recipes.servings, recipes.category_id, recipes.youtube_url, 
                recipes.user_id, recipes.created_at,
                categories.name as category_name,
                users.username as chef_username,
                users.full_name as chef_name,
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as chef_image,
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});


// GET all comments (Admin only)
router.get('/admin/comments/all', adminOnly, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const comments = await executeQuery(`
            SELECT 
                comments.*, 
                users.username, users.full_name, 
                CASE WHEN users.profile_image LIKE 'data:%' THEN '/api/images/user/' || users.id ELSE users.profile_image END as profile_image,
                recipes.title as recipe_title,
                recipes.id as recipe_id
            FROM comments 
            JOIN users ON comments.user_id = users.id
            JOIN recipes ON comments.recipe_id = recipes.id
            ORDER BY comments.created_at DESC
            LIMIT $1 OFFSET $2
        `, [parseInt(limit), parseInt(offset)]);
        res.json(comments);
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
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
        if (req.user.role !== 'admin' && comment.user_id !== userId) return res.status(403).json({ error: 'Bu yorumu düzenleyemezsiniz.' });

        await executeQuery('UPDATE comments SET content = $1 WHERE id = $2', [content, commentId]);
        res.json({ message: 'Yorum güncellendi.' });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

// DELETE comment (Owner or Admin or Recipe Owner)
router.delete('/comments/:id', authenticateToken, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Check ownership of comment OR ownership of the recipe the comment is on
        const comments = await executeQuery(`
            SELECT comments.user_id as comment_author_id, recipes.user_id as recipe_author_id 
            FROM comments 
            JOIN recipes ON comments.recipe_id = recipes.id
            WHERE comments.id = $1
        `, [commentId]);
        
        const comment = comments[0];

        if (!comment) return res.status(404).json({ error: 'Yorum bulunamadı.' });

        if (userRole !== 'admin' && comment.comment_author_id !== userId && comment.recipe_author_id !== userId) {
            return res.status(403).json({ error: 'Bu yorumu silemezsiniz.' });
        }

        await executeQuery('DELETE FROM comments WHERE id = $1', [commentId]);
        res.json({ message: 'Yorum silindi.' });
    } catch (err) {
        console.error("MY_COMMENTS_CRASH:", err); res.status(500).json({ error: err.message });
    }
});

module.exports = router;
