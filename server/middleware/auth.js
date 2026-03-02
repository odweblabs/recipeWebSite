const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token bulunamadı' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Geçersiz token' });
    }
};

const adminOnly = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return; // authenticateToken already sent response
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin yetkisi gerekiyor' });
        }
    });
};

module.exports = { authenticateToken, adminOnly };
