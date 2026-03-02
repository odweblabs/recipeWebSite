import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Folder,
    Settings,
    LogOut,
    Search,
    Bell,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Clock,
    Users,
    ChevronDown,
    UploadCloud,
    Menu,
    X
} from 'lucide-react';

const RecipeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

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
        axios.get('http://localhost:5050/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));

        // If ID exists, we are editing
        if (id) {
            setIsEditing(true);
            axios.get(`http://localhost:5050/api/recipes/${id}`)
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
                        setPreviewImage(recipe.image_url.startsWith('/images/') ? recipe.image_url : `http://localhost:5050${recipe.image_url}`);
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
        setImage(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
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
                await axios.put(`http://localhost:5050/api/recipes/${id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                await axios.post('http://localhost:5050/api/recipes', data, {
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
        <div className="flex flex-col md:flex-row min-h-screen bg-[#FFFBF2] font-sans pb-24 md:pb-0">
            {/* Mobile Header Box */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/bitarif_logo_1.png" alt="Bi Tarif Logo" className="h-14 w-auto object-contain" />
                    <span className="text-xl font-bold text-gray-800">Bi Tarif</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 bg-gray-50 rounded-xl"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50`}>
                <div className="flex items-center justify-between p-6">
                    <Link to="/" className="flex items-center gap-2 hover:bg-gray-50 transition-colors group">
                        <img src="/bitarif_logo_1.png" alt="Bi Tarif Logo" className="h-14 w-auto object-contain" />
                    </Link>
                    <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase tracking-wide">Menu</div>

                    <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-[#10B981] bg-[#FFFBF2] rounded-xl font-medium transition-colors">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Panele Dön
                    </Link>

                    <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Folder className="w-5 h-5 mr-3" />
                        Tüm Tarifler
                    </a>

                    <div className="text-xs font-semibold text-gray-400 px-4 mb-2 mt-6 uppercase tracking-wide">Diğer</div>

                    <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Settings className="w-5 h-5 mr-3" />
                        Ayarlar
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-hidden">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Tarifi Düzenle' : 'Yeni Tarif Ekle'}</h1>
                            <p className="text-sm text-gray-500">Tarif detaylarını aşağıdan yönetebilirsiniz.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <img
                                src="https://cdn.dribbble.com/userupload/42512876/file/original-f83ea4a95013355104381d9512b4c4de.png?resize=800x600&vertical=center"
                                alt="Admin"
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-8">

                            {/* Temel Bilgiler Section */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#10B981] rounded-full"></span>
                                    Temel Bilgiler
                                </h3>
                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tarif Başlığı</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Örn: Kremalı Mantar Çorbası"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Açıklama</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Tarif hakkında kısa, iştah açıcı bir açıklama..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Detaylar Section */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#FFC107] rounded-full"></span>
                                    Detaylar & Görsel
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                                <div className="relative">
                                                    <select
                                                        name="category_id"
                                                        value={formData.category_id}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none appearance-none"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Porsiyon</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="servings"
                                                        value={formData.servings}
                                                        onChange={handleChange}
                                                        placeholder="4"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none pl-10"
                                                    />
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Hazırlama</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="prep_time"
                                                        value={formData.prep_time}
                                                        onChange={handleChange}
                                                        placeholder="20 dk"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none pl-10"
                                                    />
                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pişirme</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="cook_time"
                                                        value={formData.cook_time}
                                                        onChange={handleChange}
                                                        placeholder="45 dk"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none pl-10"
                                                    />
                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
                                        <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative group">
                                            {previewImage ? (
                                                <>
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Değiştir</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-400">
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
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Tarif İçeriği
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Malzemeler</label>
                                        <textarea
                                            name="ingredients"
                                            value={formData.ingredients}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            placeholder="Her satıra bir malzeme gelecek şekilde yazınız..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all placeholder-gray-400 font-mono text-sm"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Hazırlanışı</label>
                                        <textarea
                                            name="instructions"
                                            value={formData.instructions}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            placeholder="Tarifin yapılış aşamalarını detaylıca anlatınız..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
