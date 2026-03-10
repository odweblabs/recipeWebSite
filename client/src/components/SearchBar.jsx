import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Mic, ChevronLeft, Utensils, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE from '../utils/api';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ initialQuery = '', className = "", placeholder = null, onSearch, iconOnlyOnMobile = false, onOpenChange }) => {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState(initialQuery);
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [recipeCount, setRecipeCount] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientFilter, setIngredientFilter] = useState('');
    const [activeIngredientCategory, setActiveIngredientCategory] = useState('all');
    const inputRef = useRef(null);
    const modalInputRef = useRef(null);
    const navigate = useNavigate();

    const currentPlaceholder = placeholder || t('search.placeholder');

    const popularSearches = [
        t('search.popular_items.dessert'),
        t('search.popular_items.soup'),
        t('search.popular_items.appetizer'),
        t('search.popular_items.revani'),
        t('search.popular_items.milky_desserts'),
        t('search.popular_items.pasta')
    ];

    const quickAccess = [
        { title: t('search.quick_access_items.daily_menu'), icon: <Utensils className="w-4 h-4 text-gray-500" />, query: t('search.quick_access_items.daily_menu').toLowerCase() },
        { title: t('search.quick_access_items.practical_main'), icon: <Flame className="w-4 h-4 text-orange-500" />, query: t('search.quick_access_items.practical_main').toLowerCase() }
    ];

    const ingredients = [
        // Proteinler
        { name: t('search.by_ingredient.items.chicken'), emoji: '🍗', category: 'protein' },
        { name: t('search.by_ingredient.items.minced'), emoji: '🥩', category: 'protein' },
        { name: t('search.by_ingredient.items.beef'), emoji: '🥩', category: 'protein' },
        { name: t('search.by_ingredient.items.fish'), emoji: '🐟', category: 'protein' },
        { name: t('search.by_ingredient.items.egg'), emoji: '🥚', category: 'protein' },
        { name: t('search.by_ingredient.items.shrimp'), emoji: '🦐', category: 'protein' },
        // Sebzeler
        { name: t('search.by_ingredient.items.potato'), emoji: '🥔', category: 'vegetable' },
        { name: t('search.by_ingredient.items.onion'), emoji: '🧅', category: 'vegetable' },
        { name: t('search.by_ingredient.items.tomato'), emoji: '🍅', category: 'vegetable' },
        { name: t('search.by_ingredient.items.pepper'), emoji: '🌶️', category: 'vegetable' },
        { name: t('search.by_ingredient.items.carrot'), emoji: '🥕', category: 'vegetable' },
        { name: t('search.by_ingredient.items.zucchini'), emoji: '🥒', category: 'vegetable' },
        { name: t('search.by_ingredient.items.eggplant'), emoji: '🍆', category: 'vegetable' },
        { name: t('search.by_ingredient.items.spinach'), emoji: '🥬', category: 'vegetable' },
        { name: t('search.by_ingredient.items.garlic'), emoji: '🧄', category: 'vegetable' },
        { name: t('search.by_ingredient.items.peas'), emoji: '🟢', category: 'vegetable' },
        { name: t('search.by_ingredient.items.mushroom'), emoji: '🍄', category: 'vegetable' },
        { name: t('search.by_ingredient.items.broccoli'), emoji: '🥦', category: 'vegetable' },
        { name: t('search.by_ingredient.items.corn'), emoji: '🌽', category: 'vegetable' },
        { name: t('search.by_ingredient.items.beans'), emoji: '🫘', category: 'vegetable' },
        { name: t('search.by_ingredient.items.cabbage'), emoji: '🥬', category: 'vegetable' },
        { name: t('search.by_ingredient.items.leek'), emoji: '🧅', category: 'vegetable' },
        { name: t('search.by_ingredient.items.artichoke'), emoji: '🌿', category: 'vegetable' },
        { name: t('search.by_ingredient.items.broad_beans'), emoji: '🫛', category: 'vegetable' },
        // Tahıl & Makarna
        { name: t('search.by_ingredient.items.rice'), emoji: '🍚', category: 'grain' },
        { name: t('search.by_ingredient.items.pasta'), emoji: '🍝', category: 'grain' },
        { name: t('search.by_ingredient.items.bulgur'), emoji: '🌾', category: 'grain' },
        { name: t('search.by_ingredient.items.flour'), emoji: '🌾', category: 'grain' },
        { name: t('search.by_ingredient.items.bread'), emoji: '🍞', category: 'grain' },
        { name: t('search.by_ingredient.items.chickpeas'), emoji: '🟤', category: 'grain' },
        { name: t('search.by_ingredient.items.lentils'), emoji: '🟠', category: 'grain' },
        // Süt Ürünleri
        { name: t('search.by_ingredient.items.milk'), emoji: '🥛', category: 'dairy' },
        { name: t('search.by_ingredient.items.cheese'), emoji: '🧀', category: 'dairy' },
        { name: t('search.by_ingredient.items.yogurt'), emoji: '🥣', category: 'dairy' },
        { name: t('search.by_ingredient.items.butter'), emoji: '🧈', category: 'dairy' },
        { name: t('search.by_ingredient.items.cream'), emoji: '🍶', category: 'dairy' },
        // Baharat & Diğer
        { name: t('search.by_ingredient.items.olive_oil'), emoji: '🫒', category: 'spice' },
        { name: t('search.by_ingredient.items.lemon'), emoji: '🍋', category: 'spice' },
        { name: t('search.by_ingredient.items.salt'), emoji: '🧂', category: 'spice' },
        { name: t('search.by_ingredient.items.sugar'), emoji: '🍬', category: 'spice' },
        { name: t('search.by_ingredient.items.tomato_paste'), emoji: '🥫', category: 'spice' },
        { name: t('search.by_ingredient.items.black_pepper'), emoji: '⚫', category: 'spice' },
        { name: t('search.by_ingredient.items.chili_flakes'), emoji: '🌶️', category: 'spice' },
        { name: t('search.by_ingredient.items.mint'), emoji: '🌿', category: 'spice' },
        { name: t('search.by_ingredient.items.parsley'), emoji: '🌿', category: 'spice' },
        { name: t('search.by_ingredient.items.dill'), emoji: '🌿', category: 'spice' },
    ];

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/recipes/count`);
                if (res.data && typeof res.data.count !== 'undefined') {
                    setRecipeCount(res.data.count);
                }
            } catch (err) {
                console.error("Failed to fetch recipe count", err);
            }
        };
        fetchCount();
    }, []);

    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
        const stored = localStorage.getItem('chefie_recent_searches');
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                setRecentSearches([]);
            }
        }
    }, [isOpen, onOpenChange]);

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(t('search.voice_error'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setTimeout(() => {
                handleSearch(transcript);
            }, 500); // Auto search after a brief delay
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const handleSearch = (searchQuery) => {
        if (!searchQuery?.trim()) return;

        // Save to recent
        const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('chefie_recent_searches', JSON.stringify(newRecent));
        setRecentSearches(newRecent);

        setIsOpen(false);
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            navigate(`/recipes?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(query);
        }
    };

    const clearRecent = () => {
        localStorage.removeItem('chefie_recent_searches');
        setRecentSearches([]);
    };

    const handleIngredientToggle = (ingredientName) => {
        setSelectedIngredients(prev => {
            if (prev.includes(ingredientName)) {
                return prev.filter(i => i !== ingredientName);
            } else {
                return [...prev, ingredientName];
            }
        });
    };

    const handleIngredientSearch = () => {
        if (selectedIngredients.length === 0) return;
        const searchQuery = selectedIngredients.join(' ');
        handleSearch(searchQuery);
        setSelectedIngredients([]);
    };

    const filteredIngredients = ingredients.filter(ing => {
        const matchesFilter = ing.name.toLowerCase().includes(ingredientFilter.toLowerCase());
        const matchesCategory = activeIngredientCategory === 'all' || ing.category === activeIngredientCategory;
        return matchesFilter && matchesCategory;
    });

    const ingredientCategories = [
        { key: 'all', label: t('search.by_ingredient.categories.all') },
        { key: 'protein', label: t('search.by_ingredient.categories.protein') },
        { key: 'vegetable', label: t('search.by_ingredient.categories.vegetable') },
        { key: 'grain', label: t('search.by_ingredient.categories.grain') },
        { key: 'dairy', label: t('search.by_ingredient.categories.dairy') },
        { key: 'spice', label: t('search.by_ingredient.categories.spice') },
    ];

    return (
        <div className={`relative ${className}`}>
            {/* Main Input (Closed State) */}
            <div className={`relative group ${iconOnlyOnMobile ? 'w-auto flex items-center justify-start' : 'min-w-full'}`}>
                <div className={`absolute inset-0 bg-chefie-yellow/10 blur-xl group-focus-within:bg-chefie-yellow/20 transition-all rounded-[2rem] ${iconOnlyOnMobile ? 'hidden md:block' : ''}`}></div>

                <div
                    className={`relative cursor-pointer ${iconOnlyOnMobile ? 'md:w-full flex items-center justify-center md:justify-start' : ''}`}
                    onClick={() => setIsOpen(true)}
                >
                    {/* Desktop View / Default Full Width */}
                    <div className={`${iconOnlyOnMobile ? 'hidden md:block w-full' : 'w-full block'}`}>
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-hover:text-chefie-yellow group-hover:scale-110 transition-all pointer-events-none" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={currentPlaceholder}
                            value={query}
                            readOnly
                            className="w-full pl-14 pr-6 py-4 bg-chefie-card border-0 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none text-chefie-text font-medium placeholder-gray-400 cursor-pointer outline-none cursor-text"
                        />
                    </div>

                    {/* Mobile View (Icon Button) */}
                    {iconOnlyOnMobile && (
                        <div className="md:hidden h-[48px] w-[48px] bg-chefie-card border border-chefie-border rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none text-gray-400 group-hover:text-chefie-yellow group-hover:border-chefie-yellow/30 transition-all flex items-center justify-center">
                            <Search className="h-[20px] w-[20px]" />
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Modal / Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for Desktop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Backdrop overlay for desktop to capture outside clicks */}
                        <div className="hidden md:block fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>

                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed md:absolute inset-0 md:inset-auto md:top-0 md:left-0 md:right-0 w-full md:w-[500px] h-full md:h-auto md:max-h-[85vh] bg-chefie-card z-[101] md:rounded-[2rem] md:shadow-2xl overflow-hidden flex flex-col pt-0 md:pt-0"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center gap-3 p-4 bg-chefie-yellow shadow-sm md:rounded-t-[2rem]">
                                <button onClick={() => setIsOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        autoFocus
                                        ref={modalInputRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={recipeCount > 0 ? `${recipeCount} ${t('search.searching_in')}` : t('search.search_generic')}
                                        className="w-full pl-10 pr-10 py-3 bg-white border-0 rounded-full text-sm font-medium text-chefie-dark focus:ring-2 focus:ring-white/50 outline-none"
                                    />
                                    {query && (
                                        <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-chefie-dark">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleVoiceSearch}
                                    className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-white hover:bg-white/10'}`}
                                    title={t('search.voice_error')}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto w-full scrollbar-hide bg-chefie-cream/50">

                                {/* Popüler Aramalar */}
                                <div className="p-6 border-b border-chefie-border bg-chefie-card">
                                    <h3 className="text-sm font-black text-chefie-text flex items-center gap-2 mb-4">
                                        <Flame className="w-4 h-4 text-orange-500" /> {t('search.popular')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map(item => (
                                            <button
                                                key={item}
                                                onClick={() => handleSearch(item)}
                                                className="px-4 py-2 bg-chefie-cream border border-chefie-border hover:bg-chefie-yellow/20 hover:text-chefie-text hover:border-chefie-yellow/50 text-chefie-text text-xs font-bold rounded-full transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Son Aradıklarım */}
                                {recentSearches.length > 0 && (
                                    <div className="p-6 border-b border-chefie-border bg-chefie-card">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-black text-chefie-text flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-400" /> {t('search.recent')}
                                            </h3>
                                            <button onClick={clearRecent} className="text-xs font-bold text-gray-400 hover:text-chefie-text transition-colors">{t('search.clear_recent')}</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => handleSearch(item)}
                                                    className="px-4 py-2 bg-chefie-cream border border-chefie-border hover:bg-chefie-cream/80 text-chefie-text text-xs font-bold rounded-full transition-colors flex items-center gap-2"
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Hızlı Erişim */}
                                <div className="p-6 border-b border-chefie-border bg-chefie-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-chefie-text flex items-center gap-2">
                                            <Search className="w-4 h-4 text-orange-400" /> {t('search.quick_access')}
                                        </h3>
                                        <button className="text-xs font-bold text-gray-400 hover:text-chefie-text transition-colors">{t('search.clear_recent')}</button>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6">
                                        {quickAccess.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSearch(item.query)}
                                                className="whitespace-nowrap px-4 py-3 bg-chefie-cream border border-chefie-border hover:border-chefie-yellow rounded-full flex items-center gap-3 transition-colors"
                                            >
                                                <div className="p-1 bg-chefie-card rounded-full shadow-sm">{item.icon}</div>
                                                <span className="text-xs font-black text-chefie-text">{item.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Malzemeye Göre Tarif Ara */}
                                <div className="p-6 bg-chefie-card">
                                    <h3 className="text-sm font-black text-chefie-text flex items-center gap-2 mb-4">
                                        <Utensils className="w-4 h-4 text-orange-400" /> {t('search.by_ingredient.title')}
                                    </h3>

                                    {/* Selected Ingredients Chips */}
                                    {selectedIngredients.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedIngredients.map(name => {
                                                const ing = ingredients.find(i => i.name === name);
                                                return (
                                                    <button
                                                        key={name}
                                                        onClick={() => handleIngredientToggle(name)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-chefie-yellow/20 text-chefie-dark border border-chefie-yellow/40 rounded-full text-xs font-bold transition-colors hover:bg-chefie-yellow/30"
                                                    >
                                                        <span>{ing?.emoji}</span>
                                                        <span>{name}</span>
                                                        <X className="w-3 h-3 ml-0.5" />
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={handleIngredientSearch}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-chefie-yellow text-white rounded-full text-xs font-bold transition-all hover:bg-chefie-yellow/90 shadow-sm"
                                            >
                                                <Search className="w-3 h-3" />
                                                {t('search.by_ingredient.search_button')} ({selectedIngredients.length})
                                            </button>
                                        </div>
                                    )}

                                    {/* Ingredient Filter */}
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('search.by_ingredient.placeholder')}
                                            value={ingredientFilter}
                                            onChange={(e) => setIngredientFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-chefie-cream border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-chefie-yellow/20 outline-none text-chefie-text"
                                        />
                                    </div>

                                    {/* Category Tabs */}
                                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4 -mx-6 px-6">
                                        {ingredientCategories.map(cat => (
                                            <button
                                                key={cat.key}
                                                onClick={() => setActiveIngredientCategory(cat.key)}
                                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors border ${activeIngredientCategory === cat.key
                                                    ? 'bg-chefie-yellow text-white border-chefie-yellow shadow-sm'
                                                    : 'bg-chefie-cream text-gray-600 border-chefie-border hover:bg-chefie-cream/80'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Ingredient Grid */}
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 pb-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                                        {filteredIngredients.map((ing, idx) => {
                                            const isSelected = selectedIngredients.includes(ing.name);
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex flex-col items-center gap-1.5 cursor-pointer group`}
                                                    onClick={() => handleIngredientToggle(ing.name)}
                                                >
                                                    <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all border-2 ${isSelected
                                                        ? 'bg-chefie-yellow/20 border-chefie-yellow shadow-md scale-105'
                                                        : 'bg-chefie-card border-chefie-border shadow-sm group-hover:border-chefie-yellow/50 group-hover:shadow-md'
                                                        }`}>
                                                        {ing.emoji}
                                                        {isSelected ? (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-chefie-yellow rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                                <span className="text-white text-[10px] font-black">✓</span>
                                                            </div>
                                                        ) : (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-gray-400">
                                                                <Plus size={10} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-chefie-text' : 'text-gray-500'
                                                        }`}>{ing.name}</span>
                                                </div>
                                            );
                                        })}
                                        {filteredIngredients.length === 0 && (
                                            <div className="col-span-full py-6 text-center text-gray-400 text-xs font-bold">
                                                {t('search.by_ingredient.not_found')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Search Button */}
                                    {selectedIngredients.length > 0 && (
                                        <div className="pt-4 border-t border-chefie-border">
                                            <button
                                                onClick={handleIngredientSearch}
                                                className="w-full py-3.5 bg-chefie-yellow text-white font-bold text-sm rounded-2xl shadow-lg shadow-chefie-yellow/30 hover:shadow-xl hover:shadow-chefie-yellow/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <Search className="w-4 h-4" />
                                                {selectedIngredients.length} {t('search.by_ingredient.with_ingredients')}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Spacer for mobile */}
                                <div className="h-6"></div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
