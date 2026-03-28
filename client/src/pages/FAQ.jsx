import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: t('faq.q1'),
            answer: t('faq.a1')
        },
        {
            question: t('faq.q2'),
            answer: t('faq.a2')
        },
        {
            question: t('faq.q3'),
            answer: t('faq.a3')
        },
        {
            question: t('faq.q4'),
            answer: t('faq.a4')
        },
        {
            question: t('faq.q5'),
            answer: t('faq.a5')
        },
        {
            question: t('faq.q6'),
            answer: t('faq.a6')
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

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
                <h1 className="text-xl font-bold font-sans">{t('faq.title')}</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-8">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-chefie-green/10 rounded-3xl flex items-center justify-center text-chefie-green mb-4">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif dark:text-white">{t('faq.subtitle')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mt-2">{t('faq.desc')}</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-chefie-card rounded-2xl border border-gray-100 dark:border-chefie-border shadow-sm overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="font-bold text-[15px] pr-4 dark:text-white">{faq.question}</span>
                                {activeIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-chefie-green shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-300 shrink-0" />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed border-t border-gray-50 dark:border-gray-800">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-white dark:bg-chefie-card rounded-3xl border border-dashed border-gray-200 dark:border-chefie-border text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('faq.no_answer')}</p>
                    <button className="mt-2 text-chefie-green font-bold hover:underline">
                        {t('faq.contact_us')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
