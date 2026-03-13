import { safeGetSessionStorage, safeSetSessionStorage, safeRemoveStorage, safeClearAuth } from '../../utils/storage';
import API_BASE from '../../utils/api';
import { getImageUrl } from '../../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Heart, BookOpen, Users, Settings, LogOut, LayoutDashboard, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../NotificationBell';

const Sidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = safeGetSessionStorage('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        safeClearAuth();
        safeRemoveStorage('user');
        navigate('/admin/login');
    };

    return (
        <aside className="w-64 bg-chefie-card min-h-screen fixed left-0 top-0 border-r border-chefie-border flex flex-col p-6 z-50 hidden md:flex shadow-2xl shadow-gray-100 dark:shadow-none">
            {/* Brand & Actions */}
            <div className="mb-10 flex items-center">
                <Link to="/" className="group flex-1">
                    <img
                        src="/bitarif_logo_1.png"
                        alt="Bitarif Logo"
                        className="h-20 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </div>

            {/* User Profile */}
            <div className="bg-chefie-cream/50 p-4 rounded-3xl mb-8 border border-chefie-border shadow-sm transition-transform hover:scale-105">
                <Link to={user ? `/profile/${user.id}` : '#'} className="block group">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                        <div className="absolute inset-0 bg-chefie-yellow rounded-full rotate-6 group-hover:rotate-12 transition-transform"></div>
                        <img
                            src={user?.profile_image ? getImageUrl(user.profile_image) : "https://cdn.dribbble.com/userupload/42512876/file/original-f83ea4a95013355104381d9512b4c4de.png"}
                            alt="Profile"
                            className="relative w-20 h-20 rounded-full object-cover border-2 border-chefie-card shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-chefie-green rounded-full border-2 border-chefie-card shadow-sm"></div>
                    </div>
                    <div className="text-center">
                        <h2 className="font-bold text-chefie-text text-sm line-clamp-1 group-hover:text-chefie-yellow transition-colors">{user?.full_name || user?.username || t('common.guest_chef')}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{user?.role === 'admin' ? t('common.master_chef') : t('common.gourme_chef')}</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto px-1">
                <NavLink
                    to="/recipes"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                            ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold'
                            : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'
                        }`
                    }
                >
                    <UtensilsCrossed className={`w-5 h-5 mr-3 transition-transform group-hover:rotate-12`} />
                    <span className="text-sm">{t('nav.recipes')}</span>
                </NavLink>

                <NavLink
                    to="/menus"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.menus')}</span>
                </NavLink>

                <NavLink
                    to="/trend"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <Heart className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.trend')}</span>
                </NavLink>

                <NavLink
                    to="/what-to-cook"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <ChefHat className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.what_to_cook')}</span>
                </NavLink>

                <NavLink
                    to="/blog"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.blog')}</span>
                </NavLink>

                <NavLink
                    to="/lists"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.lists')}</span>
                </NavLink>

                <NavLink
                    to="/calories"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-100 font-bold' : 'text-gray-500 hover:bg-chefie-cream hover:text-chefie-dark'}`
                    }
                >
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="text-sm">{t('nav.calories')}</span>
                </NavLink>
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-chefie-border space-y-2">
                <NavLink
                    to={user ? "/admin/dashboard" : "/admin/login"}
                    className="flex items-center px-4 py-3 text-gray-400 hover:text-chefie-yellow hover:bg-chefie-cream/50 rounded-2xl transition-all text-sm group"
                >
                    <LayoutDashboard className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {user ? 'Yönetici Paneli' : t('nav.admin_panel')}
                </NavLink>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all text-sm w-full group"
                    >
                        <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                        {t('nav.logout')}
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
