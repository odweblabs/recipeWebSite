import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Mic, ChevronLeft, Utensils, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE from '../utils/api';

const popularSearches = ['tatlı', 'çorba', 'meze', 'revani', 'sütlü tatlılar', 'makarna'];
const quickAccess = [
    { title: 'Günün menüsü', icon: <Utensils className="w-4 h-4 text-gray-500" />, query: 'günün menüsü' },
    { title: 'Pratik ana yemekler', icon: <Flame className="w-4 h-4 text-orange-500" />, query: 'pratik' }
];
const ingredients = [
    // Proteinler
    { name: 'tavuk eti', emoji: '🍗', category: 'protein' },
    { name: 'kıyma', emoji: '🥩', category: 'protein' },
    { name: 'dana eti', emoji: '🥩', category: 'protein' },
    { name: 'balık', emoji: '🐟', category: 'protein' },
    { name: 'yumurta', emoji: '🥚', category: 'protein' },
    { name: 'karides', emoji: '🦐', category: 'protein' },
    // Sebzeler
    { name: 'patates', emoji: '🥔', category: 'sebze' },
    { name: 'soğan', emoji: '🧅', category: 'sebze' },
    { name: 'domates', emoji: '🍅', category: 'sebze' },
    { name: 'biber', emoji: '🌶️', category: 'sebze' },
    { name: 'havuç', emoji: '🥕', category: 'sebze' },
    { name: 'kabak', emoji: '🥒', category: 'sebze' },
    { name: 'patlıcan', emoji: '🍆', category: 'sebze' },
    { name: 'ıspanak', emoji: '🥬', category: 'sebze' },
    { name: 'sarımsak', emoji: '🧄', category: 'sebze' },
    { name: 'bezelye', emoji: '🟢', category: 'sebze' },
    { name: 'mantar', emoji: '🍄', category: 'sebze' },
    { name: 'brokoli', emoji: '🥦', category: 'sebze' },
    { name: 'mısır', emoji: '🌽', category: 'sebze' },
    { name: 'fasulye', emoji: '🫘', category: 'sebze' },
    { name: 'lahana', emoji: '🥬', category: 'sebze' },
    { name: 'pırasa', emoji: '🧅', category: 'sebze' },
    { name: 'enginar', emoji: '🌿', category: 'sebze' },
    { name: 'bakla', emoji: '🫛', category: 'sebze' },
    // Tahıl & Makarna
    { name: 'pirinç', emoji: '🍚', category: 'tahıl' },
    { name: 'makarna', emoji: '🍝', category: 'tahıl' },
    { name: 'bulgur', emoji: '🌾', category: 'tahıl' },
    { name: 'un', emoji: '🌾', category: 'tahıl' },
    { name: 'ekmek', emoji: '🍞', category: 'tahıl' },
    { name: 'nohut', emoji: '🟤', category: 'tahıl' },
    { name: 'mercimek', emoji: '🟠', category: 'tahıl' },
    // Süt Ürünleri
    { name: 'süt', emoji: '🥛', category: 'süt' },
    { name: 'peynir', emoji: '🧀', category: 'süt' },
    { name: 'yoğurt', emoji: '🥣', category: 'süt' },
    { name: 'tereyağı', emoji: '🧈', category: 'süt' },
    { name: 'krema', emoji: '🍶', category: 'süt' },
    // Baharat & Diğer
    { name: 'zeytinyağı', emoji: '🫒', category: 'baharat' },
    { name: 'limon', emoji: '🍋', category: 'baharat' },
    { name: 'tuz', emoji: '🧂', category: 'baharat' },
    { name: 'şeker', emoji: '🍬', category: 'baharat' },
    { name: 'salça', emoji: '🥫', category: 'baharat' },
    { name: 'karabiber', emoji: '⚫', category: 'baharat' },
    { name: 'pul biber', emoji: '🌶️', category: 'baharat' },
    { name: 'nane', emoji: '🌿', category: 'baharat' },
    { name: 'maydanoz', emoji: '🌿', category: 'baharat' },
    { name: 'dereotu', emoji: '🌿', category: 'baharat' },
];

