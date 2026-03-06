import API_BASE from '../utils/api';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, ArrowRight, Home, ChevronRight, Search, SlidersHorizontal, Utensils, Award, Filter, LayoutGrid } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular'); // a-z, z-a, newest, rating, popular
    const { hash } = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const q = searchParams.get('q') || '';
        setSearchQuery(q);
    }, [searchParams]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const catRes = await axios.get(`${API_BASE}/api/categories`);
                setCategories(catRes.data);

                if (hash) {
                    const id = parseInt(hash.replace('#category-', ''));
                    if (!isNaN(id)) setSelectedCategory(id);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchInitialData();
    }, [hash]);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE}/api/recipes?limit=100`;
                if (selectedCategory) url += `&category_id=${selectedCategory}`;
                if (searchQuery) url += `&title=${searchQuery}`;

                const res = await axios.get(url);
                let sortedData = res.data;

                if (sortBy === 'rating') {
                    sortedData.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
                } else if (sortBy === 'popular') {
                    sortedData.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
                } else if (sortBy === 'a-z') {
                    sortedData.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'tr-TR'));
                } else if (sortBy === 'z-a') {
                    sortedData.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'tr-TR'));
                }

                setRecipes(sortedData);
            } catch (err) {
                console.error('Error fetching recipes:', err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchRecipes, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, sortBy]);

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6">
            {/* Minimal Header */}
            <header className="py-8 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4"
                >
                    <Link to="/" className="hover:text-chefie-yellow transition-colors">ANASAYFA</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-chefie-dark">TARİFLER</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black text-chefie-dark mb-6 leading-tight"
                >
                    Lezzet Yolculuğuna <br />
                    <span className="text-chefie-yellow relative">
                        Buradan Başla
                        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                            <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                        </svg>
                    </span>
                </motion.h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Binlerce özenle seçilmiş tarif arasından damak tadınıza en uygun olanı saniyeler içinde bulun.
                </p>
            </header>

            {/* Unified Filter Bar (Sticky) */}
            <div className="sticky top-0 z-40 -mx-4 px-4 py-4 mb-12 bg-[#FFFBF2]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-3 md:p-4 flex flex-col lg:flex-row items-center gap-4">

                        {/* Search Input */}
                        <div className="relative flex-1 w-full z-50">
                            <SearchBar
                                initialQuery={searchQuery}
                                placeholder="Tarif veya malzeme ara..."
                                className="w-full"
                                onSearch={(q) => {
                                    setSearchQuery(q);
                                    const params = new URLSearchParams(searchParams);
                                    if (q.trim()) {
                                        params.set('q', q.trim());
                                    } else {
                                        params.delete('q');
                                    }
                                    setSearchParams(params);
                                }}
                            />
                        </div>

                        {/* Category Select */}
                        <div className="flex flex-row items-center gap-2 md:gap-3 w-full lg:w-auto">
                            <div className="flex-1 lg:w-64 relative group">
                                <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 bg-chefie-yellow/10 rounded-lg group-hover:bg-chefie-yellow/20 transition-colors">
                                    <LayoutGrid className="w-4 h-4 text-chefie-yellow" />
                                </div>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-4 bg-gray-50 border-0 rounded-2xl md:rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-gray-600 font-bold appearance-none cursor-pointer text-xs md:text-sm"
                                >
                                    <option value="">Tüm Kategoriler</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 rotate-90 pointer-events-none" />
                            </div>

                            {/* Sort Select */}
                            <div className="flex-1 lg:w-56 relative group">
                                <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-1.5 bg-chefie-dark/5 rounded-lg group-hover:bg-chefie-dark/10 transition-colors">
                                    <SlidersHorizontal className="w-4 h-4 text-chefie-dark" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-4 bg-gray-50 border-0 rounded-2xl md:rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-gray-600 font-bold appearance-none cursor-pointer text-xs md:text-sm"
                                >
                                    <option value="a-z">A'dan Z'ye</option>
                                    <option value="z-a">Z'den A'ya</option>
                                    <option value="newest">En Yeni</option>
                                    <option value="rating">En Beğenilen</option>
                                    <option value="popular">En Popüler</option>
                                </select>
                                <ChevronRight className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 rotate-90 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <main className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10 px-2">
                    <h2 className="text-xl font-black text-chefie-dark flex items-center gap-3">
                        {loading ? 'Tarifler Hazırlanıyor...' : (
                            <>
                                <span className="bg-chefie-yellow text-white w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-lg shadow-yellow-100">
                                    {recipes.length}
                                </span>
                                Harika Tarif Listelendi
                            </>
                        )}
                    </h2>
                    {!loading && recipes.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[10px] font-black tracking-widest text-gray-400">
                            <Award className="w-3 h-3 text-chefie-yellow" /> SEÇKİN KOLEKSİYON
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={`skeleton-${i}`} className="animate-pulse bg-white rounded-[2.5rem] h-[450px] shadow-sm border border-gray-50 p-6">
                                <div className="bg-gray-50 rounded-[2rem] h-60 mb-8"></div>
                                <div className="h-6 bg-gray-50 rounded-full w-3/4 mb-4"></div>
                                <div className="h-6 bg-gray-50 rounded-full w-1/2"></div>
                            </div>
                        ))
                    ) : (
                        recipes.map((recipe, idx) => (
                            <div
                                key={recipe.id}
                                onClick={() => navigate(`/recipes/${recipe.id}`)}
                                className="bg-white rounded-[2.5rem] shadow-lg shadow-gray-200/30 hover:shadow-2xl hover:shadow-chefie-yellow/10 transition-transform duration-300 transform hover:-translate-y-2 border border-gray-50 overflow-hidden flex flex-col group relative cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`) : '/default-recipe.png'}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    <div className="absolute top-5 left-5">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-chefie-dark shadow-xl shadow-black/5">
                                            {recipe.category_name || 'Genel'}
                                        </div>
                                    </div>

                                    <div className="absolute top-5 right-5 bg-chefie-dark/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                                        <Star className="w-3 h-3 text-chefie-yellow fill-current" />
                                        <span className="text-white text-xs font-black">
                                            {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : 'YENİ'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-chefie-dark mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-chefie-yellow transition-colors leading-snug">
                                        {recipe.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4 font-black tracking-widest uppercase">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-chefie-yellow" />
                                            {recipe.prep_time || '30 DK'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-chefie-yellow" />
                                            {recipe.servings || '4'} KİŞİLİK
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl">
                                        {recipe.chef_image ? (
                                            <img
                                                src={recipe.chef_image.startsWith('http') ? recipe.chef_image : `${API_BASE}${recipe.chef_image}`}
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
                                            <Link
                                                to={`/profile/${recipe.user_id}`}
                                                className="text-xs font-bold text-gray-700 hover:text-chefie-yellow transition-colors z-10 relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {recipe.chef_name || recipe.chef_username}
                                            </Link>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-auto group/btn inline-flex items-center justify-center gap-3 w-full py-4.5 bg-gray-50 text-chefie-dark font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-dark hover:text-white transition-all duration-500 shadow-sm"
                                    >
                                        TARİFİ İNCELE
                                        <div className="w-6 h-6 bg-chefie-yellow rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                                            <ArrowRight className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {
                    !loading && recipes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32"
                        >
                            <div className="bg-white w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-100 border border-gray-50">
                                <Search className="w-12 h-12 text-gray-200" />
                            </div>
                            <h3 className="text-3xl font-black text-chefie-dark mb-3">Bulunamadı</h3>
                            <p className="text-gray-400 font-medium max-w-sm mx-auto">Aradığın kriterlerde tarif bulamadık. Lütfen farklı kelimelerle veya filtrelerle tekrar dene.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                                className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 hover:scale-105 active:scale-95 transition-all"
                            >
                                FİLTRELERİ SIFIRLA
                            </button>
                        </motion.div>
                    )
                }
            </main >
        </div >
    );
};

export default Recipes;
