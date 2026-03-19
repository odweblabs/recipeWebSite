const { pool } = require('./database');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    console.log('🧹 Eski Test Kullanıcıları temizleniyor...');
    const client = await pool.connect();
    const hashedPassword = bcrypt.hashSync('123456', 10);

    const firstNames = [
        'Ahmet', 'Mehmet', 'Mustafa', 'Can', 'Ali', 'Ömer', 'Emre', 'Burak', 'Hüseyin', 'Deniz',
        'Zeynep', 'Elif', 'Ayşe', 'Fatma', 'Merve', 'Selin', 'Dilan', 'Ece', 'Gözde', 'Dilara',
        'Murat', 'Serkan', 'Gökhan', 'Emir', 'Kaan', 'Arda', 'Mert', 'Yiğit', 'Onur', 'Tolga',
        'İrem', 'Büşra', 'Kübra', 'Aslı', 'Bahar', 'Ceren', 'Damla', 'Ebru', 'Gizem', 'Hande'
    ];

    const lastNames = [
        'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın', 'Özkan', 'Arslan', 'Doğan',
        'Kılıç', 'Polat', 'Güler', 'Bulut', 'Yalçın', 'Koç', 'Kurt', 'Özdemir', 'Şahin', 'Aksoy',
        'Taş', 'Aktaş', 'Erdoğan', 'Şen', 'Güneş', 'Bakır', 'Özcan', 'Tunç', 'Umut', 'Korkmaz',
        'Arıkan', 'Sönmez', 'Yavuz', 'Turan', 'Duran', 'Bozkurt', 'Özer', 'Uysal', 'Akbulut', 'Tutar'
    ];

    const faceIds = [
        '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e', '1507003211169-0a1dd7228f2d',
        '1544005313-94ddf0286df2', '1491349174775-aaafeba819df', '1544725176-7c40e5a71c5e',
        '1554151228-14d9def656e4', '1506794778202-cad84cf45f1d', '1597223557154-721c1cecc71a',
        '1494790108377-be9c29b29330', '1534528741775-53994a69daeb', '1501196356655-ed990a4237f3',
        '1521119956141-10bc11964292', '1539571696357-5a69c17a67c6', '1542206395-9feb3edaa67d',
        '1552058544-353a121ac86b', '1580489944761-15a19d654956', '1508214751196-bcfd4ca60f91',
        '1531746020798-e6953c6e8e04', '1522075469751-3a6694fb2f61'
    ];

    try {
        await client.query('BEGIN');
        
        // Önce eski test kullanıcılarını sil
        await client.query("DELETE FROM users WHERE username LIKE 'testuser%'");
        console.log('✅ Eski test kullanıcıları silindi.');
        
        console.log('🌱 1000 Yeni Test Kullanıcısı Ekleniyor (Gerçek İsimlerle)...');

        for (let i = 0; i < 1000; i++) {
            // İsimleri deterministik kombinasyonla üret
            const firstName = firstNames[i % firstNames.length];
            const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
            const fullName = `${firstName} ${lastName}`;
            
            const username = `testuser${(i + 1).toString().padStart(4, '0')}`;
            
            const faceId = faceIds[i % faceIds.length];
            const imgUrl = `https://images.unsplash.com/photo-${faceId}?auto=format&fit=crop&w=150&h=150&q=80&sig=${i}`;

            await client.query(
                "INSERT INTO users (username, password, full_name, profile_image, country, city) VALUES ($1, $2, $3, $4, $5, $6)",
                [username, hashedPassword, fullName, imgUrl, 'Türkiye', 'İstanbul']
            );

            if ((i + 1) % 100 === 0) {
                console.log(`   - ${i + 1} kullanıcı eklendi...`);
            }
        }

        await client.query('COMMIT');
        console.log('\n✅ 1000 Benzersiz isimli test kullanıcısı başarıyla oluşturuldu!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('\n❌ HATA:', err.message);
    } finally {
        client.release();
        process.exit(0);
    }
}

seedUsers();
