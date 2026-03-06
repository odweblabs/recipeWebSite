import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Mic, ChevronLeft, Utensils, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const popularSearches = ['tatlı', 'çorba', 'meze', 'revani', 'sütlü tatlılar', 'makarna'];
const quickAccess = [
    { title: 'Günün menüsü', icon: <Utensils className="w-4 h-4 text-gray-500" />, query: 'günün menüsü' },
    { title: 'Pratik ana yemekler', icon: <Flame className="w-4 h-4 text-orange-500" />, query: 'pratik' }
];
const ingredients = [
    { name: 'tavuk eti', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&h=150&fit=crop' },
    { name: 'bakla', image: 'https://images.unsplash.com/photo-1599577180579-246e7f2231ff?w=150&h=150&fit=crop' },
    { name: 'pirinç', image: 'https://images.unsplash.com/photo-1579585641193-41bb38038d17?w=150&h=150&fit=crop' },
    { name: 'mor lahana', image: 'https://images.unsplash.com/photo-1506544777-64cfbea6bdcf?w=150&h=150&fit=crop' }
];

const SearchBar = ({ initialQuery = '', className = "", placeholder = "Mükemmel tarifi keşfet...", onSearch }) => {
    const [query, setQuery] = useState(initialQuery);
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const modalInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        const stored = localStorage.getItem('chefie_recent_searches');
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                setRecentSearches([]);
            }
        }
    }, [isOpen]);

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

    return (
        <div className={`relative ${className}`}>
            {/* Main Input (Closed State) */}
            <div className="relative group min-w-full">
                <div className="absolute inset-0 bg-chefie-yellow/10 blur-xl group-focus-within:bg-chefie-yellow/20 transition-all rounded-[2rem]"></div>
                <div className="relative" onClick={() => setIsOpen(true)}>
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
                                        placeholder="981.993 tarif içinde ara"
                                        className="w-full pl-10 pr-10 py-3 bg-white border-0 rounded-full text-sm font-medium text-chefie-dark focus:ring-2 focus:ring-white/50 outline-none"
                                    />
                                    {query && (
                                        <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-chefie-dark">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors">
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
                                    <div className="relative mb-6">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Malzeme Ara"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-chefie-yellow/20 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 pb-6">
                                        {ingredients.map((ing, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => handleSearch(ing.name)}>
                                                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:border-chefie-yellow transition-colors">
                                                    <img src={ing.image} alt={ing.name} className="w-full h-full object-cover p-1 rounded-2xl" />
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center border border-white text-gray-500 font-bold text-xs"><Plus size={10} /></div>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-gray-600 text-center leading-tight">{ing.name}</span>
                                            </div>
                                        ))}
                                    </div>
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
