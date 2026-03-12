import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft,
    ChevronRight,
    Bell,
    Settings as SettingsIcon,
    Moon,
    Globe,
    Users,
    HelpCircle,
    Info,
    Shield,
    LogOut,
    Camera,
    Check
} from 'lucide-react';
import API_BASE from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const token = safeGetToken();
    const [user, setUser] = useState(JSON.parse(safeGetSessionStorage('user') || '{}'));
    const [loading, setLoading] = useState(true);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const [toggles, setToggles] = useState({
        pauseNotifications: false,
        darkMode: theme === 'dark'
    });

    useEffect(() => {
        setToggles(prev => ({ ...prev, darkMode: theme === 'dark' }));
    }, [theme]);

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchUserData();
    }, [token, navigate]);

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            safeSetSessionStorage('user', JSON.stringify(res.data));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        safeClearAuth();
        safeClearAuth();
        safeRemoveStorage('user');
        navigate('/admin/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowLanguageModal(false);
    };

    const Toggle = ({ active, onToggle }) => (
        <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${active ? 'bg-chefie-green' : 'bg-chefie-border'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );

    const MenuItem = ({ icon: Icon, title, rightElement, onClick }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-chefie-cream/50 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-chefie-cream rounded-lg text-chefie-secondary group-hover:text-chefie-green transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-[15px] font-medium text-chefie-text text-left">{title}</span>
            </div>
            {rightElement || <ChevronRight className="w-5 h-5 text-chefie-secondary/50" />}
        </button>
    );

    if (loading) return (
        <div className="min-h-screen bg-chefie-cream flex items-center justify-center">
            <div className="animate-pulse text-chefie-green font-bold">Yükleniyor...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-chefie-cream text-chefie-dark pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-chefie-cream/80 backdrop-blur-md px-4 py-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-chefie-card rounded-full transition-colors shadow-sm text-chefie-secondary"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold font-sans text-chefie-text">{t('settings.title')}</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-xl mx-auto px-4 space-y-6">
                {/* User Card */}
                <button
                    onClick={() => navigate('/edit-profile')}
                    className="w-full bg-chefie-card p-4 rounded-3xl border border-chefie-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-chefie-border relative group">
                            {user.profile_image ? (
                                <img
                                    src={getImageUrl(user.profile_image)}
                                    alt={user.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-chefie-green to-emerald-700 flex items-center justify-center text-white text-xl font-bold uppercase">
                                    {(user.full_name || user.username).charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-bold text-chefie-text">{user.full_name || user.username}</h2>
                            <p className="text-chefie-secondary text-sm">@{user.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-chefie-green text-xs font-bold">{t('settings.user_card.edit_profile')}</span>
                        <ChevronRight className="w-5 h-5 text-chefie-secondary/50" />
                    </div>
                </button>

                {/* Group 1: Notifications & General */}
                <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-chefie-secondary uppercase tracking-[0.2em] ml-4">{t('settings.groups.notifications')}</h3>
                    <div className="bg-chefie-card rounded-3xl border border-chefie-border shadow-sm overflow-hidden">
                        <MenuItem
                            icon={Bell}
                            title={t('settings.items.pause_notifications')}
                            rightElement={
                                <Toggle
                                    active={toggles.pauseNotifications}
                                    onToggle={(e) => {
                                        e.stopPropagation();
                                        setToggles(prev => ({ ...prev, pauseNotifications: !prev.pauseNotifications }));
                                    }}
                                />
                            }
                        />
                        <div className="h-px bg-chefie-border mx-4" />
                        <MenuItem
                            icon={SettingsIcon}
                            title={t('settings.items.general_settings')}
                            onClick={() => navigate('/admin/dashboard?tab=settings')}
                        />
                    </div>
                </div>

                {/* Group 2: Design & Language */}
                <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-chefie-secondary uppercase tracking-[0.2em] ml-4">{t('settings.groups.design')}</h3>
                    <div className="bg-chefie-card rounded-3xl border border-chefie-border shadow-sm overflow-hidden">
                        <MenuItem
                            icon={Moon}
                            title={t('settings.items.dark_mode')}
                            rightElement={
                                <Toggle
                                    active={toggles.darkMode}
                                    onToggle={(e) => {
                                        e.stopPropagation();
                                        toggleTheme();
                                    }}
                                />
                            }
                        />
                        <div className="h-px bg-chefie-border mx-4" />
                        <MenuItem
                            icon={Globe}
                            title={t('settings.items.language')}
                            onClick={() => setShowLanguageModal(true)}
                            rightElement={
                                <div className="flex items-center gap-2">
                                    <span className="text-chefie-secondary text-sm font-medium uppercase">{i18n.language.split('-')[0]}</span>
                                    <ChevronRight className="w-5 h-5 text-chefie-secondary/50" />
                                </div>
                            }
                        />
                        <div className="h-px bg-chefie-border mx-4" />
                        <MenuItem icon={Users} title={t('settings.items.contacts')} />
                    </div>
                </div>

                {/* Group 3: Support & Legal */}
                <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-chefie-secondary uppercase tracking-[0.2em] ml-4">{t('settings.groups.support')}</h3>
                    <div className="bg-chefie-card rounded-3xl border border-chefie-border shadow-sm overflow-hidden">
                        <MenuItem icon={HelpCircle} title={t('settings.items.faq')} onClick={() => navigate('/faq')} />
                        <div className="h-px bg-chefie-border mx-4" />
                        <MenuItem icon={Info} title={t('settings.items.terms')} onClick={() => navigate('/terms')} />
                        <div className="h-px bg-chefie-border mx-4" />
                        <MenuItem icon={Shield} title={t('settings.items.policy')} onClick={() => navigate('/policy')} />
                    </div>
                </div>

                {/* Log Out */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-chefie-card p-4 rounded-full border border-chefie-border shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                >
                    <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-red-500 font-bold uppercase tracking-wider">{t('settings.items.logout')}</span>
                </button>
            </div>

            {/* Language Selection Modal/Sheet */}
            {showLanguageModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 sm:items-center">
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowLanguageModal(false)}
                    />
                    <div className="relative w-full max-w-sm bg-chefie-card rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 border border-chefie-border">
                        <div className="p-6 text-center border-b border-chefie-border">
                            <h3 className="text-xl font-bold text-chefie-text">{t('settings.items.language')}</h3>
                        </div>
                        <div className="p-2">
                            {[
                                { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
                                { code: 'en', label: 'English', flag: '🇺🇸' }
                            ].map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-chefie-cream transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className={`font-bold ${i18n.language.startsWith(lang.code) ? 'text-chefie-green' : 'text-chefie-text'}`}>
                                            {lang.label}
                                        </span>
                                    </div>
                                    {i18n.language.startsWith(lang.code) && (
                                        <Check className="w-5 h-5 text-chefie-green" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-chefie-cream">
                            <button
                                onClick={() => setShowLanguageModal(false)}
                                className="w-full py-3 bg-chefie-card border border-chefie-border rounded-2xl font-bold text-chefie-secondary hover:bg-chefie-cream transition-colors"
                            >
                                Kapat / Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
