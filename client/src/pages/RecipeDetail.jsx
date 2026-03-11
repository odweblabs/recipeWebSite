import API_BASE from '../utils/api';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft, Printer, Share2, Heart, ChefHat, Star, MessageSquare, Send, Smartphone } from 'lucide-react';

const RecipeDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const [isFavorited, setIsFavorited] = useState(false);
    const [wakeLock, setWakeLock] = useState(null);
    const [isScreenAwake, setIsScreenAwake] = useState(false);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/recipes/${id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/recipes/${id}`);
                setRecipe(res.data);
                fetchComments();

                if (token) {
                    try {
                        const favRes = await axios.get(`${API_BASE}/api/favorites/check/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setIsFavorited(favRes.data.isFavorited);
                    } catch (favErr) {
                        console.error('Error checking favorite:', favErr);
                    }
                }

                if (res.data.category_id) {
                    const catRes = await axios.get(`${API_BASE}/api/categories`);
                    const cat = catRes.data.find(c => c.id === res.data.category_id);
                    if (cat) setCategoryName(cat.name);
                }
            } catch (err) {
                console.error('Error fetching recipe:', err);
                alert(t('recipe_detail.not_found'));
                navigate('/recipes');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, navigate, token]);

    const handleToggleFavorite = async () => {
        if (!token) {
            alert(t('recipe_detail.favorites.login_required'));
            navigate('/admin/login');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE}/api/favorites/toggle/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFavorited(res.data.isFavorited);
        } catch (err) {
            console.error('Error toggling favorite:', err);
            alert(t('profile.error_generic'));
        }
    };

    const handleRate = async (score) => {
        if (!token) {
            alert(t('recipe_detail.rate.login_required'));
            navigate('/admin/login');
            return;
        }

        try {
            await axios.post(`${API_BASE}/api/recipes/${id}/rate`, { score }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh recipe to show updated average
            const res = await axios.get(`${API_BASE}/api/recipes/${id}`);
            setRecipe(res.data);
        } catch (err) {
            alert(t('recipe_detail.rate.error'));
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!token) {
            alert(t('recipe_detail.comments.login_alert'));
            navigate('/admin/login');
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            await axios.post(`${API_BASE}/api/recipes/${id}/comment`, { content: newComment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewComment('');
            fetchComments();
            // Refresh recipe to update comment count
            const res = await axios.get(`${API_BASE}/api/recipes/${id}`);
            setRecipe(res.data);
        } catch (err) {
            alert(t('recipe_detail.comments.error'));
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: recipe.title,
            text: recipe.description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert(t('recipe_detail.share_success'));
            } catch (err) {
                console.error('Clipboard failed', err);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- Wake Lock Management ---
    const requestWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try {
                const lock = await navigator.wakeLock.request('screen');
                setWakeLock(lock);
                setIsScreenAwake(true);

                lock.addEventListener('release', () => {
                    setIsScreenAwake(false);
                    setWakeLock(null);
                });
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
                alert(t('recipe_detail.wake_lock.denied'));
            }
        } else {
            alert(t('recipe_detail.wake_lock.not_supported'));
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLock !== null) {
            await wakeLock.release();
            setWakeLock(null);
            setIsScreenAwake(false);
        }
    };

    const toggleScreenAwake = () => {
        if (isScreenAwake) {
            releaseWakeLock();
        } else {
            requestWakeLock();
        }
    };

    // Re-acquire wake lock if page becomes visible again
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Cleanup on unmount
            if (wakeLock !== null) {
                wakeLock.release().catch(console.error);
            }
        };
    }, [wakeLock]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-chefie-cream text-lg font-medium text-gray-600">{t('common.loading')}</div>;
    if (!recipe) return null;

    return (
        <div className="max-w-5xl mx-auto pb-12 print:p-0 print:m-0 px-4 bg-chefie-cream">
            {/* Breadcrumb & Back */}
            <div className="mb-8 flex items-center justify-between print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center text-chefie-text hover:text-chefie-yellow transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('recipe_detail.back')}
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Link to="/" className="hover:text-chefie-yellow">{t('recipes.breadcrumb.home')}</Link>
                    <span>/</span>
                    <Link to="/recipes" className="hover:text-chefie-yellow">{t('nav.recipes')}</Link>
                    <span>/</span>
                    <span className="text-chefie-text font-medium line-clamp-1">{recipe.title}</span>
                </div>
            </div>

            <div className="bg-chefie-card rounded-3xl shadow-sm md:shadow-lg dark:shadow-none border border-chefie-border overflow-hidden print:shadow-none print:border-none print:rounded-none">
                {/* Hero Image */}
                <div className="w-full h-[300px] md:h-[450px] relative print:h-[250px] print:mb-4">
                    <img
                        src={recipe.image_url ? (recipe.image_url.startsWith('/images/') ? recipe.image_url : `${API_BASE}${recipe.image_url}`) : '/default-recipe.png'}
                        alt={recipe.title}
                        className="w-full h-full object-cover print:rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent print:hidden"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white print:relative print:text-black print:p-0 print:mt-4">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {categoryName && (
                                <span className="px-3 py-1 bg-chefie-yellow text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg print:bg-gray-100">
                                    {categoryName}
                                </span>
                            )}
                            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold print:bg-transparent print:text-gray-600 print:px-0">
                                <Star className="w-4 h-4 text-chefie-yellow fill-current mr-1" />
                                {recipe.avg_rating ? Number(recipe.avg_rating).toFixed(1) : t('common.new_tag')}
                                <span className="text-white/60 font-normal ml-1 print:text-gray-400">({recipe.rating_count || 0})</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-serif mb-2 leading-tight">{recipe.title}</h1>
                        <p className="text-white/80 max-w-2xl text-base md:text-lg line-clamp-2 print:text-black print:line-clamp-none">{recipe.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 print:block">
                    {/* Left Sidebar (Stats & Ingredients) */}
                    <div className="col-span-1 bg-chefie-cream/50 p-6 md:p-8 border-r border-chefie-border print:bg-transparent print:border-none print:p-0 print:mb-6">
                        {/* Rating Section */}
                        <div className="bg-chefie-card p-6 rounded-2xl shadow-sm border border-chefie-border mb-8 text-center print:hidden">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t('recipe_detail.rate.title')}</h4>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleRate(star)}
                                        className="transform hover:scale-110 transition-transform focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= (hoverRating || Math.round(recipe.avg_rating || 0))
                                                ? 'text-chefie-yellow fill-current'
                                                : 'text-chefie-cream border-chefie-border'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">
                                {recipe.rating_count ? t('recipe_detail.rate.rated_by', { count: recipe.rating_count }) : t('recipe_detail.rate.not_rated')}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8 print:flex print:divide-x print:divide-gray-200 print:bg-gray-50 print:p-4 print:rounded-2xl print:border print:border-gray-100 print:gap-0">
                            <div className="bg-chefie-card p-4 rounded-xl shadow-sm border border-chefie-border text-center print:shadow-none print:bg-transparent print:border-none print:flex-1 print:p-2">
                                <Clock className="w-6 h-6 text-chefie-yellow mx-auto mb-2 print:w-5 print:h-5" />
                                <div className="text-xs text-gray-400 uppercase font-bold">{t('recipe_detail.stats.prep')}</div>
                                <div className="font-bold text-chefie-text print:text-sm">{recipe.prep_time || `15 ${t('common.minutes')}`}</div>
                            </div>
                            <div className="bg-chefie-card p-4 rounded-xl shadow-sm border border-chefie-border text-center print:shadow-none print:bg-transparent print:border-none print:flex-1 print:p-2">
                                <Clock className="w-6 h-6 text-chefie-yellow mx-auto mb-2 print:w-5 print:h-5" />
                                <div className="text-xs text-gray-400 uppercase font-bold">{t('recipe_detail.stats.cook')}</div>
                                <div className="font-bold text-chefie-text print:text-sm">{recipe.cook_time || `30 ${t('common.minutes')}`}</div>
                            </div>
                            <div className="bg-chefie-card p-4 rounded-xl shadow-sm border border-chefie-border text-center col-span-2 print:shadow-none print:bg-transparent print:border-none print:col-span-1 print:flex-1 print:p-2">
                                <Users className="w-6 h-6 text-chefie-yellow mx-auto mb-2 print:w-5 print:h-5" />
                                <div className="text-xs text-gray-400 uppercase font-bold">{t('recipe_detail.stats.servings')}</div>
                                <div className="font-bold text-chefie-text print:text-sm">{recipe.servings || '4'} {t('what_to_cook.suggestion.servings')}</div>
                            </div>
                        </div>

                        {/* Chef Info */}
                        <div className="bg-chefie-card p-6 rounded-2xl shadow-sm border border-chefie-border mb-8 flex flex-col gap-6 print:hidden">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    {recipe.chef_image ? (
                                        <img
                                            src={recipe.chef_image.startsWith('http') ? recipe.chef_image : `${API_BASE}${recipe.chef_image}`}
                                            alt={recipe.chef_name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-chefie-yellow shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-chefie-cream text-chefie-text flex items-center justify-center font-bold text-xl border-2 border-chefie-yellow shadow-sm">
                                            {(recipe.chef_name || recipe.chef_username || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('recipe_detail.chef_title')}</div>
                                    <div className="font-bold text-chefie-text text-lg">{recipe.chef_name || recipe.chef_username}</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-chefie-border">
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${isFavorited ? 'text-red-500 bg-red-500/10 shadow-sm border border-red-500/20' : 'text-gray-400 bg-chefie-cream hover:bg-chefie-card border border-transparent hover:border-chefie-border'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                                    {isFavorited ? t('recipe_detail.favorites.added') : t('recipe_detail.favorites.add')}
                                </button>
                                <div className="flex gap-2 w-full">
                                    <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-chefie-cream text-gray-400 rounded-xl hover:bg-chefie-card border border-transparent hover:border-chefie-border transition-all font-bold text-xs md:text-sm truncate">
                                        <Share2 className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{t('common.share')}</span>
                                    </button>
                                    <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-chefie-cream text-gray-400 rounded-xl hover:bg-chefie-card border border-transparent hover:border-chefie-border transition-all font-bold text-xs md:text-sm truncate">
                                        <Printer className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{t('common.print')}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={toggleScreenAwake}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${isScreenAwake ? 'text-chefie-yellow bg-chefie-yellow/10 border border-chefie-yellow/20 shadow-sm' : 'text-gray-400 bg-chefie-cream hover:bg-chefie-card border border-transparent hover:border-chefie-border'}`}
                                >
                                    <Smartphone className="w-5 h-5" />
                                    {isScreenAwake ? t('recipe_detail.wake_lock.active') : t('recipe_detail.wake_lock.inactive')}
                                </button>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <h3 className="text-xl font-bold text-chefie-text mb-4 flex items-center">
                                <span className="w-1.5 h-6 bg-chefie-yellow rounded-full mr-3"></span>
                                {t('recipe_detail.ingredients')}
                            </h3>
                            <ul className="space-y-3">
                                {recipe.ingredients.split('\n').map((item, idx) => {
                                    if (!item.trim()) return null;
                                    return (
                                        <li key={idx} className="flex items-start text-chefie-text text-sm leading-relaxed p-3 bg-chefie-cream/30 rounded-xl border border-chefie-border hover:border-chefie-yellow/30 transition-colors print:bg-transparent print:border-b print:border-gray-200 print:rounded-none print:p-2">
                                            <div className="w-2 h-2 bg-chefie-yellow rounded-full mt-1.5 mr-3 flex-shrink-0 print:bg-gray-400"></div>
                                            {item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Right Content (Instructions) */}
                    <div className="col-span-2 p-6 md:p-10 print:p-0 bg-chefie-card">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-chefie-border print:mb-4 print:pb-2">
                            <h2 className="text-2xl font-bold text-chefie-text flex items-center gap-3">
                                <ChefHat className="text-chefie-yellow" />
                                {t('recipe_detail.instructions')}
                            </h2>
                        </div>

                        <div className="space-y-8 print:space-y-4 mb-16">
                            {recipe.instructions.split('\n').map((step, idx) => {
                                if (!step.trim()) return null;
                                return (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-10 h-10 bg-chefie-cream text-chefie-text font-bold rounded-2xl flex items-center justify-center border border-chefie-yellow group-hover:bg-chefie-yellow group-hover:text-white transition-all duration-300 print:bg-white print:text-black print:rounded-full print:w-6 print:h-6">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 pt-1.5">
                                            <p className="text-chefie-text leading-relaxed text-lg print:text-sm">{step}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-chefie-border pt-12 print:hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-chefie-text flex items-center gap-3">
                                    <MessageSquare className="text-chefie-yellow" />
                                    {t('recipe_detail.comments.title')} ({recipe.comment_count || 0})
                                </h3>
                            </div>

                            {/* New Comment Form */}
                            <div className="bg-chefie-cream/50 p-6 rounded-3xl mb-10 border border-chefie-border">
                                <h4 className="font-bold text-chefie-text mb-4">{t('recipe_detail.comments.leave_comment')}</h4>
                                {token ? (
                                    <form onSubmit={handleComment} className="space-y-4">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={t('recipe_detail.comments.placeholder')}
                                            className="w-full p-4 rounded-2xl border border-chefie-border bg-chefie-card text-chefie-text focus:ring-2 focus:ring-chefie-yellow focus:border-transparent outline-none min-h-[120px] transition-all"
                                            required
                                        ></textarea>
                                        <div className="flex justify-center md:justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSubmittingComment}
                                                className="bg-chefie-yellow text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-chefie-yellow/80 transition-colors disabled:opacity-50 w-full md:w-auto justify-center"
                                            >
                                                {isSubmittingComment ? t('recipe_detail.comments.submitting') : (
                                                    <><Send className="w-4 h-4" /> {t('recipe_detail.comments.submit')}</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-400 mb-4">{t('recipe_detail.comments.login_required')}</p>
                                        <Link to="/admin/login" className="text-chefie-yellow font-bold hover:underline">{t('recipe_detail.comments.login_link')}</Link>
                                    </div>
                                )}
                            </div>

                            {/* Comment List */}
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 p-4 rounded-2xl hover:bg-chefie-cream/30 transition-colors">
                                            <div className="flex-shrink-0">
                                                <Link to={`/profile/${comment.user_id}`}>
                                                    {comment.profile_image ? (
                                                        <img
                                                            src={comment.profile_image.startsWith('http') ? comment.profile_image : `${API_BASE}${comment.profile_image}`}
                                                            alt={comment.full_name}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-chefie-card shadow-sm hover:border-chefie-yellow transition-colors"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-chefie-cream text-chefie-text flex items-center justify-center font-bold border-2 border-chefie-card shadow-sm hover:border-chefie-yellow transition-colors">
                                                            {(comment.full_name || comment.username || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </Link>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <Link to={`/profile/${comment.user_id}`} className="font-bold text-chefie-text hover:text-chefie-yellow transition-colors">
                                                        {comment.full_name || comment.username}
                                                    </Link>
                                                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString(t('common.locale'))}</span>
                                                </div>
                                                <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-10">{t('recipe_detail.comments.empty')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
