import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            tr: {
                translation: {
                    nav: {
                        home: "Ana Sayfa",
                        recipes: "Tarifler",
                        menus: "Menüler",
                        trend: "Trend",
                        what_to_cook: "Ne Pişirsem?",
                        blog: "Blog",
                        lists: "Listeler",
                        calories: "Kaç Kalori?",
                        admin_panel: "Giriş Yap / Kaydol",
                        login: "Giriş Yap",
                        logout: "Çıkış Yap",
                        share_recipe: "Tarif Paylaş"
                    },
                    home: {
                        hero: {
                            badge: "YENİ NESİL MUTFAK REHBERİ",
                            title_1: "Öğren, Pişir &",
                            title_2: "Tadını Çıkar.",
                            stats: {
                                videos: "Video",
                                recipes: "Özel Tarif",
                                chefs: "Üye Şef"
                            }
                        },
                        categories: {
                            explore: "KEŞFET",
                            subtitle: "MUTFAĞINIZIN SINIRLARINI ZORLAYIN",
                            title: "Kategorileri Keşfedin",
                            examine: "İncele"
                        },
                        sections: {
                            stars_of_week: "Haftanın Yıldızları",
                            chefs_of_week: {
                                subtitle: "USTALARIN MUTFAĞI",
                                title: "Haftanın Şefleri",
                                description: "Topluluğumuza en çok katkı sağlayan ve ilham veren şeflerimizle tanışın."
                            },
                            kitchen_secrets: "Mutfak Sırları",
                            all_blog: "TÜMÜNÜ OKU",
                            join_community: {
                                title: "Mutfakta Senin İçin Bir Yer Ayırdık.",
                                description: "Hemen ücretsiz kayıt ol, kendi tariflerini paylaş ve binlerce şeflik topluluğumuza katıl.",
                                button_join: "HEMEN KATIL",
                                button_browse: "TARİFLERİ GEZ"
                            },
                            recent_reviews: "Son Yorumlar",
                            chef_recommendation: {
                                tag: "GÜNÜN ÖZELİ",
                                score: "Puan",
                                label: "Şefin Tavsiyesi:",
                                description: "Haftanın en çok beğenilen tarifi ile akşam yemeğinizi bir ziyafete dönüştürün.",
                                prep: "HAZIRLIK",
                                servings: "PORSİYON",
                                author: "HAZIRLAYAN",
                                button: "TARİFİ İNCELE"
                            }
                        }
                    },
                    recipes: {
                        breadcrumb: {
                            home: "ANASAYFA",
                            recipes: "TARİFLER"
                        },
                        header: {
                            title_1: "Lezzet Yolculuğuna",
                            title_2: "Buradan Başla",
                            description: "Binlerce özenle seçilmiş tarif arasından damak tadınıza en uygun olanı saniyeler içinde bulun."
                        },
                        filters: {
                            search_placeholder: "Tarif veya malzeme ara...",
                            category: "Kategori",
                            sort: {
                                az: "A-Z",
                                za: "Z-A",
                                newest: "En Yeni",
                                rating: "Beğenilen",
                                popular: "Popüler"
                            }
                        },
                        results: {
                            found_prefix: "",
                            found_suffix: "Harika Tarif Listelendi",
                            loading: "Tarifler Hazırlanıyor...",
                            collection: "SEÇKİN KOLEKSİYON"
                        },
                        not_found: {
                            title: "Bulunamadı",
                            description: "Aradığın kriterlerde tarif bulamadık. Lütfen farklı kelimelerle veya filtrelerle tekrar dene.",
                            button: "FİLTRELERİ SIFIRLA"
                        }
                    },
                    trend: {
                        breadcrumb: {
                            home: "ANASAYFA",
                            trend: "TREND"
                        },
                        header: {
                            title_1: "Şu An",
                            title_2: "Trend Olan Tarifler",
                            description: "En çok beğenilen, en çok yorum alan ve en yeni tarifler burada. Herkesin konuştuğu lezzetleri keşfet."
                        },
                        sections: {
                            top_rated: "En Yüksek Puanlı",
                            top_commented: "En Çok Konuşulan",
                            newest: "Yeni Eklenenler",
                            all: "TÜMÜNÜ GÖR",
                            by_comments: "YORUM SAYISINA GÖRE",
                            new_tag: "YENİ",
                            top_trend: "#1 TREND"
                        },
                        cta: {
                            badge: "SEN DE TREND OL",
                            title: "Kendi Tarifini Paylaş",
                            description: "En lezzetli tariflerini herkesin görmesi için paylaş. Belki bir sonraki #1 senin tarifin olur!",
                            button: "TARİF PAYLAŞ"
                        }
                    },
                    search: {
                        placeholder: "Mükemmel tarifi keşfet...",
                        voice_error: "Üzgünüz, tarayıcınız sesli aramayı desteklemiyor.",
                        searching_in: "tarif içinde ara",
                        search_generic: "Tariflerde ara...",
                        recent: "Son Aradıklarım",
                        popular: "Popüler Aramalar",
                        quick_access: "Hızlı Erişim",
                        clear_recent: "Tümünü Gör",
                        popular_items: {
                            dessert: "tatlı",
                            soup: "çorba",
                            appetizer: "meze",
                            revani: "revani",
                            milky_desserts: "sütlü tatlılar",
                            pasta: "makarna"
                        },
                        quick_access_items: {
                            daily_menu: "Günün menüsü",
                            practical_main: "Pratik ana yemekler"
                        },
                        by_ingredient: {
                            title: "Malzemeye Göre Tarif Ara",
                            placeholder: "Malzeme ara...",
                            search_button: "Tarif Ara",
                            with_ingredients: "malzeme ile tarif ara",
                            not_found: "Malzeme bulunamadı.",
                            categories: {
                                all: "Tümü",
                                protein: "Protein",
                                vegetable: "Sebze",
                                grain: "Tahıl",
                                dairy: "Süt Ürünleri",
                                spice: "Baharat"
                            },
                            items: {
                                chicken: "tavuk eti",
                                minced: "kıyma",
                                beef: "dana eti",
                                fish: "balık",
                                egg: "yumurta",
                                shrimp: "karides",
                                potato: "patates",
                                onion: "soğan",
                                tomato: "domates",
                                pepper: "biber",
                                carrot: "havuç",
                                zucchini: "kabak",
                                eggplant: "patlıcan",
                                spinach: "ıspanak",
                                garlic: "sarımsak",
                                peas: "bezelye",
                                mushroom: "mantar",
                                broccoli: "brokoli",
                                corn: "mısır",
                                beans: "fasulye",
                                cabbage: "lahana",
                                leek: "pırasa",
                                artichoke: "enginar",
                                broad_beans: "bakla",
                                rice: "pirinç",
                                pasta: "makarna",
                                bulgur: "bulgur",
                                flour: "un",
                                bread: "ekmek",
                                chickpeas: "nohut",
                                lentils: "mercimek",
                                milk: "süt",
                                cheese: "peynir",
                                yogurt: "yoğurt",
                                butter: "tereyağı",
                                cream: "krema",
                                olive_oil: "zeytinyağı",
                                lemon: "limon",
                                salt: "tuz",
                                sugar: "şeker",
                                tomato_paste: "salça",
                                black_pepper: "karabiber",
                                chili_flakes: "pul biber",
                                mint: "nane",
                                parsley: "maydanoz",
                                dill: "dereotu"
                            }
                        }
                    },
                    common: {
                        view_recipe: "Tarifi Gör",
                        examine_recipe: "TARİFİ İNCELE",
                        servings: "Kişilik",
                        servings_alt: "KİŞİLİK",
                        prep_time: "dk",
                        prep_time_alt: "DK",
                        prep_short: "Hzr.",
                        cook_short: "Piş.",
                        comments: "Yorum",
                        chef: "Şef",
                        guest_chef: "Konuk Şef",
                        master_chef: "Master Chef",
                        gourme_chef: "Gurme Şef",
                        minutes: "dk",
                        rating: "Puan",
                        recipe_count: "Tarif",
                        new_tag: "YENİ",
                        general: "GENEL",
                        share: "Paylaş",
                        print: "Yazdır"
                    },
                    settings: {
                        title: "Ayarlar",
                        user_card: {
                            edit_profile: "Profili Düzenle"
                        },
                        groups: {
                            notifications: "Bildirimler & Genel",
                            design: "Tasarım & Dil",
                            support: "Destek & Yasal"
                        },
                        items: {
                            pause_notifications: "Bildirimleri duraklat",
                            general_settings: "Genel Ayarlar",
                            dark_mode: "Koyu Tema",
                            language: "Dil",
                            contacts: "Kişilerim",
                            share_app: "Uygulamayı Paylaş",
                            send_suggestion: "Öneri Gönder",
                            report_bug: "Hata Bildir",
                            faq: "Sıkça Sorulan Sorular",
                            terms: "Kullanım Koşulları",
                            policy: "Gizlilik Politikası",
                            logout: "Oturumu Kapat"
                        },
                        feedback: {
                            suggestion_title: "Öneri Gönder",
                            bug_title: "Hata Bildir",
                            placeholder: "Mesajınız...",
                            submit: "Gönder",
                            success: "Geri bildiriminiz için teşekkürler!",
                            error: "Bir hata oluştu, lütfen tekrar deneyin."
                        },
                        share: {
                            title: "Tarifo - Mutfaktaki En İyi Yardımcın!",
                            text: "Binlerce nefis tarife ulaşmak için Tarifo'yu dene!",
                            success: "Paylaşıldı!",
                            error: "Paylaşım başarısız."
                        }
                    },
                    edit_profile: {
                        title: "Profili Düzenle",
                        fields: {
                            full_name: "Ad Soyad",
                            current_password: "Mevcut Şifre",
                            new_password: "Yeni Şifre",
                            confirm_password: "Şifreyi Onayla",
                            country: "Ülke",
                            city: "Şehir"
                        },
                        buttons: {
                            save: "Değişiklikleri Kaydet",
                            delete: "Hesabı Sil",
                            updating: "Güncelleniyor..."
                        },
                        validation: {
                            name_required: "Ad soyad en az 3 karakter olmalıdır.",
                            password_mismatch: "Yeni şifreler eşleşmiyor.",
                            password_length: "Yeni şifre en az 6 karakter olmalıdır.",
                            current_password_required: "Şifre değişikliği için mevcut şifrenizi girmelisiniz."
                        },
                        status: {
                            success: "Profil başarıyla güncellendi!",
                            error: "Güncelleme sırasında bir hata oluştu.",
                            delete_confirm: "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
                            delete_success: "Hesabınız başarıyla silindi.",
                            delete_error: "Hesap silinirken bir hata oluştu."
                        }
                    },
                    profile: {
                        title: "Profilim",
                        logout_confirm: "Çıkış yapmak istediğinize emin misiniz?",
                        unfollow_confirm: "Takibi bırakmak istediğinize emin misiniz?",
                        error_generic: "Bir hata oluştu.",
                        comment_delete_error: "Yorum silinemedi.",
                        comment_update_error: "Yorum güncellenemedi.",
                        comment_delete_confirm: "Bu yorumu silmek istediğinize emin misiniz?",
                        processing: "İşleniyor...",
                        following: "Takip Ediyorsun",
                        request_sent: "İstek Gönderildi",
                        accept: "Kabul Et",
                        reject: "Reddet",
                        follow: "Takip Et",
                        loading: "Yükleniyor...",
                        not_found: "Kullanıcı bulunamadı.",
                        followers: "takipçi",
                        following_count: "takip",
                        pending_requests: "Bekleyen Takip İstekleri",
                        tabs: {
                            recipes: "Tarifler",
                            favorites: "Favoriler",
                            notifications: "Bildirimler"
                        },
                        wants_to_follow: "Seni takip etmek istiyor",
                        no_posts: "Henüz bir paylaşım bulunmuyor.",
                        no_notifications: "Yeni bildirim bulunmuyor.",
                        show_more: "DAHA FAZLA GÖSTER"
                    },
                    footer: {
                        description: "En lezzetli yemek tarifleri, mutfak sırları ve daha fazlası. Sofralarınızı şenlendirmek için buradayız.",
                        quick_links: "Hızlı Erişim",
                        about_us: "Hakkımızda",
                        contact: "İletişim",
                        location: "İstanbul, Türkiye",
                        all_rights_reserved: "Tüm hakları saklıdır."
                    },
                    what_to_cook: {
                        breadcrumb: "NE PİŞİRSEM",
                        header: {
                            title_1: "Bugün Ne",
                            title_2: "Pişirsem?",
                            description: "Karar veremiyorsan bırak biz seçelim! Filtrele ve çarkı çevir."
                        },
                        filters: {
                            show: "Filtrele",
                            hide: "Filtreleri Gizle",
                            title: "Filtreler",
                            clear: "Temizle",
                            category: "KATEGORİ",
                            max_time: "MAKSİMUM SÜRE",
                            servings: "KİŞİ SAYISI",
                            any: "Farketmez",
                            person: "Kişi"
                        },
                        actions: {
                            spinning: "Seçiliyor...",
                            spin: "ÇARKI ÇEVİR",
                            spin_again: "BİR DAHA ÇEVİR",
                            recipes_fit: "TARİF UYGUN"
                        },
                        empty: {
                            title: "Çarkı Çevir!",
                            description: "Yukarıdaki butona tıklayarak sana özel bir tarif önerisi al. İstersen önce filtrele!"
                        },
                        loading: "Tarifler yükleniyor...",
                        suggestion: {
                            tag: "SANA ÖZEL ÖNERİ",
                            prep: "Hazırlık",
                            cook: "Pişirme",
                            servings: "Kişilik",
                            button: "TARİFE GİT"
                        },
                        others: "Diğer Öneriler",
                        not_found: {
                            title: "Tarif Bulunamadı",
                            description: "Bu filtrelere uygun tarif yok. Filtreleri değiştirmeyi dene.",
                            button: "FİLTRELERİ SIFIRLA"
                        }
                    },
                    recipe_detail: {
                        back: "Geri Dön",
                        rate: {
                            title: "Bu Tarifi Puanla",
                            rated_by: "{{count}} kişi puanladı",
                            not_rated: "Henüz puanlanmamış",
                            success: "Puanınız kaydedildi.",
                            error: "Puan verilirken hata oluştu.",
                            login_required: "Puan vermek için lütfen giriş yapın."
                        },
                        stats: {
                            prep: "Hazırlama",
                            cook: "Pişirme",
                            servings: "Porsiyon"
                        },
                        chef_title: "Tarifin Şefi",
                        favorites: {
                            added: "Favorilerde",
                            add: "Favoriye Ekle",
                            login_required: "Favorilere eklemek için lütfen giriş yapın."
                        },
                        wake_lock: {
                            active: "EKRAN AÇIK TUTULUYOR",
                            inactive: "EKRANI AÇIK TUT (PİŞİRİRKEN)",
                            not_supported: "Ekranı açık tutma özelliği tarayıcınız tarafından desteklenmiyor.",
                            denied: "Ekranı açık tutma özelliği cihazınız tarafından reddedildi veya desteklenmiyor."
                        },
                        ingredients: "Malzemeler",
                        instructions: "Hazırlanışı",
                        comments: {
                            title: "Yorumlar",
                            leave_comment: "Bir yorum bırakın",
                            placeholder: "Bu tarif hakkında ne düşünüyorsunuz?",
                            submit: "Gönder",
                            submitting: "Gönderiliyor...",
                            login_required: "Yorum yapmak için giriş yapmalısınız.",
                            login_link: "Giriş Yap / Kayıt Ol",
                            empty: "Henüz yorum yapılmamış. İlk yorumu siz yapın!",
                            error: "Yorum eklenirken hata oluştu.",
                            login_alert: "Yorum yapmak için lütfen giriş yapın."
                        },
                        share_success: "Bağlantı kopyalandı!",
                        not_found: "Tarif bulunamadı."
                    },
                    menus: {
                        breadcrumb: "MENÜLER",
                        hero: {
                            title: "Kendi Menünü Buradan Oluştur",
                            subtitle: "Haftalık plan, misafir menüsü ya da diyet listesi… Favori tariflerini bir araya getir, tek tıkla tekrar bul."
                        },
                        create_button: "YENİ MENÜ OLUŞTUR",
                        saved_count: "{{count}} MENÜ KAYITLI",
                        presets: {
                            title: "Hazır Menüler",
                            badge: "SİTEDEN SEÇİLDİ",
                            error: "Hazır menüler yüklenemedi. Sunucu çalışıyor mu?",
                            tag: "HAZIR MENÜ",
                            recipe_count: "{{count}} Tarif",
                            default_desc: "Siteden seçilmiş tariflerle hazırlanmış hazır menü.",
                            copy: "MENÜYÜ KOPYALA",
                            items: {
                                quick: {
                                    title: "Hızlı Akşam Menüsü",
                                    desc: "Az zamanda çok lezzet: pratik ve hızlı tariflerden seçki."
                                },
                                fit: {
                                    title: "Fit & Hafif Menü",
                                    desc: "Daha hafif seçenekler: salata, çorba ve yüksek puanlı tarifler."
                                },
                                guest: {
                                    title: "Misafir Menüsü",
                                    desc: "Masayı şenlendiren tarifler: ana yemek + tamamlayıcılar."
                                }
                            }
                        },
                        empty: {
                            title: "Henüz menün yok",
                            description: "İlk menünü oluştur ve içerisine tarif ekle. Sonra kolayca tekrar açıp pişirmeye başla.",
                            button: "MENÜ OLUŞTUR"
                        },
                        card: {
                            added_by: "Menüyü Ekleyen",
                            local_user: "Bu cihazdaki kullanıcı",
                            no_description: "Açıklama eklenmemiş.",
                            more: "Daha",
                            delete: "SİL",
                            open: "MENÜYÜ AÇ"
                        },
                        modal: {
                            title: "Menü",
                            close: "KAPAT",
                            edit_copy: "DÜZENLE (KOPYA)"
                        },
                        create: {
                            title: "Menü Oluştur",
                            subtitle: "Tariflerini bir araya getir",
                            name_label: "Menü Adı",
                            name_placeholder: "Örn: Haftalık Menü",
                            desc_label: "Açıklama (opsiyonel)",
                            desc_placeholder: "Örn: Pazartesi–Cuma hızlı ve pratik tarifler",
                            selected_recipes: "Seçilen Tarifler",
                            empty_selection: "Sağdan tarif seçerek menünü oluştur.",
                            search_placeholder: "Tarif ara...",
                            all_categories: "Tüm Kategoriler",
                            error: "Tarifler veya kategoriler yüklenemedi. Sunucu çalışıyor mu?",
                            loading: "Yükleniyor...",
                            add_hint: "Eklemek için tıkla",
                            already_added: "Henüz menüye eklenmemiş."
                        }
                    },
                    blog: {
                        read: "OKU",
                        author_about: "Yazar Hakkında",
                        author_desc_prefix: "",
                        author_desc_suffix: "tarif yazarı",
                        share_success: "Bağlantı kopyalandı!",
                        back: "Geri Dön",
                        print: "Yazdır"
                    },
                    calories: {
                        header: {
                            badge: "SAĞLIKLI YAŞAM REHBERİ",
                            title: "Kaç Kalori",
                            subtitle: "Biliyor musun?",
                            desc: "Sağlıklı bir yaşam için günlük alman gereken kalori miktarını hesapla ve besinlerin kalori değerlerini öğren."
                        },
                        tabs: {
                            calculate: "Hesapla",
                            guide: "Besin Rehberi",
                            tips: "Öneriler"
                        },
                        form: {
                            weight: "KİLO (KG)",
                            height: "BOY (CM)",
                            age: "YAŞ",
                            gender: "CİNSİYET",
                            male: "Erkek",
                            female: "Kadın",
                            activity: "HAREKET SEVİYESİ",
                            activity_levels: {
                                level_1: "Az Hareketli (Haftada 0-1 gün)",
                                level_2: "Hafif Hareketli (Haftada 1-3 gün)",
                                level_3: "Orta Hareketli (Haftada 3-5 gün)",
                                level_4: "Çok Hareketli (Haftada 6-7 gün)",
                                level_5: "Profesyonel Sporcu"
                            },
                            submit: "HESAPLA"
                        },
                        results: {
                            daily_needs: "Günlük İhtiyacın",
                            kcal: "kcal",
                            lose_weight: "Kilo Vermek İçin",
                            gain_weight: "Kilo Almak İçin",
                            bmr: "Basal Metabolizma Hızın (BMR)",
                            bmr_desc: "Bu kaloriyi vücudun hiçbir şey yapmasa bile harcar.",
                            not_calculated_yet: "Henüz Hesaplama Yapılmadı",
                            not_calculated_desc: "Bilgilerini girerek günlük kalori ihtiyacını hemen öğren!"
                        },
                        tips: {
                            title_1: "Küçük Porsiyonlar Kullanın",
                            desc_1: "Tabağınızı küçültmek, porsiyon kontrolünü kolaylaştırır ve göz doyuruculuğunu artırır.",
                            title_2: "Yavaş Çiğneyin",
                            desc_2: "Beyninize tokluk sinyalinin ulaşması yaklaşık 20 dakika sürer. Yavaş yemek daha az kalori almanızı sağlar.",
                            title_3: "Su İçmeyi Unutmayın",
                            desc_3: "Bazen susuzluğu açlık ile karıştırabiliriz. Yemekten 30 dakika önce içilen su, tokluk hissini artırır.",
                            title_4: "Etiket Okuma Alışkanlığı",
                            desc_4: "Marketten aldığınız ürünlerin 'porsiyon' başına değil '100g' başına kalori değerlerine dikkat edin.",
                            warning_title: "Önemli Uyarı",
                            warning_desc: "Bu hesaplamalar genel bilgilendirme amaçlıdır. Herhangi bir diyet programına başlamadan önce mutlaka bir uzman doktora veya diyetisyene danışınız."
                        }
                    },
                    lists: {
                        loading: "YÜKLENİYOR...",
                        home: "ANASAYFA",
                        title: "LİSTELER",
                        header: {
                            title_1: "Alışveriş",
                            title_2: "Listelerin",
                            desc: "Sadece senin görebileceğin özel alışveriş listelerini oluştur ve yönet."
                        },
                        create_new: "YENİ LİSTE OLUŞTUR",
                        create_button: "LİSTE OLUŞTUR",
                        modal: {
                            title: "LİSTE OLUŞTUR",
                            name_label: "Liste Adı",
                            name_placeholder: "Örn: Haftalık Market Listesi",
                            store_label: "Market İsmi (İsteğe Bağlı)",
                            store_placeholder: "Örn: Migros, Şok...",
                            submit: "OLUŞTUR"
                        },
                        stores: {
                            market: "Market: "
                        },
                        items: {
                            list: "Liste",
                            add_placeholder: "Ürün ekle...",
                            quick_add: "Hızlı Ekle",
                            empty: "Henüz ürün eklenmemiş.",
                            categories: {
                                basic: "Temel",
                                greengrocer: "Manav",
                                butcher: "Kasap",
                                pantry: "Kiler",
                                drinks: "İçecek",
                                cleaning: "Temizlik"
                            }
                        },
                        actions: {
                            share: "PAYLAŞ",
                            save: "KAYDET"
                        },
                        empty: {
                            title: "Henüz listen yok",
                            button: "LİSTE OLUŞTUR"
                        }
                    }
                }
            },
            en: {
                translation: {
                    nav: {
                        home: "Home",
                        recipes: "Recipes",
                        menus: "Menus",
                        trend: "Trend",
                        what_to_cook: "What to Cook?",
                        blog: "Blog",
                        lists: "Lists",
                        calories: "Calories?",
                        admin_panel: "Login / Register",
                        login: "Login",
                        logout: "Logout",
                        share_recipe: "Share Recipe"
                    },
                    home: {
                        hero: {
                            badge: "NEXT GEN KITCHEN GUIDE",
                            title_1: "Learn, Cook &",
                            title_2: "Enjoy.",
                            stats: {
                                videos: "Videos",
                                recipes: "Special Recipes",
                                chefs: "Chefs"
                            }
                        },
                        categories: {
                            explore: "EXPLORE",
                            subtitle: "PUSH THE LIMITS OF YOUR KITCHEN",
                            title: "Explore Categories",
                            examine: "View"
                        },
                        sections: {
                            stars_of_week: "Stars of the Week",
                            chefs_of_week: {
                                subtitle: "MASTER KITCHEN",
                                title: "Chefs of the Week",
                                description: "Meet our chefs who contribute the most to our community and inspire."
                            },
                            kitchen_secrets: "Kitchen Secrets",
                            all_blog: "READ ALL",
                            join_community: {
                                title: "We Reserved a Place for You in the Kitchen.",
                                description: "Register for free now, share your own recipes and join our community of thousands of chefs.",
                                button_join: "JOIN NOW",
                                button_browse: "BROWSE RECIPES"
                            },
                            recent_reviews: "Recent Reviews",
                            chef_recommendation: {
                                tag: "SPECIAL OF THE DAY",
                                score: "Points",
                                label: "Chef's Recommendation:",
                                description: "Turn your dinner into a feast with the most liked recipe of the week.",
                                prep: "PREPARATION",
                                servings: "PORTION",
                                author: "PREPARED BY",
                                button: "VIEW RECIPE"
                            }
                        }
                    },
                    recipes: {
                        breadcrumb: {
                            home: "HOME",
                            recipes: "RECIPES"
                        },
                        header: {
                            title_1: "Start Your Food Journey",
                            title_2: "Right Here",
                            description: "Find the most suitable recipe for your taste in seconds among thousands of carefully selected recipes."
                        },
                        filters: {
                            search_placeholder: "Search recipes or ingredients...",
                            category: "Category",
                            sort: {
                                az: "A-Z",
                                za: "Z-A",
                                newest: "Newest",
                                rating: "Top Rated",
                                popular: "Popular"
                            }
                        },
                        results: {
                            found_prefix: "",
                            found_suffix: "Amazing Recipes Listed",
                            loading: "Preparing Recipes...",
                            collection: "PREMIUM COLLECTION"
                        },
                        not_found: {
                            title: "Not Found",
                            description: "We couldn't find any recipes matching your criteria. Please try again with different words or filters.",
                            button: "RESET FILTERS"
                        }
                    },
                    trend: {
                        breadcrumb: {
                            home: "HOME",
                            trend: "TREND"
                        },
                        header: {
                            title_1: "Right Now",
                            title_2: "Trending Recipes",
                            description: "Most liked, most commented and newest recipes are here. Explore the flavors everyone is talking about."
                        },
                        sections: {
                            top_rated: "Top Rated",
                            top_commented: "Most Talked About",
                            newest: "Newly Added",
                            all: "VIEW ALL",
                            by_comments: "BY COMMENT COUNT",
                            new_tag: "NEW",
                            top_trend: "#1 TREND"
                        },
                        cta: {
                            badge: "BE TRENDY TOO",
                            title: "Share Your Own Recipe",
                            description: "Share your most delicious recipes for everyone to see. Maybe the next #1 will be yours!",
                            button: "SHARE RECIPE"
                        }
                    },
                    search: {
                        placeholder: "Discover the perfect recipe...",
                        voice_error: "Sorry, your browser does not support voice search.",
                        searching_in: "search in recipes",
                        search_generic: "Search recipes...",
                        recent: "Recent Searches",
                        popular: "Popular Searches",
                        quick_access: "Quick Access",
                        clear_recent: "See All",
                        popular_items: {
                            dessert: "dessert",
                            soup: "soup",
                            appetizer: "appetizer",
                            revani: "revani",
                            milky_desserts: "milky desserts",
                            pasta: "pasta"
                        },
                        quick_access_items: {
                            daily_menu: "Daily menu",
                            practical_main: "Practical main dishes"
                        },
                        by_ingredient: {
                            title: "Search Recipe by Ingredient",
                            placeholder: "Search ingredient...",
                            search_button: "Search Recipe",
                            with_ingredients: "search recipes with ingredients",
                            not_found: "Ingredient not found.",
                            categories: {
                                all: "All",
                                protein: "Protein",
                                vegetable: "Vegetable",
                                grain: "Grain",
                                dairy: "Dairy Products",
                                spice: "Spice"
                            },
                            items: {
                                chicken: "chicken",
                                minced: "minced meat",
                                beef: "beef",
                                fish: "fish",
                                egg: "egg",
                                shrimp: "shrimp",
                                potato: "potato",
                                onion: "onion",
                                tomato: "tomato",
                                pepper: "pepper",
                                carrot: "carrot",
                                zucchini: "zucchini",
                                eggplant: "eggplant",
                                spinach: "spinach",
                                garlic: "garlic",
                                peas: "peas",
                                mushroom: "mushroom",
                                broccoli: "broccoli",
                                corn: "corn",
                                beans: "beans",
                                cabbage: "cabbage",
                                leek: "leek",
                                artichoke: "artichoke",
                                broad_beans: "broad beans",
                                rice: "rice",
                                pasta: "pasta",
                                bulgur: "bulgur",
                                flour: "flour",
                                bread: "bread",
                                chickpeas: "chickpeas",
                                lentils: "lentils",
                                milk: "milk",
                                cheese: "cheese",
                                yogurt: "yogurt",
                                butter: "butter",
                                cream: "cream",
                                olive_oil: "olive oil",
                                lemon: "lemon",
                                salt: "salt",
                                sugar: "sugar",
                                tomato_paste: "tomato paste",
                                black_pepper: "black pepper",
                                chili_flakes: "chili flakes",
                                mint: "mint",
                                parsley: "parsley",
                                dill: "dill"
                            }
                        }
                    },
                    common: {
                        view_recipe: "View Recipe",
                        examine_recipe: "VIEW RECIPE",
                        servings: "Servings",
                        servings_alt: "SERVINGS",
                        prep_time: "min",
                        prep_time_alt: "MIN",
                        prep_short: "Prep.",
                        cook_short: "Cook.",
                        comments: "Comments",
                        chef: "Chef",
                        guest_chef: "Guest Chef",
                        master_chef: "Master Chef",
                        gourme_chef: "Gourmet Chef",
                        minutes: "min",
                        rating: "Rating",
                        recipe_count: "Recipe",
                        new_tag: "NEW",
                        general: "GENERAL",
                        share: "Share",
                        print: "Print"
                    },
                    settings: {
                        title: "Settings",
                        user_card: {
                            edit_profile: "Edit Profile"
                        },
                        groups: {
                            notifications: "Notifications & General",
                            design: "Design & Language",
                            support: "Support & Legal"
                        },
                        items: {
                            pause_notifications: "Pause notifications",
                            general_settings: "General Settings",
                            dark_mode: "Dark Mode",
                            language: "Language",
                            contacts: "My Contacts",
                            faq: "FAQ (Frequently Asked Questions)",
                            terms: "Terms of Use",
                            policy: "User Policy",
                            logout: "Log Out"
                        }
                    },
                    edit_profile: {
                        title: "Edit Profile",
                        fields: {
                            full_name: "Full Name",
                            current_password: "Current Password",
                            new_password: "New Password",
                            confirm_password: "Confirm Password",
                            country: "Country",
                            city: "City"
                        },
                        buttons: {
                            save: "Save Changes",
                            delete: "Delete Account",
                            updating: "Updating..."
                        },
                        validation: {
                            name_required: "Full name must be at least 3 characters.",
                            password_mismatch: "New passwords do not match.",
                            password_length: "New password must be at least 6 characters.",
                            current_password_required: "Current password is required to change password."
                        },
                        status: {
                            success: "Profile updated successfully!",
                            error: "An error occurred during update.",
                            delete_confirm: "Are you sure you want to delete your account? This action cannot be undone.",
                            delete_success: "Your account has been deleted successfully.",
                            delete_error: "An error occurred while deleting the account."
                        }
                    },
                    profile: {
                        title: "My Profile",
                        logout_confirm: "Are you sure you want to log out?",
                        unfollow_confirm: "Are you sure you want to unfollow?",
                        error_generic: "An error occurred.",
                        comment_delete_error: "Comment could not be deleted.",
                        comment_update_error: "Comment could not be updated.",
                        comment_delete_confirm: "Are you sure you want to delete this comment?",
                        processing: "Processing...",
                        following: "Following",
                        request_sent: "Request Sent",
                        accept: "Accept",
                        reject: "Reject",
                        follow: "Follow",
                        loading: "Loading...",
                        not_found: "User not found.",
                        followers: "followers",
                        following_count: "following",
                        pending_requests: "Pending Follow Requests",
                        tabs: {
                            recipes: "Recipes",
                            favorites: "Favorites",
                            notifications: "Notifications"
                        },
                        wants_to_follow: "wants to follow you",
                        no_posts: "No posts yet.",
                        no_notifications: "No new notifications.",
                        show_more: "SHOW MORE"
                    },
                    footer: {
                        description: "The most delicious recipes, kitchen secrets and more. We are here to brighten up your tables.",
                        quick_links: "Quick Access",
                        about_us: "About Us",
                        contact: "Contact",
                        location: "Istanbul, Turkey",
                        all_rights_reserved: "All rights reserved."
                    },
                    what_to_cook: {
                        breadcrumb: "WHAT TO COOK",
                        header: {
                            title_1: "What to",
                            title_2: "Cook Today?",
                            description: "If you can't decide, let us choose! Filter and spin the wheel."
                        },
                        filters: {
                            show: "Filter",
                            hide: "Hide Filters",
                            title: "Filters",
                            clear: "Clear",
                            category: "CATEGORY",
                            max_time: "MAXIMUM TIME",
                            servings: "NUMBER OF PEOPLE",
                            any: "Any",
                            person: "Person"
                        },
                        actions: {
                            spinning: "Choosing...",
                            spin: "SPIN THE WHEEL",
                            spin_again: "SPIN AGAIN",
                            recipes_fit: "RECIPES MATCH"
                        },
                        empty: {
                            title: "Spin the Wheel!",
                            description: "Click the button above to get a special recipe suggestion for you. Filter first if you want!"
                        },
                        loading: "Loading recipes...",
                        suggestion: {
                            tag: "SPECIAL SUGGESTION FOR YOU",
                            prep: "Prep",
                            cook: "Cook",
                            servings: "People",
                            button: "GO TO RECIPE"
                        },
                        others: "Other Suggestions",
                        not_found: {
                            title: "Recipe Not Found",
                            description: "No recipes match these filters. Try changing filters.",
                            button: "RESET FILTERS"
                        }
                    },
                    recipe_detail: {
                        back: "Go Back",
                        rate: {
                            title: "Rate This Recipe",
                            rated_by: "Rated by {{count}} people",
                            not_rated: "Not rated yet",
                            success: "Your rating has been saved.",
                            error: "Error while rating.",
                            login_required: "Please login to rate."
                        },
                        stats: {
                            prep: "Preparation",
                            cook: "Cooking",
                            servings: "Servings"
                        },
                        chef_title: "Recipe's Chef",
                        favorites: {
                            added: "In Favorites",
                            add: "Add to Favorites",
                            login_required: "Please login to add to favorites."
                        },
                        wake_lock: {
                            active: "SCREEN IS KEPT AWAKE",
                            inactive: "KEEP SCREEN ON (WHILE COOKING)",
                            not_supported: "Screen wake lock is not supported by your browser.",
                            denied: "Screen wake lock was denied or not supported by your device."
                        },
                        ingredients: "Ingredients",
                        instructions: "Instructions",
                        comments: {
                            title: "Comments",
                            leave_comment: "Leave a comment",
                            placeholder: "What do you think about this recipe?",
                            submit: "Send",
                            submitting: "Sending...",
                            login_required: "You must login to comment.",
                            login_link: "Login / Register",
                            empty: "No comments yet. Be the first to comment!",
                            error: "Error while adding comment.",
                            login_alert: "Please login to comment."
                        },
                        share_success: "Link copied to clipboard!",
                        not_found: "Recipe not found."
                    },
                    menus: {
                        breadcrumb: "MENUS",
                        hero: {
                            title: "Create Your Own Menu Here",
                            subtitle: "Weekly plan, guest menu or diet list... Gather your favorite recipes and find them again with one click."
                        },
                        create_button: "CREATE NEW MENU",
                        saved_count: "{{count}} MENUS SAVED",
                        presets: {
                            title: "Preset Menus",
                            badge: "PICKED FROM SITE",
                            error: "Failed to load preset menus. Is server running?",
                            tag: "PRESET MENU",
                            recipe_count: "{{count}} Recipes",
                            default_desc: "Preset menu prepared with recipes selected from the site.",
                            copy: "COPY MENU",
                            items: {
                                quick: {
                                    title: "Quick Dinner Menu",
                                    desc: "Lots of flavor in a short time: a selection of practical and fast recipes."
                                },
                                fit: {
                                    title: "Fit & Light Menu",
                                    desc: "Lighter options: salads, soups and high rated recipes."
                                },
                                guest: {
                                    title: "Guest Menu",
                                    desc: "Recipes that cheer up the table: main course + complementary dishes."
                                }
                            }
                        },
                        empty: {
                            title: "You don't have a menu yet",
                            description: "Create your first menu and add recipes. Then easily open it again and start cooking.",
                            button: "CREATE MENU"
                        },
                        card: {
                            added_by: "Added By",
                            local_user: "User on this device",
                            no_description: "No description added.",
                            more: "More",
                            delete: "DELETE",
                            open: "OPEN MENU"
                        },
                        modal: {
                            title: "Menu",
                            close: "CLOSE",
                            edit_copy: "EDIT (COPY)"
                        },
                        create: {
                            title: "Create Menu",
                            subtitle: "Bring your recipes together",
                            name_label: "Menu Name",
                            name_placeholder: "e.g. Weekly Menu",
                            desc_label: "Description (optional)",
                            desc_placeholder: "e.g. Fast and practical recipes for Monday–Friday",
                            selected_recipes: "Selected Recipes",
                            empty_selection: "Create your menu by selecting recipes from the right.",
                            search_placeholder: "Search recipes...",
                            all_categories: "All Categories",
                            error: "Failed to load recipes or categories. Is server running?",
                            loading: "Loading...",
                            add_hint: "Click to add",
                            already_added: "Not added to menu yet."
                        }
                    },
                    blog: {
                        read: "READ",
                        author_about: "About the Author",
                        author_desc_prefix: "",
                        author_desc_suffix: "recipe author",
                        share_success: "Link copied!",
                        back: "Go Back",
                        print: "Print"
                    },
                    calories: {
                        header: {
                            badge: "HEALTHY LIVING GUIDE",
                            title: "How Many Calories",
                            subtitle: "Did you know?",
                            desc: "Calculate the daily calories you need for a healthy life and learn the calorie values of foods."
                        },
                        tabs: {
                            calculate: "Calculate",
                            guide: "Food Guide",
                            tips: "Tips"
                        },
                        form: {
                            weight: "WEIGHT (KG)",
                            height: "HEIGHT (CM)",
                            age: "AGE",
                            gender: "GENDER",
                            male: "Male",
                            female: "Female",
                            activity: "ACTIVITY LEVEL",
                            activity_levels: {
                                level_1: "Sedentary (0-1 days a week)",
                                level_2: "Lightly Active (1-3 days a week)",
                                level_3: "Moderately Active (3-5 days a week)",
                                level_4: "Very Active (6-7 days a week)",
                                level_5: "Professional Athlete"
                            },
                            submit: "CALCULATE"
                        },
                        results: {
                            daily_needs: "Daily Needs",
                            kcal: "kcal",
                            lose_weight: "To Lose Weight",
                            gain_weight: "To Gain Weight",
                            bmr: "Basal Metabolic Rate (BMR)",
                            bmr_desc: "Your body burns these calories even doing nothing.",
                            not_calculated_yet: "Not Calculated Yet",
                            not_calculated_desc: "Enter your information to find out your daily calorie needs immediately!"
                        },
                        tips: {
                            title_1: "Use Small Portions",
                            desc_1: "Shrinking your plate makes portion control easier and increases visual satisfaction.",
                            title_2: "Chew Slowly",
                            desc_2: "It takes about 20 minutes for the satiety signal to reach your brain. Eating slowly makes you consume fewer calories.",
                            title_3: "Don't Forget to Drink Water",
                            desc_3: "Sometimes we confuse thirst for hunger. Drinking water 30 minutes before a meal increases satiety.",
                            title_4: "Label Reading Habit",
                            desc_4: "Watch calorie values per '100g' rather than 'portion' on the packaged goods you buy.",
                            warning_title: "Important Warning",
                            warning_desc: "These calculations are for general information purposes only. Always consult a specialized doctor or dietitian before starting any diet program."
                        }
                    },
                    lists: {
                        loading: "LOADING...",
                        home: "HOME",
                        title: "LISTS",
                        header: {
                            title_1: "Your Shopping",
                            title_2: "Lists",
                            desc: "Create and manage custom shopping lists that only you can see."
                        },
                        create_new: "CREATE NEW LIST",
                        create_button: "CREATE LIST",
                        modal: {
                            title: "CREATE LIST",
                            name_label: "List Name",
                            name_placeholder: "e.g., Weekly Grocery List",
                            store_label: "Store Name (Optional)",
                            store_placeholder: "e.g., Walmart, Target...",
                            submit: "CREATE"
                        },
                        stores: {
                            market: "Store: "
                        },
                        items: {
                            list: "List",
                            add_placeholder: "Add item...",
                            quick_add: "Quick Add",
                            empty: "No items added yet.",
                            categories: {
                                basic: "Basic",
                                greengrocer: "Produce",
                                butcher: "Butcher",
                                pantry: "Pantry",
                                drinks: "Drinks",
                                cleaning: "Cleaning"
                            }
                        },
                        actions: {
                            share: "SHARE",
                            save: "SAVE"
                        },
                        empty: {
                            title: "You have no lists yet",
                            button: "CREATE LIST"
                        }
                    }
                }
            }
        },
        detection: {
            // Tamamen kapatıyoruz çünkü Safari PWA / Gizli sekmelerde 
            // cookie veya localStorage'a yazmaya çalışmak bile SecurityError fırlatıp
            // sitenin beyaz ekranda kalmasına sebep oluyor.
            order: ['navigator'], 
            caches: [],
        },
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
