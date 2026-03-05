import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Plus, Trash2, Check, X, ShoppingCart,
    Edit3, ListChecks, Package, ArrowRight, Save, Share2
} from 'lucide-react';
import axios from 'axios';

import API_BASE from '../utils/api';

const API_URL = `${API_BASE}/api`;

const PRESET_INGREDIENTS = [
    { name: 'Süt', emoji: '🥛' },
    { name: 'Yumurta', emoji: '🥚' },
    { name: 'Ekmek', emoji: '🍞' },
    { name: 'Peynir', emoji: '🧀' },
    { name: 'Tereyağı', emoji: '🧈' },
    { name: 'Yoğurt', emoji: '🍦' },
    { name: 'Domates', emoji: '🍅' },
    { name: 'Salatalık', emoji: '🥒' },
    { name: 'Biber', emoji: '🫑' },
    { name: 'Soğan', emoji: '🧅' },
    { name: 'Patates', emoji: '🥔' },
    { name: 'Tavuk', emoji: '🍗' },
    { name: 'Kıyma', emoji: '🥩' },
    { name: 'Makarna', emoji: '🍝' },
    { name: 'Pirinç', emoji: '🌾' },
    { name: 'Sıvı Yağ', emoji: '🧴' },
    { name: 'Zeytinyağı', emoji: '🫒' },
    { name: 'Un', emoji: '🥡' },
    { name: 'Şeker', emoji: '🍬' },
    { name: 'Tuz', emoji: '🧂' },
    { name: 'Çay', emoji: '☕' },
    { name: 'Kahve', emoji: '☕' },
    { name: 'Makarna Sosu', emoji: '🥫' },
    { name: 'Salça', emoji: '🥫' },
    { name: 'Baharat', emoji: '🌿' },
    { name: 'Meyve Suyu', emoji: '🧃' },
    { name: 'Su', emoji: '💧' },
    { name: 'Elma', emoji: '🍎' },
    { name: 'Muz', emoji: '🍌' },
    { name: 'Limon', emoji: '🍋' },
    { name: 'Sarımsak', emoji: '🧄' },
    { name: 'Zeytin', emoji: '🫒' },
    { name: 'Ketçap', emoji: '🍅' },
    { name: 'Mayonez', emoji: '🥚' },
    { name: 'Bulaşık Deterjanı', emoji: '🧼' },
    { name: 'Sabun', emoji: '🧼' },
    { name: 'Tuvalet Kağıdı', emoji: '🧻' },
    { name: 'Kağıt Havlu', emoji: '🧻' },
    { name: 'Diş Macunu', emoji: '🪥' }
];

