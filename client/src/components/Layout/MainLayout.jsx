import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // We'll use the existing Navbar for mobile functionality

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-chefie-cream font-sans">
            {/* Sidebar for Desktop */}
            <Sidebar />

            {/* Mobile Header (Navbar) - Visible only on mobile */}
            <div className="md:hidden">
                <Navbar />
            </div>

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
