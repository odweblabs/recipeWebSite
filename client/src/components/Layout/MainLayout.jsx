import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    const location = useLocation();
    const isProfilePage = location.pathname.startsWith('/profile');

    return (
        <div className="min-h-screen bg-chefie-cream font-sans">
            {/* Sidebar for Desktop */}
            <Sidebar />

            {/* Mobile Header (Navbar) - Hidden on profile page since it has its own header */}
            {!isProfilePage && (
                <div className="md:hidden">
                    <Navbar />
                </div>
            )}

            {/* Main Content Area */}
            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
