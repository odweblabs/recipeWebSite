import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Trash2, Check, X, ShoppingCart, Edit3, GripVertical, ListChecks, Sparkles, Package, ArrowRight } from 'lucide-react';

const LISTS_STORAGE_KEY = 'chefie_lists_v1';

function loadLists() {
    try {
        const raw = localStorage.getItem(LISTS_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveLists(lists) {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
}

const Lists = () => {
    const [lists, setLists] = useState(() => loadLists());
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [openListId, setOpenListId] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [editingListId, setEditingListId] = useState(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        saveLists(lists);
    }, [lists]);

    const createList = () => {
        const name = newListName.trim();
        if (!name) return;
        const newList = {
            id: `${Date.now()}`,
            name,
            items: [],
            createdAt: new Date().toISOString(),
        };
        setLists(prev => [newList, ...prev]);
        setNewListName('');
        setIsCreateOpen(false);
        setOpenListId(newList.id);
    };

    const deleteList = (id) => {
        if (!window.confirm('Bu listeyi silmek istediğinize emin misiniz?')) return;
        setLists(prev => prev.filter(l => l.id !== id));
        if (openListId === id) setOpenListId(null);
    };

    const renameList = (id) => {
        const name = editingName.trim();
        if (!name) return;
        setLists(prev => prev.map(l => l.id === id ? { ...l, name } : l));
        setEditingListId(null);
        setEditingName('');
    };

    const addItem = (listId) => {
        const text = newItem.trim();
        if (!text) return;
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: [...l.items, { id: `${Date.now()}`, text, checked: false }]
            };
        }));
        setNewItem('');
    };

    const toggleItem = (listId, itemId) => {
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: l.items.map(item =>
                    item.id === itemId ? { ...item, checked: !item.checked } : item
                )
            };
        }));
    };

    const deleteItem = (listId, itemId) => {
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: l.items.filter(item => item.id !== itemId)
            };
        }));
    };

    const clearChecked = (listId) => {
        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: l.items.filter(item => !item.checked)
            };
        }));
    };

    const openList = lists.find(l => l.id === openListId);
    const totalItems = lists.reduce((sum, l) => sum + l.items.length, 0);

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6">
            {/* Header */}
            <header className="py-10 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                        <Link to="/" className="hover:text-chefie-yellow transition-colors">ANASAYFA</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-chefie-dark">LİSTELER</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-chefie-dark leading-tight">
                        Alışveriş <br className="hidden sm:block" />
                        <span className="text-chefie-yellow relative inline-block">
                            Listelerin
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mt-5">
                        Alışveriş listeni oluştur, malzemeleri ekle ve markette kolayca takip et.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-chefie-dark text-white font-black rounded-2xl hover:bg-chefie-yellow hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-gray-900/10 w-full sm:w-auto"
                        >
                            <Plus className="w-5 h-5" />
                            YENİ LİSTE OLUŞTUR
                        </button>
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-gray-100 text-[10px] font-black tracking-widest text-gray-400 shadow-sm w-full sm:w-auto justify-center">
                            <ListChecks className="w-4 h-4 text-chefie-yellow" />
                            {lists.length} LİSTE · {totalItems} ÜRÜN
                        </div>
                    </div>
                </motion.div>
            </header>

            <main className="max-w-5xl mx-auto">
                {/* Create List Modal */}
                <AnimatePresence>
                    {isCreateOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chefie-dark/50 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-white"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest uppercase text-gray-300">Yeni Liste</div>
                                        <h2 className="text-xl font-black text-chefie-dark">Liste Oluştur</h2>
                                    </div>
                                    <button onClick={() => setIsCreateOpen(false)} className="p-3 rounded-2xl bg-gray-50 hover:bg-chefie-dark hover:text-white transition-all text-gray-400">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <input
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createList()}
                                    placeholder="Örn: Haftalık Market Listesi"
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-gray-700 placeholder-gray-300 mb-6"
                                    autoFocus
                                />

                                <button
                                    onClick={createList}
                                    disabled={!newListName.trim()}
                                    className="w-full py-4 bg-chefie-dark text-white font-black text-xs tracking-widest rounded-2xl shadow-xl hover:bg-chefie-yellow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    OLUŞTUR
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List Detail Modal */}
                <AnimatePresence>
                    {openList && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chefie-dark/50 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                className="w-full max-w-lg max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between gap-4 flex-shrink-0">
                                    <div className="min-w-0 flex-1">
                                        {editingListId === openList.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && renameList(openList.id)}
                                                    className="text-xl font-black text-chefie-dark bg-gray-50 px-3 py-1 rounded-xl border border-gray-200 focus:ring-2 focus:ring-chefie-yellow/20 flex-1"
                                                    autoFocus
                                                />
                                                <button onClick={() => renameList(openList.id)} className="p-2 bg-chefie-yellow text-white rounded-xl hover:bg-chefie-dark transition-colors">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { setEditingListId(null); setEditingName(''); }} className="p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-[10px] font-black tracking-widest uppercase text-gray-300">Liste</div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl md:text-2xl font-black text-chefie-dark line-clamp-1">{openList.name}</h2>
                                                    <button
                                                        onClick={() => { setEditingListId(openList.id); setEditingName(openList.name); }}
                                                        className="p-1.5 text-gray-300 hover:text-chefie-yellow transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setOpenListId(null)} className="p-3 rounded-2xl bg-gray-50 hover:bg-chefie-dark hover:text-white transition-all text-gray-400 flex-shrink-0">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Stats bar */}
                                <div className="px-6 md:px-8 py-3 bg-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                                    <span>{openList.items.length} ürün</span>
                                    <span>{openList.items.filter(i => i.checked).length} tamamlandı</span>
                                    {openList.items.some(i => i.checked) && (
                                        <button onClick={() => clearChecked(openList.id)} className="text-red-400 hover:text-red-600 transition-colors font-black text-[10px] tracking-widest uppercase">
                                            Tamamlananları Sil
                                        </button>
                                    )}
                                </div>

                                {/* Add item input */}
                                <div className="px-6 md:px-8 py-4 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <input
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addItem(openList.id)}
                                            placeholder="Ürün ekle... (Örn: 2 kg domates)"
                                            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-gray-700 placeholder-gray-300 text-sm"
                                        />
                                        <button
                                            onClick={() => addItem(openList.id)}
                                            disabled={!newItem.trim()}
                                            className="p-3 bg-chefie-dark text-white rounded-xl hover:bg-chefie-yellow transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md flex-shrink-0"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4">
                                    {openList.items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-medium text-sm">Henüz ürün eklenmemiş.</p>
                                            <p className="text-gray-300 text-xs mt-1">Yukarıdaki alandan ürün ekleyebilirsin.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {/* Unchecked items first, then checked */}
                                            {[...openList.items.filter(i => !i.checked), ...openList.items.filter(i => i.checked)].map(item => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${item.checked
                                                        ? 'bg-gray-50 border-gray-50'
                                                        : 'bg-white border-gray-100 hover:border-chefie-yellow/30 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => toggleItem(openList.id, item.id)}
                                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked
                                                            ? 'bg-chefie-yellow border-chefie-yellow'
                                                            : 'border-gray-200 hover:border-chefie-yellow'
                                                            }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </button>
                                                    <span className={`flex-1 text-sm font-bold transition-all ${item.checked ? 'text-gray-300 line-through' : 'text-gray-700'
                                                        }`}>
                                                        {item.text}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteItem(openList.id, item.id)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Progress bar */}
                                {openList.items.length > 0 && (
                                    <div className="px-6 md:px-8 py-4 border-t border-gray-50 flex-shrink-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-gray-300">İlerleme</span>
                                            <span className="text-xs font-black text-chefie-dark">
                                                {Math.round((openList.items.filter(i => i.checked).length / openList.items.length) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-chefie-yellow to-green-400 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(openList.items.filter(i => i.checked).length / openList.items.length) * 100}%` }}
                                                transition={{ type: 'spring', damping: 15 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lists Grid */}
                {lists.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <div className="bg-white w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gray-100 border border-gray-50">
                            <ShoppingCart className="w-12 h-12 text-gray-200" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-chefie-dark mb-3">Henüz listen yok</h2>
                        <p className="text-gray-400 font-medium max-w-md mx-auto">
                            İlk alışveriş listeni oluştur, malzemeleri ekle ve markette kolayca takip et.
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 hover:scale-105 active:scale-95 transition-all"
                        >
                            LİSTE OLUŞTUR
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lists.map((list, idx) => {
                            const checkedCount = list.items.filter(i => i.checked).length;
                            const totalCount = list.items.length;
                            const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
                            const isComplete = totalCount > 0 && checkedCount === totalCount;

                            return (
                                <motion.div
                                    key={list.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-200/30 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Card colored header */}
                                    <div className={`h-2 ${isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : progress > 0 ? 'bg-gradient-to-r from-chefie-yellow to-orange-400' : 'bg-gray-100'}`}></div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-black tracking-widest uppercase text-gray-300 mb-1">
                                                    {new Date(list.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                                <h3 className="text-lg font-black text-chefie-dark line-clamp-1 group-hover:text-chefie-yellow transition-colors">
                                                    {list.name}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Preview items */}
                                        <div className="space-y-1.5 mb-5 min-h-[4rem]">
                                            {list.items.slice(0, 3).map(item => (
                                                <div key={item.id} className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-chefie-yellow' : 'border-2 border-gray-200'}`}>
                                                        {item.checked && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className={`text-xs font-medium line-clamp-1 ${item.checked ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                                                        {item.text}
                                                    </span>
                                                </div>
                                            ))}
                                            {list.items.length > 3 && (
                                                <div className="text-[10px] font-black text-gray-300 tracking-widest pl-6">
                                                    +{list.items.length - 3} daha
                                                </div>
                                            )}
                                            {list.items.length === 0 && (
                                                <div className="text-xs text-gray-300 font-medium">Henüz ürün eklenmemiş</div>
                                            )}
                                        </div>

                                        {/* Progress */}
                                        {totalCount > 0 && (
                                            <div className="mb-5">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-300">{checkedCount}/{totalCount}</span>
                                                    <span className="text-[10px] font-black text-gray-400">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-chefie-yellow to-orange-400'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setOpenListId(list.id)}
                                            className="w-full group/btn inline-flex items-center justify-center gap-3 py-3.5 bg-gray-50 text-chefie-dark font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-dark hover:text-white transition-all duration-500 shadow-sm"
                                        >
                                            LİSTEYİ AÇ
                                            <div className="w-6 h-6 bg-chefie-yellow rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                                                <ArrowRight className="w-3 h-3 text-white" />
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};


export default Lists;

