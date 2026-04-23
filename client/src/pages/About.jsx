import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChefHat, Heart, Users, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-16 pb-20">
            <SEO title="Hakkımızda | Tarifo" description="Tarifo, en lezzetli yemek tariflerini keşfedebileceğiniz ve kendi tariflerinizi paylaşabileceğiniz devasa bir mutfak topluluğudur." />

            {/* Hero Section */}
            <section className="relative rounded-[3rem] p-10 md:p-20 overflow-hidden bg-chefie-dark flex flex-col items-center justify-center text-center shadow-2xl">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')] bg-repeat mix-blend-overlay"></div>
                <div className="absolute top-0 right-[10%] w-64 h-64 bg-chefie-yellow/10 blur-3xl rounded-full"></div>
                
                <div className="relative z-10 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-chefie-yellow/20 rounded-full text-chefie-yellow text-xs font-black tracking-widest mb-6"
                    >
                        <ChefHat className="w-4 h-4 fill-current" /> BİZ KİMİZ?
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
                    >
                        Mutfaktaki En Büyük <br />
                        <span className="text-chefie-yellow">İlham Kaynağınız</span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto"
                    >
                        Tarifo, yemek yapmayı sevenleri bir araya getiren, yeni lezzetler keşfetmenizi ve mutfaktaki yeteneklerinizi sergilemenizi sağlayan yeni nesil bir lezzet ağıdır.
                    </motion.p>
                </div>
            </section>

            {/* Stats / Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-chefie-card p-10 rounded-[2.5rem] border border-chefie-border shadow-xl shadow-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                        <Heart className="w-8 h-8 fill-current" />
                    </div>
                    <h3 className="text-2xl font-black text-chefie-text mb-3">Tutkuyla Hazırlandı</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Her tarif, mutfağa gönül vermiş şefler ve ev hanımları tarafından büyük bir sevgi ve özenle hazırlanıp paylaşılıyor.
                    </p>
                </div>

                <div className="bg-chefie-card p-10 rounded-[2.5rem] border border-chefie-border shadow-xl shadow-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 fill-current" />
                    </div>
                    <h3 className="text-2xl font-black text-chefie-text mb-3">Geniş Aile</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Binlerce aktif üyesiyle Tarifo, mutfak sırlarını ve püf noktalarını birbirinden öğrenen kocaman bir ailedir.
                    </p>
                </div>

                <div className="bg-chefie-card p-10 rounded-[2.5rem] border border-chefie-border shadow-xl shadow-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                        <Coffee className="w-8 h-8 fill-current" />
                    </div>
                    <h3 className="text-2xl font-black text-chefie-text mb-3">Pratik & Lezzetli</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Zamanı kısıtlı olanlar için 15 dakikalık pratik lezzetlerden, özel misafirleriniz için gösterişli davet sofralarına kadar her şey burada.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-gray-100 border border-gray-100 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                <div className="flex-1 space-y-6 relative z-10">
                    <span className="text-chefie-yellow text-xs font-black tracking-widest uppercase">Hikayemiz</span>
                    <h2 className="text-4xl md:text-5xl font-black text-chefie-text leading-tight">
                        Nasıl Başladık?
                    </h2>
                    <div className="w-16 h-1.5 bg-chefie-yellow rounded-full"></div>
                    <p className="text-gray-500 text-lg leading-relaxed pt-4">
                        Tarifo'nun temelleri, mutfakta vakit geçirmeyi seven küçük bir grubun tariflerini ve sırlarını dijital bir ortamda paylaşma arzusuyla atıldı. Amacımız, karmaşık ve zorlayıcı yemek kitapları yerine; herkesin kolayca anlayabileceği, adım adım anlatımlı ve evdeki malzemelerle harikalar yaratılabilecek bir platform sunmaktı.
                    </p>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Bugün binlerce tarifin yer aldığı bu büyük arşiv, sizlerin katkılarıyla her geçen gün büyümeye ve mutfakları daha da renklendirmeye devam ediyor.
                    </p>
                    <div className="pt-6">
                        <Link to="/recipes" className="inline-flex items-center gap-2 px-8 py-4 bg-chefie-dark text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-xl">
                            Hemen Keşfet <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                
                <div className="flex-1 w-full relative z-10">
                    <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-gray-50 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000" alt="Mutfakta yemek yapanlar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Footer Connect */}
            <section className="text-center py-12">
                <h2 className="text-3xl font-black text-chefie-text mb-4">Bizimle İletişime Geçin</h2>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">Soru, öneri ve işbirlikleri için bize e-posta yoluyla ulaşabilirsiniz.</p>
                <a href="mailto:tarifo@outlook.com.tr" className="px-10 py-5 bg-gradient-to-r from-chefie-yellow to-amber-500 text-white font-black rounded-2xl text-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-block">
                    tarifo@outlook.com.tr
                </a>
            </section>
        </div>
    );
};

export default About;
