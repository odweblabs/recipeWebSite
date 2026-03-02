import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileTabBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    useEffect(() => {
        // Initial check on mount
        if (window.scrollY <= 100) {
            setIsVisible(true);
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Show bar at the very top, or when scrolling up
            if (currentScrollY <= 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const tabs = [
        { path: '/', icon: Home, label: 'Ana Sayfa' },
        { path: '/recipes', icon: Search, label: 'Tarifler' },
        // Center button is handled separately
        { path: '/admin/dashboard?tab=favorites', icon: Heart, label: 'Koleksiyon' },
        { path: user?.id ? `/profile/${user.id}` : '/admin/login', icon: User, label: 'Profil' }
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;

        const [basePath, query] = path.split('?');
        if (!location.pathname.startsWith(basePath)) return false;

        if (query) {
            const currentParams = new URLSearchParams(location.search);
            const targetParams = new URLSearchParams(query);
            return currentParams.get('tab') === targetParams.get('tab');
        }

        return true;
    };

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : 150 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-0 left-0 w-full z-[70] md:hidden pointer-events-none pb-6"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
        >
            <div className="mx-4 relative pointer-events-auto">
                {/* The floating center button */}
                <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-10 flex justify-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/admin/recipes/new')}
                        className="bg-chefie-yellow w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(255,193,7,0.4)] border-4 border-[#FAFAF9]"
                    >
                        <Plus className="w-6 h-6 stroke-[3]" />
                    </motion.button>
                </div>

                {/* The main bar */}
                <div className="bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] px-6 py-4 flex items-center justify-between relative overflow-hidden">
                    {tabs.map((tab, idx) => {
                        const active = isActive(tab.path);
                        const Icon = tab.icon;

                        // Add a spacer in the middle for the big floating button
                        if (idx === 2) {
                            return (
                                <React.Fragment key="center-spacer">
                                    <div className="w-12" /> {/* Spacer */}
                                    <Link
                                        to={tab.path}
                                        className="relative flex flex-col items-center justify-center w-12 h-10 group"
                                    >
                                        <div className={`relative z-10 transition-colors duration-300 ${active ? 'text-chefie-dark' : 'text-gray-400'}`}>
                                            <Icon className="w-5 h-5 mx-auto mb-1" />
                                        </div>
                                        {/* Active background pill */}
                                        {active && (
                                            <motion.div
                                                layoutId="mobile-tab-pill"
                                                className="absolute inset-x-1 inset-y-0 bg-gray-100 rounded-xl z-0"
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                    </Link>
                                </React.Fragment>
                            );
                        }

                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className="relative flex flex-col items-center justify-center w-12 h-10 group"
                            >
                                <div className={`relative z-10 transition-colors duration-300 ${active ? 'text-chefie-dark' : 'text-gray-400'}`}>
                                    <Icon className="w-5 h-5 mx-auto mb-1" />
                                </div>
                                {/* Active background pill */}
                                {active && (
                                    <motion.div
                                        layoutId="mobile-tab-pill"
                                        className="absolute inset-x-1 inset-y-0 bg-gray-100 rounded-xl z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.div >
    );
};

export default MobileTabBar;
