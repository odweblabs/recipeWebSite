import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const sections = [
        {
            title: t('terms.item1.title'),
            content: t('terms.item1.content')
        },
        {
            title: t('terms.item2.title'),
            content: t('terms.item2.content')
        },
        {
            title: t('terms.item3.title'),
            content: t('terms.item3.content')
        },
        {
            title: t('terms.item4.title'),
            content: t('terms.item4.content')
        },
        {
            title: t('terms.item5.title'),
            content: t('terms.item5.content')
        }
    ];

    return (
        <div className="min-h-screen bg-[#FFFBF2] dark:bg-chefie-dark text-[#1F2937] dark:text-white pb-12 transition-colors">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FFFBF2]/80 dark:bg-chefie-dark/80 backdrop-blur-md px-4 py-6 flex items-center justify-between border-b border-chefie-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors shadow-sm dark:text-gray-200"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold font-sans">{t('terms.title')}</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 mb-4">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-center dark:text-white">{t('terms.header')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mt-2">{t('terms.last_update')}</p>
                </div>

                <div className="bg-white dark:bg-chefie-card rounded-[32px] border border-gray-100 dark:border-chefie-border shadow-sm p-6 md:p-8 space-y-8">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                                <CheckCircle className="w-5 h-5 text-chefie-green shrink-0" />
                                {section.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed pl-7">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {t('terms.footer_desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
