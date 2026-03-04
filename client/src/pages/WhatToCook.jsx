import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shuffle, Clock, Star, Utensils, Users, ArrowRight, Flame, Salad, X, Filter, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

import API_BASE from '../utils/api';
const apiBase = API_BASE;

const WhatToCook = () => {
    const navigate = useNavigate();
    const [allRecipes, setAllRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [maxTime, setMaxTime] = useState(null); // in minutes
    const [servingsFilter, setServingsFilter] = useState(null);

    // Result state
    const [suggestion, setSuggestion] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipesRes, categoriesRes] = await Promise.all([
                    axios.get(`${apiBase}/api/recipes?limit=500`),
                    axios.get(`${apiBase}/api/categories`),
                ]);
                setAllRecipes(recipesRes.data || []);
                setCategories(categoriesRes.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredRecipes = useMemo(() => {
        return allRecipes.filter(r => {
            if (selectedCategory && r.category_id !== selectedCategory) return false;
            if (maxTime) {
                const prep = parseInt(r.prep_time) || 0;
                const cook = parseInt(r.cook_time) || 0;
                if ((prep + cook) > maxTime) return false;
            }
            if (servingsFilter) {
                const s = parseInt(r.servings) || 4;
                if (s < servingsFilter) return false;
            }
            return true;
        });
    }, [allRecipes, selectedCategory, maxTime, servingsFilter]);

    const getRandomRecipe = () => {
        if (filteredRecipes.length === 0) return;
        setIsSpinning(true);
        setHasSpun(true);

        // Quick shuffle animation
        let count = 0;
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * filteredRecipes.length);
            setSuggestion(filteredRecipes[randomIdx]);
            count++;
            if (count >= 12) {
                clearInterval(interval);
                const finalIdx = Math.floor(Math.random() * filteredRecipes.length);
                setSuggestion(filteredRecipes[finalIdx]);
                setIsSpinning(false);
            }
        }, 80);
    };

    const resetFilters = () => {
        setSelectedCategory(null);
        setMaxTime(null);
        setServingsFilter(null);
    };

    const timeOptions = [
        { label: '15 dk', value: 15 },
        { label: '30 dk', value: 30 },
        { label: '45 dk', value: 45 },
        { label: '60 dk', value: 60 },
        { label: '90+ dk', value: 999 },
    ];

    const servingsOptions = [
        { label: '1-2', value: 1 },
        { label: '3-4', value: 3 },
        { label: '5-6', value: 5 },
        { label: '7+', value: 7 },
    ];

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20 z-0"
                style={{
                    backgroundImage: 'url("/images/uploaded-bg.svg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <header className="py-10 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                            <Link to="/" className="hover:text-chefie-yellow transition-colors">ANASAYFA</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-chefie-dark">NE PİŞİRSEM</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-chefie-dark leading-tight">
                            Bugün Ne <br className="hidden sm:block" />
                            <span className="text-chefie-yellow relative inline-block">
                                Pişirsem?
                                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                    <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mt-5">
                            Karar veremiyorsan bırak biz seçelim! Filtrele ve çarkı çevir.
                        </p>
                    </motion.div>
                </header>

                <main className="max-w-5xl mx-auto">
                    {/* Filter Toggle + Spin Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                    >
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:border-chefie-yellow hover:text-chefie-yellow transition-all shadow-md w-full sm:w-auto justify-center"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Filtreleri Gizle' : 'Filtrele'}
                            {(selectedCategory || maxTime || servingsFilter) && (
                                <span className="w-2 h-2 bg-chefie-yellow rounded-full"></span>
                            )}
                        </button>

                        <button
                            onClick={getRandomRecipe}
                            disabled={loading || filteredRecipes.length === 0 || isSpinning}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-chefie-dark text-white font-black text-sm rounded-2xl shadow-2xl shadow-gray-900/10 hover:bg-chefie-yellow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                        >
                            {isSpinning ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Seçiliyor...
                                </>
                            ) : (
                                <>
                                    <Shuffle className="w-5 h-5" />
                                    {hasSpun ? 'BİR DAHA ÇEVİR' : 'ÇARKI ÇEVİR'}
                                </>
                            )}
                        </button>

                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-gray-100 text-[10px] font-black tracking-widest text-gray-400 shadow-sm w-full sm:w-auto justify-center">
                            <Utensils className="w-4 h-4 text-chefie-yellow" />
                            {filteredRecipes.length} TARİF UYGUN
                        </div>
                    </motion.div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-10"
                            >
                                <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-100/50 p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black text-chefie-dark tracking-widest uppercase flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-chefie-yellow" /> Filtreler
                                        </h3>
                                        {(selectedCategory || maxTime || servingsFilter) && (
                                            <button onClick={resetFilters} className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                                                <X className="w-3 h-3" /> Temizle
                                            </button>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="mb-6">
                                        <div className="text-[10px] font-black tracking-widest uppercase text-gray-300 mb-3">KATEGORİ</div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${!selectedCategory ? 'bg-chefie-dark text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                            >
                                                Tümü
                                            </button>
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time & Servings row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-[10px] font-black tracking-widest uppercase text-gray-300 mb-3 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> MAKSİMUM SÜRE
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setMaxTime(null)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${!maxTime ? 'bg-chefie-dark text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    Farketmez
                                                </button>
                                                {timeOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setMaxTime(opt.value)}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${maxTime === opt.value ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black tracking-widest uppercase text-gray-300 mb-3 flex items-center gap-1.5">
                                                <Users className="w-3 h-3" /> KİŞİ SAYISI
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setServingsFilter(null)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${!servingsFilter ? 'bg-chefie-dark text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    Farketmez
                                                </button>
                                                {servingsOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setServingsFilter(opt.value)}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${servingsFilter === opt.value ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        {opt.label} Kişi
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Result Area */}
                    {!hasSpun && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 md:py-24"
                        >
                            <div className="bg-white w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-100 border border-gray-50">
                                <Shuffle className="w-14 h-14 md:w-16 md:h-16 text-gray-200" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-chefie-dark mb-3">Çarkı Çevir!</h2>
                            <p className="text-gray-400 font-medium max-w-sm mx-auto">
                                Yukarıdaki butona tıklayarak sana özel bir tarif önerisi al. İstersen önce filtrele!
                            </p>
                        </motion.div>
                    )}

                    {loading && (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 border-4 border-gray-100 border-t-chefie-yellow rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-gray-400 font-bold">Tarifler yükleniyor...</p>
                        </div>
                    )}

                    {/* Suggestion Card */}
                    <AnimatePresence mode="wait">
                        {suggestion && hasSpun && (
                            <motion.div
                                key={suggestion.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="max-w-2xl mx-auto mb-16"
                            >
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-chefie-yellow/10 rounded-full text-chefie-yellow text-[11px] font-black tracking-widest uppercase">
                                        <Sparkles className="w-4 h-4" /> SANA ÖZEL ÖNERİ
                                    </div>
                                </div>

                                <div
                                    onClick={() => navigate(`/recipes/${suggestion.id}`)}
                                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 overflow-hidden cursor-pointer group"
                                >
                                    <div className="relative h-56 md:h-72 overflow-hidden">
                                        {suggestion.image_url ? (
                                            <img
                                                src={suggestion.image_url.startsWith('/images/') ? suggestion.image_url : `${apiBase}${suggestion.image_url}`}
                                                alt={suggestion.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                                                <Utensils className="w-16 h-16 text-chefie-yellow/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-chefie-dark/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-5 left-5">
                                            <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-chefie-dark shadow-xl">
                                                {suggestion.category_name || 'GENEL'}
                                            </div>
                                        </div>
                                        <div className="absolute top-5 right-5 bg-chefie-dark/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                                            <Star className="w-3 h-3 text-chefie-yellow fill-current" />
                                            <span className="text-white text-xs font-black">
                                                {suggestion.avg_rating ? Number(suggestion.avg_rating).toFixed(1) : 'YENİ'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8">
                                        <h3 className="text-2xl md:text-3xl font-black text-chefie-dark mb-4 group-hover:text-chefie-yellow transition-colors leading-tight">
                                            {suggestion.title}
                                        </h3>

                                        {suggestion.description && (
                                            <p className="text-gray-400 font-medium leading-relaxed line-clamp-2 mb-6">{suggestion.description}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
                                                <Clock className="w-4 h-4 text-chefie-yellow" />
                                                {suggestion.prep_time || '30'} dk Hazırlık
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
                                                <Flame className="w-4 h-4 text-orange-400" />
                                                {suggestion.cook_time || '20'} dk Pişirme
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
                                                <Users className="w-4 h-4 text-blue-400" />
                                                {suggestion.servings || '4'} Kişilik
                                            </div>
                                        </div>

                                        {suggestion.chef_name && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-6">
                                                {suggestion.chef_image ? (
                                                    <img
                                                        src={suggestion.chef_image.startsWith('http') ? suggestion.chef_image : `${apiBase}${suggestion.chef_image}`}
                                                        alt={suggestion.chef_name}
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">
                                                        {(suggestion.chef_name || 'Ş').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Şef</span>
                                                    <span className="text-xs font-bold text-gray-700">{suggestion.chef_name}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="group/btn inline-flex items-center justify-center gap-3 w-full py-4 bg-chefie-dark text-white font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-yellow transition-all duration-500 shadow-lg">
                                            TARİFE GİT
                                            <div className="w-6 h-6 bg-chefie-yellow group-hover/btn:bg-white/20 rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-all">
                                                <ArrowRight className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Suggestions - shown after first spin */}
                    {hasSpun && !isSpinning && filteredRecipes.length > 3 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-lg md:text-xl font-black text-chefie-dark flex items-center gap-2">
                                    Diğer Öneriler <Salad className="text-green-500 w-5 h-5" />
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {filteredRecipes
                                    .filter(r => r.id !== suggestion?.id)
                                    .sort(() => Math.random() - 0.5)
                                    .slice(0, 4)
                                    .map((recipe, idx) => (
                                        <div
                                            key={recipe.id}
                                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                                            className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-md shadow-gray-100/50 border border-gray-50 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="relative h-28 md:h-36 overflow-hidden">
                                                <img
                                                    src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${apiBase}${recipe.image_url}`) : '/default-recipe.png'}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-2 right-2 bg-chefie-dark/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                                    <Star className="w-2.5 h-2.5 text-chefie-yellow fill-current" />
                                                    <span className="text-white text-[10px] font-black">
                                                        {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : '–'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 md:p-4">
                                                <div className="text-[9px] font-black tracking-widest uppercase text-gray-300 mb-1">
                                                    {recipe.category_name || 'GENEL'}
                                                </div>
                                                <h4 className="text-xs md:text-sm font-black text-chefie-dark line-clamp-2 leading-snug group-hover:text-chefie-yellow transition-colors min-h-[2rem] md:min-h-[2.5rem]">
                                                    {recipe.title}
                                                </h4>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold">
                                                    <Clock className="w-3 h-3 text-gray-300" />
                                                    {recipe.prep_time || '30'} dk
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </motion.section>
                    )}

                    {/* No results message */}
                    {hasSpun && filteredRecipes.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <div className="bg-white w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-50">
                                <X className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-chefie-dark mb-2">Tarif Bulunamadı</h3>
                            <p className="text-gray-400 font-medium mb-6">Bu filtrelere uygun tarif yok. Filtreleri değiştirmeyi dene.</p>
                            <button onClick={resetFilters} className="px-6 py-3 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                                FİLTRELERİ SIFIRLA
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WhatToCook;
