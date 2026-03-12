import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Flame, Info, Apple, Utensils, Activity, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Calories = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'guide' | 'tips'

    // Calculator State
    const [gender, setGender] = useState('female');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [result, setResult] = useState(null);

    const calculateBMR = () => {
        if (!weight || !height || !age) return;

        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = Math.round(bmr * parseFloat(activity));

        setResult({
            bmr: Math.round(bmr),
            tdee: tdee,
            lose: Math.round(tdee * 0.8),
            gain: Math.round(tdee * 1.2)
        });
    };

    const foodData = [
        { name: "Yumurta (1 adet)", calories: 78, protein: "6g", category: "Protein" },
        { name: "Tavuk Göğsü (100g)", calories: 165, protein: "31g", category: "Protein" },
        { name: "Pirinç Pilavı (100g)", calories: 130, carbs: "28g", category: "Karbonhidrat" },
        { name: "Elma (Orta Boy)", calories: 95, vitamins: "C", category: "Meyve" },
        { name: "Zeytinyağı (1 y.k.)", calories: 119, fats: "14g", category: "Yağ" },
        { name: "Badem (10 adet)", calories: 70, protein: "2.5g", category: "Kuruyemiş" },
        { name: "Mercimek Çorbası (1 kase)", calories: 140, fiber: "8g", category: "Çorba" },
        { name: "Yulaf Ezmesi (100g)", calories: 389, fiber: "10g", category: "Karbonhidrat" },
    ];

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6">
            {/* Header */}
            <header className="py-12 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-chefie-yellow mb-4"
                >
                    <Flame className="w-4 h-4" />
                    <span>{t('calories.header.badge')}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black text-chefie-dark mb-6 leading-tight"
                >
                    {t('calories.header.title')} <br />
                    <span className="text-chefie-yellow relative">
                        {t('calories.header.subtitle')}
                        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                            <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                        </svg>
                    </span>
                </motion.h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    {t('calories.header.desc')}
                </p>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto mb-12 flex justify-center">
                <div className="bg-white p-2 rounded-3xl shadow-xl shadow-gray-200/50 flex gap-2">
                    {[
                        { id: 'calculator', label: t('calories.tabs.calculate'), icon: Calculator },
                        { id: 'guide', label: t('calories.tabs.guide'), icon: Apple },
                        { id: 'tips', label: t('calories.tabs.tips'), icon: Info },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? 'bg-chefie-yellow text-white shadow-lg shadow-yellow-200'
                                : 'text-gray-400 hover:text-chefie-dark'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'calculator' && (
                        <motion.div
                            key="calc"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                        >
                            {/* Form Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-100 border border-gray-50">
                                <h3 className="text-2xl font-black text-chefie-dark mb-8 flex items-center gap-3">
                                    <Activity className="text-chefie-yellow" /> {t('calories.tabs.calculate')}
                                </h3>

                                <div className="space-y-6">
                                    {/* Gender Toggle */}
                                    <div className="flex gap-4 p-1 bg-gray-50 rounded-2xl">
                                        <button
                                            onClick={() => setGender('female')}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${gender === 'female' ? 'bg-white text-chefie-dark shadow-sm' : 'text-gray-400'}`}
                                        >
                                            {t('calories.form.female')}
                                        </button>
                                        <button
                                            onClick={() => setGender('male')}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${gender === 'male' ? 'bg-white text-chefie-dark shadow-sm' : 'text-gray-400'}`}
                                        >
                                            {t('calories.form.male')}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('calories.form.weight')}</label>
                                            <input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="70"
                                                className="w-full bg-gray-50 border-0 rounded-2xl py-4 flex-1 focus:ring-2 focus:ring-chefie-yellow/20 font-bold px-6"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('calories.form.height')}</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder="175"
                                                className="w-full bg-gray-50 border-0 rounded-2xl py-4 flex-1 focus:ring-2 focus:ring-chefie-yellow/20 font-bold px-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('calories.form.age')}</label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="25"
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 flex-1 focus:ring-2 focus:ring-chefie-yellow/20 font-bold px-6"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('calories.form.activity')}</label>
                                        <select
                                            value={activity}
                                            onChange={(e) => setActivity(e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-2xl py-4 flex-1 focus:ring-2 focus:ring-chefie-yellow/20 font-bold px-6 appearance-none cursor-pointer"
                                        >
                                            <option value="1.2">{t('calories.form.activity_levels.level_1')}</option>
                                            <option value="1.375">{t('calories.form.activity_levels.level_2')}</option>
                                            <option value="1.55">{t('calories.form.activity_levels.level_3')}</option>
                                            <option value="1.725">{t('calories.form.activity_levels.level_4')}</option>
                                            <option value="1.9">{t('calories.form.activity_levels.level_5')}</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={calculateBMR}
                                        className="w-full py-5 bg-chefie-dark text-white font-black rounded-[1.5rem] hover:bg-chefie-yellow transition-all shadow-xl shadow-gray-200 mt-4 flex items-center justify-center gap-2"
                                    >
                                        {t('calories.form.submit')} <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Result Card */}
                            <div className="flex flex-col gap-6">
                                {!result ? (
                                    <div className="flex-1 bg-chefie-yellow/5 border-2 border-dashed border-chefie-yellow/20 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-56 h-56 mb-6 flex items-center justify-center rounded-3xl overflow-hidden shadow-lg shadow-gray-100 group">
                                            <img src="/images/calorie-chef.svg" alt="Happy Chef" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h4 className="text-xl font-black text-chefie-dark mb-2">{t('calories.results.not_calculated_yet')}</h4>
                                        <p className="text-gray-400 text-sm max-w-xs">{t('calories.results.not_calculated_desc')}</p>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex-1 flex flex-col gap-6"
                                    >
                                        {/* Main Target */}
                                        <div className="bg-[#10B981] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-green-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">{t('calories.results.daily_needs')}</p>
                                                <h4 className="text-4xl md:text-5xl font-black">{result.tdee} <span className="text-xl">{t('calories.results.kcal')}</span></h4>
                                            </div>
                                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                                <Flame className="w-8 h-8" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('calories.results.lose_weight')}</p>
                                                <h5 className="text-2xl font-black text-[#EF4444]">{result.lose} {t('calories.results.kcal')}</h5>
                                            </div>
                                            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('calories.results.gain_weight')}</p>
                                                <h5 className="text-2xl font-black text-[#3B82F6]">{result.gain} {t('calories.results.kcal')}</h5>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 flex items-center gap-6">
                                            <div className="w-12 h-12 bg-chefie-yellow/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <Info className="w-6 h-6 text-chefie-yellow" />
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                {t('calories.results.bmr')}: <span className="font-black text-chefie-dark">{result.bmr} {t('calories.results.kcal')}</span>. {t('calories.results.bmr_desc')}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'guide' && (
                        <motion.div
                            key="guide"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {foodData.map((food, idx) => (
                                <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-100 border border-gray-50 hover:shadow-2xl hover:shadow-chefie-yellow/10 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-chefie-yellow bg-chefie-yellow/10 px-2 py-1 rounded-lg">
                                            {food.category}
                                        </span>
                                        <Utensils className="w-4 h-4 text-gray-200 group-hover:text-chefie-yellow transition-colors" />
                                    </div>
                                    <h4 className="font-black text-chefie-dark mb-4">{food.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Kalori</span>
                                            <span className="text-xl font-black text-chefie-dark">{food.calories} kcal</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{food.protein ? 'Protein' : food.carbs ? 'Karbonhidrat' : 'Fiber'}</span>
                                            <p className="font-black text-xs text-chefie-yellow">{food.protein || food.carbs || food.fiber || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'tips' && (
                        <motion.div
                            key="tips"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto space-y-6"
                        >
                            {[
                                { title: t('calories.tips.title_1'), text: t('calories.tips.desc_1'), color: "text-blue-500", bg: "bg-blue-50" },
                                { title: t('calories.tips.title_2'), text: t('calories.tips.desc_2'), color: "text-green-500", bg: "bg-green-50" },
                                { title: t('calories.tips.title_3'), text: t('calories.tips.desc_3'), color: "text-orange-500", bg: "bg-orange-50" },
                                { title: t('calories.tips.title_4'), text: t('calories.tips.desc_4'), color: "text-purple-500", bg: "bg-purple-50" },
                            ].map((tip, idx) => (
                                <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 flex gap-6 items-start">
                                    <div className={`w-14 h-14 rounded-2xl ${tip.bg} flex items-center justify-center flex-shrink-0`}>
                                        <CheckCircle2 className={`w-6 h-6 ${tip.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-chefie-dark mb-2">{tip.title}</h4>
                                        <p className="text-gray-500 leading-relaxed">{tip.text}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100 flex flex-col md:flex-row items-center gap-8 mt-12">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-red-100">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h4 className="text-2xl font-black text-red-900 mb-2">{t('calories.tips.warning_title')}</h4>
                                    <p className="text-red-700 font-medium">{t('calories.tips.warning_desc')}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Calories;
