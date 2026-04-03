const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get all menus (Public)
router.get('/', async (req, res) => {
    try {
        const { is_preset, all } = req.query;
        let query = 'SELECT * FROM menus';
        const params = [];

        // Admin check for viewing unapproved menus
        const isAdmin = req.headers?.authorization?.includes('Bearer');
        // Actually simpler: if 'all=true' and it's an admin (the route should probably be protected or checked)
        
        if (all === 'true') {
            // Admin view: show everything
            query += ' WHERE 1=1';
        } else if (is_preset !== undefined) {
            query += ' WHERE (is_preset = $1 AND is_approved = true)';
            params.push(is_preset === 'true');
        } else {
            // Public view: only show approved or official
            query += ' WHERE is_approved = true OR is_preset = true';
        }

        query += ' ORDER BY created_at DESC';
        const menus = await executeQuery(query, params);

        // Fetch recipes for each menu
        const menusWithRecipes = await Promise.all(menus.map(async (menu) => {
            const recipes = await executeQuery(`
                SELECT r.id, r.title, 
                       CASE WHEN r.image_url LIKE 'data:%' THEN '/api/images/recipe/' || r.id ELSE r.image_url END as image_url,
                       (SELECT AVG(score) FROM ratings WHERE recipe_id = r.id) as avg_rating,
                       c.name as category_name
                FROM recipes r
                JOIN menu_recipes mr ON r.id = mr.recipe_id
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE mr.menu_id = $1
                ORDER BY mr.position ASC
            `, [menu.id]);
            return { ...menu, recipes };
        }));

        res.json(menusWithRecipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin management: Seed Default Menus
router.post('/seed', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetkiniz yok' });

    try {
        // Check if menus already exist
        const countRes = await executeQuery('SELECT COUNT(*) as count FROM menus');
        if (parseInt(countRes[0].count) > 0) {
            return res.json({ message: 'Veritabanında zaten menü kayıtları mevcut.' });
        }

        // Default Menus Data (Titles and Descriptions)
        const defaultMenus = [
            { title: 'Türk Akşam Yemeği', description: 'Çorba, et yemeği, pilav ve salata — klasik bir Türk sofrası.', keywords: ['çorba', 'kebap', 'pilav', 'cacık', 'salata', 'etli', 'kuru fasulye'] },
            { title: 'Hafta Sonu Kahvaltısı', description: 'Peynir tabağı, sıcak atıştırmalıklar ve enfes yumurtalarla keyifli dolu bir sabah.', keywords: ['kahvaltı', 'yumurta', 'menemen', 'sucuk', 'börek', 'peynir', 'reçel'] },
            { title: 'Diyet & Fit Menü', description: 'Hafif, düşük kalorili ve besleyici tariflerle gününüzü zinde geçirin.', keywords: ['salata', 'diyet', 'fitness', 'smoothie', 'ızgara', 'fit'] },
            { title: 'Vejetaryen Lezzetler', description: 'Et içermeyen ama lezzet dolu sebze ve bakliyat tabakları.', keywords: ['vejetaryen', 'sebze', 'zeytinyağlı', 'bakliyat', 'falafel', 'mercimek', 'nohut'] },
            { title: 'Çocuklar İçin Menü', description: 'Miniklerin severek yiyeceği, besleyici ve eğlenceli tarifler.', keywords: ['çocuk', 'köfte', 'makarna', 'püre', 'patates', 'ev yapımı', 'atıştırmalık'] },
            { title: 'Çay Saati İkramları', description: 'Kekler, börekler ve taze demlenmiş çay eşliğinde keyifli sohbetler.', keywords: ['kek', 'kurabiye', 'börek', 'kısır', 'poğaça', 'tart', 'pasta'] },
            { title: 'Deniz Ürünleri Akşamı', description: 'Taze balıklar, hafif mezeler ve deniz esintili bir sofra.', keywords: ['balık', 'deniz', 'kalamar', 'karides', 'somon', 'çipura', 'levrek'] }
        ];

        for (const m of defaultMenus) {
            // Find shared recipes for this menu
            const recipes = await executeQuery(`
                SELECT id FROM recipes 
                WHERE title ILIKE ANY($1::text[]) 
                OR description ILIKE ANY($1::text[]) 
                LIMIT 5
            `, [m.keywords.map(k => `%${k}%`)]);

            if (recipes.length > 0) {
                const insertRes = await executeQuery(
                    "INSERT INTO menus (title, description, is_preset, is_approved, author_name) VALUES ($1, $2, true, true, 'Tarifo') RETURNING id",
                    [m.title, m.description]
                );
                const menuId = insertRes[0]?.id || insertRes.lastInsertRowid;
                
                for (let i = 0; i < recipes.length; i++) {
                    await executeQuery(
                        'INSERT INTO menu_recipes (menu_id, recipe_id, position) VALUES ($1, $2, $3)',
                        [menuId, recipes[i].id, i]
                    );
                }
            }
        }

        res.json({ message: 'Hazır menüler başarıyla içeri aktarıldı.' });
    } catch (err) {
        console.error('Seed error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create Menu (User or Admin)
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, image_url, is_preset, recipeIds } = req.body;

    try {
        const authorName = req.user.role === 'admin' ? 'Tarifo' : req.user.username;
        const isApproved = req.user.role === 'admin' ? true : false;

        const result = await executeQuery(
            'INSERT INTO menus (title, description, image_url, is_preset, user_id, author_name, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [title, description, image_url, is_preset || false, req.user.id, authorName, isApproved]
        );
        const menuId = result.lastInsertRowid;

        if (recipeIds && Array.isArray(recipeIds)) {
            for (let i = 0; i < recipeIds.length; i++) {
                await executeQuery(
                    'INSERT INTO menu_recipes (menu_id, recipe_id, position) VALUES ($1, $2, $3)',
                    [menuId, recipeIds[i], i]
                );
            }
        }

        res.json({ id: menuId, message: 'Menü başarıyla oluşturuldu' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin management: Update Menu
router.put('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetkiniz yok' });
    const { id } = req.params;
    const { title, description, image_url, is_preset, recipeIds } = req.body;

    try {
        const { is_approved } = req.body;
        
        await executeQuery(
            'UPDATE menus SET title = $1, description = $2, image_url = $3, is_preset = $4, is_approved = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
            [title, description, image_url, is_preset, is_approved !== undefined ? is_approved : true, id]
        );

        if (recipeIds && Array.isArray(recipeIds)) {
            await executeQuery('DELETE FROM menu_recipes WHERE menu_id = $1', [id]);
            for (let i = 0; i < recipeIds.length; i++) {
                await executeQuery(
                    'INSERT INTO menu_recipes (menu_id, recipe_id, position) VALUES ($1, $2, $3)',
                    [id, recipeIds[i], i]
                );
            }
        }

        res.json({ message: 'Menü güncellendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin management: Delete Menu
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetkiniz yok' });
    const { id } = req.params;

    try {
        await executeQuery('DELETE FROM menus WHERE id = $1', [id]);
        res.json({ message: 'Menü silindi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
