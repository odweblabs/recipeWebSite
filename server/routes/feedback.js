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
router.put('/:id/status', adminOnly, async (req, res) => {
    const { status } = req.body;
    const feedbackId = req.params.id;
    try {
        // First get the user_id and content to create a meaningful notification
        const feedbackItems = await executeQuery('SELECT user_id, type FROM feedback WHERE id = $1', [feedbackId]);
        const feedback = feedbackItems[0];

        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        await executeQuery(
            'UPDATE feedback SET status = $1 WHERE id = $2',
            [status, feedbackId]
        );

        // Create notification for the user
        const statusMap = {
            'pending': 'Beklemede',
            'reviewed': 'İncelendi',
            'resolved': 'Çözüldü'
        };

        const typeLabel = feedback.type === 'bug' || feedback.type === 'bug_report' ? 'Hata Bildirimi' : 'Öneri';
        const title = `${typeLabel} Güncellemesi`;
        const message = `Gönderdiğiniz ${typeLabel.toLowerCase()} durumu "${statusMap[status] || status}" olarak güncellendi.`;

        await executeQuery(
            'INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)',
            [feedback.user_id, 'feedback_update', title, message]
        );

        res.json({ message: 'Feedback status updated and user notified' });
    } catch (err) {
        console.error('Error updating feedback status:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
