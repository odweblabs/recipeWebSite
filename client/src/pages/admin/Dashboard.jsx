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
import { motion, AnimatePresence } from 'framer-motion';

// Country list with flag emojis
const COUNTRY_LIST = [
    { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
    { code: 'US', name: 'ABD', flag: '🇺🇸' },
    { code: 'DE', name: 'Almanya', flag: '🇩🇪' },
    { code: 'FR', name: 'Fransa', flag: '🇫🇷' },
    { code: 'GB', name: 'İngiltere', flag: '🇬🇧' },
    { code: 'NL', name: 'Hollanda', flag: '🇳🇱' },
    { code: 'BE', name: 'Belçika', flag: '🇧🇪' },
    { code: 'AT', name: 'Avusturya', flag: '🇦🇹' },
    { code: 'CH', name: 'İsviçre', flag: '🇨🇭' },
    { code: 'SE', name: 'İsveç', flag: '🇸🇪' },
    { code: 'NO', name: 'Norveç', flag: '🇳🇴' },
    { code: 'DK', name: 'Danimarka', flag: '🇩🇰' },
    { code: 'IT', name: 'İtalya', flag: '🇮🇹' },
    { code: 'ES', name: 'İspanya', flag: '🇪🇸' },
    { code: 'AZ', name: 'Azerbaycan', flag: '🇦🇿' },
    { code: 'RU', name: 'Rusya', flag: '🇷🇺' },
    { code: 'AU', name: 'Avustralya', flag: '🇦🇺' },
    { code: 'CA', name: 'Kanada', flag: '🇨🇦' },
    { code: 'JP', name: 'Japonya', flag: '🇯🇵' },
    { code: 'KR', name: 'Güney Kore', flag: '🇰🇷' },
    { code: 'SA', name: 'Suudi Arabistan', flag: '🇸🇦' },
    { code: 'AE', name: 'BAE', flag: '🇦🇪' },
    { code: 'BR', name: 'Brezilya', flag: '🇧🇷' },
    { code: 'OTHER', name: 'Diğer', flag: '🌍' },
];

const getCountryInfo = (code) => COUNTRY_LIST.find(c => c.code === code) || null;

const Dashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopNotificationsOpen, setIsDesktopNotificationsOpen] = useState(false);
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
    const [profileData, setProfileData] = useState({ fullName: user.full_name || '', profileImage: null, country: user.country || '' });
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

    const [chefRecommendation, setChefRecommendation] = useState(null);
    const [isSavingRecommendation, setIsSavingRecommendation] = useState(false);

    // Pending Friends State
    const [pendingFriends, setPendingFriends] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
            fetchRecommendation();
            fetchPendingFriends();
            // Refresh activity data every 60 seconds
            const activityInterval = setInterval(() => {
                fetchActivity();
                fetchPendingFriends();
            }, 60000);
            return () => clearInterval(activityInterval);
        }
    }, [token, navigate, user.role]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['all', 'favorites', 'stats', 'users', 'settings', 'recommendation'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const fetchPendingFriends = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/friends/requests/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingFriends(res.data);
        } catch (err) {
            console.error('Error fetching pending friends:', err);
        }
    };

    const handleAcceptFriend = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingFriends();
        } catch (err) {
            alert('İstek kabul edilemedi.');
        }
    };

    const handleRejectFriend = async (friendshipId) => {
        try {
            await axios.delete(`${API_BASE}/api/friends/reject/${friendshipId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingFriends();
        } catch (err) {
            alert('İstek reddedilemedi.');
        }
    };

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

    const fetchRecommendation = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/recipes/recommendation`);
            setChefRecommendation(res.data);
        } catch (err) {
            console.error('Error fetching recommendation:', err);
        }
    };

    const handleSetRecommendation = async (recipeId) => {
        setIsSavingRecommendation(true);
        try {
            await axios.post(`${API_BASE}/api/recipes/recommendation`, { recipeId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchRecommendation();
            alert('Şefin tavsiyesi güncellendi!');
        } catch (err) {
            console.error('Error setting recommendation:', err);
            alert('Güncelleme sırasında bir hata oluştu.');
        } finally {
            setIsSavingRecommendation(false);
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
            formData.append('country', profileData.country || '');
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
                        <tr key={u.id} className="hover:bg-chefie-cream/80 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <Link to={`/profile/${u.id}`}>
                                        {u.profile_image ? (
                                            <img src={u.profile_image.startsWith('http') ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name} className="w-10 h-10 rounded-full object-cover border border-chefie-border hover:border-[#10B981] transition-colors" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-chefie-cream flex items-center justify-center text-chefie-secondary border border-chefie-border hover:border-[#10B981] transition-colors uppercase font-bold text-lg">
                                                {(u.full_name || u.username).charAt(0)}
                                            </div>
                                        )}
                                    </Link>
                                    <div>
                                        <Link to={`/profile/${u.id}`} className="text-sm font-bold text-chefie-text hover:text-[#10B981] transition-colors block">
                                            {u.full_name || 'İsimsiz Şef'}
                                        </Link>
                                        <div className="text-xs text-gray-400">@{u.username}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-chefie-secondary">#{u.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-chefie-secondary">{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
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
                                <h3 className="font-bold text-chefie-secondary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
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
                                <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md">
                                    <h3 className="font-bold text-chefie-text mb-4 flex items-center gap-2">
                                        <ChefHat className="w-5 h-5 text-orange-500" /> Son Paylaşılan Tarifler
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentRecipes?.length > 0 ? stats.recentRecipes.map((r) => (
                                            <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-chefie-cream transition-colors group">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-chefie-cream border border-chefie-border flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                                                        <img
                                                            src={r.image_url ? (r.image_url.startsWith('/images/') ? r.image_url : `${API_BASE}${r.image_url}`) : '/default-recipe.png'}
                                                            alt={r.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-chefie-text line-clamp-1 group-hover:text-[#10B981] transition-colors">{r.title}</div>
                                                    <div className="text-xs text-chefie-secondary">{r.category_name || 'Genel'} · {r.chef_name || r.chef_username || 'Anonim'}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 flex-shrink-0">{new Date(r.created_at).toLocaleDateString('tr-TR')}</span>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz tarif yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Users */}
                                <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md">
                                    <h3 className="font-bold text-chefie-text mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#10B981]" /> Son Kayıt Olanlar
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentUsers?.length > 0 ? stats.recentUsers.map((u) => (
                                            <Link key={u.id} to={`/profile/${u.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-chefie-cream transition-colors group">
                                                {u.profile_image ? (
                                                    <img src={u.profile_image.startsWith('http') ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name || u.username} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 uppercase font-bold text-sm">
                                                        {(u.full_name || u.username || '?').charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-chefie-text group-hover:text-[#10B981] transition-colors flex items-center gap-1.5">
                                                        {u.full_name || 'İsimsiz Şef'}
                                                        {u.country && (() => {
                                                            const ci = getCountryInfo(u.country);
                                                            return ci ? <span className="text-sm" title={ci.name}>{ci.flag}</span> : null;
                                                        })()}
                                                    </div>
                                                    <div className="text-xs text-chefie-secondary">@{u.username}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 flex-shrink-0">{new Date(u.created_at).toLocaleDateString('tr-TR')}</span>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz kullanıcı yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Comments */}
                                <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md">
                                    <h3 className="font-bold text-chefie-text mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500" /> Son Yapılan Yorumlar
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.recentComments?.length > 0 ? stats.recentComments.map((c) => (
                                            <Link key={c.id} to={`/recipes/${c.recipe_id}`} className="block p-3 rounded-xl hover:bg-chefie-cream transition-colors group">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {c.profile_image ? (
                                                        <img src={c.profile_image.startsWith('http') ? c.profile_image : `${API_BASE}${c.profile_image}`} alt={c.username} className="w-6 h-6 rounded-full object-cover border border-chefie-border" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-chefie-cream flex items-center justify-center text-chefie-secondary text-[10px] font-bold uppercase">{(c.full_name || c.username || '?').charAt(0)}</div>
                                                    )}
                                                    <span className="text-xs font-bold text-chefie-text">{c.full_name || c.username}</span>
                                                    <span className="text-[10px] text-chefie-secondary">·</span>
                                                    <span className="text-[10px] text-chefie-secondary">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <p className="text-sm text-chefie-secondary line-clamp-2 pl-8">"{c.content}"</p>
                                                <div className="text-[10px] font-bold text-[#10B981] pl-8 mt-1 group-hover:underline">{c.recipe_title}</div>
                                            </Link>
                                        )) : (
                                            <div className="text-sm text-gray-400 py-4 text-center">Henüz yorum yok.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Rated */}
                                <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md">
                                    <h3 className="font-bold text-chefie-text mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" /> En Yüksek Puanlı Tarifler
                                    </h3>
                                    <div className="space-y-3">
                                        {stats?.topRated?.length > 0 ? stats.topRated.map((r, i) => (
                                            <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-chefie-cream transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-600 font-black text-sm flex-shrink-0">#{i + 1}</div>
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-chefie-cream border border-chefie-border flex-shrink-0">
                                                    {r.image_url ? (
                                                        <img src={r.image_url.startsWith('/images/') ? r.image_url : `${API_BASE}${r.image_url}`} alt={r.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ChefHat className="w-4 h-4" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-chefie-text line-clamp-1 group-hover:text-[#10B981] transition-colors">{r.title}</div>
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
                                <h3 className="font-bold text-chefie-secondary mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <LayoutDashboard className="w-4 h-4 text-chefie-secondary" /> Genel Toplam
                                </h3>
                                <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-blue-600 truncate px-1">{stats?.counts?.recipes || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60 mt-1 break-words">Tarif</div>
                                    </div>
                                    <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-green-600 truncate px-1">{stats?.counts?.users || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-green-500/60 mt-1 break-words">Üye</div>
                                    </div>
                                    <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-orange-600 truncate px-1">{stats?.counts?.categories || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mt-1 break-words">Kategori</div>
                                    </div>
                                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-purple-600 truncate px-1">{stats?.counts?.comments || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-purple-500/60 mt-1 break-words">Yorum</div>
                                    </div>
                                    <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-rose-600 truncate px-1">{stats?.counts?.favorites || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500/60 mt-1 break-words">Favori</div>
                                    </div>
                                    <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-yellow-600 truncate px-1">{stats?.counts?.ratings || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-600/60 mt-1 break-words">Puan</div>
                                    </div>
                                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-center flex flex-col justify-center min-h-[90px]">
                                        <div className="text-xl sm:text-2xl font-black text-indigo-600 truncate px-1">{stats?.counts?.friendships || 0}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 mt-1 break-words">Takip</div>
                                    </div>
                                </div>
                            </div>

                            {/* User Activity */}
                            <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-chefie-text flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-cyan-500" /> Kullanıcı Aktivitesi
                                    </h3>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
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
                                            <div key={a.user_id} className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4 p-4 rounded-2xl bg-chefie-cream hover:bg-chefie-cream/80 transition-all border border-chefie-border">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {a.profile_image ? (
                                                        <img src={a.profile_image.startsWith('http') ? a.profile_image : `${API_BASE}${a.profile_image}`} alt={a.username} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-sm uppercase border border-gray-200">{(a.full_name || a.username || '?').charAt(0)}</div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className="text-sm font-bold text-chefie-text truncate">{a.full_name || a.username}</span>
                                                            {isOnline && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />}
                                                            {a.role === 'admin' && <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md uppercase border border-amber-200 shadow-sm leading-none">Admin</span>}
                                                            {a.country && (() => {
                                                                const ci = getCountryInfo(a.country);
                                                                return ci ? <span className="text-sm" title={ci.name}>{ci.flag}</span> : null;
                                                            })()}
                                                        </div>
                                                        <div className="text-[10px] text-chefie-secondary truncate">@{a.username}</div>
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

        if (activeTab === 'recommendation') {
            return (
                <tr>
                    <td colSpan="5" className="px-4 md:px-6 py-8">
                        <div className="max-w-4xl mx-auto space-y-10">
                            {/* Current Recommendation */}
                            <div className="bg-chefie-card p-8 rounded-[2.5rem] border border-chefie-border shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-chefie-text flex items-center gap-2">
                                        <Star className="w-5 h-5 text-chefie-yellow fill-current" /> Şu Anki Şefin Tavsiyesi
                                    </h3>
                                    {chefRecommendation && (
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                            YAYINDA
                                        </span>
                                    )}
                                </div>

                                {chefRecommendation ? (
                                    <div className="flex flex-col md:flex-row gap-8 items-center bg-chefie-cream/50 p-6 rounded-[2rem] border border-chefie-border">
                                        <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-chefie-card flex-shrink-0">
                                            <img
                                                src={chefRecommendation.image_url ? (chefRecommendation.image_url.startsWith('/images/') ? chefRecommendation.image_url : `${API_BASE}${chefRecommendation.image_url}`) : '/default-recipe.png'}
                                                alt={chefRecommendation.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="text-xs font-black text-chefie-yellow uppercase tracking-widest mb-1">{chefRecommendation.category_name || 'GENEL'}</div>
                                            <h4 className="text-2xl font-black text-chefie-text mb-3">{chefRecommendation.title}</h4>
                                            <p className="text-chefie-secondary text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{chefRecommendation.description}</p>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Clock className="w-4 h-4" /> {chefRecommendation.prep_time || 0} dk
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Users className="w-4 h-4" /> {chefRecommendation.servings || 4} Kişilik
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <Star className="w-4 h-4 text-chefie-yellow fill-current" /> {chefRecommendation.avg_rating ? Number(chefRecommendation.avg_rating).toFixed(1) : 'Yeni'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-chefie-cream rounded-[2rem] border-2 border-dashed border-chefie-border">
                                        <div className="w-16 h-16 bg-chefie-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Star className="w-8 h-8 text-chefie-secondary/20" />
                                        </div>
                                        <p className="text-chefie-secondary font-bold">Henüz bir tavsiye seçilmemiş.</p>
                                    </div>
                                )}
                            </div>

                            {/* Select New Recommendation */}
                            <div className="bg-chefie-card p-8 rounded-[2.5rem] border border-chefie-border shadow-2xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <h3 className="font-bold text-chefie-text flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-[#10B981]" /> Yeni Tavsiye Seç
                                    </h3>
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Tarif ara..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none text-sm transition-all text-chefie-text"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                                    {recipes
                                        .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((recipe) => (
                                            <div key={recipe.id} className="group p-4 bg-chefie-cream/50 hover:bg-chefie-card border border-chefie-border hover:border-[#10B981] rounded-2xl transition-all duration-300 flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-chefie-border flex-shrink-0">
                                                    <img
                                                        src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`) : '/default-recipe.png'}
                                                        alt={recipe.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-chefie-text line-clamp-1 group-hover:text-[#10B981] transition-colors">{recipe.title}</div>
                                                    <div className="text-[10px] text-chefie-secondary uppercase font-black tracking-widest mt-1">{recipe.category_name || 'GENEL'}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleSetRecommendation(recipe.id)}
                                                    disabled={isSavingRecommendation || chefRecommendation?.id === recipe.id}
                                                    className={`p-2 rounded-xl transition-all ${chefRecommendation?.id === recipe.id ? 'bg-green-500 text-white' : 'bg-chefie-card text-chefie-secondary hover:text-chefie-yellow hover:bg-chefie-cream border border-chefie-border shadow-md'}`}
                                                >
                                                    {chefRecommendation?.id === recipe.id ? (
                                                        <Star className="w-5 h-5 fill-current" />
                                                    ) : (
                                                        <ArrowRight className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        ))
                                    }
                                    {recipes.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                        <div className="col-span-full py-12 text-center text-chefie-secondary font-medium">Tarif bulunamadı.</div>
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
                    <td colSpan="5" className="px-6 py-12 bg-chefie-cream/30">
                        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
                            <div className="space-y-8">
                                <div className="bg-chefie-card p-8 rounded-3xl border border-chefie-border shadow-2xl">
                                    <h2 className="text-xl font-bold text-chefie-text mb-6">Profil Bilgilerini Güncelle</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-chefie-secondary mb-2">Ad Soyad</label>
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                className="w-full px-5 py-3 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none text-chefie-text"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-chefie-secondary mb-2">Ülke</label>
                                            <select
                                                value={profileData.country}
                                                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                                className="w-full px-5 py-3 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none appearance-none text-chefie-text"
                                            >
                                                <option value="">Ülke Seçiniz</option>
                                                {COUNTRY_LIST.map(c => (
                                                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                                                ))}
                                            </select>
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

                                <div className="bg-chefie-card p-8 rounded-3xl border border-chefie-border shadow-2xl">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Lock className="w-5 h-5 text-[#10B981]" />
                                        <h2 className="text-xl font-bold text-chefie-text">Şifre Değiştir</h2>
                                    </div>

                                    {passwordMessage.text && (
                                        <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-bold ${passwordMessage.type === 'success'
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-chefie-secondary mb-2">Mevcut Şifre</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPw ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Mevcut şifrenizi girin"
                                                    className="w-full px-5 py-3 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12 text-chefie-text placeholder:text-chefie-secondary/30"
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
                                            <label className="block text-sm font-medium text-chefie-secondary mb-2">Yeni Şifre</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPw ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Yeni şifrenizi girin (en az 6 karakter)"
                                                    className="w-full px-5 py-3 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12 text-chefie-text placeholder:text-chefie-secondary/30"
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
                                            <label className="block text-sm font-medium text-chefie-secondary mb-2">Yeni Şifre Tekrar</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPw ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Yeni şifrenizi tekrar girin"
                                                    className="w-full px-5 py-3 bg-chefie-cream border border-chefie-border rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none pr-12 text-chefie-text placeholder:text-chefie-secondary/30"
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
                                <img src="/images/chef-settings.jpg" alt="Chef Illustration" className="w-full max-w-md object-contain mix-blend-multiply dark:mix-blend-normal opacity-80 dark:opacity-60 dark:invert-[0.05]" />
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        return (
            filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <tr key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)} className="hover:bg-chefie-cream transition-colors group cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-chefie-cream border border-chefie-border">
                                    <img
                                        src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`) : '/default-recipe.png'}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-chefie-text">{recipe.title}</div>
                                    <div className="text-xs text-chefie-secondary">ID: #{recipe.id}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">{recipe.category_name || 'Genel'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-chefie-secondary">{new Date(recipe.created_at).toLocaleDateString('tr-TR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-chefie-secondary"><Clock className="w-4 h-4 inline mr-1" /> {recipe.prep_time || '30 dk'}</td>
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
        <div className="flex flex-col md:flex-row min-h-screen bg-chefie-cream font-sans pb-24 md:pb-0">
            {/* Mobile Header Box */}
            <div className="md:hidden flex items-center justify-between p-4 bg-chefie-card border-b border-chefie-border sticky top-0 z-30 shadow-md md:shadow-none">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/bitarif_logo_1.png" alt="Bi Tarif Logo" className="h-14 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 text-gray-400"
                        >
                            <Bell className="w-6 h-6" />
                            {pendingFriends.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-chefie-card animate-pulse"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-3 w-80 bg-chefie-card rounded-2xl shadow-2xl border border-chefie-border z-[100] overflow-hidden"
                                >
                                    <div className="p-4 border-b border-chefie-border flex items-center justify-between bg-chefie-cream">
                                        <h3 className="text-sm font-black text-chefie-text uppercase tracking-wider">Bildirimler</h3>
                                        <span className="bg-chefie-yellow text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                            {pendingFriends.length} YENİ
                                        </span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {pendingFriends.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Bell className="w-10 h-10 text-chefie-secondary/20 mx-auto mb-3" />
                                                <p className="text-xs font-bold text-chefie-secondary">Yeni bildirim bulunmuyor.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-chefie-border">
                                                {pendingFriends.map((request) => (
                                                    <div key={request.friendship_id} className="p-4 hover:bg-chefie-cream transition-colors">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-chefie-border">
                                                                <img
                                                                    src={request.profile_image ? (request.profile_image.startsWith('http') ? request.profile_image : `${API_BASE}${request.profile_image}`) : "https://cdn.dribbble.com/userupload/42512876/file/original-f83ea4a95013355104381d9512b4c4de.png"}
                                                                    alt={request.username}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-black text-chefie-text line-clamp-1">@{request.username}</p>
                                                                <p className="text-[10px] font-bold text-chefie-secondary uppercase tracking-tighter">Seni takip etmek istiyor</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAcceptFriend(request.friendship_id)}
                                                                className="flex-1 py-2 bg-chefie-yellow text-white text-[10px] font-black rounded-lg hover:bg-chefie-dark transition-all shadow-lg shadow-yellow-100 dark:shadow-none"
                                                            >
                                                                KABUL ET
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectFriend(request.friendship_id)}
                                                                className="flex-1 py-2 bg-chefie-cream text-chefie-secondary text-[10px] font-black rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                                                            >
                                                                REDDET
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link to={user?.id ? `/profile/${user.id}` : '#'}>
                        {user.profile_image ? (
                            <img src={user.profile_image.startsWith('http') ? user.profile_image : `${API_BASE}${user.profile_image}`} alt="User" className="w-8 h-8 rounded-full object-cover border border-chefie-border" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border border-chefie-border">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-chefie-secondary bg-chefie-cream rounded-xl ml-1"
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

            <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 w-64 bg-chefie-card border-r border-chefie-border flex flex-col fixed h-full z-50`}>
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
                            <button onClick={() => { setActiveTab('recommendation'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'recommendation' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Star className="w-5 h-5 mr-3" /> Şefin Tavsiyesi</button>
                        </>
                    )}
                    <div className="text-xs font-semibold text-gray-400 px-4 mb-2 mt-6 uppercase tracking-wide">Diğer</div>
                    <button onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Settings className="w-5 h-5 mr-3" /> Ayarlar</button>
                </nav>

                <div className="p-4 border-t border-chefie-border">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"><LogOut className="w-5 h-5 mr-3" /> Çıkış Yap</button>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-hidden">
                <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <h1 className="text-2xl font-bold text-chefie-text">
                            {activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'stats' ? 'İstatistikler' : activeTab === 'users' ? 'Kullanıcılar' : activeTab === 'recommendation' ? 'Şefin Tavsiyesi' : 'Ayarlar'}
                        </h1>
                        <div className="relative flex-1 hidden md:block ml-8">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Arama yapın..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-chefie-card border border-chefie-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] text-chefie-text"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 ml-auto border-l border-chefie-border pl-6 mr-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsDesktopNotificationsOpen(!isDesktopNotificationsOpen)}
                                className="relative p-2.5 text-gray-400 hover:bg-chefie-cream rounded-xl transition-all"
                            >
                                <Bell className="w-6 h-6" />
                                {pendingFriends.length > 0 && (
                                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-chefie-card animate-pulse"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isDesktopNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-3 w-80 bg-chefie-card rounded-2xl shadow-2xl border border-chefie-border z-[100] overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-chefie-border flex items-center justify-between bg-chefie-cream">
                                            <h3 className="text-sm font-black text-chefie-text uppercase tracking-wider">Bildirimler</h3>
                                            <span className="bg-chefie-yellow text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                {pendingFriends.length} YENİ
                                            </span>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {pendingFriends.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="w-10 h-10 text-chefie-secondary/20 mx-auto mb-3" />
                                                    <p className="text-xs font-bold text-chefie-secondary">Yeni bildirim bulunmuyor.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-chefie-border">
                                                    {pendingFriends.map((request) => (
                                                        <div key={request.friendship_id} className="p-4 hover:bg-chefie-cream transition-colors">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-chefie-border">
                                                                    <img
                                                                        src={request.profile_image ? (request.profile_image.startsWith('http') ? request.profile_image : `${API_BASE}${request.profile_image}`) : "https://cdn.dribbble.com/userupload/42512876/file/original-f83ea4a95013355104381d9512b4c4de.png"}
                                                                        alt={request.username}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-black text-chefie-text line-clamp-1">@{request.username}</p>
                                                                    <p className="text-[10px] font-bold text-chefie-secondary uppercase tracking-tighter">Seni takip etmek istiyor</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleAcceptFriend(request.friendship_id)}
                                                                    className="flex-1 py-2 bg-chefie-yellow text-white text-[10px] font-black rounded-lg hover:bg-chefie-dark transition-all shadow-lg shadow-yellow-100 dark:shadow-none"
                                                                >
                                                                    KABUL ET
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectFriend(request.friendship_id)}
                                                                    className="flex-1 py-2 bg-chefie-cream text-chefie-secondary text-[10px] font-black rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                                                                >
                                                                    REDDET
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <Link to={user?.id ? `/profile/${user.id}` : '#'} className="hidden md:flex items-center gap-3 pl-6 border-l border-chefie-border hover:opacity-80 transition-opacity">
                        {user.profile_image ? (
                            <img src={user.profile_image.startsWith('http') ? user.profile_image : `${API_BASE}${user.profile_image}`} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                        )}
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-bold text-chefie-text">{user.full_name || user.username}</div>
                            <div className="text-xs text-chefie-secondary uppercase">{user.role || 'User'}</div>
                        </div>
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-chefie-text">{totalCount}</div><div className="text-sm text-chefie-secondary">Tarif</div></div>
                    </div>
                    <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center"><Folder className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-chefie-text">{categories.length}</div><div className="text-sm text-chefie-secondary">Kategori</div></div>
                    </div>
                    <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-chefie-text">{users.length}</div><div className="text-sm text-chefie-secondary">Kullanıcı</div></div>
                    </div>
                    <div className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-md flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center"><Heart className="w-6 h-6" /></div>
                        <div><div className="text-2xl font-bold text-chefie-text">{favorites.length}</div><div className="text-sm text-chefie-secondary">Favori</div></div>
                    </div>
                </div>

                <div className="bg-chefie-card rounded-3xl border border-chefie-border shadow-md overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full">
                    <div className="p-4 md:p-6 border-b border-chefie-border flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                        <h2 className="text-lg font-bold text-chefie-text">{activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'users' ? 'Kullanıcılar' : activeTab === 'stats' ? 'İstatistikler' : activeTab === 'recommendation' ? 'Şefin Tavsiyesi' : 'Ayarlar'}</h2>
                        {activeTab === 'all' && (
                            <Link to="/admin/recipes/new" className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold rounded-xl flex items-center gap-2"><Plus className="w-4 h-4" /> Yeni Ekle</Link>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {activeTab === 'all' && (
                                <thead className="bg-chefie-cream/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase relative" style={{ minWidth: '160px' }}>
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-chefie-border rounded-lg text-xs font-semibold text-chefie-secondary uppercase focus:outline-none appearance-none cursor-pointer hover:border-[#10B981] transition-colors"
                                                >
                                                    <option value="">KATEGORİ / ID</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Süre</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-chefie-secondary uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}

                            {activeTab === 'favorites' && (
                                <thead className="bg-chefie-cream/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase relative" style={{ minWidth: '160px' }}>
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 bg-transparent border border-chefie-border rounded-lg text-xs font-semibold text-chefie-secondary uppercase focus:outline-none appearance-none cursor-pointer hover:border-[#10B981] transition-colors"
                                                >
                                                    <option value="">KATEGORİ / ID</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Süre</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-chefie-secondary uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}

                            {activeTab === 'users' && (
                                <thead className="bg-chefie-cream/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">İsim</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Tarih</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-chefie-secondary uppercase">Rol</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-chefie-secondary uppercase">İşlemler</th>
                                    </tr>
                                </thead>
                            )}
                            <tbody className="divide-y divide-chefie-border">{renderTableContent()}</tbody>
                        </table>
                    </div>

                    {activeTab === 'all' && hasMore && recipes.length > 0 && (
                        <div className="p-6 bg-chefie-cream/50 text-center border-t border-chefie-border">
                            <button onClick={() => fetchRecipes(true)} className="px-6 py-2 bg-chefie-card border border-chefie-border text-chefie-secondary font-bold rounded-xl hover:bg-chefie-cream transition-all shadow-md">Daha Fazla</button>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-chefie-card rounded-2xl p-6 w-full max-w-md border border-chefie-border shadow-2xl">
                        <h3 className="text-xl font-bold text-chefie-text mb-4">Kullanıcı Düzenle: @{editingUser.username}</h3>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-chefie-secondary mb-1">Rol</label>
                                <select
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-chefie-cream border border-chefie-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] text-chefie-text"
                                >
                                    <option value="user">Kullanıcı</option>
                                    <option value="admin">Yönetici</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-chefie-secondary mb-1">Yorum İzni</label>
                                <select
                                    value={editFormData.can_comment}
                                    onChange={(e) => setEditFormData({ ...editFormData, can_comment: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 bg-chefie-cream border border-chefie-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981] text-chefie-text"
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
