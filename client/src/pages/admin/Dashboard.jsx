import API_BASE from '../../utils/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Folder,
    Settings,
    LogOut,
    Search,
    Bell,
    Plus,
    Edit,
    Trash2,
    FileText,
    Image as ImageIcon,
    Clock,
    Users,
    MessageSquare,
    Heart,
    ChevronDown,
    Menu,
    X,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Star,
    TrendingUp,
    ChefHat,
    ArrowRight
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [totalCount, setTotalCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 50;

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [profileData, setProfileData] = useState({ fullName: user.full_name || '', profileImage: null });
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // User Edit State
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ role: '', can_comment: 1 });

    // User Activity State
    const [userActivity, setUserActivity] = useState({ activities: [], onlineCount: 0 });

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchTotalCount();
        fetchFavorites();
        fetchCategories();
        fetchStats();
        if (user.role === 'admin') {
            fetchUsers();
            fetchActivity();
            // Refresh activity data every 60 seconds
            const activityInterval = setInterval(fetchActivity, 60000);
            return () => clearInterval(activityInterval);
        }
    }, [token, navigate, user.role]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['all', 'favorites', 'stats', 'users', 'settings'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchActivity = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/activity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserActivity(res.data);
        } catch (err) {
            console.error('Error fetching activity:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchTotalCount = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/recipes/count`);
            setTotalCount(res.data.count);
        } catch (err) {
            console.error('Error fetching count:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/recipes/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchRecipes = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset + LIMIT : 0;
            const endpoint = searchTerm
                ? `${API_BASE}/api/recipes?title=${searchTerm}&limit=${LIMIT}&offset=${currentOffset}`
                : `${API_BASE}/api/recipes?limit=${LIMIT}&offset=${currentOffset}${selectedCategory ? `&category_id=${selectedCategory}` : ''}`;

            const res = await axios.get(endpoint);

            if (isLoadMore) {
                setRecipes(prev => [...prev, ...res.data]);
                setOffset(currentOffset);
            } else {
                setRecipes(res.data);
                setOffset(0);
            }

            setHasMore(res.data.length >= LIMIT);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (token) fetchRecipes();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, token, selectedCategory]);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(res.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu tarifi silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`${API_BASE}/api/recipes/${id}`);
                fetchRecipes();
                fetchFavorites();
                fetchTotalCount();
            } catch (err) {
                alert('Silme işlemi başarısız.');
            }
        }
    };

    const handleRemoveFavorite = async (recipeId) => {
        if (window.confirm('Bu tarifi favorilerinizden kaldırmak istediğinize emin misiniz?')) {
            try {
                await axios.delete(`${API_BASE}/api/favorites/${recipeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchFavorites();
            } catch (err) {
                alert('İşlem başarısız.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`${API_BASE}/api/auth/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
                fetchStats();
            } catch (err) {
                alert(err.response?.data?.error || 'Silme işlemi başarısız.');
            }
        }
    };

    const openEditUserModal = (u) => {
        setEditingUser(u);
        setEditFormData({ role: u.role, can_comment: u.can_comment !== undefined ? u.can_comment : 1 });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE}/api/auth/users/${editingUser.id}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || 'Güncelleme başarısız.');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('full_name', profileData.fullName);
            if (profileData.profileImage) {
                formData.append('profile_image', profileData.profileImage);
            }

            await axios.put(`${API_BASE}/api/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const userRes = await axios.get(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            sessionStorage.setItem('user', JSON.stringify(userRes.data));
            window.location.reload();
        } catch (err) {
            alert('Profil güncelleme başarısız.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/admin/login');
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
        if (newPassword.length < 6) return;

        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await axios.put(`${API_BASE}/api/auth/password`, {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPasswordMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMessage({
                type: 'error',
                text: err.response?.data?.error || 'Şifre değiştirirken bir hata oluştu.'
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const filteredRecipes = (activeTab === 'all' ? recipes : favorites).filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderTableContent = () => {
        if (activeTab === 'users') {
            return (
                filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <Link to={`/profile/${u.id}`}>
                                        {u.profile_image ? (
                                            <img src={u.profile_image.startsWith('http') ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name} className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:border-[#10B981] transition-colors" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 hover:border-[#10B981] transition-colors uppercase font-bold text-lg">
                                                {(u.full_name || u.username).charAt(0)}
                                            </div>
                                        )}
                                    </Link>
                                    <div>
                                        <Link to={`/profile/${u.id}`} className="text-sm font-bold text-gray-800 hover:text-[#10B981] transition-colors block">
                                            {u.full_name || 'İsimsiz Şef'}
                                        </Link>
                                        <div className="text-xs text-gray-400">@{u.username}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{u.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${u.role === 'admin' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                    {u.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditUserModal(u)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Kullanıcı bulunamadı.</td></tr>
                )
            );
        }

        if (activeTab === 'stats') {
            return (
                <tr>
                    <td colSpan="5" className="px-4 md:px-6 py-8">
                        <div className="space-y-8">

                            {/* Today's Activity */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <TrendingUp className="w-4 h-4 text-[#10B981]" /> Bugünkü Aktivite
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-100">
                                        <div className="text-3xl font-black text-blue-600">{stats?.today?.recipes || 0}</div>
                                        <div className="text-sm font-bold text-blue-500 mt-1">Yeni Tarif</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-2xl border border-green-100">
                                        <div className="text-3xl font-black text-green-600">{stats?.today?.users || 0}</div>
                                        <div className="text-sm font-bold text-green-500 mt-1">Yeni Üye</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-2xl border border-purple-100">
                                        <div className="text-3xl font-black text-purple-600">{stats?.today?.comments || 0}</div>
                                        <div className="text-sm font-bold text-purple-500 mt-1">Yeni Yorum</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recent Recipes */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                        <ChefHat className="w-5 h-5 text-orange-500" /> Son Paylaşılan Tarifler
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentRecipes?.length > 0 ? stats.recentRecipes.map((r) => (
                                            <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                    {r.image_url ? (
                                                        <img src={r.image_url.startsWith('/images/') ? r.image_url : `${API_BASE}${r.image_url}`} alt={r.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ChefHat className="w-5 h-5" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#10B981] transition-colors">{r.title}</div>
                                                    <div className="text-xs text-gray-400">{r.category_name || 'Genel'} · {r.chef_name || r.chef_username || 'Anonim'}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 flex-shrink-0">{new Date(r.created_at).toLocaleDateString('tr-TR')}</span>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz tarif yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Users */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#10B981]" /> Son Kayıt Olanlar
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentUsers?.length > 0 ? stats.recentUsers.map((u) => (
                                            <Link key={u.id} to={`/profile/${u.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                {u.profile_image ? (
                                                    <img src={u.profile_image.startsWith('http') ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name || u.username} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 uppercase font-bold text-sm">
                                                        {(u.full_name || u.username || '?').charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-800 group-hover:text-[#10B981] transition-colors">{u.full_name || 'İsimsiz Şef'}</div>
                                                    <div className="text-xs text-gray-400">@{u.username}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 flex-shrink-0">{new Date(u.created_at).toLocaleDateString('tr-TR')}</span>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz kullanıcı yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Comments */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500" /> Son Yapılan Yorumlar
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentComments?.length > 0 ? stats.recentComments.map((c) => (
                                            <Link key={c.id} to={`/recipes/${c.recipe_id}`} className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {c.profile_image ? (
                                                        <img src={c.profile_image.startsWith('http') ? c.profile_image : `${API_BASE}${c.profile_image}`} alt={c.username} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase">{(c.full_name || c.username || '?').charAt(0)}</div>
                                                    )}
                                                    <span className="text-xs font-bold text-gray-600">{c.full_name || c.username}</span>
                                                    <span className="text-[10px] text-gray-300">·</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 pl-8">"{c.content}"</p>
                                                <div className="text-[10px] font-bold text-[#10B981] pl-8 mt-1 group-hover:underline">{c.recipe_title}</div>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz yorum yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Rated */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" /> En Yüksek Puanlı Tarifler
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.topRated?.length > 0 ? stats.topRated.map((r, i) => (
                                            <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 font-black text-sm flex-shrink-0">#{i + 1}</div>
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                    {r.image_url ? (
                                                        <img src={r.image_url.startsWith('/images/') ? r.image_url : `${API_BASE}${r.image_url}`} alt={r.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ChefHat className="w-4 h-4" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#10B981] transition-colors">{r.title}</div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-xs font-bold text-yellow-600">{r.avg_rating}</span>
                                                        <span className="text-[10px] text-gray-400">({r.rating_count} değerlendirme)</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz değerlendirme yok.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Overall Totals */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <LayoutDashboard className="w-4 h-4 text-gray-400" /> Genel Toplam
                                </h3>
                                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-blue-600 truncate px-1">{stats?.counts?.recipes || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-1 break-words">Tarif</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-green-600 truncate px-1">{stats?.counts?.users || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-green-400 mt-1 break-words">Üye</div>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-orange-600 truncate px-1">{stats?.counts?.categories || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mt-1 break-words">Kategori</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-purple-600 truncate px-1">{stats?.counts?.comments || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mt-1 break-words">Yorum</div>
                                    </div>
                                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-rose-600 truncate px-1">{stats?.counts?.favorites || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mt-1 break-words">Favori</div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-yellow-600 truncate px-1">{stats?.counts?.ratings || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mt-1 break-words">Puan</div>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-indigo-600 truncate px-1">{stats?.counts?.friendships || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mt-1 break-words">Takip</div>
                                    </div>
                                </div>
                            </div>

                            {/* User Activity */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-cyan-500" /> Kullanıcı Aktivitesi
                                    </h3>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-green-600">{userActivity.onlineCount} Çevrimiçi</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {userActivity.activities?.length > 0 ? userActivity.activities.map((a) => {
                                        const totalSec = a.total_seconds || 0;
                                        const hours = Math.floor(totalSec / 3600);
                                        const mins = Math.floor((totalSec % 3600) / 60);
                                        const secs = totalSec % 60;
                                        let timeStr = '';
                                        if (hours > 0) timeStr += `${hours} saat `;
                                        if (mins > 0) timeStr += `${mins} dk `;
                                        if (hours === 0) timeStr += `${secs} sn`;
                                        timeStr = timeStr.trim();

                                        const lastActive = a.last_active ? new Date(a.last_active) : null;
                                        const isOnline = lastActive && (Date.now() - lastActive.getTime()) < 2 * 60 * 1000;

                                        return (
                                            <div key={a.user_id} className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {a.profile_image ? (
                                                        <img src={a.profile_image.startsWith('http') ? a.profile_image : `${API_BASE}${a.profile_image}`} alt={a.username} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-sm uppercase border border-gray-200">{(a.full_name || a.username || '?').charAt(0)}</div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className="text-sm font-bold text-gray-800 truncate">{a.full_name || a.username}</span>
                                                            {isOnline && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />}
                                                            {a.role === 'admin' && <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md uppercase border border-amber-200 shadow-sm leading-none">Admin</span>}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 truncate">@{a.username}</div>
                                                    </div>
                                                </div>
                                                <div className="text-left min-[420px]:text-right flex-shrink-0 pl-[52px] min-[420px]:pl-0 border-l-2 min-[420px]:border-l-0 border-cyan-100 min-[420px]:border-transparent">
                                                    <div className="text-sm font-black text-cyan-600 leading-tight">{timeStr}</div>
                                                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">{isOnline ? 'Şu an aktif' : lastActive ? lastActive.toLocaleDateString('tr-TR') : ''}</div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-sm text-gray-400 py-4 text-center">Henüz aktivite verisi yok.</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </td>
                </tr>
            );
        }

        if (activeTab === 'settings') {
            return (
                <tr>
                    <td colSpan="5" className="px-6 py-12 bg-white/50">
                        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">Profil Bilgilerini Güncelle</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profil Fotoğrafı</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.files[0] })}
                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full bg-[#10B981] text-white py-3 rounded-xl font-bold hover:bg-[#059669] transition-all disabled:opacity-50"
                                        >
                                            {isUpdating ? 'Güncelleniyor...' : 'Bilgileri Kaydet'}
                                        </button>
                                    </form>
                                </div>

                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Lock className="w-5 h-5 text-[#10B981]" />
                                        <h2 className="text-xl font-bold text-gray-800">Şifre Değiştir</h2>
                                    </div>

                                    {passwordMessage.text && (
                                        <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-bold ${passwordMessage.type === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPw ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Mevcut şifrenizi girin"
                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCurrentPw(prev => !prev); }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPw ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Yeni şifrenizi girin (en az 6 karakter)"
                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowNewPw(prev => !prev); }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {newPassword && newPassword.length < 6 && (
                                                <p className="mt-1.5 text-xs text-orange-500 font-medium">Şifre en az 6 karakter olmalıdır.</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre Tekrar</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPw ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Yeni şifrenizi tekrar girin"
                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirmPw(prev => !prev); }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {confirmPassword && confirmPassword !== newPassword && (
                                                <p className="mt-1.5 text-xs text-red-500 font-medium">Şifreler eşleşmiyor.</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={handlePasswordChange}
                                            disabled={passwordLoading || !currentPassword || !newPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                                            className="w-full bg-[#10B981] text-white py-3 rounded-xl font-bold hover:bg-[#059669] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {passwordLoading ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Değiştiriliyor...</>
                                            ) : (
                                                <><Lock className="w-4 h-4" /> Şifreyi Değiştir</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex justify-center items-center h-full pointer-events-none sticky top-24">
                                <img src="/images/chef-settings.jpg" alt="Chef Illustration" className="w-full max-w-md object-contain mix-blend-multiply opacity-80" />
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        return (
            filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <tr key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    {recipe.image_url ? (
                                        <img src={recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`} alt={recipe.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-5 h-5" /></div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-800">{recipe.title}</div>
                                    <div className="text-xs text-gray-400">ID: #{recipe.id}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100">{recipe.category_name || 'Genel'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(recipe.created_at).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Clock className="w-4 h-4 inline mr-1" /> {recipe.prep_time || '30 dk'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                {(user.role === 'admin' || recipe.user_id === user.id) && (
                                    <>
                                        <Link to={`/admin/recipes/edit/${recipe.id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></Link>
                                        {activeTab === 'favorites' ? (
                                            <button onClick={() => handleRemoveFavorite(recipe.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                                        ) : (
                                            <button onClick={() => handleDelete(recipe.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                                        )}
                                    </>
                                )}
                                {user.role !== 'admin' && recipe.user_id !== user.id && (
                                    <span className="text-xs text-gray-300 italic">Sadece Görüntüle</span>
                                )}
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">{searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz içerik yok.'}</td></tr>
            )
        );
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#FFFBF2] font-sans pb-24 md:pb-0">
            {/* Mobile Header Box */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/bitarif_logo_1.png" alt="Bi Tarif Logo" className="h-14 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-3">
                    <button className="relative p-2 text-gray-400">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <Link to={user?.id ? `/profile/${user.id}` : '#'}>
                        {user.profile_image ? (
                            <img src={user.profile_image.startsWith('http') ? user.profile_image : `${API_BASE}${user.profile_image}`} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border border-gray-100">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-600 bg-gray-50 rounded-xl ml-1"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

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
                    <button onClick={() => { setActiveTab('all'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'all' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Folder className="w-5 h-5 mr-3" /> Tüm Tarifler</button>
                    <button onClick={() => { setActiveTab('favorites'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'favorites' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Heart className="w-5 h-5 mr-3" /> Favorilerim</button>
                    {user.role === 'admin' && (
                        <>
                            <button onClick={() => { setActiveTab('stats'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'stats' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><LayoutDashboard className="w-5 h-5 mr-3" /> İstatistikler</button>
                            <button onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Users className="w-5 h-5 mr-3" /> Kullanıcılar</button>
                        </>
                    )}
                    <div className="text-xs font-semibold text-gray-400 px-4 mb-2 mt-6 uppercase tracking-wide">Diğer</div>
                    <button onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Settings className="w-5 h-5 mr-3" /> Ayarlar</button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"><LogOut className="w-5 h-5 mr-3" /> Çıkış Yap</button>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-hidden">
                <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'stats' ? 'İstatistikler' : activeTab === 'users' ? 'Kullanıcılar' : 'Ayarlar'}
                        </h1>
                        <div className="relative flex-1 hidden md:block ml-8">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Arama yapın..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            />
                        </div>
                    </div>

                    <Link to={user?.id ? `/profile/${user.id}` : '#'} className="hidden md:flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity">
                        {user.profile_image ? (
                            <img src={user.profile_image.startsWith('http') ? user.profile_image : `${API_BASE}${user.profile_image}`} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                        )}
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-bold text-gray-800">{user.full_name || user.username}</div>
                            <div className="text-xs text-gray-500 uppercase">{user.role || 'User'}</div>
                        </div>
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-gray-800">{totalCount}</div><div className="text-sm text-gray-500">Tarif</div></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><Folder className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-gray-800">{categories.length}</div><div className="text-sm text-gray-500">Kategori</div></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-gray-800">{users.length}</div><div className="text-sm text-gray-500">Kullanıcı</div></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Heart className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-gray-800">{favorites.length}</div><div className="text-sm text-gray-500">Favori</div></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full">
                    <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800">{activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'users' ? 'Kullanıcılar' : activeTab === 'stats' ? 'İstatistikler' : 'Ayarlar'}</h2>
                        {activeTab === 'all' && (
                            <Link to="/admin/recipes/new" className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl flex items-center gap-2"><Plus className="w-4 h-4" /> Yeni Ekle</Link>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {activeTab === 'all' && (
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase relative" style={{ minWidth: '160px' }}>
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase focus:outline-none appearance-none cursor-pointer hover:border-[#10B981] transition-colors"
                                                >
                                                    <option value="">KATEGORİ / ID</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Süre</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}

                            {activeTab === 'favorites' && (
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase relative" style={{ minWidth: '160px' }}>
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase focus:outline-none appearance-none cursor-pointer hover:border-[#10B981] transition-colors"
                                                >
                                                    <option value="">KATEGORİ / ID</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Süre</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}

                            {activeTab === 'users' && (
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}
                            <tbody className="divide-y divide-gray-50">{renderTableContent()}</tbody>
                        </table>
                    </div>

                    {activeTab === 'all' && hasMore && recipes.length > 0 && (
                        <div className="p-6 bg-gray-50/50 text-center border-t border-gray-50">
                            <button onClick={() => fetchRecipes(true)} className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm">Daha Fazla</button>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Kullanıcı Düzenle: @{editingUser.username}</h3>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value="user">Kullanıcı</option>
                                    <option value="admin">Yönetici</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yorum İzni</label>
                                <select
                                    value={editFormData.can_comment}
                                    onChange={(e) => setEditFormData({ ...editFormData, can_comment: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                                >
                                    <option value={1}>İzin Verildi</option>
                                    <option value={0}>Kısıtlandı</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-bold">İptal</button>
                                <button type="submit" className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
