const express = require('express');
const router = express.Router();
const { executeQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Arkadaşlık isteği gönder
router.post('/request/:userId', authenticateToken, async (req, res) => {
    const requesterId = req.user.id;
    const addresseeId = parseInt(req.params.userId);

    if (requesterId === addresseeId) {
        return res.status(400).json({ error: 'Kendinize arkadaşlık isteği gönderemezsiniz.' });
    }

    try {
        // Kullanıcının var olup olmadığını kontrol et
        const users = await executeQuery('SELECT id FROM users WHERE id = $1', [addresseeId]);
        const user = users[0];
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        // Zaten bir arkadaşlık kaydı var mı kontrol et (her iki yönde)
        const existings = await executeQuery(`
            SELECT * FROM friendships 
            WHERE (requester_id = $1 AND addressee_id = $2) 
               OR (requester_id = $3 AND addressee_id = $4)
        `, [requesterId, addresseeId, addresseeId, requesterId]);
        const existing = existings[0];

        if (existing) {
            if (existing.status === 'accepted') {
                return res.status(400).json({ error: 'Zaten arkadaşsınız.' });
            }
            return res.status(400).json({ error: 'Zaten bekleyen bir istek var.' });
        }

        const info = await executeQuery('INSERT INTO friendships (requester_id, addressee_id, status) VALUES ($1, $2, $3) RETURNING id', [requesterId, addresseeId, 'pending']);
        const friendshipId = info[0].id;

        // Create a notification for the recipient
        const requester = await executeQuery('SELECT username FROM users WHERE id = $1', [requesterId]);
        await executeQuery(
            'INSERT INTO notifications (user_id, type, title, message, related_id) VALUES ($1, $2, $3, $4, $5)',
            [addresseeId, 'friend_request', 'Yeni Takip İsteği', `@${requester[0].username} seni takip etmek istiyor.`, friendshipId]
        );

        res.json({ id: friendshipId, message: 'Arkadaşlık isteği gönderildi.' });
    } catch (err) {
        console.error('Error sending friend request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Arkadaşlık isteğini kabul et
router.put('/accept/:friendshipId', authenticateToken, async (req, res) => {
    const friendshipId = parseInt(req.params.friendshipId);
    const userId = req.user.id;

    try {
        const friendships = await executeQuery('SELECT * FROM friendships WHERE id = $1 AND addressee_id = $2 AND status = $3', [friendshipId, userId, 'pending']);
        const friendship = friendships[0];

        if (!friendship) {
            return res.status(404).json({ error: 'Bekleyen arkadaşlık isteği bulunamadı.' });
        }

        await executeQuery('UPDATE friendships SET status = $1 WHERE id = $2', ['accepted', friendshipId]);

        // Update notification
        await executeQuery(
            'UPDATE notifications SET message = $1, is_read = TRUE WHERE related_id = $2 AND type = $3',
            ['Takip isteğini kabul ettin.', friendshipId, 'friend_request']
        );

        res.json({ message: 'Arkadaşlık isteği kabul edildi.' });
    } catch (err) {
        console.error('Error accepting friend request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Arkadaşlık isteğini reddet / sil
router.delete('/reject/:friendshipId', authenticateToken, async (req, res) => {
    const friendshipId = parseInt(req.params.friendshipId);
    const userId = req.user.id;

    try {
        // Sadece addressee (isteğin alıcısı) reddedebilir
        const friendships = await executeQuery('SELECT * FROM friendships WHERE id = $1 AND addressee_id = $2 AND status = $3', [friendshipId, userId, 'pending']);
        const friendship = friendships[0];

        if (!friendship) {
            return res.status(404).json({ error: 'Bekleyen arkadaşlık isteği bulunamadı.' });
        }

        await executeQuery('DELETE FROM friendships WHERE id = $1', [friendshipId]);

        // Update notification instead of deleting it (to persist until user deletes it)
        await executeQuery(
            'UPDATE notifications SET message = $1, is_read = TRUE WHERE related_id = $2 AND type = $3',
            ['Takip isteğini reddettin.', friendshipId, 'friend_request']
        );

        res.json({ message: 'Arkadaşlık isteği reddedildi.' });
    } catch (err) {
        console.error('Error rejecting friend request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Bir kullanıcının arkadaş listesini getir (public)
router.get('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        const friends = await executeQuery(`
            SELECT 
                u.id, u.username, u.full_name, u.profile_image, u.created_at,
                f.id as friendship_id, f.created_at as friends_since,
                f.requester_id, f.addressee_id
            FROM friendships f
            JOIN users u ON (
                CASE 
                    WHEN f.requester_id = $1 THEN u.id = f.addressee_id
                    ELSE u.id = f.requester_id
                END
            )
            WHERE (f.requester_id = $2 OR f.addressee_id = $3) AND f.status = 'accepted'
            ORDER BY f.created_at DESC
        `, [userId, userId, userId]);

        res.json(friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Giriş yapmış kullanıcının bekleyen isteklerini getir
router.get('/requests/pending', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const requests = await executeQuery(`
            SELECT 
                f.id as friendship_id, f.created_at as requested_at,
                u.id, u.username, u.full_name, u.profile_image
            FROM friendships f
            JOIN users u ON u.id = f.requester_id
            WHERE f.addressee_id = $1 AND f.status = 'pending'
            ORDER BY f.created_at DESC
        `, [userId]);

        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// İki kullanıcı arasındaki arkadaşlık durumunu getir
router.get('/status/:userId', authenticateToken, async (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    try {
        const friendships = await executeQuery(`
            SELECT * FROM friendships 
            WHERE (requester_id = $1 AND addressee_id = $2) 
               OR (requester_id = $3 AND addressee_id = $4)
        `, [currentUserId, targetUserId, targetUserId, currentUserId]);
        const friendship = friendships[0];

        if (!friendship) {
            return res.json({ status: 'none' });
        }

        // Eğer istek pending ise, kimin gönderdiğini de belirt
        if (friendship.status === 'pending') {
            return res.json({
                status: 'pending',
                friendship_id: friendship.id,
                direction: friendship.requester_id === currentUserId ? 'outgoing' : 'incoming'
            });
        }

        res.json({
            status: 'accepted',
            friendship_id: friendship.id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Arkadaşlıktan çıkar
router.delete('/remove/:userId', authenticateToken, async (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    try {
        const result = await executeQuery(`
            DELETE FROM friendships 
            WHERE ((requester_id = $1 AND addressee_id = $2) 
               OR (requester_id = $3 AND addressee_id = $4))
               AND status = 'accepted'
        `, [currentUserId, targetUserId, targetUserId, currentUserId]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Arkadaşlık bulunamadı.' });
        }

        res.json({ message: 'Arkadaşlıktan çıkarıldı.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Gönderilen bekleyen isteği iptal et
router.delete('/cancel/:userId', authenticateToken, async (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = parseInt(req.params.userId);

    try {
        const result = await executeQuery(`
            DELETE FROM friendships 
            WHERE requester_id = $1 AND addressee_id = $2 AND status = 'pending'
        `, [currentUserId, targetUserId]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Bekleyen istek bulunamadı.' });
        }

        res.json({ message: 'Arkadaşlık isteği iptal edildi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
