const { db } = require('./database');
const bcrypt = require('bcryptjs');

const resetAdmin = () => {
    const username = 'admin';
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        // Check if admin exists
        const stmtCheck = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmtCheck.get(username);

        if (user) {
            // Update password
            const stmtUpdate = db.prepare('UPDATE users SET password = ? WHERE username = ?');
            stmtUpdate.run(hashedPassword, username);
            console.log('Existing admin password reset to: password123');
        } else {
            // Create admin
            const stmtInsert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            stmtInsert.run(username, hashedPassword);
            console.log('Admin user created with password: password123');
        }
    } catch (err) {
        console.error('Error resetting admin:', err);
    }
};

resetAdmin();
