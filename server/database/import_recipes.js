const { pool } = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function importRecipes() {
    console.log('🚀 Tarif aktarımı başlatıldı...');
    let client;
    try {
        client = await pool.connect();

        const jsonPath = path.join(__dirname, 'recipes_groq_cleaned.json');
        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ Dosya bulunamadı: ${jsonPath}`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`📦 Toplam ${data.length} tarif bulundu. Aktarım başlıyor...`);

        // 1. Admin kullanıcı ID'sini al veya oluştur
        let adminRes = await client.query("SELECT id FROM users WHERE username = 'admin' LIMIT 1");
        let adminId;

        if (adminRes.rows.length === 0) {
            console.log('👤 Admin kullanıcısı bulunamadı, oluşturuluyor...');
            const bcrypt = require('bcryptjs');
            const hashedPass = await bcrypt.hash('admin123', 10);
            const newAdmin = await client.query(
                "INSERT INTO users (username, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id",
                ['admin', hashedPass, 'Sistem Yöneticisi', 'admin']
            );
            adminId = newAdmin.rows[0].id;
        } else {
            adminId = adminRes.rows[0].id;
        }

        // 2. Mevcut kategorileri al
        const catRes = await client.query("SELECT id, name FROM categories");
        const categoryMap = {};
        catRes.rows.forEach(c => categoryMap[c.name.toLowerCase()] = c.id);

        let importedCount = 0;

        for (const item of data) {
            let categoryId = null;
            if (item.kategori) {
                const catName = item.kategori.toLowerCase();
                if (!categoryMap[catName]) {
                    const newCat = await client.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id', [item.kategori]);
                    if (newCat.rows[0]) {
                        categoryMap[catName] = newCat.rows[0].id;
                    } else {
                        const checkCat = await client.query('SELECT id FROM categories WHERE name = $1', [item.kategori]);
                        categoryMap[catName] = checkCat.rows[0].id;
                    }
                }
                categoryId = categoryMap[catName];
            }

            const ingredients = Array.isArray(item.malzemeler)
                ? item.malzemeler.map(m => `${m.miktar || ''} ${m.birim || ''} ${m.isim}`).join('\n')
                : '';

            const instructions = Array.isArray(item.yapilis_adimlari)
                ? item.yapilis_adimlari.join('\n')
                : '';

            await client.query(`
                INSERT INTO recipes (
                    title, description, ingredients, instructions, 
                    category_id, user_id, servings, prep_time, cook_time
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT DO NOTHING
            `, [
                item.tarif_adi,
                item._source?.raw_name || item.tarif_adi,
                ingredients,
                instructions,
                categoryId,
                adminId,
                item.porsiyon ? parseInt(item.porsiyon) : null,
                item.hazirlik_suresi_dk ? parseInt(item.hazirlik_suresi_dk) : null,
                item.pisirme_suresi_dk ? parseInt(item.pisirme_suresi_dk) : null
            ]);

            importedCount++;
            if (importedCount % 100 === 0) {
                console.log(`⏳ ${importedCount} tarif aktarıldı...`);
            }
        }

        console.log(`\n✅ Başarıyla ${importedCount} tarif aktarıldı!`);

    } catch (err) {
        console.error('❌ Hata:', err.stack);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

importRecipes();
