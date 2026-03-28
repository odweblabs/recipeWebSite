import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Eye, Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Policy = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const policies = [
        {
            icon: Lock,
            title: t('policy.item1.title'),
            content: t('policy.item1.content')
        },
        {
            icon: Eye,
            title: t('policy.item2.title'),
            content: t('policy.item2.content')
        },
        {
            icon: Cloud,
            title: t('policy.item3.title'),
            content: t('policy.item3.content')
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
                <h1 className="text-xl font-bold font-sans">{t('policy.title')}</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif dark:text-white">{t('policy.header')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mt-2">{t('policy.desc')}</p>
                </div>

                <div className="grid gap-6">
                    {policies.map((policy, index) => (
                        <div key={index} className="bg-white dark:bg-chefie-card rounded-[32px] border border-gray-100 dark:border-chefie-border shadow-sm p-8 group hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-chefie-green group-hover:bg-chefie-green group-hover:text-white transition-colors duration-300">
                                    <policy.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold dark:text-white">{policy.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed">
                                        {policy.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-chefie-green rounded-[32px] p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <h3 className="text-xl font-bold relative z-10">{t('policy.more_info')}</h3>
                    <p className="text-white/80 mt-2 relative z-10 text-sm">
                        {t('policy.more_info_desc')}
                    </p>
                    <button className="mt-6 bg-white text-chefie-green px-8 py-3 rounded-full font-bold hover:bg-chefie-yellow hover:text-white transition-colors">
                        {t('policy.contact_btn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Policy;
