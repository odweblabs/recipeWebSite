import API_BASE from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, Star, ChevronLeft, ChevronRight, Utensils, Play, Users, Clock, ChefHat, MessageSquare, Soup, Beef, Cake, Croissant, Coffee, Flame, Trophy } from 'lucide-react';
import { blogPosts } from '../data/blogData';
import SearchBar from '../components/SearchBar';
import NotificationBell from '../components/NotificationBell';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [publicStats, setPublicStats] = useState(null);
    const [topChefs, setTopChefs] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const scrollContainerRef = useRef(null);
    const chefsScrollRef = useRef(null);

    const scrollChefs = (direction) => {
        if (chefsScrollRef.current) {
            const { current } = chefsScrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const getCategoryIcon = (name, className) => {
        const n = name.toLowerCase();
        if (n.includes('çorba')) return <Soup className={className} />;
        if (n.includes('et')) return <Beef className={className} />;
        if (n.includes('tatlı')) return <Cake className={className} />;
        if (n.includes('hamur')) return <Croissant className={className} />;
        if (n.includes('içecek')) return <Coffee className={className} />;
        if (n.includes('aperatif')) return <Flame className={className} />;
        return <Utensils className={className} />;
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipesRes, categoriesRes, statsRes, chefsRes, recommendationRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/recipes/latest?limit=12`).catch(e => ({ data: [] })),
                    axios.get(`${API_BASE}/api/categories`).catch(e => ({ data: [] })),
                    axios.get(`${API_BASE}/api/recipes/public-stats`).catch(e => ({ data: null })),
                    axios.get(`${API_BASE}/api/auth/top-chefs`).catch(e => ({ data: [] })),
                    axios.get(`${API_BASE}/api/recipes/recommendation`).catch(e => ({ data: null }))
                ]);

                setRecipes(recipesRes.data || []);
                setCategories(categoriesRes.data || []);
                setPublicStats(statsRes.data);
                setTopChefs(chefsRes.data || []);
                setRecommendation(recommendationRes.data);

                if (statsRes.data?.counts?.recipes) {
                    setTotalRecipes(statsRes.data.counts.recipes);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-16 pb-20">
            {/* Top Header & Search */}
            <header className="flex flex-row justify-between items-center gap-3 md:gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative flex-1 md:flex-none md:w-[450px] ${searchOpen ? 'z-[100]' : 'z-30'}`}
                >
                    <SearchBar
                        initialQuery={searchQuery}
                        onOpenChange={setSearchOpen}
                    />
                </motion.div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:block">
                        <NotificationBell />
                    </div>
                    <Link to="/admin/recipes/new" className="h-[48px] md:h-auto px-5 md:px-8 py-0 md:py-4 bg-gradient-to-r from-chefie-yellow to-amber-500 text-white font-black text-[10px] sm:text-xs md:text-sm rounded-2xl shadow-lg shadow-amber-200/40 dark:shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-300/50 dark:hover:shadow-amber-800/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <ChefHat className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="hidden sm:inline">{t('nav.share_recipe').toUpperCase()}</span>
                        <span className="sm:hidden">{t('common.share').toUpperCase()}</span>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative rounded-[3rem] p-10 md:p-16 overflow-hidden bg-chefie-dark min-h-[450px] flex items-center shadow-2xl shadow-gray-200/50 dark:shadow-none">
                {/* Decorative floating elements */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-[20%] w-24 h-24 bg-chefie-yellow/10 blur-2xl rounded-full"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-[10%] w-32 h-32 bg-white/5 blur-3xl rounded-full"
                ></motion.div>

                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-40 md:opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-chefie-dark via-chefie-dark/80 md:via-transparent to-chefie-dark/90 md:to-transparent z-10"></div>
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" alt="Kitchen" className="w-full h-full object-cover" />
                </div>

                <div className="relative z-20 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-chefie-yellow/20 rounded-full text-chefie-yellow text-xs font-black tracking-widest mb-6"
                    >
                        <Play className="w-3 h-3 fill-current" /> {t('home.hero.badge')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.1]"
                    >
                        {t('home.hero.title_1')} <br />
                        <span className="text-chefie-yellow">{t('home.hero.title_2')}</span>
                    </motion.h1>

                    <div className="flex flex-wrap gap-6 md:gap-10">
                        <div className="flex flex-col">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-black text-white"
                            >
                                120+
                            </motion.span>
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">{t('home.hero.stats.videos')}</span>
                        </div>
                        <div className="flex flex-col">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl md:text-4xl font-black text-chefie-yellow"
                            >
                                {publicStats?.counts?.recipes || '1k+'}
                            </motion.span>
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">{t('home.hero.stats.recipes')}</span>
                        </div>
                        <div className="flex flex-col">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl md:text-4xl font-black text-white"
                            >
                                {publicStats?.counts?.users || '5k+'}
                            </motion.span>
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">{t('home.hero.stats.chefs')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Pills */}
            <section className="bg-chefie-card/50 backdrop-blur-sm p-2 rounded-[2rem] border border-chefie-border flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <Link to="/recipes" className="px-8 py-3.5 bg-chefie-dark text-white rounded-2xl text-xs font-black tracking-widest hover:bg-chefie-yellow transition-all whitespace-nowrap shadow-lg shadow-gray-200 dark:shadow-none">
                    {t('home.categories.explore')}
                </Link>
                {categories.filter(cat =>
                    ['Kahvaltılık', 'Aperatifler', 'Çorba', 'Hızlı Yemekler', 'Makarna', 'Salata'].some(keyword => cat.name.includes(keyword))
                ).map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/recipes#category-${cat.id}`}
                        className="px-6 py-3.5 bg-chefie-card border border-chefie-border text-gray-500 rounded-2xl text-xs font-bold hover:border-chefie-yellow hover:text-chefie-yellow hover:shadow-lg hover:shadow-yellow-100 dark:hover:shadow-none transition-all whitespace-nowrap"
                    >
                        {cat.name.toUpperCase()}
                    </Link>
                ))}
            </section>

            {/* Haftanın Yıldızları Section */}
            <section className="relative group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <h2 className="text-3xl font-black text-chefie-text flex items-center gap-4">
                        {t('home.sections.stars_of_week')} <Trophy className="text-chefie-yellow w-8 h-8" />
                    </h2>
                    <div className="flex gap-3 justify-end sm:justify-start">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 bg-chefie-card border border-chefie-border rounded-2xl text-gray-400 hover:text-chefie-text hover:bg-chefie-cream transition-all shadow-xl shadow-gray-100 dark:shadow-none"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 bg-chefie-card border border-chefie-border rounded-2xl text-gray-400 hover:text-chefie-text hover:bg-chefie-cream transition-all shadow-xl shadow-gray-100 dark:shadow-none"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-12 -mx-4 px-12 md:px-4 md:mx-0 scroll-smooth scrollbar-hide snap-x snap-mandatory pt-32"
                >
                    {loading ? (
                        <div className="w-full flex gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="min-w-[320px] h-[400px] bg-white rounded-[2.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        recipes.slice(0, 6).map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/recipes/${recipe.id}`)}
                                className="min-w-[280px] sm:min-w-[300px] md:min-w-[270px] lg:min-w-[280px] snap-center md:snap-start bg-chefie-card rounded-[2.5rem] shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-chefie-yellow/10 dark:shadow-none transition-transform duration-300 relative group/card border border-chefie-border cursor-pointer text-center"
                            >
                                {/* Circular Floating Image */}
                                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full p-2 bg-chefie-card shadow-2xl z-10 transition-transform duration-300 ease-out group-hover/card:scale-105">
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                        <img
                                            src={recipe.image_url ? getImageUrl(recipe.image_url) : '/default-recipe.png'}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:rotate-3"
                                        />
                                    </div>
                                </div>

                                <div className="pt-28 pb-6 px-4 flex flex-col h-full">
                                    <h3 className="text-xl font-black text-chefie-text mb-2 line-clamp-1 group-hover/card:text-chefie-yellow transition-colors px-2">{recipe.title}</h3>

                                    <div className="flex items-center justify-center gap-1.5 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= Math.round(recipe.avg_rating || 0) ? 'text-chefie-yellow fill-current' : 'text-gray-200'}`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-400 font-bold ml-1">({recipe.comment_count || 0} {t('common.comments')})</span>
                                    </div>

                                    <div className="mt-auto grid grid-cols-3 gap-1 border-t border-gray-50 pt-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <Users className="w-5 h-5 text-gray-300" />
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.servings || 2} {t('common.servings')}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-r border-gray-50 px-1">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-chefie-yellow" />
                                                <span className="text-xs font-bold text-gray-600">{t('common.prep_short')}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.prep_time || 15} {t('common.minutes')}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1">
                                                <Utensils className="w-4 h-4 text-chefie-yellow" />
                                                <span className="text-xs font-bold text-gray-600">{t('common.cook_short')}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.cook_time || 20} {t('common.minutes')}</span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 py-3 bg-green-50 text-green-600 font-bold rounded-xl text-sm hover:bg-chefie-dark hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-none">
                                        {t('common.view_recipe')}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Kategorileri Keşfedin Section */}
            <section>
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-chefie-yellow text-xs font-black tracking-widest uppercase mb-4"
                    >
                        {t('home.categories.subtitle')}
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-chefie-text mb-6">
                        {t('home.categories.title')}
                    </h2>
                    <div className="w-20 h-1.5 bg-chefie-yellow rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.filter(cat =>
                        ['Aperatifler', 'Çorba', 'Et Yemekleri', 'Tatlı', 'Hamur İşi', 'İçecek'].some(k => cat.name.includes(k))
                    ).slice(0, 6).map((cat, idx) => {
                        const bgColors = ['bg-orange-50', 'bg-blue-50', 'bg-red-50', 'bg-purple-50', 'bg-green-50', 'bg-yellow-50'];
                        const textColors = ['text-orange-600', 'text-blue-600', 'text-red-600', 'text-purple-600', 'text-green-600', 'text-yellow-600'];
                        const iconColors = ['text-orange-400', 'text-blue-400', 'text-red-400', 'text-purple-400', 'text-green-400', 'text-yellow-400'];

                        return (
                            <Link
                                key={cat.id}
                                to={`/recipes#category-${cat.id}`}
                                className={`flex flex-col items-center p-8 rounded-[2.5rem] ${bgColors[idx % 6]} hover:scale-105 transition-all duration-300 border border-transparent hover:border-white shadow-xl shadow-transparent hover:shadow-gray-100 dark:hover:shadow-none group`}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                                    {getCategoryIcon(cat.name, `w-8 h-8 ${iconColors[idx % 6]}`)}
                                </div>
                                <span className={`text-sm font-black text-center ${textColors[idx % 6]}`}>{cat.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{t('home.categories.examine')}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Haftanın Şefleri Section */}
            <section className="bg-chefie-card rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-gray-100 dark:shadow-none border border-chefie-border overflow-hidden relative">
                <div className="absolute top-1/2 -translate-y-1/2 -right-32 md:right-10 opacity-[0.05] md:opacity-[0.05] pointer-events-none">
                    <ChefHat size={600} className="text-chefie-dark" />
                </div>

                <div className="flex flex-col md:flex-row items-end justify-between mb-16 relative z-10">
                    <div className="max-w-xl text-center md:text-left">
                        <span className="text-chefie-yellow text-xs font-black tracking-widest uppercase mb-4 block">{t('home.sections.chefs_of_week.subtitle')}</span>
                        <h2 className="text-4xl md:text-5xl font-black text-chefie-text mb-4">{t('home.sections.chefs_of_week.title')}</h2>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed">{t('home.sections.chefs_of_week.description')}</p>
                    </div>
                    <div className="flex gap-4 mt-8 md:mt-0">
                        <button onClick={() => scrollChefs('left')} className="w-14 h-14 bg-chefie-cream border border-chefie-border rounded-2x flex items-center justify-center text-gray-400 hover:text-chefie-yellow transition-all shadow-lg shadow-gray-100 dark:shadow-none rounded-2xl"><ChevronLeft size={24} /></button>
                        <button onClick={() => scrollChefs('right')} className="w-14 h-14 bg-chefie-cream border border-chefie-border rounded-2x flex items-center justify-center text-gray-400 hover:text-chefie-yellow transition-all shadow-lg shadow-gray-100 dark:shadow-none rounded-2xl"><ChevronRight size={24} /></button>
                    </div>
                </div>

                <div
                    ref={chefsScrollRef}
                    className="flex justify-center md:justify-start gap-10 overflow-x-auto scrollbar-hide pb-4 snap-x relative z-10 -mx-4 px-4"
                >
                    {topChefs.length > 0 ? topChefs.map((chef, idx) => (
                        <motion.div
                            key={chef.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[200px] flex flex-col items-center snap-start group cursor-pointer"
                            onClick={() => navigate(`/profile/${chef.id}`)}
                        >
                            <div className="relative mb-6">
                                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden">
                                    {chef.profile_image ? (
                                        <img src={getImageUrl(chef.profile_image)} alt={chef.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-chefie-cream flex items-center justify-center font-black text-3xl text-chefie-text">{(chef.full_name || chef.username).charAt(0)}</div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-chefie-yellow text-white w-10 h-10 rounded-full border-4 border-chefie-card flex items-center justify-center font-black text-xs shadow-lg">#{idx + 1}</div>
                            </div>
                            <h4 className="text-lg font-black text-chefie-text group-hover:text-chefie-yellow transition-colors">{chef.full_name || chef.username}</h4>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{chef.recipe_count} {t('common.recipe_count').toUpperCase()}</span>
                        </motion.div>
                    )) : Array(6).fill(0).map((_, i) => (
                        <div key={i} className="min-w-[200px] flex flex-col items-center animate-pulse">
                            <div className="w-32 h-32 bg-gray-100 rounded-full mb-6 shadow-inner"></div>
                            <div className="h-4 bg-gray-100 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mutfak Sırları (Blog Teaser) Section */}
            <section className="relative">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-chefie-text flex items-center gap-3">
                        {t('home.sections.kitchen_secrets')} <Play className="w-5 h-5 text-chefie-yellow fill-current" />
                    </h2>
                    <Link to="/blog" className="text-gray-400 font-bold text-xs uppercase hover:text-chefie-yellow transition-colors">{t('home.sections.all_blog')}</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.slice(0, 3).map((post, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-chefie-card rounded-[2.5rem] overflow-hidden border border-chefie-border shadow-xl shadow-gray-100 dark:shadow-none group cursor-pointer"
                            onClick={() => navigate(`/blog/${post.id}`)}
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-5 left-5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black">{post.category}</div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-black text-chefie-text mb-4 leading-tight group-hover:text-chefie-yellow transition-colors">{post.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{post.author}</span>
                                    <div className="flex items-center gap-1 text-chefie-yellow">
                                        <span className="text-[10px] font-black">{t('blog.read')}</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Topluluğa Katıl Section */}
            <section className="bg-chefie-dark rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-chefie-yellow/20 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full"></div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex p-5 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/10"
                    >
                        <ChefHat className="w-12 h-12 text-chefie-yellow" />
                    </motion.div>
                    <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">{t('home.sections.join_community.title')}</h2>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto">{t('home.sections.join_community.description')}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/admin/login" className="px-12 py-5 bg-chefie-yellow text-chefie-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-15px_rgba(255,193,7,0.4)]">{t('home.sections.join_community.button_join')}</Link>
                        <Link to="/recipes" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">{t('home.sections.join_community.button_browse')}</Link>
                    </div>
                </div>
            </section>

            {/* Recent Reviews / User Feedback Section */}
            <section>
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-chefie-text flex items-center gap-3">
                        {t('home.sections.recent_reviews')} <MessageSquare className="w-5 h-5 text-blue-500" />
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {publicStats?.recentComments?.length > 0 ? publicStats.recentComments.slice(0, 4).map((comment, idx) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-chefie-card p-6 rounded-3xl border border-chefie-border shadow-xl shadow-gray-100/50 dark:shadow-none flex flex-col h-full"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    {comment.profile_image ? (
                                        <img src={getImageUrl(comment.profile_image)} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-chefie-cream flex items-center justify-center font-bold text-chefie-dark text-xs">{(comment.full_name || comment.username).charAt(0)}</div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-chefie-text line-clamp-1">{comment.full_name || comment.username}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter line-clamp-1">{comment.recipe_title}</span>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= (comment.rating || 5) ? 'text-chefie-yellow fill-current' : 'text-gray-200'} `} />)}
                            </div>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed italic line-clamp-3">"{comment.content}"</p>
                            <span className="mt-auto pt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                        </motion.div>
                    )) : Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm"></div>
                    ))}
                </div>
            </section>

            {/* Featured Banner - Chef's Recommendation */}
            {recommendation && (
                <section className="bg-chefie-yellow rounded-[4rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-yellow-100/50 dark:shadow-none border border-white">
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-xl space-y-8 text-center md:text-left order-2 md:order-1">
                        <div className="inline-flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-chefie-dark text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">{t('home.sections.chef_recommendation.tag')}</span>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/40">
                                <Star className="w-3.5 h-3.5 text-chefie-dark fill-current" />
                                <span className="text-[10px] font-black text-chefie-dark">{Number(recommendation.avg_rating || 0).toFixed(1)} {t('common.rating')}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-chefie-dark leading-[1.1]">
                                <span className="text-chefie-dark/40 block text-2xl md:text-3xl mb-2">{t('home.sections.chef_recommendation.label')}</span>
                                {recommendation.title}
                            </h2>
                            <p className="text-chefie-dark/70 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                                {recommendation.description || t('home.sections.chef_recommendation.description')}
                            </p>
                        </div>

                        {/* Recipe Specs */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-5 py-3 bg-white shadow-xl shadow-yellow-200/50 dark:shadow-none rounded-2xl">
                                <Clock className="w-5 h-5 text-chefie-yellow" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">{t('home.sections.chef_recommendation.prep')}</span>
                                    <span className="text-sm font-black text-chefie-dark">{recommendation.cook_time || recommendation.prep_time || 30} {t('common.minutes')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-5 py-3 bg-white shadow-xl shadow-yellow-200/50 dark:shadow-none rounded-2xl">
                                <Users className="w-5 h-5 text-chefie-yellow" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">{t('home.sections.chef_recommendation.servings')}</span>
                                    <span className="text-sm font-black text-chefie-dark">{recommendation.servings || 4} {t('common.servings')}</span>
                                </div>
                            </div>
                            {recommendation.chef_name && (
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white">
                                        {recommendation.chef_image ? (
                                            <img src={getImageUrl(recommendation.chef_image)} alt={recommendation.chef_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-chefie-cream flex items-center justify-center font-black text-chefie-dark text-sm">{(recommendation.chef_name || recommendation.chef_username).charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-black text-chefie-dark/50 uppercase leading-none">{t('home.sections.chef_recommendation.author')}</span>
                                        <span className="text-xs font-black text-chefie-dark">{recommendation.chef_name}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <Link to={`/recipes/${recommendation.id}`} className="inline-flex items-center gap-3 px-10 py-5 bg-chefie-dark text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-900/10 group">
                                {t('home.sections.chef_recommendation.button')} <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex justify-center md:justify-end order-1 md:order-2">
                        <motion.div
                            whileHover={{ rotate: 8, scale: 1.05 }}
                            className="w-72 h-72 md:w-[450px] md:h-[450px] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl relative"
                        >
                            <img
                                src={recommendation.image_url ? getImageUrl(recommendation.image_url) : '/default-recipe.png'}
                                alt={recommendation.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
