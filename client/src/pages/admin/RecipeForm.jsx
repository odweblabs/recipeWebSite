import { safeGetUser, safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage} from '../../utils/storage';
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
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';

const RecipeForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const token = safeGetToken();
    const user = JSON.parse(safeGetUser() || '{}');
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
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
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
                    if (recipe.images && recipe.images.length > 0) {
                        setPreviewImages(recipe.images.map(img => getImageUrl(img)));
                    } else if (recipe.image_url) {
                        setPreviewImages([getImageUrl(recipe.image_url)]);
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
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length + images.length > 5) {
            alert('En fazla 5 resim yükleyebilirsiniz.');
            return;
        }

        const validFiles = selectedFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} çok büyük (Maksimum 5MB).`);
                return false;
            }
            return true;
        });

        const newImages = [...images, ...validFiles];
        setImages(newImages);
        
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
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

        if (images.length > 0) {
            images.forEach(img => {
                data.append('images', img);
            });
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
        <div className="min-h-screen bg-chefie-cream font-sans">
            <Sidebar />
            <div className="md:hidden">
                <Navbar />
            </div>
            
            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 bg-chefie-card border border-chefie-border rounded-xl hover:bg-chefie-cream transition-colors">
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
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-28 md:mb-0">
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
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Görseller (En Fazla 5)</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {previewImages.map((src, index) => (
                                                <div key={index} className="relative group h-[120px] rounded-xl overflow-hidden border border-chefie-border">
                                                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {previewImages.length < 5 && (
                                                <label className="flex flex-col items-center justify-center w-full h-[120px] border-2 border-chefie-border border-dashed rounded-xl cursor-pointer bg-chefie-cream hover:bg-chefie-card transition-colors overflow-hidden relative">
                                                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                                        <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                                                        <p className="text-xs text-gray-500 text-center px-2">Resim Ekle</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                                </label>
                                            )}
                                        </div>
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
                                onClick={() => navigate(-1)}
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
            </div>
        </main>
    </div>
);
};

export default RecipeForm;
