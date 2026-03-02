import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Share2, Printer, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Find post by ID
        const foundPost = blogPosts.find(p => p.id === parseInt(id));
        if (foundPost) {
            setPost(foundPost);
            window.scrollTo(0, 0); // Scroll to top
        } else {
            navigate('/blog'); // Redirect if not found
        }
    }, [id, navigate]);

    if (!post) return null;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute top-8 left-4 md:left-8 z-20">
                    <button
                        onClick={() => navigate('/blog')}
                        className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full transition-all flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden md:inline">Geri Dön</span>
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 text-white">
                    <div className="max-w-4xl mx-auto">
                        <span className="px-4 py-2 bg-chefie-yellow text-chefie-dark text-xs font-black rounded-lg uppercase tracking-widest inline-block mb-6 shadow-lg">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold opacity-90">
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <User className="w-5 h-5 text-chefie-yellow" />
                                {post.author}
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <Calendar className="w-5 h-5 text-chefie-yellow" />
                                {post.date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content */}
            <main className="max-w-4xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50"
                >
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                            <Tag className="w-4 h-4" />
                            {post.category}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                                <Printer className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Blog Content */}
                    <article
                        className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-chefie-dark prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-chefie-yellow prose-img:rounded-[2rem] first-letter:text-5xl first-letter:font-black first-letter:text-chefie-yellow first-letter:mr-1 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Author Box */}
                    <div className="mt-16 bg-gray-50 rounded-3xl p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-2xl font-black text-chefie-yellow">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-black text-chefie-dark text-lg mb-1">Yazar Hakkında</h4>
                            <p className="text-gray-500 text-sm">
                                {post.author}, gastronomi dünyasındaki deneyimlerini ve mutfak sırlarını Lezzet Yolculuğu okurlarıyla paylaşıyor.
                            </p>
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
};

export default BlogDetail;
