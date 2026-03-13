import React, { useState, useEffect } from 'react';
import { Bell, Check, MessageCircle, UserPlus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../utils/api';
import { safeGetToken, safeGetSessionStorage } from '../utils/storage';

const NotificationBell = ({ isMobile = false }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const token = safeGetToken();
    const user = JSON.parse(safeGetSessionStorage('user') || '{}');

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [location, token]);

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectRequest = async (friendshipId) => {
        try {
            await axios.delete(`${API_BASE}/api/friends/reject/${friendshipId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error rejecting friend request:', err);
        }
    };

    const handleDeleteNotification = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await axios.delete(`${API_BASE}/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n.id !== id));
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
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!token) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 text-gray-400 hover:text-chefie-yellow rounded-xl transition-all relative group ${isMobile ? 'bg-chefie-cream' : 'hover:bg-chefie-cream'}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className={`absolute top-2 right-2 flex items-center justify-center bg-red-500 text-white font-black rounded-full border-2 border-chefie-card group-hover:animate-bounce ${isMobile ? 'w-3.5 h-3.5 text-[8px]' : 'w-4 h-4 text-[9px]'}`}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95, x: isMobile ? -20 : 0 }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute z-[70] bg-chefie-card rounded-2xl shadow-2xl border border-chefie-border overflow-hidden ${
                                isMobile 
                                ? 'fixed right-4 top-24 w-[calc(100%-32px)] max-w-sm' 
                                : 'right-0 mt-3 w-80'
                            }`}
                        >
                            <div className="p-4 border-b border-chefie-border flex items-center justify-between bg-chefie-cream">
                                <h3 className="text-xs font-black text-chefie-text uppercase tracking-wider">{t('profile.notifications', 'BİLDİRİMLER')}</h3>
                                <div className="flex items-center gap-2">
                                    {notifications.filter(n => !n.is_read).length > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-[9px] font-black text-chefie-yellow hover:underline uppercase tracking-tighter"
                                        >
                                            {t('common.mark_all_read', 'TÜMÜNÜ OKUNDU YAP')}
                                        </button>
                                    )}
                                    {isMobile && (
                                        <button onClick={() => setIsOpen(false)} className="p-1 text-chefie-secondary">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className={`max-h-[400px] overflow-y-auto ${isMobile ? 'max-h-[60vh]' : ''}`}>
                                {unreadCount === 0 && notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-10 h-10 text-chefie-secondary/20 mx-auto mb-3" />
                                        <p className="text-[11px] font-bold text-chefie-secondary uppercase">{t('profile.no_notifications', 'BİLDİRİM BULUNMUYOR')}</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-chefie-border">
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
                                                            onClick={(e) => handleDeleteNotification(notification.id, e)}
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
                                                                {t('profile.accept', 'ONAYLA')}
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(notification.related_id)}
                                                                className="flex-1 py-1 bg-chefie-cream text-chefie-secondary text-[8px] font-black rounded border border-chefie-border"
                                                            >
                                                                {t('profile.reject', 'REDDET')}
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
    );
};

export default NotificationBell;
