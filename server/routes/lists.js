const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get user's lists
router.get('/', authenticateToken, async (req, res) => {
    try {
        const lists = await executeQuery(
            'SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        // Fetch items for each list
        const listsWithItems = await Promise.all(lists.map(async (list) => {
            const items = await executeQuery(
                'SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at ASC',
                [list.id]
            );
            return { ...list, items };
        }));

        res.json(listsWithItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new list
router.post('/', authenticateToken, async (req, res) => {
    const { name, market_name, is_public, items } = req.body;
    try {
        const result = await executeQuery(
            'INSERT INTO lists (user_id, name, market_name, is_public) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.user.id, name, market_name || null, is_public || false]
        );
        const listId = result.lastInsertRowid;

        if (items && Array.isArray(items)) {
            for (const item of items) {
                await executeQuery(
                    'INSERT INTO list_items (list_id, text, checked) VALUES ($1, $2, $3)',
                    [listId, item.text, item.checked || false]
                );
            }
        }

        res.json({ id: listId, message: 'Liste oluşturuldu' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update list (including items)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, market_name, is_public, items } = req.body;

    try {
        // Check ownership
        const existing = await executeQuery('SELECT user_id FROM lists WHERE id = $1', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Liste bulunamadı' });
        if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Yetkiniz yok' });

        // Update list info
        await executeQuery(
            'UPDATE lists SET name = $1, market_name = $2, is_public = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
            [name, market_name, is_public, id]
        );

        // Update items (Hard way: delete and re-insert for simplicity, or handle diff)
        // Let's go with delete and re-insert for a cleaner state management from frontend
        if (items && Array.isArray(items)) {
            await executeQuery('DELETE FROM list_items WHERE list_id = $1', [id]);
            for (const item of items) {
                await executeQuery(
                    'INSERT INTO list_items (list_id, text, checked) VALUES ($1, $2, $3)',
                    [id, item.text, item.checked || false]
                );
            }
        }

        res.json({ message: 'Liste güncellendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete list
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await executeQuery('SELECT user_id FROM lists WHERE id = $1', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Liste bulunamadı' });
        if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Yetkiniz yok' });

        await executeQuery('DELETE FROM lists WHERE id = $1', [id]);
        res.json({ message: 'Liste silindi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle share status
router.put('/:id/share', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { is_public } = req.body;
    try {
        const existing = await executeQuery('SELECT user_id FROM lists WHERE id = $1', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Liste bulunamadı' });
        if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Yetkiniz yok' });

        await executeQuery('UPDATE lists SET is_public = $1 WHERE id = $2', [is_public, id]);
        res.json({ message: 'Paylaşım durumu güncellendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public List View (if is_public)
router.get('/public/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const lists = await executeQuery('SELECT * FROM lists WHERE id = $1 AND is_public = TRUE', [id]);
        if (lists.length === 0) return res.status(404).json({ error: 'Liste bulunamadı veya gizli' });

        const items = await executeQuery('SELECT * FROM list_items WHERE list_id = $1', [id]);
        res.json({ ...lists[0], items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