const Lists = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListMarket, setNewListMarket] = useState('');
    const [openListId, setOpenListId] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [editingListId, setEditingListId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingMarket, setEditingMarket] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login', { state: { from: location } });
            return;
        }
        fetchLists();
    }, [token, navigate, location]);

    const fetchLists = async () => {
        try {
            const res = await axios.get(`${API_URL}/lists`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLists(res.data);
        } catch (err) {
            console.error('Listeler yüklenemedi:', err);
        } finally {
            setLoading(false);
        }
    };

    const createList = async () => {
        const name = newListName.trim();
        if (!name) return;
        try {
            await axios.post(`${API_URL}/lists`, {
                name,
                market_name: newListMarket.trim(),
                is_public: false,
                items: []
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewListName('');
            setNewListMarket('');
            setIsCreateOpen(false);
            fetchLists();
        } catch (err) {
            console.error('Liste oluşturulamadı:', err);
            alert('Liste oluşturulurken bir hata oluştu: ' + (err.response?.data?.error || err.message));
        }
    };

    const deleteList = async (id) => {
        if (!window.confirm('Bu listeyi silmek istediğinize emin misiniz?')) return;
        try {
            await axios.delete(`${API_URL}/lists/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (openListId === id) setOpenListId(null);
            fetchLists();
        } catch (err) {
            console.error('Liste silinemedi:', err);
        }
    };

    const saveChanges = async (id) => {
        const list = lists.find(l => l.id === id);
        if (!list) return;

        try {
            await axios.put(`${API_URL}/lists/${id}`, {
                name: editingName || list.name,
                market_name: editingMarket || list.market_name,
                is_public: isPublic,
                items: list.items
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingListId(null);
            setOpenListId(null);
            fetchLists();
        } catch (err) {
            console.error('Değişiklikler kaydedilemedi:', err);
        }
    };

    const addItem = (listId, customText = null) => {
        const text = customText || newItem.trim();
        if (!text) return;

        setLists(prev => prev.map(l => {
            if (l.id !== listId) return l;
            return {
                ...l,
                items: [...l.items, { id: Date.now(), text, checked: false }]
            };
        }));
        if (!customText) setNewItem('');
    };

    const handleShare = async (list) => {
        if (!list.is_public) {
            alert('Lütfen önce listeyi paylaşıma açın (aşağıdaki butondan).');
            return;
        }

        const shareData = {
            title: `${list.name} - Alışveriş Listem`,
            text: `${list.market_name ? list.market_name + ' için ' : ''}oluşturduğum alışveriş listesine göz at!`,
            url: `${window.location.origin}/liste/${list.id}`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Bağlantı kopyalandı!');
            } catch (err) {
                console.error('Clipboard failed', err);
            }
        }
    };

    const handlePrint = () => {
        window.print();
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
    const totalItems = lists.reduce((sum, l) => sum + (l.items?.length || 0), 0);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-chefie-dark">YÜKLENİYOR...</div>;

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
                        Sadece senin görebileceğin özel alışveriş listelerini oluştur ve yönet.
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

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 ml-2 mb-1 block">Liste Adı</label>
                                        <input
                                            value={newListName}
                                            onChange={(e) => setNewListName(e.target.value)}
                                            placeholder="Örn: Haftalık Market Listesi"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-gray-700 placeholder-gray-300"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 ml-2 mb-1 block">Market İsmi (İsteğe Bağlı)</label>
                                        <input
                                            value={newListMarket}
                                            onChange={(e) => setNewListMarket(e.target.value)}
                                            placeholder="Örn: Migros, Şok..."
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-gray-700 placeholder-gray-300"
                                        />
                                    </div>
                                </div>

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
                                            <div className="space-y-3">
                                                <input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    placeholder="Liste Adı"
                                                    className="w-full text-xl font-black text-chefie-dark bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-chefie-yellow/20"
                                                />
                                                <input
                                                    value={editingMarket}
                                                    onChange={(e) => setEditingMarket(e.target.value)}
                                                    placeholder="Market İsmi"
                                                    className="w-full text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-[10px] font-black tracking-widest uppercase text-gray-300">
                                                    {openList.market_name ? `Market: ${openList.market_name}` : 'Liste'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl md:text-2xl font-black text-chefie-dark line-clamp-1">{openList.name}</h2>
                                                    <button
                                                        onClick={() => {
                                                            setEditingListId(openList.id);
                                                            setEditingName(openList.name);
                                                            setEditingMarket(openList.market_name || '');
                                                            setIsPublic(openList.is_public);
                                                        }}
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

                                {/* Items list (Scrollable area) */}
                                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4">
                                    {/* Add item input */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addItem(openList.id)}
                                            placeholder="Ürün ekle..."
                                            className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-gray-700 placeholder-gray-300 text-sm"
                                        />
                                        <button
                                            onClick={() => addItem(openList.id)}
                                            disabled={!newItem.trim()}
                                            className="p-3 bg-chefie-dark text-white rounded-xl hover:bg-chefie-yellow transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Preset Ingredients (Quick Add) */}
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black tracking-widest uppercase text-gray-300 mb-3 ml-1">Önerilenler</p>
                                        <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-1">
                                            {PRESET_INGREDIENTS.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => addItem(openList.id, item.name)}
                                                    className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-gray-500 hover:border-chefie-yellow hover:text-chefie-yellow transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95"
                                                >
                                                    {item.emoji} {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {openList.items?.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-medium text-sm">Henüz ürün eklenmemiş.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {openList.items.map(item => (
                                                <motion.div
                                                    key={item.id}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${item.checked ? 'bg-gray-50 border-gray-50' : 'bg-white border-gray-100'}`}
                                                >
                                                    <button
                                                        onClick={() => toggleItem(openList.id, item.id)}
                                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-chefie-yellow border-chefie-yellow' : 'border-gray-200'}`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </button>
                                                    <span className={`flex-1 text-sm font-bold transition-all ${item.checked ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                                                        {item.text}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteItem(openList.id, item.id)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer (Actions) */}
                                <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setIsPublic(!isPublic)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${isPublic ? 'bg-chefie-yellow text-white' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                <Share2 className="w-4 h-4" />
                                                {isPublic ? 'PAYLAŞIMA AÇIK' : 'PAYLAŞIMA AÇ'}
                                            </button>
                                            {isPublic && (
                                                <button
                                                    onClick={() => handleShare(openList)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all shadow-sm"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                    PAYLAŞ
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => saveChanges(openList.id)}
                                            className="flex items-center gap-2 px-6 py-3 bg-chefie-dark text-white rounded-xl text-xs font-black hover:bg-chefie-yellow hover:scale-[1.02] transition-all shadow-lg"
                                        >
                                            <Save className="w-4 h-4" />
                                            KAYDET
                                        </button>
                                    </div>
                                    {isPublic && (
                                        <div className="p-3 bg-white rounded-xl border border-chefie-yellow/20 flex items-center justify-between gap-3">
                                            <span className="text-[10px] font-bold text-gray-400 truncate">
                                                {`${window.location.origin}/liste/${openList.id}`}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/liste/${openList.id}`);
                                                    alert('Bağlantı kopyalandı!');
                                                }}
                                                className="text-[10px] font-black text-chefie-yellow whitespace-nowrap"
                                            >
                                                KOPYALA
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            LİSTE OLUŞTUR
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lists.map((list, idx) => {
                            const checkedCount = list.items?.filter(i => i.checked).length || 0;
                            const totalCount = list.items?.length || 0;
                            const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

                            return (
                                <motion.div
                                    key={list.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setOpenListId(list.id)}
                                    className="bg-white rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-200/30 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-300">
                                                        {new Date(list.created_at).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    {list.is_public && <Share2 className="w-3 h-3 text-chefie-yellow" />}
                                                </div>
                                                <h3 className="text-lg font-black text-chefie-dark group-hover:text-chefie-yellow transition-colors">
                                                    {list.name}
                                                </h3>
                                                {list.market_name && (
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                                        {list.market_name}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                                                className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-1.5 mb-5 min-h-[3rem]">
                                            {list.items?.slice(0, 3).map(item => (
                                                <div key={item.id} className="flex items-center gap-2">
                                                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${item.checked ? 'bg-chefie-yellow' : 'border border-gray-200'}`}>
                                                        {item.checked && <Check className="w-2 h-2 text-white" />}
                                                    </div>
                                                    <span className={`text-[11px] font-medium line-clamp-1 ${item.checked ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                                                        {item.text}
                                                    </span>
                                                </div>
                                            ))}
                                            {totalCount > 3 && <div className="text-[10px] font-black text-gray-300 pl-5">+{totalCount - 3} daha</div>}
                                        </div>

                                        {totalCount > 0 && (
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-chefie-yellow transition-all" style={{ width: `${progress}%` }} />
                                            </div>
                                        )}
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
