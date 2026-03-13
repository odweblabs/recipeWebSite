import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage } from '../utils/storage';
import API_BASE from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, ChefHat, MessageSquare, Clock, Heart, Trash2, Edit, X, Save, UserPlus, UserCheck, UserX, Users, Check, Loader2, LogOut, ShoppingCart, ArrowRight, Bell, Globe, Flame, Settings, BadgeCheck, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [comments, setComments] = useState([]);
    const [menus, setMenus] = useState([]);
    const [userLists, setUserLists] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recipes');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Comment Edit State
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    // Friend System State
    const [friendStatus, setFriendStatus] = useState({ status: 'none' }); // none | pending | accepted
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friendActionLoading, setFriendActionLoading] = useState(false);

    // Follower / Following Modal States
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const token = safeGetToken();
    const currentUser = JSON.parse(safeGetSessionStorage('user') || '{}');
    const isOwner = currentUser.id === parseInt(id);
    const isLoggedIn = !!token && !!currentUser.id;

    const fetchRecipes = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset + LIMIT : 0;
            const res = await axios.get(`${API_BASE}/api/recipes/users/${id}/recipes?limit=${LIMIT}&offset=${currentOffset}`);

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

    // Fetch friend status between current user and profile user
    const fetchFriendStatus = async () => {
        if (!isLoggedIn || isOwner) return;
        try {
            const res = await axios.get(`${API_BASE}/api/friends/status/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus(res.data);
        } catch (err) {
            console.error('Error fetching friend status:', err);
        }
    };

    // Fetch friends list for this profile
    const fetchFriends = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/friends/${id}`);
            setFriends(res.data);
        } catch (err) {
            console.error('Error fetching friends:', err);
        }
    };

    const fetchUserLists = async () => {
        if (!isOwner || !token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/lists`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserLists(res.data);
        } catch (err) {
            console.error('Error fetching user lists:', err);
        }
    };

    const fetchUserFavorites = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/favorites/user/${id}`);
            setUserFavorites(res.data);
        } catch (err) {
            console.error('Error fetching user favorites:', err);
        }
    };

    const fetchPendingRequests = async () => {
        if (!isOwner || !token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/friends/requests/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(res.data);
        } catch (err) {
            console.error('Error fetching pending requests:', err);
        }
    };

    const fetchNotifications = async () => {
        if (!isOwner || !token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`${API_BASE}/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const markNotificationsAsRead = async () => {
        if (!isOwner || !token || notifications.filter(n => !n.is_read).length === 0) return;
        try {
            await axios.put(`${API_BASE}/api/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    const handleLogout = () => {
        if (!window.confirm(t('profile.logout_confirm'))) return;
        safeClearAuth();
        safeClearAuth();
        safeRemoveStorage('user');
        navigate('/');
        window.location.reload(); // Refresh to clear all states
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Parallelize all initial profile data fetching
                const [
                    profileRes,
                    commentsRes,
                    friendsRes,
                    friendStatusRes,
                    pendingRequestsRes,
                    userListsRes,
                    userFavoritesRes,
                    notificationsRes
                ] = await Promise.all([
                    axios.get(`${API_BASE}/api/auth/users/${id}/profile`),
                    axios.get(`${API_BASE}/api/recipes/users/${id}/comments`),
                    axios.get(`${API_BASE}/api/friends/${id}`),
                    (isLoggedIn && !isOwner) ? axios.get(`${API_BASE}/api/friends/status/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve({ data: { status: 'none' } }),
                    (isOwner && token) ? axios.get(`${API_BASE}/api/friends/requests/pending`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve({ data: [] }),
                    (isOwner && token) ? axios.get(`${API_BASE}/api/lists`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve({ data: [] }),
                    axios.get(`${API_BASE}/api/favorites/user/${id}`),
                    (isOwner && token) ? axios.get(`${API_BASE}/api/notifications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve({ data: [] })
                ]);

                setProfile(profileRes.data);
                setComments(commentsRes.data);
                setFriends(friendsRes.data);
                setFriendStatus(friendStatusRes.data);
                setPendingRequests(pendingRequestsRes.data);
                setUserLists(userListsRes.data);
                setUserFavorites(userFavoritesRes.data);
                setNotifications(notificationsRes.data);

                // Fetch recipes separately as it might be larger or has its own logic
                await fetchRecipes();

                // Load menus from localStorage only for profile owner
                try {
                    const rawMenus = safeGetStorage('chefie_menus_v1', '[]');
                    if (rawMenus) {
                        const parsed = JSON.parse(rawMenus);
                        if (Array.isArray(parsed)) {
                            const ownerId = parseInt(id);
                            const userMenus = parsed.filter(m => {
                                if (!m.createdBy || !m.createdBy.id) return isOwner && !profileRes.data.id; // fallback
                                return parseInt(m.createdBy.id) === ownerId;
                            });
                            setMenus(userMenus);
                        }
                    }
                } catch {
                    setMenus([]);
                }

            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, isLoggedIn, isOwner, token]);

    // Friend Action Handlers
    const sendFriendRequest = async () => {
        setFriendActionLoading(true);
        try {
            await axios.post(`${API_BASE}/api/friends/request/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchFriendStatus();
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        } finally {
            setFriendActionLoading(false);
        }
    };

    const cancelFriendRequest = async () => {
        setFriendActionLoading(true);
        try {
            await axios.delete(`${API_BASE}/api/friends/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        } finally {
            setFriendActionLoading(false);
        }
    };

    const removeFriend = async () => {
        if (!window.confirm(t('profile.unfollow_confirm'))) return;
        setFriendActionLoading(true);
        try {
            await axios.delete(`${API_BASE}/api/friends/remove/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
            setFriends(prev => prev.filter(f => f.id !== parseInt(id)));
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        } finally {
            setFriendActionLoading(false);
        }
    };

    const acceptRequest = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
            await fetchFriends();
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        }
    };

    const rejectRequest = async (friendshipId) => {
        try {
            await axios.delete(`${API_BASE}/api/friends/reject/${friendshipId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        }
    };

    // Incoming request: accept from profile page
    const acceptIncomingRequest = async () => {
        if (!friendStatus.friendship_id) return;
        setFriendActionLoading(true);
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendStatus.friendship_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'accepted', friendship_id: friendStatus.friendship_id });
            await fetchFriends();
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        } finally {
            setFriendActionLoading(false);
        }
    };

    const rejectIncomingRequest = async () => {
        if (!friendStatus.friendship_id) return;
        setFriendActionLoading(true);
        try {
            await axios.delete(`${API_BASE}/api/friends/reject/${friendStatus.friendship_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
        } catch (err) {
            alert(err.response?.data?.error || t('profile.error_generic'));
        } finally {
            setFriendActionLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm(t('profile.comment_delete_confirm'))) return;
        try {
            await axios.delete(`${API_BASE}/api/recipes/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert(t('profile.comment_delete_error'));
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const saveComment = async (commentId) => {
        try {
            await axios.put(`${API_BASE}/api/recipes/comments/${commentId}`, { content: editContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.map(c => c.id === commentId ? { ...c, content: editContent } : c));
            setEditingCommentId(null);
        } catch (err) {
            alert(t('profile.comment_update_error'));
        }
    };

    // Friend Button Renderer
    const renderFriendButton = () => {
        if (!isLoggedIn || isOwner) return null;

        if (friendActionLoading) {
            return (
                <button disabled className="friend-btn friend-btn--loading">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('profile.processing')}</span>
                </button>
            );
        }

        if (friendStatus.status === 'accepted') {
            return (
                <button onClick={removeFriend} className="friend-btn friend-btn--accepted">
                    <UserCheck className="w-4 h-4" />
                    <span>{t('profile.following')}</span>
                </button>
            );
        }

        if (friendStatus.status === 'pending') {
            if (friendStatus.direction === 'outgoing') {
                return (
                    <button onClick={cancelFriendRequest} className="friend-btn friend-btn--pending">
                        <Clock className="w-4 h-4" />
                        <span>{t('profile.request_sent')}</span>
                    </button>
                );
            }
            // Incoming request — show accept/reject
            return (
                <div className="friend-incoming-actions">
                    <button onClick={acceptIncomingRequest} className="friend-btn friend-btn--accept">
                        <Check className="w-4 h-4" />
                        <span>{t('profile.accept')}</span>
                    </button>
                    <button onClick={rejectIncomingRequest} className="friend-btn friend-btn--reject">
                        <X className="w-4 h-4" />
                        <span>{t('profile.reject')}</span>
                    </button>
                </div>
            );
        }

        return (
            <button onClick={sendFriendRequest} className="friend-btn friend-btn--add">
                <UserPlus className="w-4 h-4" />
                <span>{t('profile.follow')}</span>
            </button>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-chefie-cream text-chefie-text">{t('profile.loading')}</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center bg-chefie-cream text-chefie-text">{t('profile.not_found')}</div>;

    const followersList = friends.filter(f => f.addressee_id === parseInt(id));
    const followingList = friends.filter(f => f.requester_id === parseInt(id));

    return (
        <div className="min-h-screen bg-chefie-cream text-chefie-text pt-12 pb-24 px-4 overflow-x-hidden relative">
            <style>{friendStyles}</style>

            {/* Followers Modal */}
            <AnimatePresence>
                {showFollowers && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-chefie-dark/60 backdrop-blur-sm"
                        onClick={() => setShowFollowers(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-chefie-cream w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-chefie-border bg-chefie-card">
                                <h3 className="font-bold text-lg text-chefie-text">{t('profile.followers') || 'Takipçiler'}</h3>
                                <button onClick={() => setShowFollowers(false)} className="p-2 bg-chefie-cream rounded-xl text-chefie-secondary hover:text-chefie-text hover:bg-chefie-border transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto w-full flex-1">
                                {followersList.length === 0 ? (
                                    <p className="text-center text-chefie-secondary py-8 text-sm">Henüz takipçi yok.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {followersList.map(user => (
                                            <div key={user.id} onClick={() => { setShowFollowers(false); navigate(`/profile/${user.id}`); }} className="flex items-center gap-3 p-2 hover:bg-chefie-card rounded-2xl transition-colors cursor-pointer">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-chefie-border flex-shrink-0">
                                                    {user.profile_image ? (
                                                        <img src={getImageUrl(user.profile_image)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-chefie-green/10 text-chefie-green flex items-center justify-center font-bold text-lg">
                                                            {(user.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-sm text-chefie-text truncate">{user.full_name || user.username}</div>
                                                    <div className="text-xs text-chefie-secondary truncate">@{user.username}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Following Modal */}
            <AnimatePresence>
                {showFollowing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-chefie-dark/60 backdrop-blur-sm"
                        onClick={() => setShowFollowing(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-chefie-cream w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-chefie-border bg-chefie-card">
                                <h3 className="font-bold text-lg text-chefie-text">{t('profile.following_count') || 'Takip Edilenler'}</h3>
                                <button onClick={() => setShowFollowing(false)} className="p-2 bg-chefie-cream rounded-xl text-chefie-secondary hover:text-chefie-text hover:bg-chefie-border transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto w-full flex-1">
                                {followingList.length === 0 ? (
                                    <p className="text-center text-chefie-secondary py-8 text-sm">Henüz kimseyi takip etmiyor.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {followingList.map(user => (
                                            <div key={user.id} onClick={() => { setShowFollowing(false); navigate(`/profile/${user.id}`); }} className="flex items-center gap-3 p-2 hover:bg-chefie-card rounded-2xl transition-colors cursor-pointer">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-chefie-border flex-shrink-0">
                                                    {user.profile_image ? (
                                                        <img src={getImageUrl(user.profile_image)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-chefie-green/10 text-chefie-green flex items-center justify-center font-bold text-lg">
                                                            {(user.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-sm text-chefie-text truncate">{user.full_name || user.username}</div>
                                                    <div className="text-xs text-chefie-secondary truncate">@{user.username}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative w-full">
                {/* Desktop Cover Background (Hidden on mobile) */}
                <div className="hidden md:block absolute top-0 left-0 w-full h-[320px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 rounded-b-[4rem] -z-10"></div>

                <div className="max-w-6xl mx-auto md:px-8">
                    {/* Header Navigation */}
                    <div className="flex items-center justify-between mb-8 md:mb-16 relative z-10 md:pt-10">
                        <h1 className="text-2xl font-bold font-sans text-chefie-text md:hidden">{t('profile.title')}</h1>
                        <div className="hidden md:flex items-center gap-1.5 text-chefie-text font-black text-xl italic tracking-tighter">
                            Tarifo<span className="text-chefie-yellow">.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-chefie-card md:bg-white/50 md:dark:bg-chefie-dark/50 md:backdrop-blur-md px-3 py-1.5 rounded-full border border-chefie-border shadow-sm">
                                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                                <span className="font-bold text-sm text-chefie-text">{profile?.likes_count || 0}</span>
                            </div>
                            <button
                                onClick={() => isOwner && navigate('/settings')}
                                className="p-2 bg-chefie-card md:bg-white/50 md:dark:bg-chefie-dark/50 md:backdrop-blur-md rounded-full border border-chefie-border shadow-sm hover:bg-chefie-cream transition-colors text-chefie-secondary"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="flex flex-col items-center text-center mb-10 md:flex-row md:items-start md:text-left md:gap-12 md:mb-16 relative z-10">
                        
                        <div className="relative mb-6 md:mb-0 md:flex-shrink-0">
                            <div className="w-32 h-32 md:w-64 md:h-64 rounded-full overflow-hidden border-4 md:border-8 border-chefie-cream dark:border-chefie-dark shadow-xl md:shadow-2xl bg-chefie-card md:bg-white md:dark:bg-chefie-dark transition-all">
                                {profile.profile_image ? (
                                    <img
                                        src={getImageUrl(profile.profile_image)}
                                        alt={profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-chefie-green to-emerald-700 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
                                        {(profile.full_name || profile.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between pt-2">
                            {/* Left Side Info */}
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    <h2 className="text-2xl md:text-[2.5rem] font-bold font-sans text-chefie-text tracking-tight mb-0 md:-mt-2">{profile.full_name || profile.username}</h2>
                                    {profile.recipe_count > 20 && (
                                        <>
                                            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white text-[11px] font-black rounded-full font-sans shadow-lg shadow-blue-500/30">
                                                <span>PRO</span>
                                                <Flame className="w-3.5 h-3.5 fill-white" />
                                            </div>
                                            <BadgeCheck className="w-6 h-6 md:hidden text-chefie-yellow fill-chefie-yellow text-black" />
                                        </>
                                    )}
                                </div>

                                <div className="text-chefie-secondary text-sm md:text-base mb-6 max-w-sm mx-auto md:mx-0 font-medium">
                                    <span className="md:hidden">@{profile.username}</span>
                                    <div className="hidden md:block">
                                        <div className="text-chefie-text font-bold mb-1">Usta Şef & Tarif Yaratıcısı</div>
                                    {(profile.city || profile.country) && (
                                        <div className="text-chefie-secondary opacity-70">
                                            {[profile.city, profile.country].filter(Boolean).join(', ')}
                                        </div>
                                    )}
                                    </div>
                                </div>

                                <div className="md:hidden flex items-center justify-center gap-4 text-chefie-secondary text-sm font-medium mb-6">
                                    <button onClick={() => setShowFollowers(true)} className="hover:text-chefie-text transition-colors">
                                        <span className="font-bold text-chefie-text">{profile.follower_count || 0}</span> {t('profile.followers')}
                                    </button>
                                    <span className="w-1.5 h-1.5 bg-chefie-border rounded-full"></span>
                                    <button onClick={() => setShowFollowing(true)} className="hover:text-chefie-text transition-colors">
                                        <span className="font-bold text-chefie-text">{profile.following_count || 0}</span> {t('profile.following_count') || 'Takip'}
                                    </button>
                                </div>

                                <div className="mt-2 w-full flex items-center justify-center md:justify-start gap-3 md:mt-6">
                                    {!isOwner ? (
                                        <>
                                            {renderFriendButton()}
                                            <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-chefie-dark border border-chefie-border text-chefie-text font-bold rounded-xl hover:bg-chefie-cream transition-all shadow-sm">
                                                İletişime Geç
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => navigate('/settings')}
                                            className="hidden md:flex items-center gap-2 px-8 py-3 bg-chefie-yellow text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                                        >
                                            Profili Düzenle
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Side Stats (Desktop Only) */}
                            <div className="hidden md:flex flex-col items-end justify-start pt-1">
                                <div className="flex items-center gap-10">
                                    <div className="text-center group cursor-pointer" onClick={() => setShowFollowers(true)}>
                                        <div className="text-[13px] text-chefie-text/60 font-medium mb-0">{t('profile.followers')}</div>
                                        <div className="text-[2.2rem] font-black text-chefie-text tracking-tighter leading-none">{profile.follower_count || 0}</div>
                                    </div>
                                    <div className="text-center group cursor-pointer" onClick={() => setShowFollowing(true)}>
                                        <div className="text-[13px] text-chefie-text/60 font-medium mb-0">{t('profile.following_count') || 'Takip'}</div>
                                        <div className="text-[2.2rem] font-black text-chefie-text tracking-tighter leading-none">{profile.following_count || 0}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[13px] text-chefie-text/60 font-medium mb-0">Beğeniler</div>
                                        <div className="text-[2.2rem] font-black text-chefie-text tracking-tighter leading-none">{profile.likes_count || 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Pending Friend Requests (owner only) */}
                {isOwner && pendingRequests.length > 0 && (
                    <div className="bg-chefie-card rounded-[2rem] p-6 border border-chefie-yellow/20 shadow-md mb-8Text">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-chefie-yellow/10 rounded-xl">
                                <UserPlus className="w-5 h-5 text-chefie-yellow" />
                            </div>
                            <h2 className="font-bold text-chefie-text">{t('profile.pending_requests')} ({pendingRequests.length})</h2>
                        </div>
                        <div className="space-y-4">
                            {pendingRequests.map(request => (
                                <div key={request.friendship_id} className="flex items-center justify-between gap-4 p-3 bg-chefie-cream rounded-2xl border border-chefie-border">
                                    <Link to={`/profile/${request.id}`} className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-chefie-card shadow-sm flex-shrink-0">
                                            {request.profile_image ? (
                                                <img
                                                    src={getImageUrl(request.profile_image)}
                                                    alt={request.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-chefie-green/10 text-chefie-green flex items-center justify-center font-bold text-sm">
                                                    {(request.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="truncate">
                                            <div className="font-bold text-sm truncate text-chefie-text">{request.full_name || request.username}</div>
                                            <div className="text-[11px] text-chefie-secondary truncate">@{request.username}</div>
                                        </div>
                                    </Link>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => acceptRequest(request.friendship_id)} className="p-2 bg-chefie-green text-white rounded-xl shadow-sm hover:scale-105 transition-transform">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => rejectRequest(request.friendship_id)} className="p-2 bg-chefie-card text-chefie-secondary rounded-xl border border-chefie-border shadow-sm hover:bg-chefie-cream">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab System Mobile vs Desktop */}
                <div className="md:border-b md:border-chefie-border mb-8 md:mb-12 w-full overflow-x-auto hide-scrollbar">
                    {/* Mobile Tabs */}
                    <div className="md:hidden flex items-center gap-1 bg-chefie-card/50 p-1 rounded-full border border-chefie-border shadow-md">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`flex-[1.2] flex items-center justify-center gap-1.5 py-3 rounded-full font-bold text-[11px] transition-all ${activeTab === 'recipes'
                                ? 'bg-chefie-yellow text-white shadow-md'
                                : 'text-chefie-secondary hover:text-chefie-text'
                                }`}
                        >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>{t('profile.tabs.recipes')}</span>
                            {profile?.recipe_count > 0 && (
                                <span className="text-[9px] opacity-70 ml-0.5">({profile.recipe_count})</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full font-bold text-[11px] transition-all ${activeTab === 'favorites'
                                ? 'bg-chefie-yellow text-white shadow-md'
                                : 'text-chefie-secondary hover:text-chefie-text'
                                }`}
                        >
                            <Heart className="w-3.5 h-3.5" />
                            <span>{t('profile.tabs.favorites')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex-[1.1] flex items-center justify-center gap-1.5 py-3 rounded-full font-bold text-[11px] transition-all relative ${activeTab === 'notifications'
                                ? 'bg-chefie-yellow text-white shadow-md'
                                : 'text-chefie-secondary hover:text-chefie-text'
                                }`}
                        >
                            <div className="relative">
                                <Bell className="w-3.5 h-3.5" />
                                { (pendingRequests.length + notifications.filter(n => !n.is_read).length) > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </div>
                            <span>{t('profile.tabs.notifications')}</span>
                        </button>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden md:flex items-center gap-8 md:px-2">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`pb-4 font-bold text-base transition-all border-b-[3px] relative top-[3px] flex items-center gap-2 ${activeTab === 'recipes'
                                    ? 'text-chefie-text border-chefie-text dark:border-white'
                                    : 'text-chefie-secondary border-transparent hover:text-chefie-text hover:border-chefie-border'
                                }`}
                        >
                            Tarifler
                            <div className="text-[10px] font-black px-1.5 py-0.5 bg-chefie-card border border-chefie-border rounded-md text-chefie-secondary -mt-1">
                                {profile?.recipe_count || recipes.length}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`pb-4 font-bold text-base transition-all border-b-[3px] relative top-[3px] ${activeTab === 'favorites'
                                    ? 'text-chefie-text border-chefie-text dark:border-white'
                                    : 'text-chefie-secondary border-transparent hover:text-chefie-text hover:border-chefie-border'
                                }`}
                        >
                            Beğenilenler
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`pb-4 font-bold text-base transition-all border-b-[3px] relative top-[3px] ${activeTab === 'notifications'
                                    ? 'text-chefie-text border-chefie-text dark:border-white'
                                    : 'text-chefie-secondary border-transparent hover:text-chefie-text hover:border-chefie-border'
                                }`}
                        >
                            {t('profile.tabs.notifications')}
                            {(pendingRequests.length + notifications.filter(n => !n.is_read).length) > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                                    {pendingRequests.length + notifications.filter(n => !n.is_read).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-full">
                    {(activeTab === 'recipes' || activeTab === 'favorites') && (
                        (activeTab === 'recipes' ? recipes : userFavorites).length > 0 ? (
                            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
                                {(activeTab === 'recipes' ? recipes : userFavorites).map(recipe => (
                                    <div key={recipe.id} className="bg-chefie-card rounded-[2rem] border border-chefie-border overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
                                        {/* Media */}
                                        <Link to={`/recipes/${recipe.id}`} className="block relative aspect-[4/3] overflow-hidden group">
                                            <img
                                                src={recipe.image_url ? getImageUrl(recipe.image_url) : '/default-recipe.png'}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {recipe.prep_time && (
                                                <div className="absolute top-3 right-3 bg-chefie-card/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-chefie-text flex items-center gap-1.5 border border-chefie-border shadow-sm">
                                                    <Clock className="w-3 h-3 text-chefie-yellow" /> {recipe.prep_time.toString().toUpperCase()}
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Area */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[10px] text-chefie-secondary font-bold uppercase tracking-wider">
                                                    {new Date(recipe.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-chefie-text">
                                                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                                        {recipe.favorite_count || 0}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-base mb-2 hover:text-chefie-green transition-colors line-clamp-1 leading-tight text-chefie-text">
                                                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                                            </h3>
                                            
                                            <p className="text-chefie-secondary text-xs line-clamp-2 leading-relaxed mb-4">
                                                {recipe.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-chefie-border">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-chefie-border">
                                                        {profile.profile_image ? (
                                                            <img src={getImageUrl(profile.profile_image)} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full bg-chefie-green/10 text-chefie-green flex items-center justify-center text-[10px] font-black">
                                                                {(profile.username || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-chefie-text">@{profile.username}</span>
                                                </div>

                                                {isLoggedIn && currentUser.id === recipe.author_id && (
                                                    <Link to={`/admin/recipes/edit/${recipe.id}`} className="text-chefie-yellow hover:scale-110 transition-transform">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }</div>
                        ) : (
                            <div className="py-32 text-center w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="w-24 h-24 bg-chefie-green/10 rounded-full flex items-center justify-center mb-6 border border-chefie-green/20 shadow-inner">
                                    <ChefHat className="w-12 h-12 text-chefie-green" />
                                </div>
                                <h3 className="text-chefie-text font-bold text-xl mb-2">{activeTab === 'recipes' ? 'Henüz Paylaşım Yok' : 'Henüz Beğeni Yok'}</h3>
                                <p className="text-chefie-secondary font-medium max-w-xs mx-auto leading-relaxed">{t('profile.no_posts')}</p>
                            </div>
                        )
                    )}

                    {hasMore && activeTab === 'recipes' && (
                        <div className="pt-12 pb-16 flex justify-center w-full">
                            <button
                                onClick={() => fetchRecipes(true)}
                                className="px-12 py-4 bg-chefie-card/80 backdrop-blur-md border border-chefie-border text-chefie-secondary font-bold rounded-full hover:bg-chefie-cream hover:text-chefie-text transition-all text-sm shadow-md hover:shadow-xl"
                                disabled={loading}
                            >
                                {loading ? t('profile.loading') : t('profile.show_more')}
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="w-full">
                             {pendingRequests.length === 0 && notifications.length === 0 ? (
                                <div className="py-32 text-center w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="w-24 h-24 bg-chefie-yellow/10 rounded-full flex items-center justify-center mb-6 border border-chefie-yellow/20 shadow-inner">
                                        <Bell className="w-12 h-12 text-chefie-yellow" />
                                    </div>
                                    <h3 className="text-chefie-text font-bold text-xl mb-2">{t('profile.no_notifications_title', 'Bildirim Yok')}</h3>
                                    <p className="text-chefie-secondary font-medium max-w-xs mx-auto leading-relaxed">{t('profile.no_notifications')}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                        <div className="flex justify-end mb-2">
                                            <button 
                                                onClick={markNotificationsAsRead}
                                                className="text-xs font-bold text-chefie-yellow hover:underline flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3" />
                                                Tümünü Okundu İşaretle
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Follow Requests */}
                                    {pendingRequests.map((request) => (
                                        <div key={`req-${request.friendship_id}`} className="bg-chefie-card rounded-3xl border border-chefie-border p-5 flex items-center gap-4 animate-in fade-in duration-500 shadow-md">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-chefie-border flex-shrink-0 shadow-sm">
                                                {request.profile_image ? (
                                                    <img src={getImageUrl(request.profile_image)} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full bg-chefie-green/10 text-chefie-green flex items-center justify-center font-bold">
                                                        {(request.username || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate text-chefie-text">@{request.username}</p>
                                                <p className="text-[11px] text-chefie-secondary font-medium">{t('profile.wants_to_follow')}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => acceptRequest(request.friendship_id)}
                                                    className="w-10 h-10 bg-chefie-green rounded-full flex items-center justify-center text-white shadow-lg shadow-chefie-green/10 hover:scale-110 transition-transform"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => rejectRequest(request.friendship_id)}
                                                    className="w-10 h-10 bg-chefie-cream rounded-full flex items-center justify-center text-chefie-secondary border border-chefie-border hover:bg-chefie-cream/80 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* General Notifications */}
                                    {notifications.map((notification) => (
                                        <div 
                                            key={`notif-${notification.id}`} 
                                            className={`bg-chefie-card rounded-3xl border ${notification.is_read ? 'border-chefie-border opacity-70' : 'border-chefie-yellow shadow-md shadow-chefie-yellow/5'} p-5 flex items-start gap-4 animate-in fade-in duration-500 relative transition-all`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${notification.is_read ? 'bg-chefie-secondary/10 text-chefie-secondary' : 'bg-chefie-yellow/10 text-chefie-yellow'}`}>
                                                {notification.type === 'feedback_update' ? <MessageCircle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-chefie-text">{notification.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-chefie-secondary">
                                                            {new Date(notification.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDeleteNotification(notification.id)}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-chefie-secondary font-medium leading-relaxed">{notification.message}</p>
                                            </div>
                                            {!notification.is_read && (
                                                <div className="absolute top-4 right-4 w-2 h-2 bg-chefie-yellow rounded-full"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

// Scoped CSS for friend system components
const friendStyles = `
    /* Friend Buttons */
    .friend-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    .friend-btn--sm {
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 10px;
    }
    .friend-btn--add {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
    .friend-btn--add:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    .friend-btn--pending {
        background: #FEF3C7;
        color: #92400E;
        border: 1px solid #FDE68A;
    }
    .friend-btn--pending:hover {
        background: #FDE68A;
    }
    .friend-btn--accepted {
        background: #ECFDF5;
        color: #065F46;
        border: 1px solid #A7F3D0;
    }
    .friend-btn--accepted:hover {
        background: #FEE2E2;
        color: #991B1B;
        border-color: #FECACA;
    }
    .friend-btn--accept {
        background: #10B981;
        color: white;
    }
    .friend-btn--accept:hover {
        background: #059669;
    }
    .friend-btn--reject {
        background: #F3F4F6;
        color: #6B7280;
        border: 1px solid #E5E7EB;
    }
    .friend-btn--reject:hover {
        background: #FEE2E2;
        color: #991B1B;
        border-color: #FECACA;
    }
    .friend-btn--loading {
        background: #F3F4F6;
        color: #9CA3AF;
        cursor: wait;
    }

    .friend-incoming-actions {
        display: flex;
        gap: 8px;
    }

    /* Pending Requests Card */
    .pending-requests-card {
        background: var(--bg-chefie-card);
        border-radius: 2rem;
        padding: 24px 28px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid var(--border-chefie-border);
    }
    .pending-requests-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
    }
    .pending-requests-header h2 {
        font-size: 16px;
        font-weight: 700;
        color: #92400E;
        margin: 0;
    }
    .pending-requests-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .pending-request-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: white;
        border-radius: 16px;
        padding: 12px 16px;
        border: 1px solid #F3F4F6;
    }
    .pending-request-user {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
        flex: 1;
        min-width: 0;
    }
    .pending-request-user:hover .pending-request-name {
        color: #10B981;
    }
    .pending-request-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }
    .pending-request-avatar-placeholder {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10B981, #059669);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 16px;
        flex-shrink: 0;
    }
    .pending-request-name {
        font-weight: 700;
        font-size: 14px;
        color: #1F2937;
        transition: color 0.2s;
    }
    .pending-request-username {
        font-size: 12px;
        color: #9CA3AF;
    }
    .pending-request-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }

    /* Friends Grid */
    .friends-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 16px;
    }
    @media (min-width: 768px) {
        .friends-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .friends-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .friend-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        background: #F9FAFB;
        border: 1px solid #F3F4F6;
        border-radius: 16px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
    }
    .friend-card:hover {
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        border-color: #E5E7EB;
        transform: translateY(-2px);
    }
    .friend-card-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    .friend-card-avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10B981, #059669);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 18px;
        flex-shrink: 0;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    .friend-card-info {
        flex: 1;
        min-width: 0;
    }
    .friend-card-name {
        font-weight: 700;
        font-size: 14px;
        color: #1F2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .friend-card:hover .friend-card-name {
        color: #10B981;
    }
    .friend-card-username {
        font-size: 12px;
        color: #9CA3AF;
    }
    .friend-card-since {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #D1D5DB;
        flex-shrink: 0;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 640px) {
        .pending-request-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        .pending-request-actions {
            width: 100%;
        }
        .pending-request-actions .friend-btn {
            flex: 1;
            justify-content: center;
        }
        .friend-incoming-actions {
            flex-direction: row;
        }
    }
    /* Scrollbar Hidden Everywhere */
    *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
    }
    * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
    }
`;

export default Profile;
