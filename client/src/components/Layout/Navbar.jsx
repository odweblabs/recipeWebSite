import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 print:hidden">
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
                        <Link to="/recipes" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">TARİFLER</Link>
                        <Link to="/menus" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">MENÜLER</Link>
                        <Link to="/trend" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">TREND</Link>
                        <Link to="/what-to-cook" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">NE PİŞİRSEM?</Link>
                        <Link to="/lists" className="px-4 py-2 text-gray-500 hover:text-chefie-yellow font-bold transition-all text-xs tracking-widest">LİSTELER</Link>
                        <Link to="/admin/login" className="ml-4 px-6 py-2.5 bg-chefie-dark text-white rounded-2xl hover:bg-chefie-yellow transition-all text-xs font-black shadow-lg shadow-gray-100">GİRİŞ YAP</Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-400 hover:text-chefie-dark bg-gray-50 rounded-xl transition-all"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-50 shadow-lg absolute w-full top-[112px] left-0 z-40 max-h-[80vh] overflow-y-auto pb-8">
                    <div className="px-4 pt-4 pb-12 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">ANA SAYFA</Link>
                        <Link to="/recipes" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">TARİFLER</Link>
                        <Link to="/menus" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">MENÜLER</Link>
                        <Link to="/trend" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">TREND</Link>
                        <Link to="/what-to-cook" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">NE PİŞİRSEM?</Link>
                        <Link to="/lists" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">ALIŞVERİŞ LİSTELERİ</Link>
                        <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-500 hover:text-chefie-yellow active:bg-gray-50 rounded-2xl font-black text-xs tracking-wide">BLOG / MAKALELER</Link>
                        <div className="h-px bg-gray-100 my-4 mx-4"></div>
                        <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block px-4 py-4 bg-chefie-yellow text-white text-center rounded-2xl font-black text-sm shadow-lg shadow-yellow-100 mt-4">YÖNETİM PANELİ / HESABIM</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
