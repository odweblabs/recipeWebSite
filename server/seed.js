const { db } = require('./database');
const bcrypt = require('bcryptjs');

const seedAdmin = () => {
    const username = 'admin';
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const stmt = db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');
        stmt.run(username, hashedPassword);
        console.log('Admin user created/checked (admin:password123)');
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};

seedAdmin();
process.exit();
