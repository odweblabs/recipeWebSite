const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../database');
const multer = require('multer');
const path = require('path');
const { authenticateToken, adminOnly } = require('../middleware/auth');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Configure Multer for profile image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await executeQuery('SELECT * FROM users WHERE username = $1', [username]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role || 'user'
        }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role || 'user',
                full_name: user.full_name,
                profile_image: user.profile_image
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register Route
router.post('/register', upload.single('profile_image'), async (req, res) => {
    const { username, password, full_name } = req.body;
    let profile_image = null;

    if (req.file) {
        const base64Image = req.file.buffer.toString('base64');
        profile_image = `data:${req.file.mimetype};base64,${base64Image}`;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const counts = await executeQuery('SELECT COUNT(*) as count FROM users');
        const userCount = parseInt(counts[0].count, 10);
        const role = userCount === 0 ? 'admin' : 'user';

        const info = await executeQuery(
            'INSERT INTO users (username, password, full_name, profile_image, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [username, hashedPassword, full_name || null, profile_image || null, role]
        );
        res.json({ id: info.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: 'Kullanıcı zaten mevcut' });
    }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const users = await executeQuery('SELECT id, username, full_name, profile_image, role, created_at FROM users WHERE id = $1', [req.user.id]);
        const user = users[0];
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/profile', authenticateToken, upload.single('profile_image'), async (req, res) => {
    const { full_name } = req.body;
    let profile_image = req.body.profile_image;

    if (req.file) {
        const base64Image = req.file.buffer.toString('base64');
        profile_image = `data:${req.file.mimetype};base64,${base64Image}`;
    }
    try {
        await executeQuery('UPDATE users SET full_name = $1, profile_image = $2 WHERE id = $3', [full_name, profile_image, req.user.id]);
        res.json({ message: 'Profil güncellendi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Public User Profile
router.get('/users/:id/profile', async (req, res) => {
    try {
        const users = await executeQuery('SELECT id, username, full_name, profile_image, created_at FROM users WHERE id = $1', [req.params.id]);
        const user = users[0];
        if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (Admin only)
router.get('/users', adminOnly, async (req, res) => {
    try {
        const users = await executeQuery('SELECT id, username, full_name, profile_image, role, can_comment, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete User
router.delete('/users/:id', adminOnly, async (req, res) => {
    try {
        const userId = req.params.id;
        // Prevent deleting self
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ error: 'Kendinizi silemezsiniz.' });
        }

        const info = await executeQuery('DELETE FROM users WHERE id = $1', [userId]);

        if (info.changes === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        res.json({ message: 'Kullanıcı silindi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update User (Role, Can Comment)
router.put('/users/:id', adminOnly, async (req, res) => {
    const { role, can_comment } = req.body;
    const userId = req.params.id;

    // Prevent demoting self
    if (parseInt(userId) === req.user.id && role && role !== 'admin') {
        return res.status(400).json({ error: 'Kendi rolünüzü değiştiremezsiniz.' });
    }

    try {
        let sql = 'UPDATE users SET ';
        const params = [];
        const updates = [];
        let paramIndex = 1;

        if (role) {
            updates.push(`role = $${paramIndex++}`);
            params.push(role);
        }
        if (can_comment !== undefined) {
            updates.push(`can_comment = $${paramIndex++}`);
            params.push(can_comment);
        }

        if (updates.length > 0) {
            sql += updates.join(', ') + ` WHERE id = $${paramIndex++}`;
            params.push(userId);
            const info = await executeQuery(sql, params);

            if (info.changes === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
            res.json({ message: 'Kullanıcı güncellendi.' });
        } else {
            res.json({ message: 'Değişiklik yok.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Password
router.put('/password', authenticateToken, async (req, res) => {
    const { current_password, new_password } = req.body;
    try {
        const users = await executeQuery('SELECT password FROM users WHERE id = $1', [req.user.id]);
        const user = users[0];
        if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

        const validPassword = bcrypt.compareSync(current_password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mevcut şifreniz yanlış.' });
        }

        const hashedNewPassword = bcrypt.hashSync(new_password, 10);
        await executeQuery('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);

        res.json({ message: 'Şifreniz başarıyla değiştirildi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Heartbeat - tracks user activity
router.post('/heartbeat', authenticateToken, async (req, res) => {
    try {
        const existings = await executeQuery('SELECT * FROM user_activity WHERE user_id = $1', [req.user.id]);
        const existing = existings[0];

        if (existing) {
            await executeQuery(`
                UPDATE user_activity 
                SET total_seconds = total_seconds + CASE 
                    WHEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_heartbeat)) > 0 
                     AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_heartbeat)) <= 120 
                    THEN CAST(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - last_heartbeat)) AS INTEGER)
                    ELSE 0 END,
                last_heartbeat = CURRENT_TIMESTAMP,
                last_active = CURRENT_TIMESTAMP
                WHERE user_id = $1
            `, [req.user.id]);
        } else {
            await executeQuery(`
                INSERT INTO user_activity (user_id, total_seconds, last_heartbeat, last_active) 
                VALUES ($1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [req.user.id]);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error("Heartbeat error: ", err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: get user activity data
router.get('/activity', adminOnly, async (req, res) => {
    try {
        const activities = await executeQuery(`
            SELECT ua.user_id, ua.total_seconds, ua.last_active,
                   u.username, u.full_name, u.profile_image, u.role
            FROM user_activity ua
            LEFT JOIN users u ON ua.user_id = u.id
            ORDER BY ua.total_seconds DESC
        `);

        // Online users: last heartbeat within last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const onlineCounts = await executeQuery('SELECT COUNT(*) as count FROM user_activity WHERE last_active > $1', [twoMinutesAgo]);
        const onlineCount = onlineCounts[0] ? onlineCounts[0].count : 0;

        res.json({ activities, onlineCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET top chefs based on recipe count
router.get('/top-chefs', async (req, res) => {
    try {
        const chefs = await executeQuery(`
            SELECT u.id, u.username, u.full_name, u.profile_image, COUNT(r.id) as recipe_count
            FROM users u
            JOIN recipes r ON u.id = r.user_id
            GROUP BY u.id
            ORDER BY recipe_count DESC
            LIMIT 6
        `);
        res.json(chefs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
