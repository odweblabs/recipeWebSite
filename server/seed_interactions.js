const { pool } = require('./database');

async function seedInteractions() {
    console.log('🚀 Otomatik Takip ve Beğeni İşlemi Başlatıldı (Parçalı İşlem)...');
    
    // Hedef kullanıcılar: admin ve Osman
    const targetUsernames = ['admin', 'Osman'];

    try {
        const client = await pool.connect();
        
        // 1. Hedef ID'leri bul
        const targetRes = await client.query("SELECT id FROM users WHERE username IN ($1, $2)", targetUsernames);
        const targetIds = targetRes.rows.map(r => r.id);
        
        if (targetIds.length === 0) {
            console.error('❌ Hedef kullanıcılar bulunamadı!');
            process.exit(1);
        }

        // 2. Takip işlemleri
        console.log('👥 Takip işlemleri yapılıyor...');
        const followResult = await client.query(`
            INSERT INTO friendships (requester_id, addressee_id, status)
            SELECT u.id, t.id, 'accepted'
            FROM users u, (SELECT unnest($1::int[]) as id) as t
            WHERE u.username LIKE 'testuser%'
            ON CONFLICT (requester_id, addressee_id) DO NOTHING
        `, [targetIds]);
        console.log(`✅ Takip işlemleri tamamlandı. (${followResult.rowCount} kayıt)`);

        // 3. Beğeni işlemleri
        console.log('❤️ Beğeni işlemleri başlatılıyor...');
        const usersRes = await client.query("SELECT id FROM users WHERE username LIKE 'testuser%' ORDER BY id");
        const userIds = usersRes.rows.map(r => r.id);
        
        const chunkSize = 50;
        let totalLiked = 0;
        for (let i = 0; i < userIds.length; i += chunkSize) {
            const currentChunk = userIds.slice(i, i + chunkSize);
            const res = await client.query(`
                INSERT INTO favorites (user_id, recipe_id)
                SELECT u.id, r.id
                FROM (SELECT unnest($1::int[]) as id) as u, recipes r
                WHERE r.user_id IN (SELECT id FROM users WHERE username IN ('admin', 'Osman'))
                ON CONFLICT (user_id, recipe_id) DO NOTHING
            `, [currentChunk]);
            totalLiked += res.rowCount;
            console.log(`   - İşlendi: ${i + currentChunk.length}/1000 kullanıcı (${totalLiked} yeni beğeni)`);
        }

        console.log('\n✅ Tüm işlemler başarıyla tamamlandı!');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ HATA:', err.message);
        process.exit(1);
    }
}

seedInteractions();
