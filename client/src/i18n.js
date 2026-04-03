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
                        share_recipe: "Tarif Paylaş",
                        dashboard: "Yönetici Paneli"
                    },
                    home: {
                        seo_title: "En Lezzetli Yemek Tarifleri | Pratik ve Denenmiş Tarifler - Tarifo",
                        seo_description: "Binlerce denenmiş yemek tarifi, videolu anlatımlar ve adım adım rehberlerle mutfağınızın şefi olun. En lezzetli ve pratik tarifler Tarifo'da.",
                        hero: {
                            badge: "YENİ NESİL MUTFAK REHBERİ",
                            title_1: "En Güncel",
                            title_2: "Yemek Tarifleri",
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
                            stars_of_week: "Son Eklenen Tarifler",
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
                            title_1: "Adım Adım",
                            title_2: "Pratik Tarifler",
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
                        },
                        seo_title_default: "Nefis Yemek Tarifleri - Binlerce Lezzet | Tarifo",
                        seo_description_default: "Binlerce kategorize edilmiş yemek tarifi arasından size en uygun olanı seçin. Et yemeklerinden tatlılara kadar her gün yeni bir lezzet keşfedin.",
                        seo_title_search: "{{query}} - Arama Sonuçları | Tarifo"
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
                        clear_recent: "Temizle",
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
                        close: "Kapat",
                        general: "Genel",
                        loading: "Yükleniyor...",
                        view_all: "Tümünü Gör",
                        clear: "Temizle",
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
                        share: "Paylaş",
                        print: "Yazdır",
                        cancel: "VAZGEÇ",
                        remove: "Çıkar",
                        protein: "Protein",
                        carbs: "Karbonhidrat",
                        fiber: "Lif",
                        fat: "Yağ",
                        vitamins: "Vitaminler",
                        calories: "Kalori"
                    },
                    settings: {
                        title: "Ayarlar",
                        user_card: {
                            edit_profile: "Profili Düzenle"
                        },
                        groups: {
                            notifications: "Bildirimler & Genel",
                            design: "Tasarım & Dil",
                            support: "Destek & Yasal",
                            social: "Sosyal & İletişim"
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
                            github_repo: "GitHub Deposu",
                            email_us: "Bize Ulaşın",
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
                        likes: "beğeni",
                        pending_requests: "Bekleyen Takip İstekleri",
                        tabs: {
                            recipes: "Tarifler",
                            favorites: "Favoriler",
                            notifications: "Bildirimler"
                        },
                        no_posts: "Henüz bir paylaşım bulunmuyor.",
                        no_notifications: "Yeni bildirim bulunmuyor.",
                        show_more: "DAHA FAZLA GÖSTER",
                        wants_to_follow: "seni takip etmek istiyor.",
                        mark_all_read: "Tümünü Okundu İşaretle",
                        chef_title: "Usta Şef & Tarif Yaratıcısı",
                        contact: "İletişime Geç",
                        edit_profile_btn: "Profili Düzenle",
                        received_likes: "Aldığım Beğeniler",
                        my_favorites: "Favorilerim",
                        no_followers: "Henüz takipçi yok.",
                        no_following: "Henüz kimseyi takip etmiyor.",
                        no_likes: "Henüz beğeni yok.",
                        no_favorites: "Henüz favori tarifiniz yok.",
                        likes_label: "beğeni",
                        menus_count: " Tarif",
                        menu_owner: "Kullanıcı",
                        menu_source: "Kaynak: ",
                        no_menus: "Henüz Menü Yok",
                        no_menus_desc: "Menüler sayfasından hazır menüleri kopyalayabilir veya kendi menünüzü oluşturabilirsiniz.",
                        go_to_menus: "Menülere Git"
                    },
                    footer: {
                        description: "En lezzetli yemek tarifleri, mutfak sırları ve daha fazlası. Sofralarınızı şenlendirmek için buradayız.",
                        quick_links: "Hızlı Erişim",
                        about_us: "Hakkımızda",
                        contact: "İletişim",
                        location: "İstanbul, Türkiye",
                        seo_title: "Bugün Ne Pişirsem? - Tarif Çarkı | Tarifo",
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
                            login_alert: "Yorum yapmak için lütfen giriş yapın."
                        },
                        seo_title: "{{title}} Tarifi - Nasıl Yapılır? | Tarifo",
                        chef_fallback: "Tarifo Şefi",
                    },
                    share_success: "Bağlantı kopyalandı!",
                    not_found: "Tarif bulunamadı.",
                menus: {
                    breadcrumb: "MENÜLER",
                    hero: {
                        title_1: "Kendi Menünü",
                        title_2: "Buradan Oluştur",
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
                            aksam: {
                                title: "Türk Akşam Yemeği",
                                desc: "Çorba, et yemeği, pilav ve salata — klasik bir Türk sofrası."
                            },
                            breakfast: {
                                title: "Hafta Sonu Kahvaltısı",
                                desc: "Peynir tabağı, sıcak atıştırmalıklar ve enfes yumurtalarla keyif dolu bir sabah."
                            },
                            diet: {
                                title: "Diyet & Fit Menü",
                                desc: "Hafif, düşük kalorili ve besleyici tariflerle gününüzü zinde geçirin."
                            },
                            vegetarian: {
                                title: "Vejetaryen Lezzetler",
                                desc: "Et içermeyen ama lezzet dolu sebze ve bakliyat tabakları."
                            },
                            kids: {
                                title: "Çocuklar İçin Menü",
                                desc: "Miniklerin severek yiyeceği, besleyici ve eğlenceli tarifler."
                            },
                            tea_time: {
                                title: "Çay Saati İkramları",
                                desc: "Kekler, börekler ve taze demlenmiş çay eşliğinde keyifli sohbetler."
                            },
                            seafood: {
                                title: "Deniz Ürünleri Akşamı",
                                desc: "Taze balıklar, hafif mezeler ve deniz esintili bir sofra."
                            },
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
                        open: "MENÜYÜ AÇ",
                        personal_tag: "KİŞİSEL MENÜ",
                        copied_by: "Kopyalayan",
                        created_by: "Menüyü Oluşturan",
                        source: "Kaynak: "
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
                        already_added: "Henüz menüye eklenmemiş.",
                        max_hint: "En fazla 20 tarif ekleyebilirsin"
                    }
                },
                blog: {
                    header_badge: "LEZZET GÜNLÜĞÜ",
                    header_title_1: "Mutfak Hikayeleri &",
                    header_title_2: "İlham Veren Yazılar",
                    header_desc: "Yemek kültürü, şeflerden ipuçları, sağlıklı beslenme önerileri ve mutfağa dair her şey bu blogda.",
                    recent_posts: "Son Yazılar",
                    read_more: "DEVAMINI OKU",
                    seo_title: "Mutfak Sırları & Lezzet Hikayeleri | Tarifo",
                    detail_seo_title: "{{title}} | Tarifo Blog",
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
                    },
                    guide: {
                        items: [
                            { name: "Yumurta (1 adet)", calories: 78, protein: "6g", category: "Protein" },
                            { name: "Tavuk Göğsü (100g)", calories: 165, protein: "31g", category: "Protein" },
                            { name: "Pirinç Pilavı (100g)", calories: 130, carbs: "28g", category: "Karbonhidrat" },
                            { name: "Elma (Orta Boy)", calories: 95, vitamins: "C", category: "Meyve" },
                            { name: "Zeytinyağı (1 y.k.)", calories: 119, fats: "14g", category: "Yağ" },
                            { name: "Badem (10 adet)", calories: 70, protein: "2.5g", category: "Kuruyemiş" },
                            { name: "Mercimek Çorbası (1 kase)", calories: 140, fiber: "8g", category: "Çorba" },
                            { name: "Yulaf Ezmesi (100g)", calories: 389, fiber: "10g", category: "Karbonhidrat" }
                        ]
                    }
                },
                lists: {
                    loading: "YÜKLENİYOR...",
                    home: "ANASAYFA",
                    title: "LİSTELER",
                    header: {
                        title_1: "Alışveriş",
                        title_2: "Listelerin",
                        desc: "Sadece senin görebileceğin özel alışveriş listelerini oluştur ve yönet.",
                        lists_count: "LİSTE",
                        items_count: "ÜRÜN"
                    },
                    create_new: "YENİ LİSTE OLUŞTUR",
                    create_button: "LİSTE OLUŞTUR",
                    modal: {
                        title: "LİSTE OLUŞTUR",
                        new_list: "Yeni Liste",
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
                            cleaning: "Temizlik",
                            breakfast: "Kahvaltılık",
                            snacks: "Atıştırmalık",
                            bakery: "Fırın"
                        },
                        presets: {
                            basic: ["Süt", "Yumurta", "Ekmek", "Peynir", "Tereyağı", "Yoğurt", "Un", "Şeker", "Tuz", "Maya", "Zeytinyağı", "Sıvı Yağ"],
                            greengrocer: ["Domates", "Salatalık", "Biber", "Soğan", "Patates", "Sarımsak", "Limon", "Marul", "Maydanoz", "Muz", "Elma", "Mantar"],
                            butcher: ["Tavuk", "Kıyma", "Kuşbaşı", "Sucuk", "Salam", "Sosis", "Balık"],
                            breakfast: ["Zeytin", "Bal", "Reçel", "Tahin", "Pekmez", "Labne", "Krem Peynir", "Kaymak"],
                            pantry: ["Makarna", "Pirinç", "Bulgur", "Mercimek", "Salça", "Ketçap", "Mayonez", "Baharat"],
                            snacks: ["Bisküvi", "Çikolata", "Cips", "Kuruyemiş", "Gofret", "Kek"],
                            drinks: ["Su", "Çay", "Kahve", "Soda", "Ayran", "Meyve Suyu"],
                            cleaning: ["Deterjan", "Sabun", "Şampuan", "T. Kağıdı", "Havlu Kağıt", "Diş Macunu"],
                            bakery: ["Sıcak Ekmek", "Simit", "Poğaça", "Börek", "Yufka", "Lavaş"]
                        }
                    },
                    actions: {
                        share: "PAYLAŞ",
                        save: "KAYDET"
                    },
                    empty: {
                        title: "Henüz bir listen yok",
                        button: "LİSTE OLUŞTUR"
                    }
                },
                faq: {
                    title: "Sıkça Sorulan Sorular",
                    subtitle: "Size nasıl yardımcı olabiliriz?",
                    desc: "Merak ettiğiniz konuların cevaplarını aşağıda bulabilirsiniz.",
                    no_answer: "Aradığınız cevabı bulamadınız mı?",
                    contact_us: "Bize e-posta gönderin",
                    q1: "Tarifo nedir?",
                    a1: "Tarifo, yemek tutkunlarının tariflerini paylaştığı, yeni lezzetler keşfettiği ve birbirini takip edebildiği dijital bir yemek topluluğudur.",
                    q2: "Nasıl tarif ekleyebilirim?",
                    a2: "Giriş yaptıktan sonra navigasyon menüsündeki 'Tarif Ekle' ikonuna tıklayarak tarifinizi, malzemelerinizi ve hazırlanış aşamalarını paylaşabilirsiniz.",
                    q3: "Profil resmimi nasıl değiştirebilirim?",
                    a3: "Ayarlar -> Profil Düzenle bölümüne giderek avatarınızın üzerindeki kamera ikonuna tıklayıp yeni bir resim yükleyebilirsiniz.",
                    q4: "Şifremi unuttum, ne yapmalıyım?",
                    a4: "Şu an için şifre sıfırlama işlemi yönetici onayı ile yapılmaktadır. Lütfen bizimle iletişime geçin.",
                    q5: "Tariflerimi kimler görebilir?",
                    a5: "Paylaştığınız tüm tarifler 'Açık' statüsünde ise tüm kullanıcılar tarafından görülebilir ve favorilere eklenebilir.",
                    q6: "Hesabımı nasıl silebilirim?",
                    a6: "Ayarlar -> Profil Düzenle sayfasının en altında bulunan 'Hesabı Sil' butonunu kullanarak üyeliğinizi sonlandırabilirsiniz."
                },
                policy: {
                    title: "Kullanıcı Politikası",
                    header: "Güvenliğiniz Önceliğimiz",
                    desc: "Tarifo platformunda verilerinizin nasıl yönetildiğini öğrenin.",
                    more_info: "Daha Fazla Bilgi?",
                    more_info_desc: "Güvenlik ve gizlilik hakkında daha fazla sorunuz varsa destek ekibimizle iletişime geçmekten çekinmeyin.",
                    contact_btn: "Bize Ulaşın",
                    item1: {
                        title: "Veri Güvenliği",
                        content: "Kullanıcı verileriniz şifrelenmiş sunucularımızda güvenle saklanır. Şifreleriniz bcrypt hashing algoritması ile korunmaktadır ve bizim tarafımızdan dahi görülemez."
                    },
                    item2: {
                        title: "Gizlilik İlkesi",
                        content: "Kişisel verileriniz asla üçüncü şahıslarla paylaşılmaz. Sadece platform içindeki etkileşimleriniz (ad soyad, paylaşılan tarifler) diğer kullanıcılar tarafından görülebilir."
                    },
                    item3: {
                        title: "Depolama",
                        content: "Paylaştığınız tarif görselleri bulut tabanlı depolama servislerimizde barındırılır. Hesabınızı sildiğinizde, size ait tüm kişisel veriler ve görseller sistemden kalıcı olarak temizlenir."
                    }
                },
                terms: {
                    title: "Kullanım Koşulları",
                    header: "Yasal Bildirimler",
                    last_update: "Son güncelleme: 10 Mart 2026",
                    footer_desc: "Bu belge Tarifo topluluk standartlarını korumak amacıyla hazırlanmıştır.",
                    item1: {
                        title: "1. Hizmetin Kabulü",
                        content: "Tarifo platformunu kullanarak, bu kullanım koşullarını tamamen kabul etmiş sayılırsınız. Eğer bu koşullardan herhangi birini kabul etmiyorsanız, lütfen hizmetimizi kullanmayınız."
                    },
                    item2: {
                        title: "2. Kullanım Lisansı",
                        content: "Bu web sitesindeki materyallerin (tarifler, resimler vb.) bir kopyasının sadece kişisel, ticari olmayan geçici görüntüleme için indirilmesine izin verilir. Bu bir mülkiyet transferi değil, bir lisans verilmesidir."
                    },
                    item3: {
                        title: "3. Kullanıcı Sorumlulukları",
                        content: "Kullanıcılar, paylaştıkları içeriklerin doğruluğundan ve telif haklarından sorumludur. Diğer kullanıcılara karşı saygılı ve etik kurallar çerçevesinde hareket etmek zorundadırlar."
                    },
                    item4: {
                        title: "4. İçerik ve Moderasyon",
                        content: "Tarifo, topluluk kurallarını ihlal eden, yanıltıcı veya zararlı içerikleri önceden haber vermeksizin silme hakkını saklı tutar."
                    },
                    item5: {
                        title: "5. Sorumluluk Reddi",
                        content: "Tarifo, platformdaki tariflerin uygulanması sonucu oluşabilecek herhangi bir sağlık sorunu, mutfak kazası veya malzeme israfından sorumlu tutulamaz. Tariflerin uygulanması tamamen kullanıcının kendi sorumluluğundadır."
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
                        share_recipe: "Share Recipe",
                        dashboard: "Admin Panel"
                    },
                    home: {
                        seo_title: "Tarifo - Most Delicious Recipes, Easy and Practical Recipes",
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
                            stars_of_week: "Latest Recipes",
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
                        },
                        seo_title_default: "Delicious Recipes - Thousands of Flavors | Tarifo",
                        seo_title_search: "{{query}} - Search Results | Tarifo"
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
                        clear_recent: "Clear",
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
                                flour: "un",
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
                        close: "Close",
                        general: "General",
                        loading: "Loading...",
                        view_all: "View All",
                        clear: "Clear",
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
                        share: "Share",
                        print: "Print",
                        cancel: "CANCEL",
                        remove: "Remove",
                        protein: "Protein",
                        carbs: "Carbohydrates",
                        fiber: "Fiber",
                        fat: "Fat",
                        vitamins: "Vitamins",
                        calories: "Calories"
                    },
                    settings: {
                        title: "Settings",
                        user_card: {
                            edit_profile: "Edit Profile"
                        },
                        groups: {
                            notifications: "Notifications & General",
                            design: "Design & Language",
                            support: "Support & Legal",
                            social: "Social & Contact"
                        },
                        items: {
                            pause_notifications: "Pause notifications",
                            general_settings: "General Settings",
                            dark_mode: "Dark Mode",
                            language: "Language",
                            contacts: "My Contacts",
                            share_app: "Share App",
                            send_suggestion: "Send Suggestion",
                            report_bug: "Report a Bug",
                            faq: "FAQ",
                            terms: "Terms of Use",
                            policy: "User Policy",
                            github_repo: "GitHub Repository",
                            email_us: "Contact Us",
                            logout: "Log Out"
                        },
                        feedback: {
                            suggestion_title: "Send Suggestion",
                            bug_title: "Report a Bug",
                            placeholder: "Your message...",
                            submit: "Send",
                            success: "Thank you for your feedback!",
                            error: "An error occurred, please try again."
                        },
                        share: {
                            title: "Tarifo - Your Best Kitchen Helper!",
                            text: "Try Tarifo to access thousands of delicious recipes!",
                            success: "Shared!",
                            error: "Sharing failed."
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
                        likes: "likes",
                        pending_requests: "Pending Follow Requests",
                        tabs: {
                            recipes: "Recipes",
                            favorites: "Favorites",
                            notifications: "Notifications"
                        },
                        no_posts: "No posts yet.",
                        no_notifications: "No new notifications.",
                        show_more: "SHOW MORE",
                        wants_to_follow: "wants to follow you.",
                        mark_all_read: "Mark All as Read",
                        chef_title: "Master Chef & Recipe Creator",
                        contact: "Contact",
                        edit_profile_btn: "Edit Profile",
                        received_likes: "Likes Received",
                        my_favorites: "My Favorites",
                        no_followers: "No followers yet.",
                        no_following: "Not following anyone yet.",
                        no_likes: "No likes yet.",
                        no_favorites: "No favorite recipes yet.",
                        likes_label: "likes",
                        menus_count: " Recipes",
                        menu_owner: "User",
                        menu_source: "Source: ",
                        no_menus: "No Menus Yet",
                        no_menus_desc: "You can copy preset menus or create your own menu from the Menus page.",
                        go_to_menus: "Go to Menus"
                    },
                    footer: {
                        description: "The most delicious recipes, kitchen secrets and more. We are here to brighten up your tables.",
                        quick_links: "Quick Access",
                        about_us: "About Us",
                        contact: "Contact",
                        location: "Istanbul, Turkey",
                        seo_title: "What to Cook Today? - Recipe Wheel | Tarifo",
                        all_rights_reserved: "All rights reserved."
                    },
                    what_to_cook: {
                        breadcrumb: "WHAT TO COOK",
                        header: {
                            title_1: "What to",
                            title_2: "Cook Today?",
                            description: "If you can't decide, let us choose! Filter and spin the wheel."
                        },
                        seo_title: "What to Cook Today? - Recipe Wheel | Tarifo",
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
                        seo_title: "{{title}} Recipe - How to Make? | Tarifo",
                        chef_fallback: "Tarifo Chef",
                    },
                    share_success: "Link copied to clipboard!",
                    not_found: "Recipe not found.",
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
                            aksam: {
                                title: "Turkish Dinner",
                                desc: "Soup, meat dish, rice and salad — a classic Turkish table."
                            },
                            breakfast: {
                                title: "Weekend Breakfast",
                                desc: "Cheese platter, warm snacks and delicious eggs for a delightful morning."
                            },
                            diet: {
                                title: "Diet & Fit Menu",
                                desc: "Stay fit throughout your day with light, low-calorie and nutritious recipes."
                            },
                            vegetarian: {
                                title: "Vegetarian Delights",
                                desc: "Meat-free but flavorful vegetable and pulse dishes."
                            },
                            kids: {
                                title: "Menu for Kids",
                                desc: "Nutritious and fun recipes that little ones will love."
                            },
                            tea_time: {
                                title: "Tea Time Treats",
                                desc: "Pleasant conversations accompanied by cakes, pastries and freshly brewed tea."
                            },
                            seafood: {
                                title: "Seafood Evening",
                                desc: "Fresh fish, light appetizers and a sea-inspired table."
                            },
                            quick: {
                                title: "Quick Dinner Menu",
                                desc: "Great taste in little time: a selection of practical and fast recipes."
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
                        open: "OPEN MENU",
                        personal_tag: "PERSONAL MENU",
                        copied_by: "Copied By",
                        created_by: "Created By",
                        source: "Source: "
                    },
                    header_badge: "FOOD DIARY",
                    header_title_1: "Kitchen Stories &",
                    header_title_2: "Inspirational Articles",
                    header_desc: "Food culture, tips from chefs, healthy eating suggestions and everything about the kitchen is on this blog.",
                    recent_posts: "Recent Posts",
                    read_more: "READ MORE",
                    seo_title: "Kitchen Secrets & Taste Stories | Tarifo",
                    detail_seo_title: "{{title}} | Tarifo Blog",
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
                        already_added: "Not added to menu yet.",
                        max_hint: "You can add at most 20 recipes"
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
                    },
                    guide: {
                        items: [
                            { name: "Egg (1 piece)", calories: 78, protein: "6g", category: "Protein" },
                            { name: "Chicken Breast (100g)", calories: 165, protein: "31g", category: "Protein" },
                            { name: "Rice Pilaf (100g)", calories: 130, carbs: "28g", category: "Carbohydrate" },
                            { name: "Apple (Medium)", calories: 95, vitamins: "C", category: "Fruit" },
                            { name: "Olive Oil (1 tbsp)", calories: 119, fats: "14g", category: "Oil" },
                            { name: "Almond (10 pieces)", calories: 70, protein: "2.5g", category: "Nuts" },
                            { name: "Lentil Soup (1 bowl)", calories: 140, fiber: "8g", category: "Soup" },
                            { name: "Oatmeal (100g)", calories: 389, fiber: "10g", category: "Carbohydrate" }
                        ]
                    }
                },
                menus: {
                    breadcrumb: "MENUS",
                    hero: {
                        title_1: "Create Your Own Menu",
                        title_2: "Here",
                        subtitle: "Weekly plan, guest menu or diet list... Bring your favorite recipes together, find them again with one click."
                    },
                    create_button: "CREATE NEW MENU",
                    saved_count: "{{count}} MENUS SAVED",
                    presets: {
                        title: "Preset Menus",
                        badge: "CURATED FROM SITE",
                        error: "Failed to load preset menus. Is the server running?",
                        tag: "PRESET MENU",
                        recipe_count_one: "{{count}} Recipe",
                        recipe_count_other: "{{count}} Recipes",
                        default_desc: "A preset menu prepared with selected recipes from the site.",
                        copy: "COPY MENU",
                        items: {
                            aksam: {
                                title: "Turkish Dinner",
                                desc: "Soup, meat dish, rice and salad — a classic Turkish table."
                            },
                            breakfast: {
                                title: "Weekend Breakfast",
                                desc: "A morning full of joy with cheese platter, hot snacks and delicious eggs."
                            },
                            diet: {
                                title: "Diet & Fit Menu",
                                desc: "Get through your day with light, low-calorie and nutritious recipes."
                            },
                            vegetarian: {
                                title: "Vegetarian Flavors",
                                desc: "Meat-free but flavor-packed vegetable and legume dishes."
                            },
                            kids: {
                                title: "Menu for Kids",
                                desc: "Nutritious and fun recipes that little ones will love."
                            },
                            tea_time: {
                                title: "Tea Time Treats",
                                desc: "Pleasant conversations accompanied by cakes, pastries and freshly brewed tea."
                            },
                            seafood: {
                                title: "Seafood Night",
                                desc: "Fresh fish, light appetizers and a sea-breeze table."
                            },
                            quick: {
                                title: "Quick Dinner Menu",
                                desc: "Much flavor in little time: a selection of practical and fast recipes."
                            },
                            fit: {
                                title: "Fit & Light Menu",
                                desc: "Lighter options: salad, soup and high-rated recipes."
                            },
                            guest: {
                                title: "Guest Menu",
                                desc: "Recipes that cheer up the table: main course + complements."
                            }
                        }
                    },
                    empty: {
                        title: "You have no menus yet",
                        description: "Create your first menu and add recipes. Then easily open it again and start cooking.",
                        button: "CREATE MENU"
                    },
                    card: {
                        added_by: "Added By",
                        local_user: "User on this device",
                        no_description: "No description added.",
                        more: "More",
                        delete: "DELETE",
                        open: "OPEN MENU",
                        personal_tag: "PERSONAL MENU",
                        copied_by: "Copied by",
                        created_by: "Created by",
                        source: "Source: "
                    },
                    modal: {
                        title: "Menu",
                        close: "CLOSE",
                        edit_copy: "EDIT (COPY)"
                    },
                    create: {
                        title: "Create Menu",
                        subtitle: "Gather your recipes",
                        name_label: "Menu Name",
                        name_placeholder: "e.g., Weekly Menu",
                        desc_label: "Description (optional)",
                        desc_placeholder: "e.g., Fast and practical recipes for Monday–Friday",
                        selected_recipes: "Selected Recipes",
                        empty_selection: "Create your menu by selecting recipes from the right.",
                        search_placeholder: "Search recipes...",
                        all_categories: "All Categories",
                        error: "Failed to load recipes or categories. Is the server running?",
                        loading: "Loading...",
                        add_hint: "Click to add",
                        already_added: "Not yet added to menu.",
                        max_hint: "You can add up to 20 recipes"
                    }
                },
                blog: {
                    header_badge: "FLAVOR JOURNAL",
                    header_title_1: "Kitchen Stories &",
                    header_title_2: "Inspirational Articles",
                    header_desc: "Food culture, tips from chefs, healthy eating suggestions and everything about the kitchen is in this blog.",
                    recent_posts: "Recent Posts",
                    read_more: "READ MORE",
                    seo_title: "Kitchen Secrets & Flavor Stories | Tarifo",
                    detail_seo_title: "{{title}} | Tarifo Blog",
                    read: "READ",
                    author_about: "About Author",
                    author_desc_prefix: "",
                    author_desc_suffix: "recipe author",
                    share_success: "Link copied!",
                    back: "Go Back",
                    print: "Print"
                },
                lists: {
                    loading: "LOADING...",
                    home: "HOME",
                    title: "LISTS",
                    header: {
                        title_1: "Your Shopping",
                        title_2: "Lists",
                        desc: "Create and manage custom shopping lists that only you can see.",
                        lists_count: "LISTS",
                        items_count: "ITEMS"
                    },
                    create_new: "CREATE NEW LIST",
                    create_button: "CREATE LIST",
                    modal: {
                        title: "CREATE LIST",
                        new_list: "New List",
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
                            cleaning: "Cleaning",
                            breakfast: "Breakfast",
                            snacks: "Snacks",
                            bakery: "Bakery"
                        },
                        presets: {
                            basic: ["Milk", "Egg", "Bread", "Cheese", "Butter", "Yogurt", "Flour", "Sugar", "Salt", "Yeast", "Olive Oil", "Oil"],
                            greengrocer: ["Tomato", "Cucumber", "Pepper", "Onion", "Potato", "Garlic", "Lemon", "Lettuce", "Parsley", "Banana", "Apple", "Mushroom"],
                            butcher: ["Chicken", "Ground Beef", "Beef Cubes", "Sujuk", "Salami", "Sausage", "Fish"],
                            breakfast: ["Olives", "Honey", "Jam", "Tahini", "Molasses", "Labneh", "Cream Cheese", "Cream"],
                            pantry: ["Pasta", "Rice", "Bulgur", "Lentils", "Tomato Paste", "Ketchup", "Mayonnaise", "Spices"],
                            snacks: ["Biscuits", "Chocolate", "Chips", "Nuts", "Wafer", "Cake"],
                            drinks: ["Water", "Tea", "Coffee", "Soda", "Ayran", "Juice"],
                            cleaning: ["Detergent", "Soap", "Shampoo", "Toilet Paper", "Paper Towel", "Toothpaste"],
                            bakery: ["Fresh Bread", "Simit", "Pastry", "Börek", "Phyllo", "Lavash"]
                        }
                    },
                    actions: {
                        share: "SHARE",
                        save: "SAVE",
                        delete_confirm: "Are you sure you want to delete this list?",
                        share_title: "{{name}} - My Shopping List",
                        share_text: "Check out the shopping list I created{{market}}!",
                        share_error: "An error occurred while sharing.",
                        copied: "Link copied!",
                        error_fetch: "Failed to load lists:",
                        error_create: "An error occurred while creating the list:",
                        error_delete: "Failed to delete list:",
                        error_save: "Failed to save changes:"
                    },
                    empty: {
                        title: "You have no lists yet",
                        button: "CREATE LIST"
                    }
                },
                faq: {
                    title: "Frequently Asked Questions",
                    subtitle: "How can we help you?",
                    desc: "You can find answers to your questions below.",
                    no_answer: "Couldn't find the answer you're looking for?",
                    contact_us: "Email us",
                    q1: "What is Tarifo?",
                    a1: "Tarifo is a digital food community where food enthusiasts share recipes, discover new flavors, and follow each other.",
                    q2: "How can I add a recipe?",
                    a2: "After logging in, you can share your recipe, ingredients, and preparation steps by clicking the 'Add Recipe' icon in the navigation menu.",
                    q3: "How can I change my profile picture?",
                    a3: "Go to Settings -> Edit Profile, click the camera icon on your avatar and upload a new image.",
                    q4: "I forgot my password, what should I do?",
                    a4: "Currently, password reset is done with admin approval. Please contact us.",
                    q5: "Who can see my recipes?",
                    a5: "All recipes you share can be seen and favorited by all users if they are in 'Public' status.",
                    q6: "How can I delete my account?",
                    a6: "You can terminate your membership using the 'Delete Account' button at the bottom of the Settings -> Edit Profile page."
                },
                policy: {
                    title: "User Policy",
                    header: "Your Security is Our Priority",
                    desc: "Learn how your data is managed on the Tarifo platform.",
                    more_info: "More Information?",
                    more_info_desc: "If you have more questions about security and privacy, feel free to contact our support team.",
                    contact_btn: "Contact Us",
                    item1: {
                        title: "Data Security",
                        content: "Your user data is securely stored on our encrypted servers. Your passwords are protected with the bcrypt hashing algorithm and cannot even be seen by us."
                    },
                    item2: {
                        title: "Privacy Policy",
                        content: "Your personal data is never shared with third parties. Only your interactions within the platform (full name, shared recipes) can be seen by other users."
                    },
                    item3: {
                        title: "Storage",
                        content: "The recipe images you share are hosted in our cloud-based storage services. When you delete your account, all your personal data and images are permanently cleared from the system."
                    }
                },
                terms: {
                    title: "Terms of Use",
                    header: "Legal Notices",
                    last_update: "Last update: March 10, 2026",
                    footer_desc: "This document has been prepared to protect the community standards of Tarifo.",
                    item1: {
                        title: "1. Acceptance of Service",
                        content: "By using the Tarifo platform, you are deemed to have fully accepted these terms of use. If you do not accept any of these terms, please do not use our service."
                    },
                    item2: {
                        title: "2. Usage License",
                        content: "Permission is granted to download a copy of the materials (recipes, images, etc.) on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
                    },
                    item3: {
                        title: "3. User Responsibilities",
                        content: "Users are responsible for the accuracy and copyrights of the content they share. They must act respectfully and within ethical rules towards other users."
                    },
                    item4: {
                        title: "4. Content and Moderation",
                        content: "Tarifo reserves the right to delete content that violates community rules, is misleading or harmful without prior notice."
                    },
                    item5: {
                        title: "5. Disclaimer",
                        content: "Tarifo cannot be held responsible for any health problems, kitchen accidents or waste of materials that may result from the implementation of the recipes on the platform. The implementation of the recipes is entirely the user's responsibility."
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
