const { executeQuery } = require('./database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
    const username = 'admin';
    const password = process.env.ADMIN_PASSWORD || 'RecipeChefSecret_2026!';
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        console.log('🔄 Admin şifresi sıfırlanıyor...');
        
        // Check if admin exists
        const users = await executeQuery('SELECT * FROM users WHERE username = $1', [username]);
        const user = users[0];

        if (user) {
            // Update password
            await executeQuery('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);
            console.log('✅ Mevcut admin şifresi başarıyla güncellendi.');
        } else {
            // Create admin
            await executeQuery(
                'INSERT INTO users (username, password, full_name, role) VALUES ($1, $2, $3, $4)', 
                [username, hashedPassword, 'Sistem Yöneticisi', 'admin']
            );
            console.log('✅ Admin kullanıcısı oluşturuldu.');
        }
    } catch (err) {
        console.error('❌ Admin sıfırlama hatası:', err.message);
    } finally {
        process.exit(0);
    }
};

resetAdmin();
