import API_BASE from '../utils/api';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sliders, ArrowUpRight, Star, ChevronLeft, ChevronRight, Utensils, Play, Users, Clock, ChefHat, MessageSquare } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const Home = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [publicStats, setPublicStats] = useState(null);
    const [topChefs, setTopChefs] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef(null);
    const chefsScrollRef = useRef(null);

    const scrollChefs = (direction) => {
        if (chefsScrollRef.current) {
            const { current } = chefsScrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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
                const [recipesRes, categoriesRes, statsRes, chefsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/recipes/latest?limit=12`),
                    axios.get(`${API_BASE}/api/categories`),
                    axios.get(`${API_BASE}/api/recipes/public-stats`),
                    axios.get(`${API_BASE}/api/auth/top-chefs`)
                ]);
                setRecipes(recipesRes.data);
                setCategories(categoriesRes.data);
                setPublicStats(statsRes.data);
                setTopChefs(chefsRes.data);
                setTotalRecipes(statsRes.data.counts.recipes);
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
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full md:w-[450px] group"
                >
                    <div className="absolute inset-0 bg-chefie-yellow/10 blur-xl group-focus-within:bg-chefie-yellow/20 transition-all rounded-full"></div>
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-chefie-yellow group-focus-within:scale-110 transition-all" />
                        <input
                            type="text"
                            placeholder="Mükemmel tarifi keşfet..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const q = searchQuery.trim();
                                    if (q) {
                                        navigate(`/recipes?q=${encodeURIComponent(q)}`);
                                    } else {
                                        navigate('/recipes');
                                    }
                                }
                            }}
                            className="w-full pl-14 pr-6 py-4 bg-white border-0 rounded-2xl shadow-xl shadow-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 text-gray-700 font-medium placeholder-gray-300 transition-all outline-none"
                        />
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <button className="p-4 bg-white border border-gray-50 rounded-2xl text-gray-400 hover:text-chefie-yellow shadow-xl shadow-gray-100 transition-all">
                        <Sliders className="h-5 w-5" />
                    </button>
                    <Link to="/admin/recipes/new" className="px-8 py-4 bg-chefie-dark text-white font-black text-sm rounded-2xl shadow-xl shadow-gray-200 hover:bg-chefie-yellow hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        TARİF PAYLAŞ <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative rounded-[3rem] p-10 md:p-16 overflow-hidden bg-chefie-dark min-h-[450px] flex items-center shadow-2xl shadow-gray-200/50">
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

                <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-l from-chefie-dark to-transparent z-10"></div>
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" alt="Kitchen" className="w-full h-full object-cover" />
                </div>

                <div className="relative z-20 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-chefie-yellow/20 rounded-full text-chefie-yellow text-xs font-black tracking-widest mb-6"
                    >
                        <Play className="w-3 h-3 fill-current" /> YENİ NESİL MUTFAK REHBERİ
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.1]"
                    >
                        Öğren, Pişir & <br />
                        <span className="text-chefie-yellow">Tadını Çıkar.</span>
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
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Video</span>
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
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Özel Tarif</span>
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
                            <span className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Üye Şef</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Pills */}
            <section className="bg-white/50 backdrop-blur-sm p-2 rounded-[2rem] border border-gray-50 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <Link to="/recipes" className="px-8 py-3.5 bg-chefie-dark text-white rounded-2xl text-xs font-black tracking-widest hover:bg-chefie-yellow transition-all whitespace-nowrap shadow-lg shadow-gray-200">
                    KEŞFET
                </Link>
                {categories.filter(cat =>
                    ['Kahvaltılık', 'Aperatifler', 'Çorba', 'Hızlı Yemekler', 'Makarna', 'Salata'].some(keyword => cat.name.includes(keyword))
                ).map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/recipes#category-${cat.id}`}
                        className="px-6 py-3.5 bg-white border border-gray-100 text-gray-500 rounded-2xl text-xs font-bold hover:border-chefie-yellow hover:text-chefie-yellow hover:shadow-lg hover:shadow-yellow-100 transition-all whitespace-nowrap"
                    >
                        {cat.name.toUpperCase()}
                    </Link>
                ))}
            </section>

            {/* Haftanın Yıldızları Section */}
            <section className="relative group">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-chefie-dark flex items-center gap-3">
                        Haftanın Yıldızları <Utensils className="text-chefie-yellow" />
                    </h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 bg-white border border-gray-50 rounded-2xl text-gray-400 hover:text-chefie-dark hover:bg-chefie-cream transition-all shadow-xl shadow-gray-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 bg-white border border-gray-50 rounded-2xl text-gray-400 hover:text-chefie-dark hover:bg-chefie-cream transition-all shadow-xl shadow-gray-100"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-12 -mx-4 px-4 scroll-smooth scrollbar-hide snap-x pt-32"
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
                                className="min-w-[260px] md:min-w-[270px] lg:min-w-[280px] snap-start bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-chefie-yellow/10 transition-transform duration-300 relative group/card border border-gray-50 cursor-pointer text-center"
                            >
                                {/* Circular Floating Image */}
                                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full p-2 bg-white shadow-2xl z-10 transition-transform duration-300 ease-out group-hover/card:scale-105">
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                        {recipe.image_url ? (
                                            <img src={recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:rotate-3" />
                                        ) : (
                                            <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                                                <Utensils className="w-10 h-10 text-chefie-yellow/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-28 pb-6 px-4 flex flex-col h-full">
                                    <h3 className="text-xl font-black text-chefie-dark mb-2 line-clamp-1 group-hover/card:text-chefie-yellow transition-colors px-2">{recipe.title}</h3>

                                    <div className="flex items-center justify-center gap-1.5 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= Math.round(recipe.avg_rating || 0) ? 'text-chefie-yellow fill-current' : 'text-gray-200'}`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-400 font-bold ml-1">({recipe.comment_count || 0} Yorum)</span>
                                    </div>

                                    <div className="mt-auto grid grid-cols-3 gap-1 border-t border-gray-50 pt-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <Users className="w-5 h-5 text-gray-300" />
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.servings || 2} Kişilik</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-r border-gray-50 px-1">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-chefie-yellow" />
                                                <span className="text-xs font-bold text-gray-600">Hzr.</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.prep_time || 15} dk</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1">
                                                <Utensils className="w-4 h-4 text-chefie-yellow" />
                                                <span className="text-xs font-bold text-gray-600">Piş.</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{recipe.cook_time || 20} dk</span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 py-3 bg-green-50 text-green-600 font-bold rounded-xl text-sm hover:bg-chefie-dark hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-gray-200">
                                        Tarifi Gör
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
                        MUTFAĞINIZIN SINIRLARINI ZORLAYIN
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-chefie-dark mb-6">
                        Kategorileri Keşfedin
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
                                className={`flex flex-col items-center p-8 rounded-[2.5rem] ${bgColors[idx % 6]} hover:scale-105 transition-all duration-300 border border-transparent hover:border-white shadow-xl shadow-transparent hover:shadow-gray-100 group`}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                                    <Utensils className={`w-8 h-8 ${iconColors[idx % 6]}`} />
                                </div>
                                <span className={`text-sm font-black text-center ${textColors[idx % 6]}`}>{cat.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">İncele</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Haftanın Şefleri Section */}
            <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden relative">
                <div className="absolute top-1/2 -translate-y-1/2 right-10 md:right-20 opacity-[0.40] pointer-events-none">
                    <img src="/images/faint-chef-hat.jpg" alt="Chef Illustration" className="w-[30rem] h-[30rem] object-contain mix-blend-darken" />
                </div>

                <div className="flex flex-col md:flex-row items-end justify-between mb-16 relative z-10">
                    <div className="max-w-xl text-center md:text-left">
                        <span className="text-chefie-yellow text-xs font-black tracking-widest uppercase mb-4 block">USTALARIN MUTFAĞI</span>
                        <h2 className="text-4xl md:text-5xl font-black text-chefie-dark mb-4">Haftanın Şefleri</h2>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed">Topluluğumuza en çok katkı sağlayan ve ilham veren şeflerimizle tanışın.</p>
                    </div>
                    <div className="flex gap-4 mt-8 md:mt-0">
                        <button onClick={() => scrollChefs('left')} className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2x flex items-center justify-center text-gray-400 hover:text-chefie-yellow transition-all shadow-lg shadow-gray-100 rounded-2xl"><ChevronLeft size={24} /></button>
                        <button onClick={() => scrollChefs('right')} className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2x flex items-center justify-center text-gray-400 hover:text-chefie-yellow transition-all shadow-lg shadow-gray-100 rounded-2xl"><ChevronRight size={24} /></button>
                    </div>
                </div>

                <div
                    ref={chefsScrollRef}
                    className="flex gap-10 overflow-x-auto scrollbar-hide pb-4 snap-x relative z-10 -mx-4 px-4"
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
                                        <img src={chef.profile_image.startsWith('http') ? chef.profile_image : `${API_BASE}${chef.profile_image}`} alt={chef.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-chefie-cream flex items-center justify-center font-black text-3xl text-chefie-dark">{(chef.full_name || chef.username).charAt(0)}</div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-chefie-yellow text-white w-10 h-10 rounded-full border-4 border-white flex items-center justify-center font-black text-xs shadow-lg">#{idx + 1}</div>
                            </div>
                            <h4 className="text-lg font-black text-chefie-dark group-hover:text-chefie-yellow transition-colors">{chef.full_name || chef.username}</h4>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{chef.recipe_count} TARİF</span>
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
                    <h2 className="text-3xl font-black text-chefie-dark flex items-center gap-3">
                        Mutfak Sırları <Play className="w-5 h-5 text-chefie-yellow fill-current" />
                    </h2>
                    <Link to="/blog" className="px-6 py-3 bg-white border border-gray-100 text-gray-400 font-bold text-xs rounded-xl hover:text-chefie-yellow hover:border-chefie-yellow transition-all shadow-sm">TÜMÜNÜ OKU</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.slice(0, 3).map((post, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-xl shadow-gray-100 group cursor-pointer"
                            onClick={() => navigate(`/blog/${post.id}`)}
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-5 left-5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black">{post.category}</div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-black text-chefie-dark mb-4 leading-tight group-hover:text-chefie-yellow transition-colors">{post.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{post.author}</span>
                                    <div className="flex items-center gap-1 text-chefie-yellow">
                                        <span className="text-[10px] font-black">OKU</span>
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
                    <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">Mutfakta Senin İçin <br /> Bir Yer Ayırdık.</h2>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto">Hemen ücretsiz kayıt ol, kendi tariflerini paylaş ve binlerce şeflik topluluğumuza katıl.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/admin/login" className="px-12 py-5 bg-chefie-yellow text-chefie-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-15px_rgba(255,193,7,0.4)]">HEMEN KATIL</Link>
                        <Link to="/recipes" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">TARİFLERİ GEZ</Link>
                    </div>
                </div>
            </section>

            {/* Recent Reviews / User Feedback Section */}
            <section>
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black text-chefie-dark flex items-center gap-3">
                        Son Yorumlar <MessageSquare className="w-5 h-5 text-blue-500" />
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {publicStats?.recentComments?.length > 0 ? publicStats.recentComments.slice(0, 4).map((comment, idx) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    {comment.profile_image ? (
                                        <img src={comment.profile_image.startsWith('http') ? comment.profile_image : `${API_BASE}${comment.profile_image}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-chefie-cream flex items-center justify-center font-bold text-chefie-dark text-xs">{(comment.full_name || comment.username).charAt(0)}</div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-chefie-dark line-clamp-1">{comment.full_name || comment.username}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter line-clamp-1">{comment.recipe_title}</span>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= (comment.rating || 5) ? 'text-chefie-yellow fill-current' : 'text-gray-200'} `} />)}
                            </div>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed italic line-clamp-3">"{comment.content}"</p>
                            <span className="mt-auto pt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>
                        </motion.div>
                    )) : Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm"></div>
                    ))}
                </div>
            </section>

            {/* Featured Banner */}
            <section className="bg-chefie-yellow rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-xl shadow-yellow-100/50">
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 max-w-lg space-y-6 text-center md:text-left">
                    <span className="px-4 py-1.5 bg-chefie-dark text-white rounded-full text-[10px] font-black tracking-widest uppercase">GÜNÜN ÖZELİ</span>
                    <h2 className="text-4xl md:text-6xl font-black text-chefie-dark leading-tight">Şefin Tavsiyesi: Akdeniz Esintisi</h2>
                    <p className="text-chefie-dark/70 text-lg font-medium leading-relaxed">
                        Haftanın en çok beğenilen tarifi ile akşam yemeğinizi bir ziyafete dönüştürün. Üstelik sadece 45 dakikada!
                    </p>
                    <Link to="/recipes" className="inline-flex items-center gap-2 px-10 py-5 bg-chefie-dark text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-900/10">
                        TARİFİ İNCELE <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>
                <div className="flex-1 w-full flex justify-center md:justify-end">
                    <motion.div
                        whileHover={{ rotate: 8, scale: 1.05 }}
                        className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-white/30 shadow-2xl rotate-3"
                    >
                        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" alt="Featured" className="w-full h-full object-cover" />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