const SearchBar = ({ initialQuery = '', className = "", placeholder = "Mükemmel tarifi keşfet...", onSearch, iconOnlyOnMobile = false, onOpenChange }) => {
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
            alert("Üzgünüz, tarayıcınız sesli aramayı desteklemiyor.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
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
        { key: 'all', label: 'Tümü' },
        { key: 'protein', label: 'Protein' },
        { key: 'sebze', label: 'Sebze' },
        { key: 'tahıl', label: 'Tahıl' },
        { key: 'süt', label: 'Süt Ürünleri' },
        { key: 'baharat', label: 'Baharat' },
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
                            placeholder={placeholder}
                            value={query}
                            readOnly
                            className="w-full pl-14 pr-6 py-4 bg-white border-0 rounded-2xl shadow-xl shadow-gray-100/50 text-gray-700 font-medium placeholder-gray-400 cursor-pointer outline-none cursor-text"
                        />
                    </div>

                    {/* Mobile View (Icon Button) */}
                    {iconOnlyOnMobile && (
                        <div className="md:hidden h-[48px] w-[48px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/50 flex items-center justify-center text-gray-400 group-hover:text-chefie-yellow group-hover:border-chefie-yellow/30 transition-all">
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
                            className="fixed md:absolute inset-0 md:inset-auto md:top-0 md:left-0 md:right-0 w-full md:w-[500px] h-full md:h-auto md:max-h-[85vh] bg-white z-[101] md:rounded-[2rem] md:shadow-2xl overflow-hidden flex flex-col pt-0 md:pt-0"
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
                                        placeholder={recipeCount > 0 ? `${recipeCount} tarif içinde ara` : "Tariflerde ara..."}
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
                                    title="Sesli Arama"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto w-full scrollbar-hide bg-gray-50/50">

                                {/* Popüler Aramalar */}
                                <div className="p-6 border-b border-gray-100 bg-white">
                                    <h3 className="text-sm font-black text-chefie-dark flex items-center gap-2 mb-4">
                                        <Flame className="w-4 h-4 text-orange-500" /> Popüler Aramalar
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map(item => (
                                            <button
                                                key={item}
                                                onClick={() => handleSearch(item)}
                                                className="px-4 py-2 bg-gray-50 border border-gray-100 hover:bg-chefie-yellow/20 hover:text-chefie-dark hover:border-chefie-yellow/50 text-gray-700 text-xs font-bold rounded-full transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Son Aradıklarım */}
                                {recentSearches.length > 0 && (
                                    <div className="p-6 border-b border-gray-100 bg-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-black text-chefie-dark flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-400" /> Son Aradıklarım
                                            </h3>
                                            <button onClick={clearRecent} className="text-xs font-bold text-gray-400 hover:text-chefie-dark transition-colors">Tümünü Gör</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map(item => (
                                                <button
                                                    key={item}
                                                    onClick={() => handleSearch(item)}
                                                    className="px-4 py-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-full transition-colors flex items-center gap-2"
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Hızlı Erişim */}
                                <div className="p-6 border-b border-gray-100 bg-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-chefie-dark flex items-center gap-2">
                                            <Search className="w-4 h-4 text-orange-400" /> Hızlı Erişim
                                        </h3>
                                        <button className="text-xs font-bold text-gray-400 hover:text-chefie-dark transition-colors">Tümünü Gör</button>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6">
                                        {quickAccess.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSearch(item.query)}
                                                className="whitespace-nowrap px-4 py-3 bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-full flex items-center gap-3 transition-colors"
                                            >
                                                <div className="p-1 bg-white rounded-full shadow-sm">{item.icon}</div>
                                                <span className="text-xs font-black text-gray-700">{item.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Malzemeye Göre Tarif Ara */}
                                <div className="p-6 bg-white">
                                    <h3 className="text-sm font-black text-chefie-dark flex items-center gap-2 mb-4">
                                        <Utensils className="w-4 h-4 text-orange-400" /> Malzemeye Göre Tarif Ara
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
                                                Tarif Ara ({selectedIngredients.length})
                                            </button>
                                        </div>
                                    )}

                                    {/* Ingredient Filter */}
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Malzeme ara..."
                                            value={ingredientFilter}
                                            onChange={(e) => setIngredientFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-chefie-yellow/20 outline-none"
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
                                                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
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
                                                            : 'bg-white border-gray-100 shadow-sm group-hover:border-chefie-yellow/50 group-hover:shadow-md'
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
                                                    <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-chefie-dark' : 'text-gray-500'
                                                        }`}>{ing.name}</span>
                                                </div>
                                            );
                                        })}
                                        {filteredIngredients.length === 0 && (
                                            <div className="col-span-full py-6 text-center text-gray-400 text-xs font-bold">
                                                Malzeme bulunamadı.
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Search Button */}
                                    {selectedIngredients.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <button
                                                onClick={handleIngredientSearch}
                                                className="w-full py-3.5 bg-chefie-yellow text-white font-bold text-sm rounded-2xl shadow-lg shadow-chefie-yellow/30 hover:shadow-xl hover:shadow-chefie-yellow/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <Search className="w-4 h-4" />
                                                {selectedIngredients.length} malzeme ile tarif ara
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
