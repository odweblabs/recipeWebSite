import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-900"> {/* Updated footer background and text color */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4"> {/* Wrapped logo and text in Link */}
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold">Bi Tarif</span> {/* Changed LezzetDünyası to Bi Tarif */}
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed"> {/* Updated classes and content */}
                            En lezzetli yemek tarifleri, mutfak sırları ve daha fazlası. Sofralarınızı şenlendirmek için buradayız.
                        </p>
                    </div>

                    {/* Quick Links */} {/* Added comment */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Hızlı Erişim</h3> {/* Updated classes */}
                        <ul className="space-y-2 text-sm text-gray-500"> {/* Updated classes */}
                            <li><Link to="/recipes" className="hover:text-orange-500 transition-colors">Tarifler</Link></li> {/* Updated to Link and new class */}
                            <li><Link to="/menus" className="hover:text-orange-500 transition-colors">Menüler</Link></li> {/* New link */}
                            <li><Link to="/blog" className="hover:text-orange-500 transition-colors">Blog</Link></li> {/* New link */}
                            <li><Link to="/about" className="hover:text-orange-500 transition-colors">Hakkımızda</Link></li> {/* New link */}
                        </ul>
                    </div>

                    {/* Contact */} {/* Added comment */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">İletişim</h3> {/* Updated classes */}
                        <ul className="space-y-2 text-sm text-gray-500"> {/* Updated classes */}
                            <li>info@bitarif.com</li> {/* Updated email */}
                            <li>+90 (212) 555 0123</li> {/* Updated phone number */}
                            <li>İstanbul, Türkiye</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400"> {/* Updated classes */}
                    <p>&copy; {new Date().getFullYear()} Bi Tarif. Tüm hakları saklıdır.</p> {/* Changed LezzetDünyası to Bi Tarif */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
