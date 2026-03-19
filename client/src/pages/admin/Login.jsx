import { safeGetToken, safeClearAuth, safeGetStorage, safeSetStorage, safeRemoveStorage, safeGetSessionStorage, safeSetSessionStorage } from '../../utils/storage';
import API_BASE from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(!location.state?.isRegister);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = safeGetToken();
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const endpoint = isLogin ? '/login' : '/register';
            let res;

            if (isLogin) {
                res = await axios.post(`${API_BASE}/api/auth${endpoint}`, { username, password });
            } else {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                formData.append('full_name', fullName);
                if (profileImage) {
                    formData.append('profile_image', profileImage);
                }
                res = await axios.post(`${API_BASE}/api/auth${endpoint}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (isLogin) {
                const token = res.data.token;
                const user = res.data.user;
                // Kullanıcı isteği üzerine sadece oturum süresince (tab kapatılana kadar) geçerli
                safeSetSessionStorage('token', token);
                safeSetSessionStorage('user', JSON.stringify(user));

                // Başarılı girişten sonra gidilecek yer
                const origin = location.state?.from?.pathname || '/';
                setTimeout(() => {
                    navigate(origin, { replace: true });
                }, 100);
            } else {
                setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setUsername('');
        setPassword('');
        setFullName('');
        setProfileImage('');
    };

    return (
        <div className="min-h-screen w-full bg-[#FFFBF2] relative overflow-hidden font-inter">
            {/* Arkaplan Dekorasyonu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#10B981]/5 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FFC107]/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Anasayfa Butonu */}
            <Link to="/" className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-[#10B981] hover:text-[#059669] transition-all font-bold bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 z-50 group border border-chefie-border/50">
                <Home size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm">Anasayfa</span>
            </Link>

            {/* Merkez Konteynırı */}
            <div className="absolute inset-0 flex items-center justify-center p-4 min-[400px]:p-6 md:p-8 z-10">
                <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden max-w-[900px] w-full flex flex-col md:flex-row relative border border-chefie-border/10">

                {/* Sol Taraf - Form */}
                <div className="w-full md:w-1/2 px-6 py-8 min-[400px]:px-10 min-[400px]:py-10 md:px-10 md:py-12 flex flex-col justify-center relative z-10 bg-white">
                    <div className="mb-4 md:mb-8">
                        <Link to="/" className="hover:opacity-80 transition-opacity w-fit mb-4 md:mb-12 block mt-4 md:mt-0 group">
                            <img src="/bitarif_logo_1.png" alt="Logo" className="w-16 min-[400px]:w-20 md:w-24 h-auto transform group-hover:scale-105 transition-transform drop-shadow-sm" />
                        </Link>

                        <h1 className="text-3xl min-[400px]:text-4xl md:text-5xl lg:text-6xl font-black text-[#1F2937] mb-3 md:mb-6 leading-[1.1] tracking-tight">
                            {isLogin ? 'Hoş Geldiniz,' : 'Aramıza Katılın,'} <br />
                            <span className="text-[#10B981]">{isLogin ? 'Şef!' : 'Yeni Şef!'}</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-base min-[400px]:text-lg md:text-lg leading-relaxed max-w-sm">
                            {isLogin ? 'En güzel tariflerinizi paylaşmak, favorilerinizi yönetmek ve şefler kulübüne katılmak için giriş yapın.' : 'Tariflerinizi binlerce kişiye ulaştırmak ve lezzet dolu bir dünyaya adım atmak için hemen şef profilinizi oluşturun.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm font-medium border border-green-100">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2 text-xs md:text-sm">Kullanıcı Adı</label>
                            <input
                                type="text"
                                placeholder="kullaniciadi"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm md:text-base"
                                required
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2 text-xs md:text-sm">İsim Soyisim</label>
                                    <input
                                        type="text"
                                        placeholder="Ad Soyad"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 text-sm md:text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2 text-xs md:text-sm">Profil Resmi</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                        className="w-full px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all duration-200 text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#10B981]/10 file:text-[#10B981] hover:file:bg-[#10B981]/20 text-xs md:text-sm"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2 text-xs md:text-sm">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-700 pr-12 text-sm md:text-base"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#10B981] text-white py-3 md:py-3.5 rounded-xl font-bold text-base md:text-lg hover:bg-[#059669] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#10B981]/30 focus:ring-4 focus:ring-[#10B981]/20 active:translate-y-0 lg:mt-2"
                        >
                            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <div className="mt-4 md:mt-8 text-center text-sm text-gray-500 pb-6 md:pb-12">
                        {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                        <span
                            onClick={toggleMode}
                            className="text-[#10B981] font-bold cursor-pointer hover:underline ml-1"
                        >
                            {isLogin ? 'Hemen Kayıt Olun' : 'Giriş Yapın'}
                        </span>
                    </div>
                </div>

                {/* Sağ Taraf - Görsel ve Dekorasyon */}
                <div className="hidden md:block w-1/2 bg-[#FFFBF2] relative overflow-hidden">
                    {/* Dekoratif Arkaplan Şekilleri */}
                    <div className="absolute top-0 right-0 w-full h-full">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FFFBF2] to-transparent z-10"></div>
                    </div>

                    {/* Dalgalı Geçiş (SVG) */}
                    <div className="absolute top-0 bottom-0 left-0 w-24 z-20 h-full pointer-events-none text-white">
                        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M0 0 L100 0 C60 20 60 80 100 100 L0 100 Z" />
                        </svg>
                    </div>

                    <div className="relative z-30 w-full h-full flex items-center justify-center p-12">
                        <div className="relative w-full max-w-md aspect-square">
                            {/* Ana Görsel */}
                            <img
                                src="/login-chef.png"
                                alt="Chef Illustration"
                                className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                            />

                            {/* Yüzen Kartlar (Dekoratif) */}
                            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-5 rounded-[24px] shadow-2xl animate-bounce border border-white/50" style={{ animationDuration: '4s' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center text-[#10B981] shadow-inner">
                                        👨‍🍳
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#10B981]/60 mb-0.5">YENİ TARİFLER</div>
                                        <div className="font-extrabold text-[#1F2937] text-lg tracking-tight">Şeflerin Sırları</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Login;
