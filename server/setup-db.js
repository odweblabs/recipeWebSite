require('dotenv').config();
const { pool } = require('./database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setup() {
    console.log('🚀 Supabase Database Setup Başlatıldı...');
    const client = await pool.connect();

    try {
        // 1. Migrations tablosunu oluştur
        console.log('1. Migrations tablosu kontrol ediliyor...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename TEXT UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Migrations klasörünü oku ve SQL'leri çalıştır
        console.log('2. Tablolar oluşturuluyor...');
        const migrationsDir = path.join(__dirname, 'database/migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            const executed = await client.query('SELECT 1 FROM migrations WHERE filename = $1', [file]);
            if (executed.rows.length === 0) {
                console.log(`   - Uygulanıyor: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await client.query(sql);
                await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
            } else {
                console.log(`   - Atlanıyor (zaten yüklü): ${file}`);
            }
        }

        // 3. Kategorileri Seed et
        console.log('3. Kategoriler kontrol ediliyor...');
        const categories = [
            'Aperatifler', 'Bakliyat Yemekleri', 'Bebekler İçin', 'Çocuklar İçin',
            'Çorba Tarifleri', 'Diyet Yemekleri', 'Dolma-Sarma Tarifleri',
            'Et Yemekleri', 'Hamur İşi Tarifleri', 'Hızlı Yemekler', 'İçecek Tarifleri',
            'Kahvaltılık Tarifler', 'Kurabiye Tarifleri', 'Makarna Tarifleri',
            'Pilav Tarifleri', 'Salata & Meze & Kanepe', 'Sandviç Tarifleri',
            'Sebze Yemekleri', 'Tatlı Tarifleri'
        ];
        for (const cat of categories) {
            await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [cat]);
        }

        // 4. Admin Kullanıcısı Kontrolü
        console.log('4. Admin kullanıcısı kontrol ediliyor...');
        const adminCheck = await client.query("SELECT 1 FROM users WHERE role = 'admin'");
        if (adminCheck.rows.length === 0) {
            const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
            const hashedPassword = bcrypt.hashSync(adminPassword, 10);
            await client.query(
                "INSERT INTO users (username, password, full_name, role) VALUES ($1, $2, $3, $4)",
                ['admin', hashedPassword, 'Sistem Yöneticisi', 'admin']
            );
            console.log('   - Varsayılan admin oluşturuldu.');
        } else {
            console.log('   - Admin kullanıcısı zaten mevcut.');
        }

        console.log('\n✅ Kurulum başarıyla tamamlandı!');
        console.log('Şimdi sitenizi yenileyip giriş yapmayı deneyebilirsiniz.');

    } catch (err) {
        console.error('\n❌ HATA:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
