const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Get all notifications for the current user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await executeQuery(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: err.message });
    }
});

// Mark all notifications as read
router.put('/mark-as-read', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        await executeQuery(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
            [userId]
        );
        res.json({ message: 'Notifications marked as read' });
    } catch (err) {
        console.error('Error marking notifications as read:', err);
        res.status(500).json({ error: err.message });
    }
});

// Mark a single notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await executeQuery(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: err.message });
    }
});

// Send notification (Admin only)
router.post('/send', authenticateToken, adminOnly, async (req, res) => {
    const { target, userIds, title, message } = req.body;

    if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
    }

    try {
        let recipientIds = [];

        if (target === 'all') {
            const users = await executeQuery('SELECT id FROM users');
            recipientIds = users.map(u => u.id);
        } else if (target === 'specific' && Array.isArray(userIds)) {
            recipientIds = userIds;
        } else {
            return res.status(400).json({ error: 'Invalid target or userIds' });
        }

        if (recipientIds.length === 0) {
            return res.status(400).json({ error: 'No recipients found' });
        }

        // Batch insert notifications
        const values = [];
        const placeholders = [];
        let index = 1;

        recipientIds.forEach(userId => {
            placeholders.push(`($${index++}, $${index++}, $${index++}, $${index++})`);
            values.push(userId, 'admin_broadcast', title, message);
        });

        const query = `INSERT INTO notifications (user_id, type, title, message) VALUES ${placeholders.join(', ')}`;
        await executeQuery(query, values);

        res.json({ message: `Notification sent to ${recipientIds.length} users` });
    } catch (err) {
        console.error('Error sending administrative notification:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
