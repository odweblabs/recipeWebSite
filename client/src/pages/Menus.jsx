import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Utensils, ArrowRight, Trash2, LayoutGrid, Star, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { safeGetStorage, safeSetStorage, safeGetSessionStorage, safeSetSessionStorage } from '../utils/storage';
import { getImageUrl } from '../utils/imageUtils';

const MENUS_STORAGE_KEY = 'chefie_menus_v1';

function loadMenus() {
  try {
    const raw = safeGetStorage(MENUS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMenus(nextMenus) {
  safeSetStorage(MENUS_STORAGE_KEY, JSON.stringify(nextMenus));
}

import API_BASE from '../utils/api';
const apiBase = API_BASE;

const Menus = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState(() => loadMenus());
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [presetMenus, setPresetMenus] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(true);
  const [presetsError, setPresetsError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipeQuery, setRecipeQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipesError, setRecipesError] = useState('');

  useEffect(() => {
    saveMenus(menus);
  }, [menus]);

  useEffect(() => {
    try {
      const raw = safeGetSessionStorage('user') || safeGetStorage('user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setCurrentUser(parsed || null);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const buildPresets = (recipes) => {
      const safe = Array.isArray(recipes) ? recipes : [];

      const byCategory = (keywords) =>
        safe.filter((r) => keywords.some((k) => (r.category_name || '').toLowerCase().includes(k)));

      const uniqById = (arr) => {
        const map = new Map();
        for (const r of arr) {
          if (r?.id && !map.has(r.id)) map.set(r.id, r);
        }
        return Array.from(map.values());
      };

      const pickRandom = (pool, count) => {
        const unique = uniqById(pool);
        const shuffled = [...unique].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map((r) => ({
          id: r.id,
          title: r.title,
          image_url: r.image_url,
          avg_rating: r.avg_rating,
          category_name: r.category_name,
        }));
      };

      // Türk Akşam Yemeği: çorba + et/tavuk + pilav + salata/turşu
      const aksam = [
        ...pickRandom(byCategory(['çorba', 'corba']), 1),
        ...pickRandom(byCategory(['et yemek', 'tavuk']), 1),
        ...pickRandom(byCategory(['pilav']), 1),
        ...pickRandom(byCategory(['salata', 'meze', 'kanepe']), 1),
        ...pickRandom(byCategory(['sebze']), 1),
        ...pickRandom(byCategory(['turşu', 'tursu']), 1),
      ];

      // Misafir Menüsü: çorba + ana yemek + makarna/börek + salata + tatlı + içecek
      const misafir = [
        ...pickRandom(byCategory(['çorba', 'corba']), 1),
        ...pickRandom(byCategory(['et yemek']), 1),
        ...pickRandom(byCategory(['makarna', 'hamur', 'börek']), 1),
        ...pickRandom(byCategory(['salata', 'meze', 'kanepe']), 1),
        ...pickRandom(byCategory(['tatlı', 'tatli', 'kurabiye']), 1),
        ...pickRandom(byCategory(['içecek', 'icecek']), 1),
      ];

      // Hızlı Akşam: en hızlı pişen tarifler
      const quickAll = [...safe]
        .filter(r => (parseInt(r.prep_time) || 0) + (parseInt(r.cook_time) || 0) > 0)
        .sort((a, b) => ((parseInt(a.prep_time) || 0) + (parseInt(a.cook_time) || 0)) - ((parseInt(b.prep_time) || 0) + (parseInt(b.cook_time) || 0)));

      const presets = [
        {
          id: 'preset-aksam',
          title: 'Türk Akşam Yemeği',
          description: 'Çorba, et yemeği, pilav, salata ve sebze — klasik Türk sofrası.',
          recipes: aksam.filter(r => r),
        },
        {
          id: 'preset-guest',
          title: 'Misafir Menüsü',
          description: 'Çorba, ana yemek, makarna, salata, tatlı ve içecek — misafirie layık.',
          recipes: misafir.filter(r => r),
        },
        {
          id: 'preset-quick',
          title: 'Hızlı Akşam Menüsü',
          description: 'Az zamanda çok lezzet: en hızlı pişen tariflerden seçki.',
          recipes: pickRandom(quickAll.slice(0, 20), 6),
        },
      ].filter((m) => (m.recipes?.length || 0) > 0);

      return presets;
    };

    const fetchForPresets = async () => {
      setLoadingPresets(true);
      setPresetsError('');
      try {
        const res = await axios.get(`${apiBase}/api/recipes?limit=200`);
        const nextPresets = buildPresets(res.data || []);
        if (!cancelled) setPresetMenus(nextPresets);
      } catch {
        if (!cancelled) setPresetsError('Hazır menüler yüklenemedi. Sunucu çalışıyor mu?');
      } finally {
        if (!cancelled) setLoadingPresets(false);
      }
    };

    fetchForPresets();
    return () => {
      cancelled = true;
    };
  }, []);

  // Kategorileri sadece bir kez çek
  useEffect(() => {
    axios.get(`${apiBase}/api/categories`)
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // Tarif arama: kullanıcı yazdıkça veya kategori seçtikçe sunucudan çek
  useEffect(() => {
    if (!isCreateOpen) return;

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoadingRecipes(true);
      setRecipesError('');
      try {
        let url = `${apiBase}/api/recipes?limit=50`;
        if (recipeQuery.trim()) url += `&title=${encodeURIComponent(recipeQuery.trim())}`;
        if (selectedCategoryId) url += `&category_id=${selectedCategoryId}`;

        const res = await axios.get(url);
        if (!cancelled) setAllRecipes(res.data || []);
      } catch {
        if (!cancelled) setRecipesError('Tarifler yüklenemedi.');
      } finally {
        if (!cancelled) setLoadingRecipes(false);
      }
    }, 300); // 300ms debounce

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isCreateOpen, recipeQuery, selectedCategoryId]);

  const filteredRecipes = useMemo(() => {
    return allRecipes;
  }, [allRecipes]);

  const selectedIds = useMemo(() => new Set(selectedRecipes.map((r) => r.id)), [selectedRecipes]);

  const openCreate = () => {
    setIsCreateOpen(true);
    setTitle('');
    setDescription('');
    setRecipeQuery('');
    setSelectedRecipes([]);
    setSelectedCategoryId('');
    setRecipesError('');

  };

  const closeCreate = () => setIsCreateOpen(false);
  const closeMenu = () => setOpenMenu(null);

  const toggleRecipe = (recipe) => {
    if (!recipe?.id) return;
    setSelectedRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) return prev.filter((r) => r.id !== recipe.id);
      return [
        ...prev,
        {
          id: recipe.id,
          title: recipe.title,
          image_url: recipe.image_url,
          avg_rating: recipe.avg_rating,
          category_name: recipe.category_name,
        },
      ];
    });
  };

  const removeMenu = (id) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const addPresetToMyMenus = (preset) => {
    const creator = currentUser
      ? {
        id: currentUser.id,
        username: currentUser.username,
        full_name: currentUser.full_name,
        profile_image: currentUser.profile_image,
      }
      : null;

    const next = {
      id: `${Date.now()}`,
      title: preset.title,
      description: preset.description || '',
      createdAt: new Date().toISOString(),
      recipes: preset.recipes || [],
      createdBy: creator,
      copiedFrom: 'Tarifo Hazır Menü',
    };
    setMenus((prev) => [next, ...prev]);
  };

  const createMenu = () => {
    const t = title.trim();
    if (!t) return;

    const creator = currentUser
      ? {
        id: currentUser.id,
        username: currentUser.username,
        full_name: currentUser.full_name,
        profile_image: currentUser.profile_image,
      }
      : null;

    const next = {
      id: `${Date.now()}`,
      title: t,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      recipes: selectedRecipes,
      createdBy: creator,
    };
    setMenus((prev) => [next, ...prev]);
    closeCreate();
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-6 bg-chefie-cream text-chefie-text">
      <header className="py-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-chefie-secondary/50 mb-4">
            <Link to="/" className="hover:text-chefie-yellow transition-colors">ANASAYFA</Link>
            <span className="opacity-40">/</span>
            <span className="text-chefie-text">MENÜLER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-chefie-text leading-tight">
            Kendi Menünü <br className="hidden sm:block" />
            <span className="text-chefie-yellow relative inline-block">
              Buradan Oluştur
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-chefie-secondary text-lg md:text-xl max-w-2xl mx-auto mt-5">
            Haftalık plan, misafir menüsü ya da diyet listesi… Favori tariflerini bir araya getir, tek tıkla tekrar bul.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-chefie-card text-chefie-text border border-chefie-border font-black rounded-2xl hover:bg-chefie-yellow hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl dark:shadow-none w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              YENİ MENÜ OLUŞTUR
            </button>
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-chefie-card rounded-2xl border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary shadow-sm w-full sm:w-auto justify-center">
              <LayoutGrid className="w-4 h-4 text-chefie-yellow" />
              {menus.length} MENÜ KAYITLI
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto">
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-black text-chefie-text flex items-center gap-3">
              Hazır Menüler <Sparkles className="text-chefie-yellow" />
            </h2>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-chefie-card rounded-full border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary">
              <LayoutGrid className="w-3.5 h-3.5 text-chefie-yellow" /> SİTEDEN SEÇİLDİ
            </div>
          </div>

          {presetsError ? (
            <div className="p-5 bg-red-50 text-red-500 rounded-[2rem] border border-red-100 font-bold">
              {presetsError}
            </div>
          ) : loadingPresets ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-[320px] bg-chefie-card rounded-[2.5rem] animate-pulse border border-chefie-border"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {presetMenus.map((m) => {
                const cover = m.recipes?.find((r) => r.image_url)?.image_url;
                return (
                  <div key={m.id} className="bg-chefie-card rounded-[2.5rem] border border-chefie-border shadow-md overflow-hidden group cursor-pointer" onClick={() => setOpenMenu(m)}>
                    <div className="relative h-40">
                      {cover ? (
                        <img
                          src={getImageUrl(cover)}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                          <Utensils className="w-10 h-10 text-chefie-yellow/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-chefie-dark/70 via-chefie-dark/10 to-transparent"></div>
                      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-white/80 text-[10px] font-black tracking-widest uppercase">HAZIR MENÜ</div>
                          <h3 className="text-2xl font-black text-white leading-tight">{m.title}</h3>
                        </div>
                        <div className="px-4 py-2 bg-chefie-card/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-chefie-text shadow-xl border border-chefie-border">
                          {(m.recipes?.length || 0)} Tarif
                        </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <p className="text-chefie-secondary font-medium leading-relaxed line-clamp-2">
                        {m.description || 'Siteden seçilmiş tariflerle hazırlanmış hazır menü.'}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {(m.recipes || []).slice(0, 3).map((r) => (
                          <div
                            key={r.id}
                            className="group/thumb relative rounded-2xl overflow-hidden border border-chefie-border shadow-sm text-left bg-chefie-cream"
                          >
                            <div className="h-16 bg-gray-50">
                              {r.image_url ? (
                                <img
                                  src={getImageUrl(r.image_url)}
                                  alt={r.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                                  <Utensils className="w-5 h-5 text-chefie-yellow/30" />
                                </div>
                              )}
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 line-clamp-1">
                                {r.category_name || 'GENEL'}
                              </div>
                              <div className="text-[11px] font-black text-chefie-text line-clamp-1 mt-1">{r.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); addPresetToMyMenus(m); }}
                        className="mt-6 w-full group/btn inline-flex items-center justify-center gap-3 py-4 bg-chefie-cream text-chefie-text font-black text-[11px] tracking-widest rounded-[1.5rem] hover:bg-chefie-yellow hover:text-white transition-all duration-500 shadow-sm border border-chefie-border"
                      >
                        MENÜYÜ KOPYALA
                        <div className="w-6 h-6 bg-chefie-yellow rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {menus.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="bg-chefie-card w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-chefie-border">
              <Utensils className="w-12 h-12 text-chefie-secondary/20" />
            </div>
            <h2 className="text-3xl font-black text-chefie-text mb-3">Henüz menün yok</h2>
            <p className="text-chefie-secondary font-medium max-w-md mx-auto">
              İlk menünü oluştur ve içerisine tarif ekle. Sonra kolayca tekrar açıp pişirmeye başla.
            </p>
            <button
              onClick={openCreate}
              className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
            >
              MENÜ OLUŞTUR
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menus.map((m, idx) => {
              const cover = m.recipes?.find((r) => r.image_url)?.image_url;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-chefie-card rounded-[2.5rem] border border-chefie-border shadow-md overflow-hidden group"
                >
                  <div className="relative h-40 cursor-pointer" onClick={() => setOpenMenu(m)}>
                    {cover ? (
                      <img
                        src={getImageUrl(cover)}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                        <Utensils className="w-10 h-10 text-chefie-yellow/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-chefie-dark/70 via-chefie-dark/10 to-transparent"></div>
                    <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-white/80 text-[10px] font-black tracking-widest uppercase">
                          {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight">{m.title}</h3>
                      </div>
                      <div className="px-4 py-2 bg-chefie-card/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-chefie-text shadow-xl border border-chefie-border">
                        {(m.recipes?.length || 0)} Tarif
                      </div>
                    </div>
                  </div>

                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-chefie-cream border border-chefie-border shadow-sm flex-shrink-0">
                        {m.createdBy?.profile_image ? (
                          <img
                            src={getImageUrl(m.createdBy.profile_image)}
                            alt={m.createdBy.full_name || m.createdBy.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-chefie-text/60">
                            {(m.createdBy?.full_name || m.createdBy?.username || 'Şef')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">
                          {m.copiedFrom ? 'Kopyalayan' : 'Menüyü Oluşturan'}
                        </span>
                        <span className="text-xs font-bold text-chefie-text">
                          {m.createdBy?.full_name || m.createdBy?.username || 'Konuk Kullanıcı'}
                        </span>
                        {m.copiedFrom && (
                          <span className="text-[10px] text-chefie-secondary/60 font-medium">Kaynak: {m.copiedFrom}</span>
                        )}
                      </div>
                    </div>

                    {m.description && (
                      <p className="text-chefie-secondary font-medium leading-relaxed line-clamp-2 mb-4">{m.description}</p>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      {(m.recipes || []).slice(0, 3).map((r) => (
                        <div
                          key={r.id}
                          onClick={() => navigate(`/recipes/${r.id}`)}
                          className="group/thumb relative rounded-2xl overflow-hidden border border-chefie-border shadow-sm text-left bg-chefie-cream cursor-pointer"
                        >
                          <div className="h-16 bg-gray-50">
                            {r.image_url ? (
                              <img
                                src={getImageUrl(r.image_url)}
                                alt={r.title}
                                className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                                <Utensils className="w-5 h-5 text-chefie-yellow/30" />
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <div className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 line-clamp-1">
                              {r.category_name || 'GENEL'}
                            </div>
                            <div className="text-[11px] font-black text-chefie-text line-clamp-1 mt-1">{r.title}</div>
                          </div>
                        </div>
                      ))}
                      {Math.max(0, (m.recipes?.length || 0) - 3) > 0 && (
                        <div className="rounded-2xl border border-chefie-border bg-chefie-cream flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-black text-chefie-text">
                              +{Math.max(0, (m.recipes?.length || 0) - 3)}
                            </div>
                            <div className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">Daha</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => removeMenu(m.id)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-50 text-red-500 font-black text-[11px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        title="Menüyü sil"
                      >
                        <Trash2 className="w-4 h-4" />
                        SİL
                      </button>

                      <button
                        onClick={() => setOpenMenu(m)}
                        className="ml-auto group/btn inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-chefie-cream text-chefie-text font-black text-[11px] tracking-widest hover:bg-chefie-yellow hover:text-white transition-all border border-chefie-border shadow-sm"
                      >
                        MENÜYÜ AÇ
                        <div className="w-6 h-6 bg-chefie-yellow rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chefie-dark/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-chefie-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-chefie-border flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-gray-50 dark:border-chefie-border flex items-center justify-between gap-4 flex-shrink-0">
                <div className="min-w-0">
                  <div className="text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-500">Menü</div>
                  <h2 className="text-2xl md:text-3xl font-black text-chefie-text line-clamp-1">{openMenu.title}</h2>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-chefie-dark hover:bg-chefie-dark hover:text-white dark:hover:bg-chefie-text dark:hover:text-chefie-dark transition-all text-gray-400 dark:text-gray-300"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-chefie-cream border border-chefie-border shadow-sm flex-shrink-0">
                      {openMenu.createdBy?.profile_image ? (
                        <img
                          src={getImageUrl(openMenu.createdBy.profile_image)}
                          alt={openMenu.createdBy.full_name || openMenu.createdBy.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-chefie-text/60">
                          {(openMenu.createdBy?.full_name || openMenu.createdBy?.username || 'Şef')
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">Menüyü Ekleyen</span>
                      <span className="text-sm font-bold text-chefie-text">
                        {openMenu.createdBy?.full_name || openMenu.createdBy?.username || 'Bu cihazdaki kullanici'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-chefie-cream rounded-2xl border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary uppercase">
                      {(openMenu.recipes?.length || 0)} Tarif
                    </div>
                    <div className="px-4 py-2 bg-chefie-card rounded-2xl border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary uppercase">
                      {openMenu.createdAt ? new Date(openMenu.createdAt).toLocaleDateString('tr-TR') : ''}
                    </div>
                  </div>
                </div>

                {openMenu.description ? (
                  <div className="mb-6 p-5 rounded-[2rem] bg-chefie-cream border border-chefie-border text-chefie-secondary font-medium leading-relaxed">
                    {openMenu.description}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(openMenu.recipes || []).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/recipes/${r.id}`)}
                      className="group flex items-center gap-4 p-4 bg-chefie-card rounded-[2rem] border border-chefie-border hover:border-chefie-yellow hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-chefie-cream flex-shrink-0 border border-chefie-border">
                        <img
                          src={r.image_url ? getImageUrl(r.image_url) : '/default-recipe.png'}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-500 line-clamp-1">
                          {r.category_name || 'GENEL'}
                        </div>
                        <div className="text-sm font-black text-chefie-text line-clamp-1 group-hover:text-chefie-yellow transition-colors">
                          {r.title}
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-2xl bg-chefie-cream border border-chefie-border flex items-center justify-center text-chefie-secondary group-hover:bg-chefie-yellow group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-chefie-border flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={closeMenu}
                  className="w-full sm:w-auto px-8 py-4 bg-chefie-cream text-chefie-secondary font-black text-xs tracking-widest rounded-2xl hover:bg-chefie-yellow hover:text-white transition-all border border-chefie-border shadow-sm"
                >
                  KAPAT
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    openCreate();
                    setTitle(openMenu.title);
                    setDescription(openMenu.description || '');
                    setSelectedRecipes(openMenu.recipes || []);
                  }}
                  className="w-full sm:w-auto ml-auto px-10 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
                >
                  DÜZENLE (KOPYA)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chefie-dark/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-4xl max-h-[90vh] bg-chefie-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-chefie-border flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-chefie-border flex items-center justify-between gap-4 flex-shrink-0">
                <div>
                  <div className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">Menü Oluştur</div>
                  <h2 className="text-2xl md:text-3xl font-black text-chefie-text">Tariflerini bir araya getir</h2>
                </div>
                <button
                  onClick={closeCreate}
                  className="p-3 rounded-2xl bg-chefie-cream hover:bg-chefie-yellow hover:text-white transition-all text-chefie-secondary shadow-sm border border-chefie-border"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="bg-chefie-cream rounded-[2rem] p-5 border border-chefie-border">
                      <label className="block text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 mb-2">
                        Menü Adı
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Örn: Haftalık Menü"
                        className="w-full px-5 py-4 bg-chefie-card rounded-2xl border border-chefie-border focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-chefie-text placeholder-chefie-secondary/30"
                      />

                      <label className="block text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 mb-2 mt-5">
                        Açıklama (opsiyonel)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Örn: Pazartesi–Cuma hızlı ve pratik tarifler"
                        rows={4}
                        className="w-full px-5 py-4 bg-chefie-card rounded-2xl border border-chefie-border focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-chefie-text placeholder-chefie-secondary/30 resize-none"
                      />
                    </div>

                    <div className="bg-chefie-card rounded-[2rem] border border-chefie-border p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-black tracking-widest text-chefie-secondary/50 uppercase">Seçilen Tarifler</div>
                        <div className="text-xs font-black text-chefie-text">
                          {selectedRecipes.length}
                          <span className="text-chefie-secondary/50 font-black"> / </span>
                          20
                        </div>
                      </div>

                      {selectedRecipes.length === 0 ? (
                        <div className="text-chefie-secondary/50 font-medium mt-5">Sağdan tarif seçerek menünü oluştur.</div>
                      ) : (
                        <div className="mt-5 space-y-3 max-h-80 overflow-auto pr-1 scrollbar-hide">
                          {selectedRecipes.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center gap-3 px-4 py-3 rounded-[1.75rem] bg-chefie-card border border-chefie-border shadow-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-chefie-cream text-[10px] font-black tracking-widest uppercase text-chefie-dark/60 mb-1">
                                  {r.category_name || 'GENEL'}
                                </div>
                                <div className="text-sm font-black text-chefie-text line-clamp-1">{r.title}</div>
                              </div>
                              <button
                                onClick={() => toggleRecipe(r)}
                                className="p-2 rounded-xl bg-chefie-cream border border-chefie-border text-chefie-secondary hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                title="Çıkar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-chefie-cream rounded-[2rem] p-5 border border-chefie-border">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-chefie-secondary/50 w-5 h-5" />
                        <input
                          value={recipeQuery}
                          onChange={(e) => setRecipeQuery(e.target.value)}
                          placeholder=""
                          aria-label="Tarif ara"
                          className="w-full pl-14 pr-5 py-4 bg-chefie-card border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold placeholder-chefie-secondary/50 transition-all"
                        />
                      </div>
                      <div className="md:w-56">
                        <select
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                          className="w-full px-4 py-4 bg-chefie-card border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold text-sm cursor-pointer"
                        >
                          <option value="">Tüm Kategoriler</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-5">
                      {recipesError ? (
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 font-bold">
                          {recipesError}
                        </div>
                      ) : loadingRecipes ? (
                        <div className="space-y-3">
                          {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-16 bg-chefie-card rounded-2xl animate-pulse border border-chefie-border"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[28rem] overflow-auto pr-1 scrollbar-hide">
                          {filteredRecipes.map((r) => {
                            const active = selectedIds.has(r.id);
                            return (
                              <button
                                key={r.id}
                                onClick={() => toggleRecipe(r)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1.75rem] border transition-all text-left shadow-sm ${active
                                  ? 'bg-chefie-dark border-chefie-dark shadow-chefie-dark/30'
                                  : 'bg-chefie-card border-chefie-border hover:border-chefie-yellow'
                                  }`}
                                disabled={!active && selectedRecipes.length >= 20}
                                title={!active && selectedRecipes.length >= 20 ? 'En fazla 20 tarif ekleyebilirsin' : undefined}
                              >
                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                  <img
                                    src={r.image_url ? (r.image_url.startsWith('/images/') ? r.image_url : `${apiBase}${r.image_url}`) : '/default-recipe.png'}
                                    alt={r.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-[10px] font-black tracking-widest uppercase line-clamp-1 ${active ? 'text-white/70' : 'text-chefie-secondary/50'
                                      }`}
                                  >
                                    {r.category_name || 'GENEL'}
                                  </div>
                                  <div
                                    className={`text-sm font-black line-clamp-1 ${active ? 'text-white' : 'text-chefie-text'
                                      }`}
                                  >
                                    {r.title}
                                  </div>
                                </div>
                                <div
                                  className={`ml-2 flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full ${active ? 'bg-chefie-yellow text-white' : 'bg-chefie-cream border border-chefie-border text-chefie-secondary'
                                    }`}
                                >
                                  <Star className={`w-3.5 h-3.5 ${active ? 'fill-current' : 'text-chefie-yellow'}`} />
                                  <span>{r.avg_rating ? Number(r.avg_rating).toFixed(1) : 'Yeni'}</span>
                                </div>
                              </button>
                            );
                          })}
                          {filteredRecipes.length === 0 && (
                            <div className="text-chefie-secondary/50 font-medium p-6 text-center">Sonuç bulunamadı.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-chefie-border flex flex-col sm:flex-row gap-4 items-center flex-shrink-0">
                <button
                  onClick={closeCreate}
                  className="w-full sm:w-auto px-8 py-4 bg-chefie-cream text-chefie-secondary font-black text-xs tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-chefie-border"
                >
                  VAZGEÇ
                </button>
                <button
                  onClick={createMenu}
                  disabled={!title.trim()}
                  className="w-full sm:w-auto ml-auto px-10 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  MENÜYÜ KAYDET
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menus;

