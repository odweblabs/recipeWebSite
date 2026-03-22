import API_BASE from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, ArrowRight, Home, ChevronRight, Search, SlidersHorizontal, Utensils, Award, Filter, LayoutGrid } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useTranslation } from 'react-i18next';

const Recipes = () => {
    const { t } = useTranslation();
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
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
                    sortedData.sort((a, b) => (a.title || '').localeCompare(b.title || '', i18n.language === 'tr' ? 'tr-TR' : 'en-US'));
                } else if (sortBy === 'z-a') {
                    sortedData.sort((a, b) => (b.title || '').localeCompare(a.title || '', i18n.language === 'tr' ? 'tr-TR' : 'en-US'));
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
                    <Link to="/" className="hover:text-chefie-yellow transition-colors">{t('recipes.breadcrumb.home')}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-chefie-text">{t('recipes.breadcrumb.recipes')}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black text-chefie-text mb-6 leading-tight"
                >
                    {t('recipes.header.title_1')} <br />
                    <span className="text-chefie-yellow relative">
                        {t('recipes.header.title_2')}
                        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                            <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                        </svg>
                    </span>
                </motion.h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    {t('recipes.header.description')}
                </p>
            </header>

            {/* Unified Filter Bar (Sticky) */}
            <div className={`sticky top-0 -mx-4 px-4 pt-4 pb-2 mb-8 bg-chefie-cream md:bg-chefie-cream/80 md:backdrop-blur-md ${searchOpen ? 'z-[100]' : 'z-40'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-chefie-card border border-chefie-border shadow-sm md:shadow-lg dark:shadow-none rounded-2xl md:rounded-[2.5rem] p-2 md:p-4 flex flex-col md:flex-row items-center gap-3 md:gap-4">

                        {/* Search Input */}
                        <div className="relative z-50 w-full md:flex-1">
                            <SearchBar
                                initialQuery={searchQuery}
                                placeholder={t('recipes.filters.search_placeholder')}
                                className="w-full"
                                onOpenChange={setSearchOpen}
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
                        <div className="flex flex-row flex-1 items-center gap-2 md:gap-3 w-full lg:w-auto">
                            <div className="flex-1 lg:w-64 relative group">
                                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-1.5 bg-chefie-yellow/10 rounded-md md:rounded-lg group-hover:bg-chefie-yellow/20 transition-colors">
                                    <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4 text-chefie-yellow" />
                                </div>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full pl-8 md:pl-12 pr-6 md:pr-10 py-2.5 md:py-4 bg-chefie-cream border-0 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold appearance-none cursor-pointer text-[10px] sm:text-xs md:text-sm truncate"
                                >
                                    <option value="">{t('recipes.filters.category')}</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-300 rotate-90 pointer-events-none" />
                            </div>

                            {/* Sort Select */}
                            <div className="flex-1 lg:w-56 relative group">
                                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-1.5 bg-chefie-dark/5 rounded-md md:rounded-lg group-hover:bg-chefie-dark/10 transition-colors">
                                    <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4 text-chefie-dark" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-8 md:pl-12 pr-6 md:pr-10 py-2.5 md:py-4 bg-chefie-cream border-0 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold appearance-none cursor-pointer text-[10px] sm:text-xs md:text-sm truncate"
                                >
                                    <option value="a-z">{t('recipes.filters.sort.az')}</option>
                                    <option value="z-a">{t('recipes.filters.sort.za')}</option>
                                    <option value="newest">{t('recipes.filters.sort.newest')}</option>
                                    <option value="rating">{t('recipes.filters.sort.rating')}</option>
                                    <option value="popular">{t('recipes.filters.sort.popular')}</option>
                                </select>
                                <ChevronRight className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-300 rotate-90 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <main className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10 px-2">
                    <h2 className="text-xl font-black text-chefie-text flex items-center gap-3">
                        {loading ? t('recipes.results.loading') : (
                            <>
                                <span className="bg-chefie-yellow text-white w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-md dark:shadow-none">
                                    {recipes.length}
                                </span>
                                {t('recipes.results.found_suffix')}
                            </>
                        )}
                    </h2>
                    {!loading && recipes.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-chefie-card rounded-full border border-chefie-border text-[10px] font-black tracking-widest text-gray-400">
                            <Award className="w-3 h-3 text-chefie-yellow" /> {t('recipes.results.collection')}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={`skeleton-${i}`} className="animate-pulse bg-chefie-card rounded-[2.5rem] h-[450px] shadow-sm border border-chefie-border p-6">
                                <div className="bg-chefie-cream rounded-[2rem] h-60 mb-8"></div>
                                <div className="h-6 bg-chefie-cream rounded-full w-3/4 mb-4"></div>
                                <div className="h-6 bg-chefie-cream rounded-full w-1/2"></div>
                            </div>
                        ))
                    ) : (
                        recipes.map((recipe, idx) => (
                            <div
                                key={recipe.id}
                                onClick={() => navigate(`/recipes/${recipe.id}`)}
                                className="bg-chefie-card rounded-[2.5rem] shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-transform duration-300 transform hover:-translate-y-2 border border-chefie-border overflow-hidden flex flex-col group relative cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={recipe.image_url ? getImageUrl(recipe.image_url) : '/default-recipe.png'}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    <div className="absolute top-5 left-5">
                                        <div className="px-4 py-2 bg-chefie-card/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-chefie-text shadow-md dark:shadow-none">
                                            {recipe.category_name || 'Genel'}
                                        </div>
                                    </div>

                                    <div className="absolute top-5 right-5 bg-chefie-dark/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 shadow-md dark:shadow-none">
                                        <Star className="w-3 h-3 text-chefie-yellow fill-current" />
                                        <span className="text-white text-xs font-black">
                                            {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : t('common.new_tag')}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-chefie-text mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-chefie-yellow transition-colors leading-snug">
                                        {recipe.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4 font-black tracking-widest uppercase">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-chefie-yellow" />
                                            {recipe.prep_time ? (String(recipe.prep_time).includes('dk') ? recipe.prep_time : `${recipe.prep_time} dk`) : `30 dk`}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Users className="w-4 h-4 text-chefie-yellow" />
                                            {recipe.servings || '4'} {t('common.servings_alt')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-6 p-3 bg-chefie-cream rounded-2xl border border-chefie-border">
                                        {recipe.chef_image ? (
                                            <img
                                                src={getImageUrl(recipe.chef_image)}
                                                alt={recipe.chef_name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-chefie-card shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-text flex items-center justify-center font-bold text-xs border-2 border-chefie-card shadow-sm">
                                                {(recipe.chef_name || recipe.chef_username || 'A').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('common.chef')}</span>
                                            <Link
                                                to={`/profile/${recipe.user_id}`}
                                                className="text-xs font-bold text-gray-400 hover:text-chefie-yellow transition-colors z-10 relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {recipe.chef_name || recipe.chef_username}
                                            </Link>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-auto group/btn inline-flex items-center justify-center gap-3 w-full py-4.5 bg-chefie-cream text-chefie-text font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-yellow hover:text-white transition-all duration-500 shadow-sm border border-chefie-border"
                                    >
                                        {t('common.examine_recipe')}
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
                            <div className="bg-chefie-card w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-md dark:shadow-none border border-chefie-border">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-3xl font-black text-chefie-text mb-3">{t('recipes.not_found.title')}</h3>
                            <p className="text-gray-400 font-medium max-w-sm mx-auto">{t('recipes.not_found.description')}</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                                className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('recipes.not_found.button')}
                            </button>
                        </motion.div>
                    )
                }
            </main >
        </div >
    );
};

export default Recipes;
