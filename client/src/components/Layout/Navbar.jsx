import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NotificationBell from '../NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { safeGetToken, safeGetSessionStorage } from '../../utils/storage';
import axios from 'axios';
import API_BASE from '../../utils/api';

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const unreadCount = 0; // Handled within NotificationBell

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
                                <NotificationBell />
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
                            <NotificationBell isMobile={true} />
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
