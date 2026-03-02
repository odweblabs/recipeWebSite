import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, ChefHat, MessageSquare, Clock, Heart, Trash2, Edit, X, Save, UserPlus, UserCheck, UserX, Users, Check, Loader2 } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [comments, setComments] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recipes');

    // Comment Edit State
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    // Friend System State
    const [friendStatus, setFriendStatus] = useState({ status: 'none' }); // none | pending | accepted
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friendActionLoading, setFriendActionLoading] = useState(false);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    const isOwner = currentUser.id === parseInt(id);
    const isLoggedIn = !!token && !!currentUser.id;

    const fetchRecipes = async (isLoadMore = false) => {
        try {
            const currentOffset = isLoadMore ? offset + LIMIT : 0;
            const res = await axios.get(`http://localhost:5050/api/recipes/users/${id}/recipes?limit=${LIMIT}&offset=${currentOffset}`);

            if (isLoadMore) {
                setRecipes(prev => [...prev, ...res.data]);
                setOffset(currentOffset);
            } else {
                setRecipes(res.data);
                setOffset(0);
            }
            setHasMore(res.data.length >= LIMIT);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        }
    };

    // Fetch friend status between current user and profile user
    const fetchFriendStatus = async () => {
        if (!isLoggedIn || isOwner) return;
        try {
            const res = await axios.get(`http://localhost:5050/api/friends/status/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus(res.data);
        } catch (err) {
            console.error('Error fetching friend status:', err);
        }
    };

    // Fetch friends list for this profile
    const fetchFriends = async () => {
        try {
            const res = await axios.get(`http://localhost:5050/api/friends/${id}`);
            setFriends(res.data);
        } catch (err) {
            console.error('Error fetching friends:', err);
        }
    };

    // Fetch pending requests (only for profile owner)
    const fetchPendingRequests = async () => {
        if (!isOwner || !token) return;
        try {
            const res = await axios.get(`http://localhost:5050/api/friends/requests/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(res.data);
        } catch (err) {
            console.error('Error fetching pending requests:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const profileRes = await axios.get(`http://localhost:5050/api/auth/users/${id}/profile`);
                setProfile(profileRes.data);

                await fetchRecipes();

                const commentsRes = await axios.get(`http://localhost:5050/api/recipes/users/${id}/comments`);
                setComments(commentsRes.data);

                // Load menus from localStorage only for profile owner
                try {
                    const rawMenus = localStorage.getItem('chefie_menus_v1');
                    if (rawMenus) {
                        const parsed = JSON.parse(rawMenus);
                        if (Array.isArray(parsed)) {
                            const ownerId = parseInt(id);
                            const userMenus = parsed.filter(m => {
                                if (!m.createdBy || !m.createdBy.id) return isOwner && !profileRes.data.id; // fallback
                                return parseInt(m.createdBy.id) === ownerId;
                            });
                            setMenus(userMenus);
                        }
                    }
                } catch {
                    setMenus([]);
                }

                // Fetch friend data
                await fetchFriends();
                await fetchFriendStatus();
                await fetchPendingRequests();
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // Friend Action Handlers
    const sendFriendRequest = async () => {
        setFriendActionLoading(true);
        try {
            await axios.post(`http://localhost:5050/api/friends/request/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchFriendStatus();
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        } finally {
            setFriendActionLoading(false);
        }
    };

    const cancelFriendRequest = async () => {
        setFriendActionLoading(true);
        try {
            await axios.delete(`http://localhost:5050/api/friends/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        } finally {
            setFriendActionLoading(false);
        }
    };

    const removeFriend = async () => {
        if (!window.confirm('Bu arkadaşlığı kaldırmak istediğinize emin misiniz?')) return;
        setFriendActionLoading(true);
        try {
            await axios.delete(`http://localhost:5050/api/friends/remove/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
            setFriends(prev => prev.filter(f => f.id !== parseInt(id)));
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        } finally {
            setFriendActionLoading(false);
        }
    };

    const acceptRequest = async (friendshipId) => {
        try {
            await axios.put(`http://localhost:5050/api/friends/accept/${friendshipId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
            await fetchFriends();
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        }
    };

    const rejectRequest = async (friendshipId) => {
        try {
            await axios.delete(`http://localhost:5050/api/friends/reject/${friendshipId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(prev => prev.filter(r => r.friendship_id !== friendshipId));
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        }
    };

    // Incoming request: accept from profile page
    const acceptIncomingRequest = async () => {
        if (!friendStatus.friendship_id) return;
        setFriendActionLoading(true);
        try {
            await axios.put(`http://localhost:5050/api/friends/accept/${friendStatus.friendship_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'accepted', friendship_id: friendStatus.friendship_id });
            await fetchFriends();
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        } finally {
            setFriendActionLoading(false);
        }
    };

    const rejectIncomingRequest = async () => {
        if (!friendStatus.friendship_id) return;
        setFriendActionLoading(true);
        try {
            await axios.delete(`http://localhost:5050/api/friends/reject/${friendStatus.friendship_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriendStatus({ status: 'none' });
        } catch (err) {
            alert(err.response?.data?.error || 'Bir hata oluştu.');
        } finally {
            setFriendActionLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
        try {
            await axios.delete(`http://localhost:5050/api/recipes/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Yorum silinemedi.');
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const saveComment = async (commentId) => {
        try {
            await axios.put(`http://localhost:5050/api/recipes/comments/${commentId}`, { content: editContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.map(c => c.id === commentId ? { ...c, content: editContent } : c));
            setEditingCommentId(null);
        } catch (err) {
            alert('Yorum güncellenemedi.');
        }
    };

    // Friend Button Renderer
    const renderFriendButton = () => {
        if (!isLoggedIn || isOwner) return null;

        if (friendActionLoading) {
            return (
                <button disabled className="friend-btn friend-btn--loading">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>İşleniyor...</span>
                </button>
            );
        }

        if (friendStatus.status === 'accepted') {
            return (
                <button onClick={removeFriend} className="friend-btn friend-btn--accepted">
                    <UserCheck className="w-4 h-4" />
                    <span>Arkadaşsınız</span>
                </button>
            );
        }

        if (friendStatus.status === 'pending') {
            if (friendStatus.direction === 'outgoing') {
                return (
                    <button onClick={cancelFriendRequest} className="friend-btn friend-btn--pending">
                        <Clock className="w-4 h-4" />
                        <span>İstek Gönderildi</span>
                    </button>
                );
            }
            // Incoming request — show accept/reject
            return (
                <div className="friend-incoming-actions">
                    <button onClick={acceptIncomingRequest} className="friend-btn friend-btn--accept">
                        <Check className="w-4 h-4" />
                        <span>Kabul Et</span>
                    </button>
                    <button onClick={rejectIncomingRequest} className="friend-btn friend-btn--reject">
                        <X className="w-4 h-4" />
                        <span>Reddet</span>
                    </button>
                </div>
            );
        }

        return (
            <button onClick={sendFriendRequest} className="friend-btn friend-btn--add">
                <UserPlus className="w-4 h-4" />
                <span>Arkadaş Ekle</span>
            </button>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF2]">Yükleniyor...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF2]">Kullanıcı bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-[#FFFBF2] pt-24 pb-12 px-4">
            <style>{friendStyles}</style>
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                    <div className="relative">
                        {profile.profile_image ? (
                            <img
                                src={profile.profile_image.startsWith('http') ? profile.profile_image : `http://localhost:5050${profile.profile_image}`}
                                alt={profile.full_name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto md:mx-0"
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-md mx-auto md:mx-0">
                                {(profile.full_name || profile.username).charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{profile.full_name || 'İsimsiz Şef'}</h1>
                            {renderFriendButton()}
                        </div>
                        <p className="text-gray-500 font-medium mb-6">@{profile.username}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm text-gray-600 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#10B981]" />
                                <span>Katılım: {new Date(profile.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ChefHat className="w-4 h-4 text-orange-500" />
                                <span>{recipes.length} Tarif</span>
                            </div>
                            {isOwner && (
                                <div className="flex items-center gap-1.5">
                                    <ChefHat className="w-4 h-4 text-yellow-500" />
                                    <span>{menus.length} Menü</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span>{friends.length} Arkadaş</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                <span>{comments.length} Yorum</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Friend Requests (owner only) */}
                {isOwner && pendingRequests.length > 0 && (
                    <div className="pending-requests-card mb-8">
                        <div className="pending-requests-header">
                            <UserPlus className="w-5 h-5 text-orange-500" />
                            <h2>Bekleyen Arkadaşlık İstekleri ({pendingRequests.length})</h2>
                        </div>
                        <div className="pending-requests-list">
                            {pendingRequests.map(request => (
                                <div key={request.friendship_id} className="pending-request-item">
                                    <Link to={`/profile/${request.id}`} className="pending-request-user">
                                        {request.profile_image ? (
                                            <img
                                                src={request.profile_image.startsWith('http') ? request.profile_image : `http://localhost:5050${request.profile_image}`}
                                                alt={request.full_name || request.username}
                                                className="pending-request-avatar"
                                            />
                                        ) : (
                                            <div className="pending-request-avatar-placeholder">
                                                {(request.full_name || request.username).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="pending-request-name">{request.full_name || request.username}</div>
                                            <div className="pending-request-username">@{request.username}</div>
                                        </div>
                                    </Link>
                                    <div className="pending-request-actions">
                                        <button onClick={() => acceptRequest(request.friendship_id)} className="friend-btn friend-btn--accept friend-btn--sm">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Kabul Et</span>
                                        </button>
                                        <button onClick={() => rejectRequest(request.friendship_id)} className="friend-btn friend-btn--reject friend-btn--sm">
                                            <X className="w-3.5 h-3.5" />
                                            <span>Reddet</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Tabs */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'recipes' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Tarifler ({recipes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'friends' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Arkadaşlar ({friends.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'comments' ? 'text-[#10B981] border-b-2 border-[#10B981] bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Yorumlar ({comments.length})
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Recipes Tab */}
                        {activeTab === 'recipes' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {recipes.length > 0 ? recipes.map(recipe => (
                                        <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                                            <div className="h-48 overflow-hidden relative">
                                                {recipe.image_url ? (
                                                    <img src={recipe.image_url.startsWith('/images/') ? recipe.image_url : `http://localhost:5050${recipe.image_url}`} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ChefHat className="w-12 h-12" /></div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {recipe.prep_time}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="text-xs font-bold text-[#10B981] mb-2 uppercase tracking-wide">{recipe.category_name || 'Genel'}</div>
                                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-[#10B981] transition-colors">{recipe.title}</h3>
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{recipe.description}</p>
                                            </div>
                                        </Link>
                                    )) : (
                                        !loading && (
                                            <div className="col-span-full py-12 text-center text-gray-400">
                                                <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                Henüz tarif paylaşılmamış.
                                            </div>
                                        )
                                    )}
                                </div>
                                {hasMore && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => fetchRecipes(true)}
                                            className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                                            disabled={loading}
                                        >
                                            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
                                        </button>
                                    </div>
                                )}

                                {isOwner && (
                                    <div className="mt-10 border-t border-gray-100 pt-8">
                                        <h2 className="text-lg font-bold text-gray-800 mb-4">Menülerim</h2>
                                        {menus.length === 0 ? (
                                            <p className="text-gray-400 text-sm">
                                                Henüz menü oluşturulmamış. İlk menünü <Link to="/menus" className="text-[#10B981] font-semibold">Menüler</Link> sayfasından oluştur.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {menus.map(menu => (
                                                    <div key={menu.id} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex flex-col">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                                    MENÜ
                                                                </div>
                                                                <h3 className="font-bold text-gray-800 text-base">{menu.title}</h3>
                                                            </div>
                                                            <div className="text-xs font-bold text-gray-400">
                                                                {new Date(menu.createdAt).toLocaleDateString('tr-TR')}
                                                            </div>
                                                        </div>
                                                        {menu.description && (
                                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                                {menu.description}
                                                            </p>
                                                        )}
                                                        <div className="flex -space-x-2 mb-4">
                                                            {(menu.recipes || []).slice(0, 3).map(r => (
                                                                <div key={r.id} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                                                    {r.image_url && (
                                                                        <img src={r.image_url.startsWith('/images/') ? r.image_url : `http://localhost:5050${r.image_url}`} alt={r.title} className="w-full h-full object-cover" />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {Math.max(0, (menu.recipes || []).length - 3) > 0 && (
                                                                <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                                    +{Math.max(0, (menu.recipes || []).length - 3)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Link
                                                            to="/menus"
                                                            className="mt-auto inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-[#10B981] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                                        >
                                                            Menüyü Görüntüle
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Friends Tab */}
                        {activeTab === 'friends' && (
                            <div className="friends-grid">
                                {friends.length > 0 ? friends.map(friend => (
                                    <Link key={friend.id} to={`/profile/${friend.id}`} className="friend-card">
                                        {friend.profile_image ? (
                                            <img
                                                src={friend.profile_image.startsWith('http') ? friend.profile_image : `http://localhost:5050${friend.profile_image}`}
                                                alt={friend.full_name || friend.username}
                                                className="friend-card-avatar"
                                            />
                                        ) : (
                                            <div className="friend-card-avatar-placeholder">
                                                {(friend.full_name || friend.username).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="friend-card-info">
                                            <div className="friend-card-name">{friend.full_name || friend.username}</div>
                                            <div className="friend-card-username">@{friend.username}</div>
                                        </div>
                                        <div className="friend-card-since">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(friend.friends_since).toLocaleDateString('tr-TR')}
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-full py-12 text-center text-gray-400">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        Henüz arkadaş eklenmemiş.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comments Tab */}
                        {activeTab === 'comments' && (
                            <div className="space-y-4 max-w-3xl mx-auto">
                                {comments.length > 0 ? comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative group">
                                        <div className="flex items-start justify-between mb-2 gap-4">
                                            <Link to={`/recipes/${comment.recipe_id}`} className="font-bold text-gray-800 hover:text-[#10B981] transition-colors flex-1">
                                                {comment.recipe_title}
                                            </Link>
                                            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                                                <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>

                                                {/* Actions for Owner */}
                                                {(isOwner || currentUser.role === 'admin') && !editingCommentId && (
                                                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {isOwner && (
                                                            <button onClick={() => startEditing(comment)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors shadow-sm"><Edit className="w-4 h-4" /></button>
                                                        )}
                                                        <button onClick={() => handleDeleteComment(comment.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {editingCommentId === comment.id ? (
                                            <div className="mt-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] focus:outline-none mb-3"
                                                    rows="3"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg flex items-center gap-1"><X className="w-3 h-3" /> İptal</button>
                                                    <button onClick={() => saveComment(comment.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg flex items-center gap-1"><Save className="w-3 h-3" /> Kaydet</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                                        )}
                                    </div>
                                )) : (
                                    <div className="py-12 text-center text-gray-400">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        Henüz yorum yapılmamış.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Scoped CSS for friend system components
const friendStyles = `
    /* Friend Buttons */
    .friend-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    .friend-btn--sm {
        padding: 6px 12px;
        font-size: 12px;
        border-radius: 10px;
    }
    .friend-btn--add {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
    .friend-btn--add:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    .friend-btn--pending {
        background: #FEF3C7;
        color: #92400E;
        border: 1px solid #FDE68A;
    }
    .friend-btn--pending:hover {
        background: #FDE68A;
    }
    .friend-btn--accepted {
        background: #ECFDF5;
        color: #065F46;
        border: 1px solid #A7F3D0;
    }
    .friend-btn--accepted:hover {
        background: #FEE2E2;
        color: #991B1B;
        border-color: #FECACA;
    }
    .friend-btn--accept {
        background: #10B981;
        color: white;
    }
    .friend-btn--accept:hover {
        background: #059669;
    }
    .friend-btn--reject {
        background: #F3F4F6;
        color: #6B7280;
        border: 1px solid #E5E7EB;
    }
    .friend-btn--reject:hover {
        background: #FEE2E2;
        color: #991B1B;
        border-color: #FECACA;
    }
    .friend-btn--loading {
        background: #F3F4F6;
        color: #9CA3AF;
        cursor: wait;
    }

    .friend-incoming-actions {
        display: flex;
        gap: 8px;
    }

    /* Pending Requests Card */
    .pending-requests-card {
        background: white;
        border-radius: 2rem;
        padding: 24px 28px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border: 1px solid #FDE68A;
        background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    }
    .pending-requests-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
    }
    .pending-requests-header h2 {
        font-size: 16px;
        font-weight: 700;
        color: #92400E;
        margin: 0;
    }
    .pending-requests-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .pending-request-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: white;
        border-radius: 16px;
        padding: 12px 16px;
        border: 1px solid #F3F4F6;
    }
    .pending-request-user {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
        flex: 1;
        min-width: 0;
    }
    .pending-request-user:hover .pending-request-name {
        color: #10B981;
    }
    .pending-request-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }
    .pending-request-avatar-placeholder {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10B981, #059669);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 16px;
        flex-shrink: 0;
    }
    .pending-request-name {
        font-weight: 700;
        font-size: 14px;
        color: #1F2937;
        transition: color 0.2s;
    }
    .pending-request-username {
        font-size: 12px;
        color: #9CA3AF;
    }
    .pending-request-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }

    /* Friends Grid */
    .friends-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 16px;
    }
    @media (min-width: 768px) {
        .friends-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .friends-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .friend-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        background: #F9FAFB;
        border: 1px solid #F3F4F6;
        border-radius: 16px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
    }
    .friend-card:hover {
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        border-color: #E5E7EB;
        transform: translateY(-2px);
    }
    .friend-card-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    .friend-card-avatar-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10B981, #059669);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 18px;
        flex-shrink: 0;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    .friend-card-info {
        flex: 1;
        min-width: 0;
    }
    .friend-card-name {
        font-weight: 700;
        font-size: 14px;
        color: #1F2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .friend-card:hover .friend-card-name {
        color: #10B981;
    }
    .friend-card-username {
        font-size: 12px;
        color: #9CA3AF;
    }
    .friend-card-since {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #D1D5DB;
        flex-shrink: 0;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 640px) {
        .pending-request-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        .pending-request-actions {
            width: 100%;
        }
        .pending-request-actions .friend-btn {
            flex: 1;
            justify-content: center;
        }
        .friend-incoming-actions {
            flex-direction: row;
        }
    }
`;

export default Profile;
