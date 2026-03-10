import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold">Tarifo</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">{t('footer.quick_links')}</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/recipes" className="hover:text-orange-500 transition-colors">{t('nav.recipes')}</Link></li>
                            <li><Link to="/menus" className="hover:text-orange-500 transition-colors">{t('nav.menus')}</Link></li>
                            <li><Link to="/blog" className="hover:text-orange-500 transition-colors">{t('nav.blog')}</Link></li>
                            <li><Link to="/about" className="hover:text-orange-500 transition-colors">{t('footer.about_us')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">{t('footer.contact')}</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>info@bitarif.com</li>
                            <li>+90 (212) 555 0123</li>
                            <li>{t('footer.location')}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Tarifo. {t('footer.all_rights_reserved')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
