import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, ArrowRight, ChevronRight, Utensils, TrendingUp, Flame, Heart, MessageSquare, Award, Crown, Zap } from 'lucide-react';

import API_BASE from '../utils/api';
const apiBase = API_BASE;

const Trend = () => {
    const navigate = useNavigate();
    const [topRated, setTopRated] = useState([]);
    const [mostCommented, setMostCommented] = useState([]);
    const [newest, setNewest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiBase}/api/recipes?limit=100`);
                const all = res.data || [];

                // En Yüksek Puanlı
                const byRating = [...all]
                    .filter(r => r.avg_rating)
                    .sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0))
                    .slice(0, 6);
                setTopRated(byRating);

                // En Çok Yorumlanan
                const byComments = [...all]
                    .sort((a, b) => (Number(b.comment_count) || 0) - (Number(a.comment_count) || 0))
                    .slice(0, 6);
                setMostCommented(byComments);

                // En Yeni Eklenenler
                const byDate = [...all]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 8);
                setNewest(byDate);
            } catch (err) {
                console.error('Error fetching trend data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Hero featured recipe = top rated #1
    const heroRecipe = topRated[0];

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6">
            {/* Header */}
            <header className="py-10 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                        <Link to="/" className="hover:text-chefie-yellow transition-colors">ANASAYFA</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-chefie-dark">TREND</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-chefie-dark leading-tight">
                        Şu An <br className="hidden sm:block" />
                        <span className="text-chefie-yellow relative inline-block">
                            Trend Olan Tarifler
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-5">
                        En çok beğenilen, en çok yorum alan ve en yeni tarifler burada. Herkesin konuştuğu lezzetleri keşfet.
                    </p>
                </motion.div>
            </header>

            <main className="max-w-6xl mx-auto space-y-20">

                {/* HERO — #1 En Yüksek Puanlı */}
                {!loading && heroRecipe && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div
                            onClick={() => navigate(`/recipes/${heroRecipe.id}`)}
                            className="relative rounded-[3rem] overflow-hidden min-h-[380px] md:min-h-[440px] cursor-pointer group shadow-2xl shadow-gray-200/40"
                        >
                            {heroRecipe.image_url ? (
                                <img
                                    src={heroRecipe.image_url.startsWith('/images/') ? heroRecipe.image_url : `${apiBase}${heroRecipe.image_url}`}
                                    alt={heroRecipe.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-chefie-cream flex items-center justify-center">
                                    <Utensils className="w-20 h-20 text-chefie-yellow/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-chefie-dark via-chefie-dark/40 to-transparent"></div>

                            <div className="absolute top-6 left-6 flex items-center gap-3">
                                <div className="px-5 py-2.5 bg-chefie-yellow text-white text-[11px] font-black tracking-widest uppercase rounded-2xl shadow-xl shadow-yellow-200/50 flex items-center gap-2">
                                    <Crown className="w-4 h-4" /> #1 TREND
                                </div>
                                <div className="px-4 py-2.5 bg-white/90 backdrop-blur-md text-chefie-dark text-[11px] font-black tracking-widest uppercase rounded-2xl shadow-xl">
                                    {heroRecipe.category_name || 'GENEL'}
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-xl group-hover:text-chefie-yellow transition-colors">
                                    {heroRecipe.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                                        <Star className="w-4 h-4 text-chefie-yellow fill-current" />
                                        <span className="text-white text-sm font-black">
                                            {heroRecipe.avg_rating ? Number(heroRecipe.avg_rating).toFixed(1) : 'Yeni'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                                        <MessageSquare className="w-4 h-4 text-white/70" />
                                        <span className="text-white text-sm font-black">{heroRecipe.comment_count || 0} Yorum</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                                        <Clock className="w-4 h-4 text-white/70" />
                                        <span className="text-white text-sm font-black">{heroRecipe.prep_time || '30'} dk</span>
                                    </div>
                                    {heroRecipe.chef_name && (
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                                            {heroRecipe.chef_image ? (
                                                <img
                                                    src={heroRecipe.chef_image.startsWith('http') ? heroRecipe.chef_image : `${apiBase}${heroRecipe.chef_image}`}
                                                    alt={heroRecipe.chef_name}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-chefie-yellow/30 flex items-center justify-center text-[10px] font-black text-white">
                                                    {(heroRecipe.chef_name || 'Ş').charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-white text-sm font-bold">{heroRecipe.chef_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* En Yüksek Puanlı Tarifler */}
                <section>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-black text-chefie-dark flex items-center gap-3">
                            En Yüksek Puanlı <Star className="text-chefie-yellow fill-current" />
                        </h2>
                        <Link to="/recipes" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black tracking-widest text-gray-400 hover:border-chefie-yellow hover:text-chefie-yellow transition-all">
                            <Award className="w-3.5 h-3.5 text-chefie-yellow" /> TÜMÜNÜ GÖR
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-[360px] bg-white rounded-[2.5rem] animate-pulse border border-gray-50"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {topRated.slice(0, 6).map((recipe, idx) => (
                                <RecipeCard key={recipe.id} recipe={recipe} index={idx} navigate={navigate} badge={
                                    idx < 3 ? (
                                        <div className={`absolute top-5 left-5 z-10 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl flex items-center gap-1.5 ${idx === 0 ? 'bg-chefie-yellow text-white shadow-yellow-200/50' :
                                            idx === 1 ? 'bg-white/90 backdrop-blur-md text-chefie-dark shadow-black/5' :
                                                'bg-white/90 backdrop-blur-md text-chefie-dark shadow-black/5'
                                            }`}>
                                            {idx === 0 ? <Crown className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5 text-chefie-yellow" />}
                                            #{idx + 1}
                                        </div>
                                    ) : null
                                } />
                            ))}
                        </div>
                    )}
                </section>

                {/* En Çok Yorumlanan */}
                <section>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-black text-chefie-dark flex items-center gap-3">
                            En Çok Konuşulan <Flame className="text-orange-500" />
                        </h2>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black tracking-widest text-gray-400">
                            <MessageSquare className="w-3.5 h-3.5 text-orange-400" /> YORUM SAYISINA GÖRE
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-[160px] bg-white rounded-[2rem] animate-pulse border border-gray-50"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mostCommented.map((recipe, idx) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                                    className="bg-white p-4 rounded-[2rem] shadow-lg shadow-gray-100 border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex gap-5 group"
                                >
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] overflow-hidden shadow-md flex-shrink-0 relative">
                                        <img
                                            src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${apiBase}${recipe.image_url}`) : '/default-recipe.png'}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 w-7 h-7 bg-chefie-dark/80 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-black text-[11px]">
                                            #{idx + 1}
                                        </div>
                                    </div>

                                    <div className="flex-1 py-1 flex flex-col justify-center min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="px-2.5 py-1 bg-orange-50 text-orange-500 text-[10px] font-black rounded-lg uppercase tracking-wide">
                                                {recipe.category_name || 'GENEL'}
                                            </span>
                                            <div className="flex items-center text-xs text-gray-400 font-bold ml-auto">
                                                <Star className="w-3 h-3 text-chefie-yellow fill-current mr-1" />
                                                {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : 'Yeni'}
                                            </div>
                                        </div>

                                        <h3 className="text-base md:text-lg font-black text-chefie-dark leading-tight mb-2 line-clamp-2 group-hover:text-chefie-yellow transition-colors">
                                            {recipe.title}
                                        </h3>

                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                                                {recipe.comment_count || 0} Yorum
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                <Clock className="w-3.5 h-3.5 text-gray-300" />
                                                {recipe.prep_time || '30'} dk
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Yeni Eklenenler */}
                <section>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl md:text-3xl font-black text-chefie-dark flex items-center gap-3">
                            Yeni Eklenenler <Zap className="text-green-500" />
                        </h2>
                        <Link to="/recipes" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black tracking-widest text-gray-400 hover:border-chefie-yellow hover:text-chefie-yellow transition-all">
                            TÜMÜNÜ GÖR
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-[280px] bg-white rounded-[2.5rem] animate-pulse border border-gray-50"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {newest.map((recipe, idx) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.04 }}
                                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                                    className="bg-white rounded-[2rem] shadow-lg shadow-gray-100/50 border border-gray-50 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="relative h-36 md:h-44 overflow-hidden">
                                        <img
                                            src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${apiBase}${recipe.image_url}`) : '/default-recipe.png'}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <div className="px-3 py-1.5 bg-green-500 text-white text-[9px] font-black tracking-widest uppercase rounded-xl shadow-lg flex items-center gap-1">
                                                <Zap className="w-3 h-3" /> YENİ
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-chefie-dark/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                                            <Star className="w-3 h-3 text-chefie-yellow fill-current" />
                                            <span className="text-white text-[10px] font-black">
                                                {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : '–'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-[9px] font-black tracking-widest uppercase text-gray-300 mb-1">
                                            {recipe.category_name || 'GENEL'}
                                        </div>
                                        <h3 className="text-sm font-black text-chefie-dark line-clamp-2 leading-snug group-hover:text-chefie-yellow transition-colors min-h-[2.5rem]">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400 font-bold">
                                            <Clock className="w-3 h-3 text-gray-300" />
                                            {recipe.prep_time || '30'} dk
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA Banner */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-chefie-dark rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-gray-200/30"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-48 h-48 bg-chefie-yellow rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-64 h-64 bg-chefie-yellow rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-chefie-yellow/20 rounded-full text-chefie-yellow text-[11px] font-black tracking-widest mb-6 uppercase">
                            <TrendingUp className="w-4 h-4" /> SEN DE TREND OL
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                            Kendi Tarifini Paylaş
                        </h2>
                        <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto mb-10">
                            En lezzetli tariflerini herkesin görmesi için paylaş. Belki bir sonraki #1 senin tarifin olur!
                        </p>
                        <Link
                            to="/admin/recipes/new"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-600/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            TARİF PAYLAŞ
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

// Reusable Recipe Card Component
const RecipeCard = ({ recipe, index, navigate, badge }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="bg-white rounded-[2.5rem] shadow-lg shadow-gray-200/30 hover:shadow-2xl hover:shadow-chefie-yellow/10 transition-all duration-300 hover:-translate-y-2 border border-gray-50 overflow-hidden flex flex-col group cursor-pointer"
    >
        <div className="relative h-56 overflow-hidden">
            <img
                src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${apiBase}${recipe.image_url}`) : '/default-recipe.png'}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {badge}

            <div className="absolute top-5 right-5 bg-chefie-dark/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                <Star className="w-3 h-3 text-chefie-yellow fill-current" />
                <span className="text-white text-xs font-black">
                    {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : 'YENİ'}
                </span>
            </div>
        </div>

        <div className="p-7 flex flex-col flex-1">
            <div className="px-3 py-1.5 bg-chefie-yellow/10 text-chefie-yellow text-[10px] font-black rounded-lg uppercase tracking-wide inline-block self-start mb-3">
                {recipe.category_name || 'GENEL'}
            </div>

            <h3 className="text-lg font-black text-chefie-dark mb-3 line-clamp-2 min-h-[3rem] group-hover:text-chefie-yellow transition-colors leading-snug">
                {recipe.title}
            </h3>

            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4 font-black tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-chefie-yellow" />
                    {recipe.prep_time || '30 DK'}
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-300" />
                    {recipe.comment_count || 0}
                </div>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-2xl">
                {recipe.chef_image ? (
                    <img
                        src={recipe.chef_image.startsWith('http') ? recipe.chef_image : `${apiBase}${recipe.chef_image}`}
                        alt={recipe.chef_name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">
                        {(recipe.chef_name || recipe.chef_username || 'A').charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Şef</span>
                    <span
                        className="text-xs font-bold text-gray-700 hover:text-chefie-yellow transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${recipe.user_id}`); }}
                    >
                        {recipe.chef_name || recipe.chef_username}
                    </span>
                </div>
            </div>

            <div className="mt-auto group/btn inline-flex items-center justify-center gap-3 w-full py-4 bg-gray-50 text-chefie-dark font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-dark hover:text-white transition-all duration-500 shadow-sm">
                TARİFİ İNCELE
                <div className="w-6 h-6 bg-chefie-yellow rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                    <ArrowRight className="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
    </motion.div>
);

export default Trend;
