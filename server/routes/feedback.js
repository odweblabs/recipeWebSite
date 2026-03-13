const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Submit feedback (suggestion or bug report)
router.post('/', authenticateToken, async (req, res) => {
    const { type, content } = req.body;
    
    if (!type || !content) {
        return res.status(400).json({ error: 'Type and content are required' });
    }

    try {
        await executeQuery(
            'INSERT INTO feedback (user_id, type, content) VALUES ($1, $2, $3)',
            [req.user.id, type, content]
        );
        res.json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all feedback (Admin only)
router.get('/', adminOnly, async (req, res) => {
    try {
        const feedback = await executeQuery(`
            SELECT f.*, u.username, u.full_name, u.profile_image 
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC
        `);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update feedback status (Admin only)
router.put('/:id', adminOnly, async (req, res) => {
    const { status } = req.body;
    try {
        await executeQuery(
            'UPDATE feedback SET status = $1 WHERE id = $2',
            [status, req.params.id]
        );
        res.json({ message: 'Feedback status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
