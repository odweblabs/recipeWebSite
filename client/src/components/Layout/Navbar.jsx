import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Check, MessageCircle, UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { safeGetToken, safeGetSessionStorage } from '../../utils/storage';

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const fetchNotifications = async (storedToken) => {
        if (!storedToken) return;
        try {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const fetchPendingRequests = async (storedToken) => {
        if (!storedToken) return;
        try {
            const res = await axios.get(`${API_BASE}/api/friends/requests/pending`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setPendingRequests(res.data);
        } catch (err) {
            console.error('Error fetching pending requests:', err);
        }
    };

    useEffect(() => {
        const storedToken = safeGetToken();
        const storedUser = JSON.parse(safeGetSessionStorage('user') || '{}');
        setToken(storedToken);
        setUser(storedUser);

        if (storedToken && storedUser.id) {
            fetchNotifications(storedToken);
            fetchPendingRequests(storedToken);
        }
    }, [location]);

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingRequests(token);
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectRequest = async (friendshipId) => {
        try {
            await axios.delete(`${API_BASE}/api/friends/reject/${friendshipId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingRequests(token);
            fetchNotifications(token); // Refresh history
        } catch (err) {
            console.error('Error rejecting friend request:', err);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`${API_BASE}/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(token);
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!token || notifications.filter(n => !n.is_read).length === 0) return;
        try {
            await axios.put(`${API_BASE}/api/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(token);
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length + pendingRequests.length;

    return (
        <nav className="bg-chefie-card/80 backdrop-blur-md shadow-sm border-b border-chefie-border sticky top-0 z-50 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-28">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img
                                src="/bitarif_logo_1.png"
                                alt="Bitarif Logo"
                                className="h-20 w-auto group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/recipes" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">{t('nav.recipes').toUpperCase()}</Link>
                        <Link to="/menus" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">{t('nav.menus').toUpperCase()}</Link>
                        <Link to="/trend" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">{t('nav.trend').toUpperCase()}</Link>
                        <Link to="/what-to-cook" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">{t('nav.what_to_cook').toUpperCase()}</Link>
                        <Link to="/lists" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">{t('nav.lists').toUpperCase()}</Link>
                        
                        {token && (
                            <div className="relative mx-2">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="p-2.5 text-gray-400 hover:text-chefie-yellow hover:bg-chefie-cream rounded-xl transition-all relative group"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-chefie-card group-hover:animate-bounce">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-80 bg-chefie-card rounded-2xl shadow-2xl border border-chefie-border z-50 overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-chefie-border flex items-center justify-between bg-chefie-cream">
                                                    <h3 className="text-xs font-black text-chefie-text uppercase tracking-wider">{t('profile.notifications', 'BİLDİRİMLER')}</h3>
                                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                                        <button 
                                                            onClick={markAllAsRead}
                                                            className="text-[9px] font-black text-chefie-yellow hover:underline uppercase tracking-tighter"
                                                        >
                                                            TÜMÜNÜ OKUNDU YAP
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {unreadCount === 0 ? (
                                                        <div className="p-8 text-center">
                                                            <Bell className="w-10 h-10 text-chefie-secondary/20 mx-auto mb-3" />
                                                            <p className="text-[11px] font-bold text-chefie-secondary uppercase">{t('profile.no_notifications', 'BİLDİRİM BULUNMUYOR')}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="divide-y divide-chefie-border">
                                                            {/* Friend Requests (Active) */}
                                                            {pendingRequests.map((request) => (
                                                                <div key={`req-${request.friendship_id}`} className="p-4 hover:bg-chefie-cream transition-colors hidden">
                                                                    {/* Hidden because we now use persistent notifications list below */}
                                                                </div>
                                                            ))}
                                                            
                                                            {/* System & History Notifications */}
                                                            {notifications.map((notification) => (
                                                                <div 
                                                                    key={`notif-${notification.id}`} 
                                                                    className={`p-4 hover:bg-chefie-cream transition-colors group/item flex gap-3 ${notification.is_read ? 'opacity-60' : 'bg-chefie-yellow/[0.02]'}`}
                                                                >
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${notification.is_read ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-chefie-yellow/10 border-chefie-yellow/20 text-chefie-yellow'}`}>
                                                                        {notification.type === 'feedback_update' ? <MessageCircle className="w-4 h-4" /> : notification.type === 'friend_request' ? <UserPlus className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-xs font-black text-chefie-text leading-tight mb-1">{notification.title}</p>
                                                                            <button 
                                                                                onClick={() => handleDeleteNotification(notification.id)}
                                                                                className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                        <p className="text-[10px] text-chefie-secondary font-bold leading-relaxed line-clamp-2">{notification.message}</p>
                                                                        
                                                                        {notification.type === 'friend_request' && !notification.is_read && (
                                                                            <div className="flex gap-2 mt-2">
                                                                                <button
                                                                                    onClick={() => handleAcceptRequest(notification.related_id)}
                                                                                    className="flex-1 py-1 bg-chefie-yellow text-white text-[8px] font-black rounded hover:bg-chefie-dark transition-all"
                                                                                >
                                                                                    ONAYLA
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleRejectRequest(notification.related_id)}
                                                                                    className="flex-1 py-1 bg-chefie-cream text-chefie-secondary text-[8px] font-black rounded border border-chefie-border"
                                                                                >
                                                                                    REDDET
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {!notification.is_read && (
                                                                        <div className="w-1.5 h-1.5 bg-chefie-yellow rounded-full flex-shrink-0 mt-1"></div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {token && user?.id ? (
                            <Link to={`/profile/${user.id}`} className="ml-2 px-6 py-2.5 bg-chefie-yellow text-white rounded-2xl hover:bg-chefie-dark transition-all text-xs font-black shadow-lg shadow-yellow-100">PROFİLİM</Link>
                        ) : (
                            <Link to="/admin/login" className="ml-4 px-6 py-2.5 bg-chefie-dark text-white rounded-2xl hover:bg-chefie-yellow transition-all text-xs font-black shadow-lg shadow-gray-100">{t('nav.login').toUpperCase()}</Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        {token && (
                            <div className="relative">
                                <button
                                    onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsOpen(false); }}
                                    className="p-2.5 text-gray-400 hover:text-chefie-yellow bg-chefie-cream rounded-xl transition-all relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-chefie-card">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}></div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="fixed right-4 top-24 w-[calc(100%-32px)] max-w-sm bg-chefie-card rounded-3xl shadow-2xl border border-chefie-border z-[70] overflow-hidden"
                                            >
                                                <div className="p-5 border-b border-chefie-border flex items-center justify-between bg-chefie-cream">
                                                    <h3 className="text-xs font-black text-chefie-text uppercase tracking-wider">BİLDİRİMLER</h3>
                                                    <button onClick={() => setIsNotificationsOpen(false)} className="p-1.5 bg-chefie-card rounded-lg border border-chefie-border"><X className="w-3 h-3" /></button>
                                                </div>
                                                <div className="max-h-[60vh] overflow-y-auto pb-4">
                                                    {unreadCount === 0 ? (
                                                        <div className="p-12 text-center text-gray-400">
                                                            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Bildirim bulunmuyor</p>
                                                        </div>
                                                    ) : (
                                                        <div className="divide-y divide-chefie-border">
                                                            {pendingRequests.map((request) => (
                                                                <div key={`mob-req-${request.friendship_id}`} className="hidden">
                                                                </div>
                                                            ))}
                                                            {notifications.map((notification) => (
                                                                <div key={`mob-notif-${notification.id}`} className={`p-5 flex gap-4 item-center ${notification.is_read ? 'opacity-50' : ''}`}>
                                                                    <div className="w-10 h-10 rounded-2xl bg-chefie-yellow/10 text-chefie-yellow flex items-center justify-center flex-shrink-0">
                                                                        {notification.type === 'friend_request' ? <UserPlus className="w-5 h-5" /> : notification.type === 'feedback_update' ? <MessageCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <p className="text-xs font-black text-chefie-text mb-1">{notification.title}</p>
                                                                            <button 
                                                                                onClick={() => handleDeleteNotification(notification.id)}
                                                                                className="p-1 text-gray-400 hover:text-red-500"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                        <p className="text-[10px] text-chefie-secondary font-bold leading-relaxed">{notification.message}</p>
                                                                        
                                                                        {notification.type === 'friend_request' && !notification.is_read && (
                                                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                                                <button onClick={() => handleAcceptRequest(notification.related_id)} className="py-2 bg-chefie-yellow text-white text-[10px] font-black rounded-lg">ONAYLA</button>
                                                                                <button onClick={() => handleRejectRequest(notification.related_id)} className="py-2 bg-chefie-cream text-chefie-secondary text-[10px] font-black rounded-lg border border-chefie-border">REDDET</button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {notifications.filter(n => !n.is_read).length > 0 && (
                                                    <div className="p-4 bg-chefie-cream border-t border-chefie-border">
                                                        <button onClick={markAllAsRead} className="w-full py-3 bg-chefie-card border border-chefie-border text-[10px] font-black text-chefie-yellow rounded-xl shadow-sm">TÜMÜNÜ OKUNDU İŞARETLE</button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <button
                            onClick={() => { setIsOpen(!isOpen); setIsNotificationsOpen(false); }}
                            className="p-2 text-gray-400 hover:text-chefie-text bg-chefie-cream rounded-xl transition-all"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-chefie-card border-t border-chefie-border shadow-lg absolute w-full top-[112px] left-0 z-40 max-h-[80vh] overflow-y-auto pb-8">
                    <div className="px-4 pt-4 pb-12 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.home').toUpperCase()}</Link>
                        <Link to="/recipes" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.recipes').toUpperCase()}</Link>
                        <Link to="/menus" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.menus').toUpperCase()}</Link>
                        <Link to="/trend" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.trend').toUpperCase()}</Link>
                        <Link to="/what-to-cook" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.what_to_cook').toUpperCase()}</Link>
                        <Link to="/lists" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.lists').toUpperCase()}</Link>
                        <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-chefie-cream rounded-2xl font-black text-xs tracking-wide">{t('nav.blog').toUpperCase()}</Link>
                        <div className="h-px bg-chefie-border my-4 mx-4"></div>
                        {token && user?.id ? (
                            <Link to={`/profile/${user.id}`} onClick={() => setIsOpen(false)} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4">PROFİLİM</Link>
                        ) : (
                            <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4">{t('nav.admin_panel').toUpperCase()}</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
