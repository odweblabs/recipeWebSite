import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft,
    Camera,
    User,
    Lock,
    Trash2,
    Loader2,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';
import API_BASE from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import axios from 'axios';

const EditProfile = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'));
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State for inputs
    const [fullName, setFullName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Visibility toggles
    const [showPw, setShowPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchUserData();
    }, [token, navigate]);

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setFullName(res.data.full_name || '');
            setPreviewImage(res.data.profile_image ? getImageUrl(res.data.profile_image) : null);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Update Profile Info (Name & Image)
            const formData = new FormData();
            formData.append('full_name', fullName);
            formData.append('country', user.country || ''); // Keep existing country
            if (profileImage) {
                formData.append('profile_image', profileImage);
            }

            await axios.put(`${API_BASE}/api/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 2. Update Password if fields are filled
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error(t('edit_profile.errors.match'));
                }
                if (newPassword.length < 6) {
                    throw new Error(t('edit_profile.errors.length'));
                }
                if (!currentPassword) {
                    throw new Error(t('edit_profile.errors.current_required'));
                }

                await axios.put(`${API_BASE}/api/auth/password`, {
                    current_password: currentPassword,
                    new_password: newPassword
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Success!
            setMessage({ type: 'success', text: t('edit_profile.messages.success') });

            // Update session storage
            const userRes = await axios.get(`${API_BASE}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            sessionStorage.setItem('user', JSON.stringify(userRes.data));

            setTimeout(() => {
                navigate('/settings');
            }, 1500);

        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || err.message || t('edit_profile.messages.error')
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm(t('edit_profile.messages.confirm_delete'))) {
            try {
                await axios.delete(`${API_BASE}/api/auth/account`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                localStorage.clear();
                sessionStorage.clear();
                navigate('/admin/login');
            } catch (err) {
                alert(t('edit_profile.messages.error_delete'));
            }
        }
    };

    const FormInput = ({ label, placeholder, value, onChange, type = "text", icon: Icon, showToggle, onToggle, show }) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-chefie-secondary ml-1 uppercase tracking-wider">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-chefie-secondary group-focus-within:text-chefie-green transition-colors">
                    {Icon && <Icon className="w-5 h-5" />}
                </div>
                <input
                    type={showToggle ? (show ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-chefie-card border border-chefie-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-chefie-green/20 focus:border-chefie-green transition-all shadow-sm text-chefie-text placeholder-chefie-secondary/50"
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-chefie-secondary hover:text-chefie-text p-1"
                    >
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-chefie-cream flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-chefie-green animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-chefie-cream text-chefie-text pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-chefie-cream/80 backdrop-blur-md px-4 py-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-chefie-card rounded-full transition-colors shadow-sm text-chefie-secondary"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold font-sans text-chefie-text">{t('edit_profile.title')}</h1>
                <div className="w-10" />
            </div>

            <div className="max-w-xl mx-auto px-4">
                <form onSubmit={handleSaveChanges} className="space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-chefie-card shadow-xl bg-chefie-card">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-chefie-green to-emerald-700 flex items-center justify-center text-white text-3xl font-bold">
                                        {(fullName || user.username).charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 bg-chefie-yellow p-2.5 rounded-full shadow-lg border-2 border-chefie-card cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                                <Camera className="w-5 h-5 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {/* Status Message */}
                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                            <span className="text-sm font-bold">{message.text}</span>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="pt-4">
                        <FormInput
                            label={t('edit_profile.fields.full_name')}
                            placeholder={t('edit_profile.fields.full_name')}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={User}
                        />
                    </div>

                    {/* Password Section */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 text-chefie-secondary mb-2">
                            <span className="h-px bg-chefie-border flex-1"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('edit_profile.fields.new_password')}</span>
                            <span className="h-px bg-chefie-border flex-1"></span>
                        </div>

                        <FormInput
                            label={t('edit_profile.fields.current_password')}
                            placeholder={t('edit_profile.fields.current_password')}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            icon={Lock}
                            showToggle
                            show={showPw}
                            onToggle={() => setShowPw(!showPw)}
                        />

                        <FormInput
                            label={t('edit_profile.fields.new_password')}
                            placeholder={t('edit_profile.fields.new_password')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            icon={Lock}
                            showToggle
                            show={showNewPw}
                            onToggle={() => setShowNewPw(!showNewPw)}
                        />

                        <FormInput
                            label={t('edit_profile.fields.confirm_password')}
                            placeholder={t('edit_profile.fields.confirm_password')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            showToggle
                            show={showConfirmPw}
                            onToggle={() => setShowConfirmPw(!showConfirmPw)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="pt-8 space-y-4">
                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-chefie-green text-white py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-chefie-green/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {updating ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {t('edit_profile.buttons.updating')}</>
                            ) : (
                                t('edit_profile.buttons.save')
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="w-full bg-chefie-card border border-chefie-border py-4 rounded-full font-bold text-chefie-secondary hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                        >
                            {t('edit_profile.buttons.delete')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
