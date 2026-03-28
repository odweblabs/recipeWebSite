import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Utensils, ArrowRight, Trash2, LayoutGrid, Star, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { safeGetUser, safeGetStorage, safeSetStorage, safeGetSessionStorage, safeSetSessionStorage} from '../utils/storage';
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
  const { t, i18n } = useTranslation();
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
      const raw = safeGetUser() || safeGetStorage('user');
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
      const isEn = i18n.language === 'en';
      const safe = Array.isArray(recipes) ? recipes : [];

      const byKeywords = (keywords) => {
        const lowerKeywords = keywords.map(k => k.toLowerCase());
        return safe.filter((r) => {
          const cat = (r.category_name || '').toLowerCase();
          const title = (r.title || '').toLowerCase();
          return lowerKeywords.some(k => cat.includes(k) || title.includes(k));
        });
      };

      const uniqById = (arr) => {
        const map = new Map();
        for (const r of arr) {
          if (r?.id && !map.has(r.id)) map.set(r.id, r);
        }
        return Array.from(map.values());
      };

      const pickRandom = (pool, count) => {
        const unique = uniqById(pool);
        if (unique.length === 0) return [];
        const result = [];
        const copy = [...unique];
        for (let i = 0; i < Math.min(count, unique.length); i++) {
          const randIdx = Math.floor(Math.random() * copy.length);
          result.push(copy.splice(randIdx, 1)[0]);
        }
        return result.map((r) => ({
          id: r.id,
          title: r.title,
          image_url: r.image_url,
          avg_rating: r.avg_rating,
          category_name: r.category_name,
        }));
      };

      // Hazır Kategoriler
      const presets = [
        {
          id: 'preset-aksam',
          title: t('menus.presets.items.aksam.title'),
          description: t('menus.presets.items.aksam.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['soup', 'meat', 'rice', 'salad', 'çorba', 'corba', 'et yemek', 'tavuk', 'kıymalı', 'pilav', 'makarna', 'salata', 'meze', 'turşu'] : ['çorba', 'corba', 'et yemek', 'tavuk', 'kıymalı', 'pilav', 'makarna', 'salata', 'meze', 'turşu']), 4),
          ],
        },
        {
          id: 'preset-breakfast',
          title: t('menus.presets.items.breakfast.title'),
          description: t('menus.presets.items.breakfast.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['breakf', 'egg', 'pancake', 'kahvaltı', 'yumurta', 'menemen', 'omlet', 'krep', 'sucuk'] : ['kahvaltı', 'yumurta', 'menemen', 'omlet', 'pancake', 'krep', 'sucuk']), 5),
          ],
        },
        {
          id: 'preset-diet',
          title: t('menus.presets.items.diet.title'),
          description: t('menus.presets.items.diet.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['diet', 'fit', 'health', 'salat', 'diyet', 'fitness', 'smoothie', 'ızgara'] : ['salata', 'diyet', 'fitness', 'smoothie', 'ızgara', 'fit']), 4),
          ],
        },
        {
          id: 'preset-vegetarian',
          title: t('menus.presets.items.vegetarian.title'),
          description: t('menus.presets.items.vegetarian.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['veget', 'sebze', 'zeytinyağlı', 'bakliyat', 'falafel', 'mercimek', 'nohut'] : ['vejetaryen', 'sebze', 'zeytinyağlı', 'bakliyat', 'falafel', 'mercimek', 'nohut']), 4),
          ],
        },
        {
          id: 'preset-kids',
          title: t('menus.presets.items.kids.title'),
          description: t('menus.presets.items.kids.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['child', 'kid', 'baby', 'makarna', 'püre', 'patates', 'çocuk', 'köfte'] : ['çocuk', 'köfte', 'makarna', 'püre', 'patates', 'ev yapımı', 'atıştırmalık']), 5),
          ],
        },
        {
          id: 'preset-tea-time',
          title: t('menus.presets.items.tea_time.title'),
          description: t('menus.presets.items.tea_time.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['cake', 'cookie', 'tea', 'kek', 'kurabiye', 'börek', 'kısır', 'poğaça', 'tart', 'pasta'] : ['kek', 'kurabiye', 'börek', 'kısır', 'poğaça', 'tart', 'pasta']), 5),
          ],
        },
        {
          id: 'preset-seafood',
          title: t('menus.presets.items.seafood.title'),
          description: t('menus.presets.items.seafood.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['fish', 'sea', 'balık', 'deniz', 'kalamar', 'karides', 'somon', 'çipura', 'levrek'] : ['balık', 'deniz', 'kalamar', 'karides', 'somon', 'çipura', 'levrek']), 4),
          ],
        },
        {
          id: 'preset-guest',
          title: t('menus.presets.items.guest.title'),
          description: t('menus.presets.items.guest.desc'),
          recipes: [
            ...pickRandom(byKeywords(isEn ? ['main', 'meal', 'fırın', 'rost', 'antrikot', 'kuzu', 'ana yemek'] : ['ana yemek', 'antrikot', 'kuzu', 'fırın', 'rost']), 1),
            ...pickRandom(byKeywords(['ara sıcak', 'paçanga', 'mücver']), 1),
            ...pickRandom(byKeywords(isEn ? ['dessert', 'sweet', 'tatlı', 'pasta', 'şerbetli'] : ['tatlı', 'pasta', 'şerbetli']), 1),
            ...pickRandom(byKeywords(['içecek', 'limonata', 'şerbet']), 1),
          ],
        },
        {
          id: 'preset-quick',
          title: t('menus.presets.items.quick.title'),
          description: t('menus.presets.items.quick.desc'),
          recipes: pickRandom(safe.filter(r => (parseInt(r.prep_time) || 0) + (parseInt(r.cook_time) || 0) <= 30), 4),
        },
      ];

      return presets.filter((m) => (m.recipes?.length || 0) > 0);
    };

    const fetchForPresets = async () => {
      setLoadingPresets(true);
      setPresetsError('');
      try {
        // First try to fetch from the new menus API
        const menuRes = await axios.get(`${apiBase}/api/menus?is_preset=true`);
        if (menuRes.data && menuRes.data.length > 0) {
          if (!cancelled) setPresetMenus(menuRes.data);
        } else {
          // Fallback to local generation if no menus in DB
          const recipeRes = await axios.get(`${apiBase}/api/recipes?limit=200`);
          const nextPresets = buildPresets(recipeRes.data || []);
          if (!cancelled) setPresetMenus(nextPresets);
        }
      } catch (err) {
        console.error('Error fetching presets:', err);
        // Fallback on error
        try {
          const recipeRes = await axios.get(`${apiBase}/api/recipes?limit=200`);
          const nextPresets = buildPresets(recipeRes.data || []);
          if (!cancelled) setPresetMenus(nextPresets);
        } catch {
          if (!cancelled) setPresetsError(t('menus.presets.error'));
        }
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
        if (!cancelled) setRecipesError(t('menus.create.error'));
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
      copiedFrom: t('menus.presets.tag'),
    };
    setMenus((prev) => [next, ...prev]);
  };

  const createMenu = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

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
      title: trimmedTitle,
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
            <Link to="/" className="hover:text-chefie-yellow transition-colors">{t('nav.home')}</Link>
            <span className="opacity-40">/</span>
            <span className="text-chefie-text">{t('menus.breadcrumb')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-chefie-text leading-tight">
            {t('menus.hero.title_1')} <br className="hidden sm:block" />
            <span className="text-chefie-yellow relative inline-block pl-2 sm:pl-0">
                {t('menus.hero.title_2')}
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7" stroke="#FFC107" strokeWidth="2" fill="none" />
                </svg>
            </span>
          </h1>
          <p className="text-chefie-secondary text-lg md:text-xl max-w-2xl mx-auto mt-5">
            {t('menus.hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-chefie-card text-chefie-text border border-chefie-border font-black rounded-2xl hover:bg-chefie-yellow hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl dark:shadow-none w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              {t('menus.create_button')}
            </button>
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-chefie-card rounded-2xl border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary shadow-sm w-full sm:w-auto justify-center">
              <LayoutGrid className="w-4 h-4 text-chefie-yellow" />
              {t('menus.saved_count', { count: menus.length })}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto">
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-black text-chefie-text flex items-center gap-3">
              {t('menus.presets.title')} <Sparkles className="text-chefie-yellow" />
            </h2>
            <div className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black tracking-[0.2em] text-chefie-secondary shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-chefie-yellow animate-pulse" /> {t('menus.presets.badge')}
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
                    <div className="relative h-48">
                      {cover ? (
                        <img
                          src={getImageUrl(cover)}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <img
                          src="/images/menu-placeholder.jpg"
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      )}
                      
                      {/* Richer Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 bg-chefie-yellow/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          {t('menus.presets.tag')}
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-col gap-1">
                          <div className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase">
                             {t('menus.presets.badge')} • {m.author_name || 'Tarifo'}
                          </div>
                          <h3 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">{m.title}</h3>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20 shadow-xl">
                          {t('menus.presets.recipe_count', { count: (m.recipes?.length || 0) })}
                        </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <p className="text-chefie-secondary font-medium leading-relaxed line-clamp-2">
                        {m.description || t('menus.presets.default_desc')}
                      </p>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        {(m.recipes || []).slice(0, 3).map((r) => (
                           <div key={r.id} className="group/recipe relative">
                             <div className="aspect-square rounded-2xl overflow-hidden border border-chefie-border shadow-sm bg-chefie-cream group-hover/recipe:border-chefie-yellow/50 transition-colors">
                               {r.image_url ? (
                                 <img
                                   src={getImageUrl(r.image_url)}
                                   alt={r.title}
                                   className="w-full h-full object-cover group-hover/recipe:scale-110 transition-transform duration-700"
                                 />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-chefie-cream">
                                   <Utensils className="w-5 h-5 text-chefie-yellow/20" />
                                 </div>
                               )}
                             </div>
                             <div className="mt-2 text-center">
                               <div className="text-[10px] font-black text-chefie-text line-clamp-1 group-hover/recipe:text-chefie-yellow transition-colors">{r.title}</div>
                             </div>
                           </div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); addPresetToMyMenus(m); }}
                        className="mt-8 w-full group/btn inline-flex items-center justify-center gap-4 py-4.5 bg-chefie-dark text-white font-black text-[12px] tracking-[0.1em] rounded-2xl hover:bg-chefie-yellow transition-all duration-300 shadow-xl"
                      >
                        {t('menus.presets.copy')}
                        <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
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
            <h2 className="text-3xl font-black text-chefie-text mb-3">{t('menus.empty.title')}</h2>
            <p className="text-chefie-secondary font-medium max-w-md mx-auto">
              {t('menus.empty.description')}
            </p>
            <button
              onClick={openCreate}
              className="mt-10 px-8 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
            >
              {t('menus.empty.button')}
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
                  <div className="relative h-48 cursor-pointer" onClick={() => setOpenMenu(m)}>
                    {cover ? (
                      <img
                        src={getImageUrl(cover)}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <img
                        src="/images/menu-placeholder.jpg"
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    )}
                    
                    {/* Richer Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 bg-chefie-card/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-chefie-text shadow-lg border border-chefie-border flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-chefie-yellow" />
                        {t('menus.card.personal_tag')}
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">{m.title}</h3>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20 shadow-xl">
                        {t('menus.presets.recipe_count', { count: (m.recipes?.length || 0) })}
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
                            {(m.createdBy?.full_name || m.createdBy?.username || t('common.chef'))
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">
                          {m.copiedFrom ? t('menus.card.copied_by') : t('menus.card.created_by')}
                        </span>
                        <span className="text-xs font-bold text-chefie-text">
                          {m.author_name || m.createdBy?.full_name || m.createdBy?.username || t('menus.card.local_user')}
                        </span>
                        {m.copiedFrom && (
                          <span className="text-[10px] text-chefie-secondary/60 font-medium">{t('menus.card.source')}{m.copiedFrom}</span>
                        )}
                      </div>
                    </div>

                    {m.description && (
                      <p className="text-chefie-secondary font-medium leading-relaxed line-clamp-2 mb-4">{m.description}</p>
                    )}

                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {(m.recipes || []).slice(0, 3).map((r) => (
                        <div
                          key={r.id}
                          onClick={() => navigate(`/recipes/${r.id}`)}
                          className="group/recipe relative cursor-pointer"
                        >
                          <div className="aspect-square rounded-2xl overflow-hidden border border-chefie-border shadow-sm bg-chefie-cream group-hover/recipe:border-chefie-yellow/50 transition-colors">
                            {r.image_url ? (
                              <img
                                src={getImageUrl(r.image_url)}
                                alt={r.title}
                                className="w-full h-full object-cover group-hover/recipe:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full bg-chefie-cream flex items-center justify-center">
                                <Utensils className="w-5 h-5 text-chefie-yellow/30" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-[10px] font-black text-chefie-text line-clamp-1 group-hover/recipe:text-chefie-yellow transition-colors">{r.title}</div>
                          </div>
                        </div>
                      ))}
                      {Math.max(0, (m.recipes?.length || 0) - 3) > 0 && (
                        <div className="aspect-square rounded-2xl border border-chefie-border bg-chefie-cream flex items-center justify-center shadow-sm">
                          <div className="text-center">
                            <div className="text-xl font-black text-chefie-text">
                              +{Math.max(0, (m.recipes?.length || 0) - 3)}
                            </div>
                            <div className="text-[8px] font-black tracking-widest uppercase text-chefie-secondary/50">{t('common.more')}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                      <button
                        onClick={() => removeMenu(m.id)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-red-50 text-red-500 font-black text-[12px] tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                        title={t('menus.card.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('menus.card.delete')}
                      </button>

                      <button
                        onClick={() => setOpenMenu(m)}
                        className="ml-auto group/btn inline-flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-chefie-dark text-white font-black text-[12px] tracking-[0.1em] hover:bg-chefie-yellow transition-all duration-300 shadow-xl"
                      >
                        {t('menus.card.open')}
                        <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
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
              <div className="p-8 md:p-10 border-b border-gray-50 dark:border-chefie-border flex items-center justify-between gap-6 flex-shrink-0 bg-chefie-cream/30">
                <div className="min-w-0">
                  <div className="text-[10px] font-black tracking-[0.2em] uppercase text-chefie-yellow mb-1">{t('menus.modal.title')}</div>
                  <h2 className="text-3xl md:text-4xl font-black text-chefie-text leading-tight tracking-tight line-clamp-1">{openMenu.title}</h2>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-chefie-dark hover:bg-chefie-dark hover:text-white dark:hover:bg-chefie-text dark:hover:text-chefie-dark transition-all text-gray-400 dark:text-gray-300"
                  aria-label={t('menus.modal.close')}
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
                          {(openMenu.createdBy?.full_name || openMenu.createdBy?.username || t('common.chef'))
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">{t('menus.card.added_by')}</span>
                      <span className="text-sm font-bold text-chefie-text">
                        {openMenu.author_name || openMenu.createdBy?.full_name || openMenu.createdBy?.username || t('recipe_detail.chef_fallback')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-chefie-yellow text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-md">
                      {t('menus.presets.recipe_count', { count: (openMenu.recipes?.length || 0) })}
                    </div>
                    {openMenu.createdAt && (
                      <div className="px-4 py-2 bg-chefie-cream rounded-xl border border-chefie-border text-[10px] font-black tracking-widest text-chefie-secondary uppercase">
                        {new Date(openMenu.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {openMenu.description ? (
                  <div className="mb-8 p-6 rounded-[2rem] bg-chefie-cream border border-chefie-border text-chefie-secondary font-medium leading-relaxed italic">
                    "{openMenu.description}"
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
                          {r.category_name || t('common.general')}
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

              <div className="p-8 md:p-10 border-t border-chefie-border flex items-center gap-4 flex-shrink-0 bg-chefie-cream/30">
                <button
                  onClick={closeMenu}
                  className="px-8 py-4 bg-white dark:bg-chefie-card text-chefie-secondary font-black text-xs tracking-widest rounded-2xl hover:bg-gray-50 transition-all border border-chefie-border shadow-sm uppercase"
                >
                  {t('menus.modal.close')}
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    openCreate();
                    setTitle(openMenu.title);
                    setDescription(openMenu.description || '');
                    setSelectedRecipes(openMenu.recipes || []);
                  }}
                  className="ml-auto px-10 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all uppercase"
                >
                  {t('menus.modal.edit_copy')}
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
                  <div className="text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50">{t('menus.create.title')}</div>
                  <h2 className="text-2xl md:text-3xl font-black text-chefie-text">{t('menus.create.subtitle')}</h2>
                </div>
                <button
                  onClick={closeCreate}
                  className="p-3 rounded-2xl bg-chefie-cream hover:bg-chefie-yellow hover:text-white transition-all text-chefie-secondary shadow-sm border border-chefie-border"
                  aria-label={t('menus.modal.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div className="bg-chefie-cream rounded-[2rem] p-5 border border-chefie-border">
                      <label className="block text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 mb-2">
                        {t('menus.create.name_label')}
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('menus.create.name_placeholder')}
                        className="w-full px-5 py-4 bg-chefie-card rounded-2xl border border-chefie-border focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-chefie-text placeholder-chefie-secondary/30"
                      />

                      <label className="block text-[10px] font-black tracking-widest uppercase text-chefie-secondary/50 mb-2 mt-5">
                        {t('menus.create.desc_label')}
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('menus.create.desc_placeholder')}
                        rows={4}
                        className="w-full px-5 py-4 bg-chefie-card rounded-2xl border border-chefie-border focus:ring-2 focus:ring-chefie-yellow/20 font-bold text-chefie-text placeholder-chefie-secondary/30 resize-none"
                      />
                    </div>

                    <div className="bg-chefie-card rounded-[2rem] border border-chefie-border p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-black tracking-widest text-chefie-secondary/50 uppercase">{t('menus.create.selected_recipes')}</div>
                        <div className="text-xs font-black text-chefie-text">
                          {selectedRecipes.length}
                          <span className="text-chefie-secondary/50 font-black"> / </span>
                          20
                        </div>
                      </div>

                      {selectedRecipes.length === 0 ? (
                        <div className="text-chefie-secondary/50 font-medium mt-5">{t('menus.create.empty_selection')}</div>
                      ) : (
                        <div className="mt-5 space-y-3 max-h-80 overflow-auto pr-1 scrollbar-hide">
                          {selectedRecipes.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center gap-3 px-4 py-3 rounded-[1.75rem] bg-chefie-card border border-chefie-border shadow-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-chefie-cream text-[10px] font-black tracking-widest uppercase text-chefie-dark/60 mb-1">
                                  {r.category_name || t('common.general')}
                                </div>
                                <div className="text-sm font-black text-chefie-text line-clamp-1">{r.title}</div>
                              </div>
                              <button
                                onClick={() => toggleRecipe(r)}
                                className="p-2 rounded-xl bg-chefie-cream border border-chefie-border text-chefie-secondary hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                title={t('common.remove')}
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
                          aria-label={t('menus.create.search_placeholder')}
                          className="w-full pl-14 pr-5 py-4 bg-chefie-card border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold placeholder-chefie-secondary/50 transition-all"
                        />
                      </div>
                      <div className="md:w-56">
                        <select
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                          className="w-full px-4 py-4 bg-chefie-card border border-chefie-border rounded-2xl focus:ring-2 focus:ring-chefie-yellow/20 text-chefie-text font-bold text-sm cursor-pointer"
                        >
                          <option value="">{t('menus.create.all_categories')}</option>
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
                                title={!active && selectedRecipes.length >= 20 ? t('menus.create.max_hint') : undefined}
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
                                    {r.category_name || t('common.general')}
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
                                  <span>{r.avg_rating ? Number(r.avg_rating).toFixed(1) : t('common.new_tag')}</span>
                                </div>
                              </button>
                            );
                          })}
                          {filteredRecipes.length === 0 && (
                            <div className="text-chefie-secondary/50 font-medium p-6 text-center">{t('recipes.not_found.title')}</div>
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
                  {t('common.cancel')}
                </button>
                <button
                  onClick={createMenu}
                  disabled={!title.trim()}
                  className="w-full sm:w-auto ml-auto px-10 py-4 bg-chefie-yellow text-white font-black text-xs tracking-widest rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {t('common.save')}
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

