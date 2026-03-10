import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen, Coffee, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';

const Blog = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6">
            {/* Header */}
            <header className="py-12 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-4"
                >
                    <BookOpen className="w-4 h-4 text-chefie-yellow" />
                    <span>LEZZET GÜNLÜĞÜ</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black text-chefie-text mb-6 leading-tight"
                >
                    Mutfak Hikayeleri & <br />
                    <span className="text-chefie-yellow relative">
                        İlham Veren Yazılar
                        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                            <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                        </svg>
                    </span>
                </motion.h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Yemek kültürü, şeflerden ipuçları, sağlıklı beslenme önerileri ve mutfağa dair her şey bu blogda.
                </p>
            </header>

            {/* Featured Post (First item) */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-20"
            >
                <div
                    onClick={() => navigate(`/blog/${blogPosts[0].id}`)}
                    className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl shadow-gray-200 dark:shadow-none"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 z-20 max-w-4xl text-white">
                        <span className="px-4 py-2 bg-chefie-yellow text-white text-xs font-black rounded-lg uppercase tracking-widest mb-4 inline-block">
                            {blogPosts[0].category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight group-hover:text-chefie-yellow transition-colors">
                            {blogPosts[0].title}
                        </h2>
                        <p className="text-gray-200 text-lg mb-8 line-clamp-2 max-w-2xl">
                            {blogPosts[0].excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-chefie-yellow" />
                                {blogPosts[0].author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-chefie-yellow" />
                                {blogPosts[0].date}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Recent Posts Grid */}
            <section className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10 border-b border-chefie-border pb-4">
                    <h3 className="text-2xl font-black text-chefie-text flex items-center gap-2">
                        <Coffee className="text-chefie-yellow" /> Son Yazılar
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.slice(1).map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="bg-chefie-card rounded-[2rem] p-4 shadow-xl shadow-gray-100/50 dark:shadow-none hover:shadow-2xl hover:shadow-chefie-yellow/10 transition-all group cursor-pointer border border-chefie-border flex flex-col"
                        >
                            <div className="h-56 rounded-3xl overflow-hidden mb-6 relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-chefie-card/90 backdrop-blur text-chefie-text px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide">
                                    {post.category}
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 px-2">
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-chefie-yellow rounded-full"></span>
                                    <span>{post.author}</span>
                                </div>

                                <h3 className="text-xl font-black text-chefie-text mb-3 leading-snug group-hover:text-chefie-yellow transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-chefie-border flex items-center justify-between">
                                    <span className="text-chefie-text font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                        DEVAMINI OKU <ArrowRight className="w-3 h-3 text-chefie-yellow" />
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Blog;
