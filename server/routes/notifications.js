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
            const users = await executeQuery('SELECT id FROM users WHERE notifications_paused IS FALSE OR notifications_paused IS NULL');
            recipientIds = users.map(u => u.id);
        } else if (target === 'specific' && Array.isArray(userIds)) {
            recipientIds = userIds;
        } else {
            return res.status(400).json({ error: 'Invalid target or userIds' });
        }

        if (recipientIds.length === 0) {
            return res.status(400).json({ error: 'No recipients found' });
        }

        // 1. Record in history FIRST to get the history_id
        const historyResult = await executeQuery(
            'INSERT INTO admin_notification_history (sender_id, title, message, target_type, recipient_count) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [req.user.id, title, message, target, recipientIds.length]
        );
        const historyId = historyResult.lastInsertRowid;

        // 2. Batch insert notifications with history_id
        const values = [];
        const placeholders = [];
        let index = 1;

        recipientIds.forEach(userId => {
            placeholders.push(`($${index++}, $${index++}, $${index++}, $${index++}, $${index++})`);
            values.push(userId, 'admin_broadcast', title, message, historyId);
        });

        const query = `INSERT INTO notifications (user_id, type, title, message, history_id) VALUES ${placeholders.join(', ')}`;
        await executeQuery(query, values);

        res.json({ message: `Notification sent to ${recipientIds.length} users`, historyId });
    } catch (err) {
        console.error('Error sending administrative notification:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get admin notification history (Admin only)
router.get('/admin-history', authenticateToken, adminOnly, async (req, res) => {
    try {
        const history = await executeQuery(`
            SELECT h.*, u.username as sender_name 
            FROM admin_notification_history h
            LEFT JOIN users u ON h.sender_id = u.id
            ORDER BY h.created_at DESC
            LIMIT 50
        `);
        res.json(history);
    } catch (err) {
        console.error('Error fetching notification history:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete admin notification history record and all related notifications (Admin only)
router.delete('/admin-history/:id', authenticateToken, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Delete associated notifications
        await executeQuery('DELETE FROM notifications WHERE history_id = $1', [id]);
        
        // 2. Delete the history record
        const result = await executeQuery('DELETE FROM admin_notification_history WHERE id = $1', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Notification history record not found' });
        }
        
        res.json({ message: 'Notification history and related notifications deleted successfully' });
    } catch (err) {
        console.error('Error deleting notification history:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update welcome notification template (Admin only)
router.post('/welcome-template', authenticateToken, adminOnly, async (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
    }

    try {
        await executeQuery(
            "INSERT INTO site_settings (key, value) VALUES ('welcome_notif_title', $1), ('welcome_notif_message', $2) " +
            "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            [title, message]
        );
        res.json({ message: 'Welcome notification template updated successfully' });
    } catch (err) {
        console.error('Error updating welcome template:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get recipients for a specific history record (Admin only)
router.get('/admin-history/:id/recipients', authenticateToken, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const recipients = await executeQuery(`
            SELECT u.id, u.username, u.full_name, u.profile_image
            FROM notifications n
            JOIN users u ON n.user_id = u.id
            WHERE n.history_id = $1
            ORDER BY u.username ASC
        `, [id]);
        res.json(recipients);
    } catch (err) {
        console.error('Error fetching notification recipients:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await executeQuery(
            'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get welcome notification template (Admin only)
router.get('/welcome-template', authenticateToken, adminOnly, async (req, res) => {
    try {
        const settings = await executeQuery(
            "SELECT key, value FROM site_settings WHERE key IN ('welcome_notif_title', 'welcome_notif_message')"
        );
        const template = {};
        settings.forEach(s => {
            if (s.key === 'welcome_notif_title') template.title = s.value;
            if (s.key === 'welcome_notif_message') template.message = s.value;
        });
        res.json(template);
    } catch (err) {
        console.error('Error fetching welcome template:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

