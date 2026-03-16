import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, MessageCircle, UserPlus, Trash2, X, Clock } from 'lucide-react';
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
    const [selectedNotification, setSelectedNotification] = useState(null);
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

    const handleAcceptRequest = async (friendshipId, e) => {
        if (e) e.stopPropagation();
        try {
            await axios.put(`${API_BASE}/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectRequest = async (friendshipId, e) => {
        if (e) e.stopPropagation();
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
            if (selectedNotification?.id === id) setSelectedNotification(null);
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const markAsRead = async (id) => {
        if (!token) return;
        try {
            await axios.put(`${API_BASE}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error('Error marking notification as read:', err);
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

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNotificationClick = (notification) => {
        setIsOpen(false); // Close the dropdown first
        setTimeout(() => {
            setSelectedNotification(notification);
        }, 10);
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!token) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`p-4 hover:bg-chefie-cream transition-colors group/item flex gap-3 cursor-pointer ${notification.is_read ? 'opacity-60' : 'bg-chefie-yellow/[0.02]'}`}
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

            {mounted && selectedNotification && createPortal(
                <AnimatePresence mode="wait">
                    <div 
                        className="fixed top-0 left-0 w-full h-full z-[99999] flex justify-center items-start pt-24 px-4 pointer-events-auto bg-black/40 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setSelectedNotification(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-[480px] bg-chefie-card rounded-[32px] shadow-2xl border border-chefie-border overflow-hidden my-8 flex flex-col max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 bg-chefie-cream border-b border-chefie-border flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-chefie-yellow/10 flex items-center justify-center text-chefie-yellow flex-shrink-0">
                                        {selectedNotification.type === 'feedback_update' ? <MessageCircle className="w-6 h-6" /> : selectedNotification.type === 'friend_request' ? <UserPlus className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-black text-chefie-text leading-tight truncate">{selectedNotification.title}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 text-chefie-secondary">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{formatDate(selectedNotification.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedNotification(null)}
                                    className="p-2 bg-chefie-card rounded-xl border border-chefie-border text-chefie-secondary hover:text-chefie-text transition-all flex-shrink-0 ml-4"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 md:p-8 overflow-y-auto flex-1 overscroll-contain">
                                <p className="text-chefie-text text-base font-medium leading-relaxed whitespace-pre-wrap">
                                    {selectedNotification.message}
                                </p>

                                {selectedNotification.type === 'friend_request' && !selectedNotification.is_read && (
                                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                        <button
                                            onClick={(e) => {
                                                handleAcceptRequest(selectedNotification.related_id, e);
                                                setSelectedNotification(null);
                                            }}
                                            className="flex-1 py-4 bg-chefie-yellow text-white font-black rounded-2xl shadow-lg shadow-yellow-100/50 hover:bg-chefie-dark transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" />
                                            {t('profile.accept', 'ONAYLA')}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                handleRejectRequest(selectedNotification.related_id, e);
                                                setSelectedNotification(null);
                                            }}
                                            className="flex-1 py-4 bg-chefie-cream text-chefie-secondary font-black rounded-2xl border border-chefie-border hover:bg-chefie-border/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" />
                                            {t('profile.reject', 'REDDET')}
                                        </button>
                                    </div>
                                )}
                                
                                <div className="mt-8 pt-6 border-t border-chefie-border flex justify-end">
                                    <button
                                        onClick={(e) => handleDeleteNotification(selectedNotification.id, e)}
                                        className="px-6 py-3 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t('common.delete', 'SİL')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default NotificationBell;
