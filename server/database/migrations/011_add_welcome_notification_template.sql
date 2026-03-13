-- 011_add_welcome_notification_template.sql
-- Add welcome notification template settings to site_settings table

INSERT INTO site_settings (key, value) VALUES ('welcome_notif_title', 'Tarifo Mutfağına Hoş Geldin, {isim}! 👨‍🍳✨') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_settings (key, value) VALUES ('welcome_notif_message', 'Selam {isim}! Aramıza katılmana çok sevindik, masada sana da bir yer ayırdık. Artık gizli aile tariflerini paylaşabilir veya bu akşam ne pişirsem derdine son verecek yeni lezzetler keşfedebilirsin. Hadi, mutfak önlüğünü tak ve ilk tarifini bizimle paylaş (ya da sadece lezzetli tarifler arasında kaybol)! Şimdiden afiyet olsun.') ON CONFLICT (key) DO NOTHING;
