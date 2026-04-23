import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../UI/Logo';
import { Instagram, Github, Mail } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-t border-gray-100 dark:border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            <Logo className="text-3xl" />
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-200">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">{t('footer.quick_links')}</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/recipes" className="hover:text-chefie-yellow transition-colors">{t('nav.recipes')}</Link></li>
                            <li><Link to="/menus" className="hover:text-chefie-yellow transition-colors">{t('nav.menus')}</Link></li>
                            <li><Link to="/blog" className="hover:text-chefie-yellow transition-colors">{t('nav.blog')}</Link></li>
                            <li><Link to="/about" className="hover:text-chefie-yellow transition-colors">{t('footer.about_us')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">{t('footer.contact')}</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="mailto:tarifo@outlook.com.tr" className="hover:text-chefie-yellow transition-colors">tarifo@outlook.com.tr</a></li>
                            <li>{t('footer.location')}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between transition-colors duration-200">
                    {/* Left side links */}
                    <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
                        <Link to="/about" className="font-bold text-gray-600 dark:text-gray-300 hover:text-chefie-yellow dark:hover:text-chefie-yellow uppercase text-sm tracking-wider transition-colors duration-200">
                            Hakkında
                        </Link>
                        <a href="mailto:tarifo@outlook.com.tr" className="font-bold text-gray-600 dark:text-gray-300 hover:text-chefie-yellow dark:hover:text-chefie-yellow uppercase text-sm tracking-wider transition-colors duration-200">
                            İletişime Geçin
                        </a>
                        <Link to="/terms" className="font-bold text-gray-600 dark:text-gray-300 hover:text-chefie-yellow dark:hover:text-chefie-yellow uppercase text-sm tracking-wider transition-colors duration-200">
                            Kullanım Koşulları
                        </Link>
                    </div>

                    {/* Social Icons */}
                    <div className="flex space-x-3">
                        <a href="https://www.instagram.com/recipes.with.tarifo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 dark:border-slate-700 rounded hover:border-chefie-yellow dark:hover:border-chefie-yellow hover:text-chefie-yellow dark:hover:text-chefie-yellow text-gray-500 dark:text-gray-400 transition-colors duration-200" title="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://github.com/odweblabs/recipeWebSite" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 dark:border-slate-700 rounded hover:border-chefie-yellow dark:hover:border-chefie-yellow hover:text-chefie-yellow dark:hover:text-chefie-yellow text-gray-500 dark:text-gray-400 transition-colors duration-200" title="GitHub">
                            <Github size={20} />
                        </a>
                        <a href="mailto:tarifo@outlook.com.tr" className="flex items-center justify-center w-10 h-10 border-2 border-gray-200 dark:border-slate-700 rounded hover:border-chefie-yellow dark:hover:border-chefie-yellow hover:text-chefie-yellow dark:hover:text-chefie-yellow text-gray-500 dark:text-gray-400 transition-colors duration-200" title="Email">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
                    <p>&copy; {new Date().getFullYear()} Tarifo. {t('footer.all_rights_reserved')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
