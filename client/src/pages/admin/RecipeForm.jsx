import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage } from '../../utils/storage';
import API_BASE from '../../utils/api';
import { getImageUrl } from '../../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Folder,
    Settings,
    LogOut,
    Search,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Clock,
    Users,
    ChevronDown,
    UploadCloud,
    Menu,
    X,
    MessageCircle,
    UserPlus,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../../components/NotificationBell';

const RecipeForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const token = safeGetToken();
    const user = JSON.parse(safeGetSessionStorage('user') || '{}');
    const isLoggedIn = !!token && !!user?.id;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        category_id: '',
        servings: '',
        prep_time: '',
        cook_time: ''
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }

        // Fetch categories
        axios.get(`${API_BASE}/api/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));

        // If ID exists, we are editing
        if (id) {
            setIsEditing(true);
            axios.get(`${API_BASE}/api/recipes/${id}`)
                .then(res => {
                    const recipe = res.data;
                    setFormData({
                        title: recipe.title,
                        description: recipe.description,
                        ingredients: recipe.ingredients,
                        instructions: recipe.instructions,
                        category_id: recipe.category_id || '',
                        servings: recipe.servings || '',
                        prep_time: recipe.prep_time || '',
                        cook_time: recipe.cook_time || ''
                    });
                    if (recipe.image_url) {
                        setPreviewImage(getImageUrl(recipe.image_url));
                    }
                })
                .catch(err => {
                    console.error('Error fetching recipe:', err);
                    alert('Tarif yüklenemedi.');
                    navigate('/admin/dashboard');
                });
        }
    }, [id, navigate, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 4 * 1024 * 1024) {
            alert('Resim boyutu çok büyük (Maksimum 4MB olmalıdır).');
            e.target.value = '';
            return;
        }
        setImage(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleLogout = () => {
        safeClearAuth();
        safeClearAuth();
        navigate('/admin/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('ingredients', formData.ingredients);
        data.append('instructions', formData.instructions);
        data.append('category_id', formData.category_id);
        data.append('servings', formData.servings || '');
        data.append('prep_time', formData.prep_time || '');
        data.append('cook_time', formData.cook_time || '');

        if (image) {
            data.append('image', image);
        }

        try {
            if (isEditing) {
                await axios.put(`${API_BASE}/api/recipes/${id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${API_BASE}/api/recipes`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Error saving recipe:', err);
            alert('Hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-chefie-cream font-sans pb-24 md:pb-0">
            {/* Mobile Header Box */}
            {/* Mobile Header Box */}
            <div className="md:hidden bg-chefie-card sticky top-0 z-50 border-b border-chefie-border shadow-sm dark:shadow-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center group">
                                <img
                                    src="/bitarif_logo_1.png"
                                    alt="Bitarif Logo"
                                    className="h-14 md:h-20 w-auto group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            {isLoggedIn && (
                                <div className="flex items-center gap-3">
                                    <NotificationBell isMobile={true} />
                                    <Link to={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                                        {user.profile_image ? (
                                            <img src={getImageUrl(user.profile_image)} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border border-gray-100">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                                        )}
                                    </Link>
                                </div>
                            )}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-400 hover:text-chefie-text bg-chefie-cream rounded-xl transition-all border border-chefie-border"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu (Inside header like Navbar.jsx) */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-chefie-card border-t border-chefie-border shadow-lg absolute w-full top-20 left-0 z-40 max-h-[80vh] overflow-y-auto pb-8">
                        <div className="px-4 pt-4 pb-12 space-y-1">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.home').toUpperCase()}
                            </Link>
                            <Link to="/recipes" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.recipes').toUpperCase()}
                            </Link>
                            <Link to="/menus" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.menus').toUpperCase()}
                            </Link>
                            <Link to="/trend" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.trend').toUpperCase()}
                            </Link>
                            <Link to="/what-to-cook" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.what_to_cook').toUpperCase()}
                            </Link>
                            <Link to="/lists" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.lists').toUpperCase()}
                            </Link>
                            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">
                                {t('nav.blog').toUpperCase()}
                            </Link>

                            <div className="h-px bg-chefie-border my-4 mx-4"></div>

                            {isLoggedIn && user?.id ? (
                                <Link to={`/profile/${user.id}`} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4">
                                    {t('nav.profile', 'PROFİLİM').toUpperCase()}
                                </Link>
                            ) : (
                                <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4">
                                    {t('nav.admin_panel', 'GİRİŞ YAP').toUpperCase()}
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar (Desktop Only) */}
            <aside className="hidden md:flex flex-col w-64 bg-chefie-card border-r border-chefie-border fixed h-full z-50">
                <div className="flex items-center justify-center p-8">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src="/bitarif_logo_1.png" alt="Bi Tarif Logo" className="h-16 w-auto object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto">
                    <Link to="/" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.home').toUpperCase()}
                    </Link>
                    <Link to="/recipes" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.recipes').toUpperCase()}
                    </Link>
                    <Link to="/menus" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.menus').toUpperCase()}
                    </Link>
                    <Link to="/trend" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.trend').toUpperCase()}
                    </Link>
                    <Link to="/what-to-cook" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.what_to_cook').toUpperCase()}
                    </Link>
                    <Link to="/lists" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.lists').toUpperCase()}
                    </Link>
                    <Link to="/blog" className="flex items-center px-4 py-3 text-gray-500 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl font-bold transition-all text-xs tracking-widest">
                        {t('nav.blog').toUpperCase()}
                    </Link>

                    <div className="h-px bg-chefie-border my-6"></div>

                    {isLoggedIn && user?.id ? (
                        <Link to={`/profile/${user.id}`} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4 transition-transform hover:scale-[1.02]">
                            {t('nav.profile', 'PROFİLİM').toUpperCase()}
                        </Link>
                    ) : (
                        <Link to="/admin/login" className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4 transition-transform hover:scale-[1.02]">
                            {t('nav.login', 'GİRİŞ YAP').toUpperCase()}
                        </Link>
                    )}
                </nav>

                <div className="p-6 border-t border-chefie-border">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all text-xs tracking-widest uppercase">
                        <LogOut className="w-4 h-4 mr-3" />
                        {t('common.logout', 'Çıkış Yap')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-hidden">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 bg-chefie-card border border-chefie-border rounded-xl hover:bg-chefie-cream transition-colors">
                            <ArrowLeft className="w-5 h-5 text-chefie-text" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-chefie-text">{isEditing ? 'Tarifi Düzenle' : 'Yeni Tarif Ekle'}</h1>
                            <p className="text-sm text-gray-400">Tarif detaylarını aşağıdan yönetebilirsiniz.</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <NotificationBell />

                        <Link to={user?.id ? `/profile/${user.id}` : '#'} className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity">
                            {user.profile_image ? (
                                <img
                                    src={getImageUrl(user.profile_image)}
                                    alt={user.full_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                                    {(user.full_name || user.username || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-bold text-chefie-text">{user.full_name || user.username}</div>
                                <div className="text-xs text-gray-500 uppercase">{user.role || 'User'}</div>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="bg-chefie-card rounded-3xl shadow-sm md:shadow-lg dark:shadow-none border border-chefie-border overflow-hidden">
                        <div className="p-8 space-y-8">

                            {/* Temel Bilgiler Section */}
                            <div>
                                <h3 className="text-lg font-bold text-chefie-text mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#10B981] rounded-full"></span>
                                    Temel Bilgiler
                                </h3>
                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Tarif Başlığı</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Örn: Kremalı Mantar Çorbası"
                                            className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Kısa Açıklama</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Tarif hakkında kısa, iştah açıcı bir açıklama..."
                                            className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Detaylar Section */}
                            <div>
                                <h3 className="text-lg font-bold text-chefie-text mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#FFC107] rounded-full"></span>
                                    Detaylar & Görsel
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                                                <div className="relative">
                                                    <select
                                                        name="category_id"
                                                        value={formData.category_id}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none appearance-none"
                                                    >
                                                        <option value="">Seçiniz</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Porsiyon</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="servings"
                                                        value={formData.servings}
                                                        onChange={handleChange}
                                                        placeholder="4"
                                                        className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none pl-10"
                                                    />
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Hazırlama</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="prep_time"
                                                        value={formData.prep_time}
                                                        onChange={handleChange}
                                                        placeholder="20"
                                                        className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none pl-10 pr-10"
                                                    />
                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 pointer-events-none">dk</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Pişirme</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="cook_time"
                                                        value={formData.cook_time}
                                                        onChange={handleChange}
                                                        placeholder="45"
                                                        className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none pl-10 pr-10"
                                                    />
                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 pointer-events-none">dk</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Kapak Görseli</label>
                                        <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-chefie-border border-dashed rounded-xl cursor-pointer bg-chefie-cream hover:bg-chefie-card transition-colors overflow-hidden relative group">
                                            {previewImage ? (
                                                <>
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Değiştir</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="w-12 h-12 bg-chefie-card rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-400">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                                                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* İçerik Section */}
                            <div>
                                <h3 className="text-lg font-bold text-chefie-text mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Tarif İçeriği
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Malzemeler</label>
                                        <textarea
                                            name="ingredients"
                                            value={formData.ingredients}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            placeholder="Her satıra bir malzeme gelecek şekilde yazınız..."
                                            className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none transition-all placeholder-gray-500 font-mono text-sm"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Hazırlanışı</label>
                                        <textarea
                                            name="instructions"
                                            value={formData.instructions}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            placeholder="Tarifin yapılış aşamalarını detaylıca anlatınız..."
                                            className="w-full px-4 py-3 bg-chefie-cream/50 border border-chefie-border text-chefie-text rounded-xl focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none transition-all placeholder-gray-500"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="bg-chefie-cream px-8 py-6 flex items-center justify-between border-t border-chefie-border">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-6 py-2.5 bg-chefie-card border border-chefie-border text-gray-400 font-medium rounded-xl hover:bg-chefie-cream hover:text-chefie-text transition-colors shadow-sm dark:shadow-none"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-chefie-yellow hover:bg-chefie-yellow/80 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/20 dark:shadow-none flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>Kaydediliyor...</>
                                ) : (
                                    <><Save className="w-5 h-5" /> Kaydet</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default RecipeForm;
