import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage } from '../../utils/storage';
import API_BASE from '../../utils/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Folder,
    Settings,
    LogOut,
    Search,
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
    ArrowRight,
    UserPlus,
    History,
    Globe,
    UserCheck,
    Calendar,
    Sparkles,
    Info,
    Save,
    Bell
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../../components/NotificationBell';

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
    const navigate = useNavigate();
    const location = useLocation();
    const token = safeGetToken();
    const user = JSON.parse(safeGetSessionStorage('user') || '{}');

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
    const [editFormData, setEditFormData] = useState({ role: 'user', can_comment: 1 });

    // Notification Recipient States
    const [viewingHistoryId, setViewingHistoryId] = useState(null);
    const [recipientsList, setRecipientsList] = useState([]);
    const [isRecipientsLoading, setIsRecipientsLoading] = useState(false);

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

    const [isSendingNotif, setIsSendingNotif] = useState(false);
    const [welcomeTemplate, setWelcomeTemplate] = useState({ title: '', message: '' });
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [templateMessage, setTemplateMessage] = useState({ type: '', text: '' });
    const [feedback, setFeedback] = useState([]);
    const [notificationHistory, setNotificationHistory] = useState([]);
    const [notifForm, setNotifForm] = useState({
        target: 'all',
        userIds: [],
        title: '',
        message: ''
    });

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const initDashboard = async () => {
            const basicFetches = [
                fetchTotalCount(),
                fetchFavorites(),
                fetchCategories(),
                fetchStats()
            ];

            const adminFetches = user.role === 'admin' ? [
                fetchUsers(),
                fetchActivity(),
                fetchRecommendation(),
                fetchNotificationHistory()
            ] : [];

            await Promise.all([...basicFetches, ...adminFetches]);
        };

        initDashboard();

        // Refresh activity data every 60 seconds
        const activityInterval = setInterval(() => {
            if (user.role === 'admin') {
                fetchActivity();
                fetchFeedback();
                fetchNotificationHistory();
            }
        }, 60000);

        return () => clearInterval(activityInterval);
    }, [token, navigate, user.role]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['all', 'favorites', 'stats', 'users', 'settings', 'recommendation', 'feedback', 'send_notification'].includes(tab)) {
            setActiveTab(tab);
        }
        // Always fetch template if target tab is send_notification or activeTab is changed to it
        if ((tab === 'send_notification' || activeTab === 'send_notification') && user.role === 'admin') {
            fetchWelcomeTemplate();
        }
    }, [location.search, activeTab, user.role]);

    const fetchWelcomeTemplate = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/notifications/welcome-template`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWelcomeTemplate(res.data);
        } catch (err) {
            console.error('Error fetching welcome template:', err);
        }
    };

    const handleUpdateTemplate = async (e) => {
        if (e) e.preventDefault();
        setIsSavingTemplate(true);
        setTemplateMessage({ type: '', text: '' });
        try {
            await axios.post(`${API_BASE}/api/notifications/welcome-template`, welcomeTemplate, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTemplateMessage({ type: 'success', text: 'Karşılama şablonu güncellendi!' });
        } catch (err) {
            console.error('Error updating welcome template:', err);
            setTemplateMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const fetchNotificationHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/notifications/admin-history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotificationHistory(res.data);
        } catch (err) {
            console.error('Error fetching notification history:', err);
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

    const fetchFeedback = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/feedback`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedback(res.data);
        } catch (err) {
            console.error('Error fetching feedback:', err);
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

    const handleUpdateFeedbackStatus = async (id, status) => {
        try {
            await axios.put(`${API_BASE}/api/feedback/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFeedback();
        } catch (err) {
            console.error('Error updating feedback status:', err);
            alert('Durum güncellenemedi.');
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        if (!notifForm.title || !notifForm.message) return;
        if (notifForm.target === 'specific' && notifForm.userIds.length === 0) {
            alert('Lütfen en az bir kullanıcı seçin.');
            return;
        }

        setIsSendingNotif(true);
        try {
            await axios.post(`${API_BASE}/api/notifications/send`, notifForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Bildirim başarıyla gönderildi!');
            setNotifForm({
                target: 'all',
                userIds: [],
                title: '',
                message: ''
            });
        } catch (err) {
            console.error('Error sending notification:', err);
            alert(err.response?.data?.error || 'Bildirim gönderilemedi.');
        } finally {
            setIsSendingNotif(false);
        }
    };

    const fetchRecipients = async (historyId) => {
        setViewingHistoryId(historyId);
        setIsRecipientsLoading(true);
        try {
            const token = safeGetToken();
            const res = await axios.get(`${API_BASE}/api/notifications/admin-history/${historyId}/recipients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecipientsList(res.data);
        } catch (err) {
            console.error('Error fetching recipients:', err);
        } finally {
            setIsRecipientsLoading(false);
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
            if (token) {
                fetchRecipes();
                if (user.role === 'admin') fetchFeedback();
            }
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
                await axios.delete(`${API_BASE}/api/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            safeSetSessionStorage('user', JSON.stringify(userRes.data));
            window.location.reload();
        } catch (err) {
            alert('Profil güncelleme başarısız.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        safeClearAuth();
        safeClearAuth();
        safeRemoveStorage('user');
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
                                            <img src={(u.profile_image.startsWith('http') || u.profile_image.startsWith('data:')) ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name} className="w-10 h-10 rounded-full object-cover border border-chefie-border hover:border-[#10B981] transition-colors" />
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
                                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                                                    <img
                                                        src={r.image_url ? (r.image_url.startsWith('/images/') ? r.image_url : `${API_BASE}${r.image_url}`) : '/default-recipe.png'}
                                                        alt={r.title}
                                                        className="w-full h-full object-cover"
                                                    />
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
                                                    <img src={(u.profile_image.startsWith('http') || u.profile_image.startsWith('data:')) ? u.profile_image : `${API_BASE}${u.profile_image}`} alt={u.full_name || u.username} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
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
                            </div>

                            {/* Totals Grid */}
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
                                        const lastActiveTime = a.last_active ? new Date(a.last_active) : null;
                                        const isOnline = lastActiveTime && (Date.now() - lastActiveTime.getTime()) < 2 * 60 * 1000;
                                        const timeStr = lastActiveTime ? lastActiveTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';
                                        
                                        return (
                                            <div key={a.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-chefie-cream border border-chefie-border group/activity hover:shadow-sm transition-all">
                                                <div className="relative">
                                                    {a.profile_image ? (
                                                        <img src={(a.profile_image.startsWith('http') || a.profile_image.startsWith('data:')) ? a.profile_image : `${API_BASE}${a.profile_image}`} className="w-10 h-10 rounded-full object-cover border border-chefie-border" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm uppercase border border-chefie-border">{(a.full_name || a.username).charAt(0)}</div>
                                                    )}
                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-chefie-card ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} title={isOnline ? 'Çevrimiçi' : 'Çevrimdışı'} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-chefie-text truncate">
                                                        {a.full_name || a.username}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className={`text-[10px] font-black uppercase tracking-wider ${isOnline ? 'text-green-500' : 'text-chefie-secondary'}`}>
                                                            {isOnline ? 'ÇEVRİMİÇİ' : 'SON AKTİF'}
                                                        </span>
                                                        {lastActiveTime && !isOnline && (
                                                            <span className="text-[10px] text-chefie-secondary font-medium">
                                                                · {lastActiveTime.toLocaleDateString('tr-TR')} {lastActiveTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-sm text-gray-400 py-4 text-center">Aktivite yok.</div>
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
                    <td colSpan="5" className="px-6 py-8">
                        <div className="space-y-8">
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

        if (activeTab === 'feedback') {
            return (
                <tr>
                    <td colSpan="5" className="px-6 py-8">
                        <div className="space-y-6">
                            {feedback.length > 0 ? feedback.map((item) => (
                                <div key={item.id} className="bg-chefie-card p-6 rounded-2xl border border-chefie-border shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                                                (item.type === 'bug' || item.type === 'bug_report') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                                            }`}>
                                                {(item.type === 'bug' || item.type === 'bug_report') ? '⚠️ Hata Bildirimi' : '💡 Öneri'}
                                            </span>
                                            <span className="text-xs text-chefie-secondary font-bold pb-0.5 border-b-2 border-chefie-yellow/20">
                                                {new Date(item.created_at).toLocaleDateString('tr-TR')} {new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                                            className="text-xs font-bold bg-chefie-cream border border-chefie-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-chefie-yellow transition-all"
                                        >
                                            <option value="pending">🕒 Beklemede</option>
                                            <option value="reviewed">👀 İncelendi</option>
                                            <option value="resolved">✅ Çözüldü</option>
                                        </select>
                                    </div>
                                    <div className="bg-chefie-cream/50 p-4 rounded-xl border border-chefie-border mb-4">
                                        <div className="text-xs font-bold text-chefie-secondary uppercase tracking-[0.1em] mb-2 opacity-50">Mesaj İçeriği:</div>
                                        <p className="text-sm text-chefie-text font-medium leading-relaxed whitespace-pre-wrap">{item.content}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-chefie-border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden border border-gray-200">
                                                {item.profile_image ? (
                                                    <img src={(item.profile_image.startsWith('http') || item.profile_image.startsWith('data:')) ? item.profile_image : `${API_BASE}${item.profile_image}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-chefie-yellow/10 text-chefie-yellow flex items-center justify-center">
                                                        {(item.full_name || item.username).charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-chefie-text">
                                                    {item.full_name || item.username}
                                                </span>
                                                <span className="text-[10px] text-chefie-secondary">@{item.username}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-chefie-secondary/30 uppercase tracking-widest">
                                            ID: #{item.id}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center">
                                    <MessageSquare className="w-12 h-12 text-chefie-secondary/20 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-chefie-secondary">Henüz bir geri bildirim bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            );
        }

        if (activeTab === 'send_notification') {
            return (
                <tr>
                    <td colSpan="5" className="px-6 py-8">
                        <div className="max-w-4xl mx-auto">
                            <form onSubmit={handleSendNotification} className="bg-chefie-card p-8 rounded-[2.5rem] border border-chefie-border shadow-2xl space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-chefie-text mb-3 uppercase tracking-wider">Hedef Kitle</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifForm({ ...notifForm, target: 'all' })}
                                                    className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all border ${notifForm.target === 'all' ? 'bg-chefie-yellow text-white border-chefie-yellow shadow-lg' : 'bg-chefie-cream text-chefie-secondary border-chefie-border hover:bg-chefie-cream/80'}`}
                                                >
                                                    Tüm Kullanıcılar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifForm({ ...notifForm, target: 'specific' })}
                                                    className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all border ${notifForm.target === 'specific' ? 'bg-chefie-yellow text-white border-chefie-yellow shadow-lg' : 'bg-chefie-cream text-chefie-secondary border-chefie-border hover:bg-chefie-cream/80'}`}
                                                >
                                                    Belirli Kullanıcılar
                                                </button>
                                            </div>
                                        </div>

                                        {notifForm.target === 'specific' && (
                                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                                <label className="block text-sm font-bold text-chefie-text mb-3 uppercase tracking-wider">Kullanıcı Seçin ({notifForm.userIds.length})</label>
                                                <div className="max-h-[300px] overflow-y-auto border border-chefie-border rounded-2xl bg-chefie-cream p-4 space-y-2 scrollbar-thin">
                                                    {users.map(u => (
                                                        <label key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-chefie-card border border-chefie-border/50 hover:border-chefie-yellow transition-all cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={notifForm.userIds.includes(u.id)}
                                                                onChange={(e) => {
                                                                    const newIds = e.target.checked
                                                                        ? [...notifForm.userIds, u.id]
                                                                        : notifForm.userIds.filter(id => id !== u.id);
                                                                    setNotifForm({ ...notifForm, userIds: newIds });
                                                                }}
                                                                className="w-4 h-4 rounded border-chefie-border text-chefie-yellow focus:ring-chefie-yellow"
                                                            />
                                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-chefie-border flex-shrink-0">
                                                                {u.profile_image ? (
                                                                    <img src={(u.profile_image.startsWith('http') || u.profile_image.startsWith('data:')) ? u.profile_image : `${API_BASE}${u.profile_image}`} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-chefie-yellow/10 text-chefie-yellow flex items-center justify-center font-bold text-xs uppercase">
                                                                        {(u.full_name || u.username).charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-bold text-chefie-text truncate">@{u.username}</div>
                                                                <div className="text-[10px] text-chefie-secondary truncate">{u.full_name}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-chefie-text mb-3 uppercase tracking-wider">Bildirim Başlığı</label>
                                            <input
                                                type="text"
                                                value={notifForm.title}
                                                onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                                                placeholder="Örn: Hafta Sonu Sürprizi!"
                                                className="w-full px-5 py-4 bg-chefie-cream border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow outline-none text-chefie-text font-bold shadow-inner"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-chefie-text mb-3 uppercase tracking-wider">Bildirim Mesajı</label>
                                            <textarea
                                                value={notifForm.message}
                                                onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                                                placeholder="Bildirim içeriğini buraya yazın..."
                                                rows="5"
                                                className="w-full px-5 py-4 bg-chefie-cream border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow outline-none text-chefie-text font-medium shadow-inner resize-none"
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSendingNotif || !notifForm.title || !notifForm.message}
                                            className="w-full py-5 bg-chefie-yellow text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-chefie-yellow/20 flex items-center justify-center gap-3"
                                        >
                                            {isSendingNotif ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> GÖNDERİLİYOR...</>
                                            ) : (
                                                <><Bell className="w-5 h-5" /> BİLDİRİMİ GÖNDER</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Welcome Notification Template Management */}
                            <div className="mt-16 space-y-8">
                                <div className="flex items-center gap-4 px-4">
                                    <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-chefie-yellow/20 to-chefie-yellow/5 text-chefie-yellow flex items-center justify-center shadow-sm border border-chefie-yellow/10">
                                        <Sparkles className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-chefie-text tracking-tight">Yeni Üye Karşılama Şablonu</h3>
                                        <p className="text-xs font-bold text-chefie-secondary uppercase tracking-[0.2em] opacity-60 mt-1">Sistem Hoş Geldin Mesajı Ayarları</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                                    {/* Editor Card */}
                                    <div className="xl:col-span-3 bg-chefie-card p-8 rounded-[40px] border border-chefie-border shadow-2xl space-y-8">
                                        {templateMessage.text && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${templateMessage.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                            >
                                                {templateMessage.type === 'success' ? <UserCheck className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                                {templateMessage.text}
                                            </motion.div>
                                        )}

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="block text-xs font-black text-chefie-text uppercase tracking-widest ml-1">Şeblon Başlığı</label>
                                                <input
                                                    type="text"
                                                    value={welcomeTemplate.title || ''}
                                                    onChange={(e) => setWelcomeTemplate({ ...welcomeTemplate, title: e.target.value })}
                                                    placeholder="Örn: Aramıza Hoş Geldin!"
                                                    className="w-full px-6 py-4 bg-chefie-cream/50 border border-chefie-border rounded-[22px] focus:ring-4 focus:ring-chefie-yellow/10 focus:border-chefie-yellow outline-none text-chefie-text font-bold transition-all shadow-inner"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-xs font-black text-chefie-text uppercase tracking-widest ml-1">Şablon Mesajı</label>
                                                <textarea
                                                    value={welcomeTemplate.message || ''}
                                                    onChange={(e) => setWelcomeTemplate({ ...welcomeTemplate, message: e.target.value })}
                                                    placeholder="Karşılama mesajınızı buraya yazın..."
                                                    rows="5"
                                                    className="w-full px-6 py-5 bg-chefie-cream/50 border border-chefie-border rounded-[22px] focus:ring-4 focus:ring-chefie-yellow/10 focus:border-chefie-yellow outline-none text-chefie-text font-medium transition-all shadow-inner resize-none min-h-[160px]"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="p-5 bg-chefie-dark/5 border border-chefie-dark/10 rounded-[28px] flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-chefie-dark text-white flex items-center justify-center flex-shrink-0">
                                                    <Info className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-black text-chefie-dark uppercase tracking-wider">Değişken Kullanımı</h4>
                                                    <p className="text-[11px] text-chefie-secondary font-bold leading-relaxed">
                                                        Metin içerisinde <code className="bg-chefie-dark/10 px-2 py-0.5 rounded text-chefie-dark">{"{isim}"}</code> etiketini kullanarak kullanıcının adını otomatik olarak ekleyebilirsiniz.
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleUpdateTemplate}
                                                disabled={isSavingTemplate || !welcomeTemplate.title || !welcomeTemplate.message}
                                                className="group w-full py-5 bg-chefie-dark text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
                                            >
                                                {isSavingTemplate ? (
                                                    <><Loader2 className="w-5 h-5 animate-spin" /> SİSTEME İŞLENİYOR...</>
                                                ) : (
                                                    <><Save className="w-5 h-5 group-hover:rotate-12 transition-transform" /> ŞABLONU SİSTEME KAYDET</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Live Preview Card */}
                                    <div className="xl:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between px-4">
                                            <h4 className="text-xs font-black text-chefie-secondary uppercase tracking-widest">Canlı Önizleme</h4>
                                            <span className="text-[10px] font-bold text-chefie-yellow bg-chefie-yellow/10 px-2 py-1 rounded-md">Masaüstü Görünümü</span>
                                        </div>
                                        
                                        <div className="relative p-6 bg-chefie-cream/30 border border-dashed border-chefie-border rounded-[40px] flex items-center justify-center min-h-[300px]">
                                            <motion.div 
                                                className="w-full max-w-[380px] bg-chefie-card rounded-2xl shadow-2xl border border-chefie-border overflow-hidden flex flex-col pointer-events-none"
                                            >
                                                <div className="p-5 bg-chefie-cream border-b border-chefie-border flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-chefie-yellow/10 flex items-center justify-center text-chefie-yellow">
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-black text-chefie-text leading-tight">{welcomeTemplate.title || 'Bildirim Başlığı'}</h3>
                                                            <span className="text-[9px] font-bold text-chefie-secondary uppercase tracking-wider">Hemen Şimdi</span>
                                                        </div>
                                                    </div>
                                                    <X className="w-4 h-4 text-chefie-secondary/40" />
                                                </div>
                                                <div className="p-6">
                                                    <p className="text-chefie-text text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                                        {welcomeTemplate.message ? welcomeTemplate.message.replace('{isim}', user.full_name || user.username) : 'Bildirim mesajı içeriği burada görünecek...'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                            
                                            <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                                                <div className="px-4 py-1.5 bg-chefie-card border border-chefie-border rounded-full shadow-lg">
                                                    <p className="text-[10px] font-black text-chefie-secondary uppercase tracking-tighter">Yeni Üyeye Gidecek Görünüm</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-chefie-card/50 p-6 rounded-[32px] border border-chefie-border/50">
                                            <p className="text-[10px] text-chefie-secondary font-bold leading-relaxed text-center italic">
                                                * Bu şablon, sisteme yeni kayıt olan her kullanıcıya otomatik olarak gönderilir. Değişiklikler anında sisteme yansıtılır.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification History Section */}
                            <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-12 h-12 rounded-2xl bg-chefie-yellow/10 text-chefie-yellow flex items-center justify-center">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-chefie-text uppercase tracking-tight">Gönderilen Bildirimler</h3>
                                        <p className="text-xs font-bold text-chefie-secondary uppercase tracking-widest">{notificationHistory.length} Kayıt Listeleniyor</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {notificationHistory.length === 0 ? (
                                        <div className="bg-chefie-card p-12 rounded-[2.5rem] border border-chefie-border text-center shadow-lg">
                                            <History className="w-16 h-16 text-chefie-secondary/10 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-chefie-secondary uppercase tracking-widest">Henüz bildirim geçmişi bulunmuyor.</p>
                                        </div>
                                    ) : (
                                        notificationHistory.map((item) => (
                                            <div 
                                                key={item.id} 
                                                className="bg-chefie-card p-6 rounded-[2rem] border border-chefie-border shadow-md hover:shadow-xl hover:border-chefie-yellow/50 transition-all duration-300 group"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <h4 className="text-sm font-black text-chefie-text leading-tight group-hover:text-chefie-yellow transition-colors">{item.title}</h4>
                                                                <p className="text-[11px] text-chefie-secondary font-medium line-clamp-2 md:line-clamp-1">{item.message}</p>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 flex-shrink-0 ${item.target_type === 'all' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                                                {item.target_type === 'all' ? (
                                                                    <><Globe className="w-3 h-3" /> TÜMÜ</>
                                                                ) : (
                                                                    <><Users className="w-3 h-3" /> ÖZEL</>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-chefie-border/50">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-chefie-secondary">
                                                                <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
                                                                <span className="text-chefie-text">@{item.sender_name || 'Admin'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-chefie-secondary">
                                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                                <span>{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                                                            </div>
                                                            <div 
                                                                onClick={(e) => { e.stopPropagation(); fetchRecipients(item.id); }}
                                                                className="flex items-center gap-1.5 text-[10px] font-bold text-chefie-secondary hover:text-chefie-yellow cursor-pointer transition-colors p-1 rounded-md hover:bg-chefie-yellow/5"
                                                            >
                                                                <Users className="w-3.5 h-3.5 text-purple-400" />
                                                                <span className="text-chefie-text underline decoration-chefie-yellow/30 underline-offset-2">{item.recipient_count} Alıcı</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
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
                    <NotificationBell isMobile={true} />

                    <Link to={user?.id ? `/profile/${user.id}` : '#'}>
                        {user.profile_image ? (
                            <img src={(user.profile_image.startsWith('http') || user.profile_image.startsWith('data:')) ? user.profile_image : `${API_BASE}${user.profile_image}`} alt="User" className="w-8 h-8 rounded-full object-cover border border-chefie-border" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-chefie-cream text-chefie-dark flex items-center justify-center font-bold text-xs border border-chefie-border">{(user.full_name || user.username || 'A').charAt(0).toUpperCase()}</div>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 flex items-center justify-center text-chefie-secondary bg-chefie-cream rounded-xl border border-chefie-border"
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
                            <button onClick={() => { setActiveTab('feedback'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'feedback' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><MessageSquare className="w-5 h-5 mr-3" /> Öneriler & Hatalar</button>
                            <button onClick={() => { setActiveTab('send_notification'); setIsMobileMenuOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'send_notification' ? 'bg-[#FFFBF2] text-[#10B981]' : 'text-gray-500 hover:bg-gray-50'}`}><Plus className="w-5 h-5 mr-3" /> Bildirim Gönder</button>
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
                            {activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'stats' ? 'İstatistikler' : activeTab === 'users' ? 'Kullanıcılar' : activeTab === 'recommendation' ? 'Şefin Tavsiyesi' : activeTab === 'feedback' ? 'Öneriler & Hatalar' : activeTab === 'send_notification' ? 'Bildirim Gönder' : 'Ayarlar'}
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
                        <NotificationBell />
                    </div>

                    <Link to={user?.id ? `/profile/${user.id}` : '#'} className="hidden md:flex items-center gap-3 pl-6 border-l border-chefie-border hover:opacity-80 transition-opacity">
                        {user.profile_image ? (
                            <img src={(user.profile_image.startsWith('http') || user.profile_image.startsWith('data:')) ? user.profile_image : `${API_BASE}${user.profile_image}`} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
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
                        <h2 className="text-lg font-bold text-chefie-text">{activeTab === 'all' ? 'Tüm Tarifler' : activeTab === 'favorites' ? 'Favorilerim' : activeTab === 'users' ? 'Kullanıcılar' : activeTab === 'stats' ? 'İstatistikler' : activeTab === 'recommendation' ? 'Şefin Tavsiyesi' : activeTab === 'feedback' ? 'Öneriler & Hatalar' : activeTab === 'send_notification' ? 'Bildirim Gönder' : 'Ayarlar'}</h2>
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

            {/* Recipients Modal */}
            {viewingHistoryId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-chefie-card rounded-[32px] w-full max-w-lg border border-chefie-border shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-chefie-border flex items-center justify-between bg-chefie-cream/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-chefie-text uppercase tracking-tight">Alıcı Listesi</h3>
                                    <p className="text-[10px] font-bold text-chefie-secondary uppercase tracking-widest">{recipientsList.length} Kullanıcı bulundu</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setViewingHistoryId(null); setRecipientsList([]); }}
                                className="w-10 h-10 rounded-xl bg-chefie-card border border-chefie-border flex items-center justify-center text-chefie-secondary hover:text-red-500 hover:border-red-500/20 transition-all shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
                            {isRecipientsLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-10 h-10 text-chefie-yellow animate-spin" />
                                    <p className="text-sm font-bold text-chefie-secondary uppercase tracking-widest">Yükleniyor...</p>
                                </div>
                            ) : recipientsList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {recipientsList.map((rec) => (
                                        <div key={rec.id} className="flex items-center gap-4 p-4 rounded-2xl bg-chefie-cream/50 border border-chefie-border/50 hover:bg-chefie-card hover:border-chefie-yellow/30 transition-all group">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-chefie-border shadow-sm flex-shrink-0">
                                                {rec.profile_image ? (
                                                    <img src={(rec.profile_image.startsWith('http') || rec.profile_image.startsWith('data:')) ? rec.profile_image : `${API_BASE}${rec.profile_image}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-chefie-yellow/10 text-chefie-yellow flex items-center justify-center font-bold text-sm uppercase">
                                                        {(rec.full_name || rec.username).charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-black text-chefie-text group-hover:text-chefie-yellow transition-colors truncate">
                                                    {rec.full_name || 'İsimsiz Kullanıcı'}
                                                </div>
                                                <div className="text-[11px] font-bold text-chefie-secondary truncate">@{rec.username}</div>
                                            </div>
                                            <div className="text-[10px] font-black text-chefie-secondary/40 uppercase tracking-tighter">ID: #{rec.id}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm font-bold text-chefie-secondary">Henüz taranmış bir alıcı verisi bulunamadı.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 border-t border-chefie-border bg-chefie-cream/30">
                            <button 
                                onClick={() => { setViewingHistoryId(null); setRecipientsList([]); }}
                                className="w-full py-4 bg-chefie-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all"
                            >
                                Pencereyi Kapat
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
