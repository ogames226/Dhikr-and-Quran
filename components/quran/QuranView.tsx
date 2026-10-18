'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SURAHS_LIST } from '@/data/surahs';
import { RECITERS_LIST } from '@/data/reciters';
import { SurahMeta, Ayah } from '@/types';
import { cleanAyahTextForDisplay } from '@/lib/utils';
import Image from 'next/image';
import { 
  Search, 
  BookOpen, 
  Play, 
  Pause, 
  Bookmark, 
  Heart, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  FileText, 
  User, 
  RefreshCw, 
  AlertCircle,
  Volume2,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Sparkles,
  HelpCircle,
  Headphones
} from 'lucide-react';

export const QuranView: React.FC = () => {
  const {
    activeSurahNumber,
    activeSurahAyahTarget,
    activePageNumber,
    setActivePageNumber,
    openSurah,
    closeSurah,
    goToNextSurah,
    goToPrevSurah,
    fontSize,
    fontFamily,
    quranViewMode,
    setQuranViewMode,
    currentReciter,
    setCurrentReciter,
    playAyah,
    playFullSurah,
    isFullSurahMode,
    currentFullSurah,
    isPlaying,
    currentAudioAyah,
    saveBookmark,
    isAyahFavorite,
    toggleFavoriteAyah,
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  // Script type: 'enhanced' (مشكول واضح وموثوق بدون صناديق أحرف مفقودة) vs 'uthmani' (الرسم العثماني المنسق)
  const [scriptType, setScriptType] = useState<'enhanced' | 'uthmani'>('enhanced');

  // Mushaf page viewing state
  const [mushafNightMode, setMushafNightMode] = useState<boolean>(false);
  const [mushafZoom, setMushafZoom] = useState<number>(1);
  const [cdnIndex, setCdnIndex] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  // Surah reader data fetching
  const [surahAyahs, setSurahAyahs] = useState<Ayah[]>([]);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [surahError, setSurahError] = useState<string | null>(null);

  // Tafsir state (active Ayah number displaying Tafsir)
  const [tafsirData, setTafsirData] = useState<Record<number, string>>({});
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<number | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);

  // Toast feedback
  const [copiedAyahId, setCopiedAyahId] = useState<number | null>(null);
  const [bookmarkedAyahId, setBookmarkedAyahId] = useState<number | null>(null);

  // References to scroll to target Ayah
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Filter 114 surahs
  const filteredSurahs = SURAHS_LIST.filter((s) => {
    const matchesSearch = 
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number) === searchQuery.trim();
    const matchesType = filterType === 'all' || s.revelationType === filterType;
    return matchesSearch && matchesType;
  });

  const activeSurahMeta = activeSurahNumber 
    ? SURAHS_LIST.find(s => s.number === activeSurahNumber) 
    : null;

  // Identify which Surah is on the active Mushaf page
  const pageSurah = [...SURAHS_LIST].reverse().find(s => s.page <= activePageNumber) || SURAHS_LIST[0];

  // Fetch Surah text from alquran.cloud based on activeSurahNumber & scriptType
  const fetchSurahData = (surahNum: number) => {
    setLoadingSurah(true);
    setSurahError(null);
    const edition = scriptType === 'uthmani' ? 'quran-uthmani' : 'quran-simple-enhanced';
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${edition}`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل جلب نص السورة الكريمة من الخادم');
        return res.json();
      })
      .then((json) => {
        if (json?.data?.ayahs) {
          setSurahAyahs(json.data.ayahs);
        } else {
          throw new Error('بيانات غير صحيحة');
        }
      })
      .catch(() => {
        // Fallback to simple enhanced if uthmani had a network glitch
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-simple-enhanced`)
          .then(r => r.json())
          .then(fallbackJson => {
            if (fallbackJson?.data?.ayahs) {
              setSurahAyahs(fallbackJson.data.ayahs);
            } else {
              setSurahError('تعذر جلب نص السورة. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.');
            }
          })
          .catch(() => {
            setSurahError('تعذر جلب نص السورة. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.');
          });
      })
      .finally(() => {
        setLoadingSurah(false);
      });
  };

  useEffect(() => {
    if (!activeSurahNumber) return;
    let isSubscribed = true;

    const edition = scriptType === 'uthmani' ? 'quran-uthmani' : 'quran-simple-enhanced';
    fetch(`https://api.alquran.cloud/v1/surah/${activeSurahNumber}/${edition}`)
      .then((res) => {
        if (!res.ok) throw new Error('فشل جلب نص السورة الكريمة من الخادم');
        return res.json();
      })
      .then((json) => {
        if (isSubscribed && json?.data?.ayahs) {
          setSurahAyahs(json.data.ayahs);
          setLoadingSurah(false);
          setSurahError(null);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          fetch(`https://api.alquran.cloud/v1/surah/${activeSurahNumber}/quran-simple-enhanced`)
            .then(r => r.json())
            .then(fallbackJson => {
              if (isSubscribed && fallbackJson?.data?.ayahs) {
                setSurahAyahs(fallbackJson.data.ayahs);
                setLoadingSurah(false);
                setSurahError(null);
              } else {
                setSurahError('تعذر جلب نص السورة. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.');
                setLoadingSurah(false);
              }
            })
            .catch(() => {
              if (isSubscribed) {
                setSurahError('تعذر جلب نص السورة. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.');
                setLoadingSurah(false);
              }
            });
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeSurahNumber, scriptType]);

  // Fetch Tafsir on demand for active surah
  const loadTafsir = (ayahNum: number) => {
    if (activeTafsirAyah === ayahNum) {
      setActiveTafsirAyah(null);
      return;
    }
    setActiveTafsirAyah(ayahNum);
    if (tafsirData[ayahNum] || !activeSurahNumber) return;

    setLoadingTafsir(true);
    fetch(`https://api.alquran.cloud/v1/ayah/${activeSurahNumber}:${ayahNum}/ar.muyassar`)
      .then(res => res.json())
      .then(json => {
        if (json?.data?.text) {
          setTafsirData(prev => ({ ...prev, [ayahNum]: json.data.text }));
        }
      })
      .catch(err => {
        console.warn('Failed to load Tafsir:', err);
      })
      .finally(() => {
        setLoadingTafsir(false);
      });
  };

  // Scroll to active target ayah once loaded
  useEffect(() => {
    if (activeSurahAyahTarget && surahAyahs.length > 0) {
      setTimeout(() => {
        const el = ayahRefs.current[activeSurahAyahTarget];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [activeSurahAyahTarget, surahAyahs]);

  // Clean page navigation handler
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(604, newPage));
    if (clamped === activePageNumber) return;
    setPageLoading(true);
    setCdnIndex(0);
    setActivePageNumber(clamped);
  };

  // Copy Ayah text
  const handleCopyAyah = (ayah: Ayah, formattedText: string) => {
    if (!activeSurahMeta) return;
    const textToCopy = `﴿${formattedText}﴾ [سورة ${activeSurahMeta.name}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahId(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahId(null), 2000);
  };

  // Bookmark Ayah
  const handleBookmarkAyah = (ayah: Ayah) => {
    if (!activeSurahMeta) return;
    saveBookmark(activeSurahMeta.number, activeSurahMeta.name, ayah.numberInSurah, ayah.page || activeSurahMeta.page);
    setBookmarkedAyahId(ayah.numberInSurah);
    setTimeout(() => setBookmarkedAyahId(null), 2000);
  };

  // Font styling resolver
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xl sm:text-2xl leading-[2.2]';
      case 'md': return 'text-2xl sm:text-3xl leading-[2.4]';
      case 'lg': return 'text-3xl sm:text-4xl leading-[2.6]';
      case 'xl': return 'text-4xl sm:text-5xl leading-[2.8]';
      case '2xl': return 'text-5xl sm:text-6xl leading-[3.0]';
      default: return 'text-2xl sm:text-3xl leading-[2.4]';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'cairo': return 'font-cairo';
      case 'scheherazade': return 'font-scheherazade';
      case 'amiri':
      default:
        return 'font-quran';
    }
  };

  // Mushaf page image sources with multi-CDN fallback
  const pageStr = String(activePageNumber).padStart(3, '0');
  const cdnList = [
    `https://raw.githubusercontent.com/naeemdev/quran-images/main/${activePageNumber}.png`,
    `https://files.quran.app/hafs/madani/width_1260/page${pageStr}.png`,
    `https://quran.ksu.edu.sa/ayat/safahat1/${activePageNumber}.png`,
    `https://quran.islam-db.com/public/data/pages/quranpages_1024/images/page${pageStr}.png`
  ];
  const currentMushafImageUrl = cdnList[cdnIndex % cdnList.length];

  // If viewing a Surah
  if (activeSurahNumber && activeSurahMeta) {
    return (
      <div className="space-y-6 pb-20 animate-fadeIn">
        
        {/* Top Header & Sticky Surah Toolbar */}
        <div className="sticky top-16 z-30 bg-[#FBF8F1]/95 dark:bg-[#081714]/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#0F5C4D]/15 dark:border-[#C9A227]/20 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          {/* Back button & Surah title */}
          <div className="flex items-center gap-3">
            <button
              onClick={closeSurah}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 transition"
              title="العودة لفهرس السور"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                  سورة {activeSurahMeta.name}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] font-bold">
                  {activeSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeSurahMeta.numberOfAyahs} آية • صفحة {activeSurahMeta.page} • الجزء {activeSurahMeta.juz}
              </p>
            </div>
          </div>

          {/* Right Toolbar Controls (View Mode, Script toggle, Prev/Next Surah) */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* View Mode Toggle: Text vs Mushaf Pages */}
            <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5">
              <button
                onClick={() => setQuranViewMode('text')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  quranViewMode === 'text'
                    ? 'bg-[#0F5C4D] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="عرض الآيات نصاً بخط واضح مع التفسير والتشغيل"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>نص السورة</span>
              </button>
              <button
                onClick={() => {
                  setQuranViewMode('mushaf');
                  setActivePageNumber(activeSurahMeta.page);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  quranViewMode === 'mushaf'
                    ? 'bg-[#0F5C4D] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="عرض صفحات مصحف المدينة المنورة المصورة الأصلية"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>صفحات المصحف</span>
              </button>
            </div>

            {/* Script Type Toggle in Text View */}
            {quranViewMode === 'text' && (
              <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5 text-[11px] font-bold">
                <button
                  onClick={() => setScriptType('enhanced')}
                  title="الرسم المشكول الواضح المعتمد - قراءة واضحة بدون صناديق أحرف مفقودة"
                  className={`px-2 py-1 rounded-lg transition ${
                    scriptType === 'enhanced'
                      ? 'bg-[#0F5C4D] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  مشكول واضح
                </button>
                <button
                  onClick={() => setScriptType('uthmani')}
                  title="الرسم العثماني المنسق مع علامات الوقف"
                  className={`px-2 py-1 rounded-lg transition ${
                    scriptType === 'uthmani'
                      ? 'bg-[#0F5C4D] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  عثماني منسق
                </button>
              </div>
            )}

            {/* Reciter quick chip */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 text-xs text-[#0F5C4D] dark:text-[#C9A227] font-semibold border border-[#0F5C4D]/20">
              <User className="w-3.5 h-3.5" />
              <span>{currentReciter.name}</span>
            </div>

            {/* Prev/Next Surah Nav */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevSurah}
                disabled={activeSurahNumber <= 1}
                title="السورة السابقة"
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/15 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextSurah}
                disabled={activeSurahNumber >= 114}
                title="السورة التالية"
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/15 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* View Mode 1: Text View (Optimized for crystal-clear readability without duplicate Bismillah or tofu boxes) */}
        {quranViewMode === 'text' && (
          <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Surah Banner & Calligraphy Header */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-[#0F5C4D] via-[#0A473B] to-[#0F5C4D] text-white text-center shadow-md border border-[#C9A227]/30 bg-islamic-ornament">
              <h3 className="font-quran text-2xl sm:text-3xl font-bold text-[#F3E7BE] mb-1">
                سُورَةُ {activeSurahMeta.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/80">
                {activeSurahMeta.revelationType === 'Meccan' ? 'مكية، نزلت في مكة المكرمة' : 'مدنية، نزلت في المدينة المنورة'} • عدد آياتها {activeSurahMeta.numberOfAyahs}
              </p>

              {/* Dedicated Calligraphic Bismillah Header (Except Surah At-Tawbah #9) */}
              {activeSurahNumber !== 9 && (
                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="font-quran text-2xl sm:text-3xl text-[#C9A227] tracking-wider font-normal">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Full Surah Play Button (Direct from MP3Quran API) */}
              <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => playFullSurah(activeSurahNumber, currentReciter.surahServerUrl, currentReciter.name)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#b8911c] text-[#081714] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Headphones className="w-4 h-4" />
                  <span>
                    {isFullSurahMode && currentFullSurah?.surahNumber === activeSurahNumber && isPlaying
                      ? 'جاري الاستماع للسورة كاملة'
                      : `استماع للسورة كاملة بصوت ${currentReciter.name} (MP3Quran)`}
                  </span>
                </button>
              </div>
            </div>

            {/* Error state with retry */}
            {surahError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{surahError}</span>
                </div>
                <button
                  onClick={() => fetchSurahData(activeSurahNumber)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loadingSurah && (
              <div className="space-y-4 py-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#122A24] animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-full" />
                    <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-4/5" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20" />
                      <div className="h-6 bg-gray-200 dark:bg-white/10 rounded-full w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ayahs List */}
            {!loadingSurah && surahAyahs.length > 0 && (
              <div className="space-y-4">
                {surahAyahs.map((ayah) => {
                  const isCurrentPlaying = 
                    isPlaying && 
                    currentAudioAyah?.surahNumber === activeSurahNumber && 
                    currentAudioAyah?.ayahNumber === ayah.numberInSurah;

                  const isFav = isAyahFavorite(activeSurahNumber, ayah.numberInSurah);

                  // Clean out redundant Bismillah prefix from Ayah 1 of Surahs 2-114
                  // and sanitize archaic tofu characters
                  const displayText = cleanAyahTextForDisplay(
                    ayah.text, 
                    activeSurahNumber, 
                    ayah.numberInSurah
                  );

                  const isTafsirOpen = activeTafsirAyah === ayah.numberInSurah;

                  return (
                    <div
                      key={ayah.numberInSurah}
                      ref={(el) => { ayahRefs.current[ayah.numberInSurah] = el; }}
                      className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                        isCurrentPlaying
                          ? 'bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 border-[#C9A227] shadow-md ring-1 ring-[#C9A227]'
                          : 'bg-gray-50/50 dark:bg-[#122A24]/60 border-gray-100 dark:border-white/5 hover:border-[#C9A227]/30'
                      }`}
                    >
                      {/* Ayah Calligraphy Text */}
                      <div className="text-right py-2">
                        <p className={`${getFontFamilyClass()} ${getFontSizeClass()} text-gray-900 dark:text-gray-100 text-right font-normal select-text tracking-wide`}>
                          {displayText}
                          <span className="ayah-number-badge">
                            {ayah.numberInSurah}
                          </span>
                        </p>
                      </div>

                      {/* Tafsir Al-Muyassar Card (if opened) */}
                      {isTafsirOpen && (
                        <div className="my-3 p-4 rounded-xl bg-[#FBF8F1] dark:bg-[#081714] border border-[#C9A227]/30 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed animate-fadeIn">
                          <div className="flex items-center gap-1.5 font-bold text-[#0F5C4D] dark:text-[#C9A227] mb-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>التفسير الميسر:</span>
                          </div>
                          {loadingTafsir && !tafsirData[ayah.numberInSurah] ? (
                            <p className="text-gray-400 animate-pulse">جاري جلب التفسير المعتمد...</p>
                          ) : (
                            <p>{tafsirData[ayah.numberInSurah] || 'التفسير متاح عند الاتصال بالشبكة.'}</p>
                          )}
                        </div>
                      )}

                      {/* Ayah Action Row */}
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200/50 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
                        
                        {/* Audio recitation button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => playAyah(activeSurahNumber, ayah.numberInSurah)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition active:scale-95 ${
                              isCurrentPlaying
                                ? 'bg-[#0F5C4D] text-[#C9A227] shadow-sm ring-1 ring-[#C9A227]'
                                : 'bg-white dark:bg-[#0D221D] hover:bg-[#0F5C4D] hover:text-white dark:hover:bg-[#C9A227] dark:hover:text-[#081714] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                            }`}
                          >
                            {isCurrentPlaying ? (
                              <>
                                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                                <span>يتلو الآن</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>استماع للآية</span>
                              </>
                            )}
                          </button>

                          {/* Tafsir toggle button */}
                          <button
                            onClick={() => loadTafsir(ayah.numberInSurah)}
                            className={`px-2.5 py-1.5 rounded-xl font-bold transition text-xs border ${
                              isTafsirOpen
                                ? 'bg-[#C9A227] text-[#081714] border-[#C9A227]'
                                : 'bg-white dark:bg-[#0D221D] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#C9A227]'
                            }`}
                            title="عرض التفسير الميسر لهذه الآية"
                          >
                            تفسير الآية
                          </button>
                        </div>

                        {/* Actions (Bookmark, Favorite, Copy) */}
                        <div className="flex items-center gap-1">
                          
                          {/* Bookmark */}
                          <button
                            onClick={() => handleBookmarkAyah(ayah)}
                            title="حفظ علامة قراءة عند هذه الآية"
                            className={`p-2 rounded-xl transition ${
                              bookmarkedAyahId === ayah.numberInSurah
                                ? 'bg-[#C9A227] text-white'
                                : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>

                          {/* Favorite */}
                          <button
                            onClick={() => toggleFavoriteAyah(activeSurahNumber, ayah.numberInSurah, displayText, activeSurahMeta.name)}
                            title={isFav ? 'إزالة من الآيات المفضلة' : 'إضافة للآيات المفضلة'}
                            className={`p-2 rounded-xl transition ${
                              isFav 
                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopyAyah(ayah, displayText)}
                            title="نسخ الآية الكريمة"
                            className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition"
                          >
                            {copiedAyahId === ayah.numberInSurah ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Nav to next surah */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={goToPrevSurah}
                disabled={activeSurahNumber <= 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 disabled:opacity-40 hover:bg-gray-200 font-bold text-xs sm:text-sm transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة</span>
              </button>

              <button
                onClick={closeSurah}
                className="px-4 py-2 rounded-xl bg-[#0F5C4D]/10 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#C9A227] font-bold text-xs sm:text-sm transition"
              >
                فهرس السور
              </button>

              <button
                onClick={goToNextSurah}
                disabled={activeSurahNumber >= 114}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 disabled:opacity-40 hover:bg-gray-200 font-bold text-xs sm:text-sm transition"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* View Mode 2: Authentic Medina Mushaf Page Viewer with Gold Frame, Pure Ivory Paper, & Zero-Distortion Aspect Ratio */}
        {quranViewMode === 'mushaf' && (
          <div className="p-3 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
            
            {/* Page Navigator bar with Night Filter & Zoom controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-[#122A24] border border-gray-200/50 dark:border-white/5">
              
              {/* Previous / Next page */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(activePageNumber + 1)}
                  disabled={activePageNumber >= 604}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D221D] shadow-sm disabled:opacity-40 font-bold text-xs hover:bg-[#0F5C4D] hover:text-white transition"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة التالية ({activePageNumber + 1})</span>
                </button>

                <button
                  onClick={() => handlePageChange(activePageNumber - 1)}
                  disabled={activePageNumber <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D221D] shadow-sm disabled:opacity-40 font-bold text-xs hover:bg-[#0F5C4D] hover:text-white transition"
                >
                  <span>السابقة ({activePageNumber - 1})</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Page Number & Surah Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                <BookOpen className="w-4 h-4" />
                <span>صفحة {activePageNumber} من 604</span>
                <span className="text-gray-400 font-normal">• {pageSurah.name} (جزء {pageSurah.juz})</span>
              </div>

              {/* Display Enhancers: Night Invert & Zoom */}
              <div className="flex items-center gap-1.5">
                {/* Night reading mode button */}
                <button
                  onClick={() => setMushafNightMode(!mushafNightMode)}
                  title={mushafNightMode ? 'العودة لورق المصحف الطبيعي' : 'تفعيل وضع القراءة الليلية المريحة للعينين'}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                    mushafNightMode
                      ? 'bg-[#C9A227] text-[#081714] border-[#C9A227]'
                      : 'bg-white dark:bg-[#0D221D] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10'
                  }`}
                >
                  {mushafNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{mushafNightMode ? 'ورق طبيعي' : 'قراءة ليلية'}</span>
                </button>

                {/* Zoom */}
                <button
                  onClick={() => setMushafZoom(z => z >= 1.4 ? 1 : Number((z + 0.2).toFixed(1)))}
                  title="تكبير الصفحة"
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0D221D] border border-gray-200 dark:border-white/10 text-xs font-bold flex items-center gap-1 hover:border-[#C9A227]"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{mushafZoom}×</span>
                </button>
              </div>

            </div>

            {/* Sacred Sheet of Paper Container:
                The background is ALWAYS pure solid Ivory Cream #FFFDF5, completely preventing 
                black calligraphy from vanishing or appearing blotchy in dark mode!
            */}
            <div className={`relative w-full rounded-2xl p-2 sm:p-6 flex items-center justify-center transition-colors overflow-x-auto ${
              mushafNightMode
                ? 'bg-[#06120E] border-2 border-[#C9A227]/30 shadow-inner'
                : 'bg-[#F2ECE1] dark:bg-[#0B1E19] border-2 border-[#C9A227]/40 shadow-inner'
            }`}>
              
              {/* Authentically framed sheet with Gilded Borders */}
              <div 
                className={`relative max-w-xl w-full rounded-2xl shadow-2xl transition-all duration-200 flex flex-col items-center justify-between border-4 ${
                  mushafNightMode
                    ? 'bg-[#091A16] border-[#C9A227]/50 shadow-[0_0_25px_rgba(201,162,39,0.15)] ring-4 ring-[#C9A227]/20'
                    : 'bg-[#FFFDF4] border-[#C9A227] shadow-[0_10px_30px_rgba(15,92,77,0.1)] ring-8 ring-[#C9A227]/10'
                }`}
                style={{ 
                  transform: `scale(${mushafZoom})`, 
                  transformOrigin: 'top center',
                  maxWidth: mushafZoom > 1 ? `${Math.round(576 * mushafZoom)}px` : undefined
                }}
              >
                
                {/* Authentic Page Top Bar (Surah Name & Juz) */}
                <div className={`w-full px-5 py-2.5 flex items-center justify-between border-b ${
                  mushafNightMode
                    ? 'border-[#C9A227]/30 text-[#C9A227]'
                    : 'border-[#C9A227]/40 text-[#0F5C4D]'
                } font-bold text-xs sm:text-sm select-none`}>
                  <span>سورة {pageSurah.name}</span>
                  <span className="font-quran text-sm text-[#C9A227]">۞ مصحف المدينة النبوية ۞</span>
                  <span>الجزء {pageSurah.juz}</span>
                </div>

                {/* Page Image Frame with Perfect Aspect Ratio and Loading State */}
                <div className="relative w-full aspect-[1/1.55] p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                  
                  {/* Loading spinner while switching pages */}
                  {pageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFFDF4]/90 dark:bg-[#091A16]/90 z-10 space-y-2">
                      <RefreshCw className="w-8 h-8 text-[#C9A227] animate-spin" />
                      <span className="text-xs font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                        جاري تحميل صفحة المصحف ({activePageNumber})...
                      </span>
                    </div>
                  )}

                  {/* Main Page Image */}
                  <Image
                    key={`mushaf-p${activePageNumber}-cdn${cdnIndex}`}
                    src={currentMushafImageUrl}
                    alt={`مصحف المدينة المنورة - صفحة ${activePageNumber}`}
                    width={1024}
                    height={1656}
                    priority
                    onLoad={() => setPageLoading(false)}
                    onError={() => {
                      if (cdnIndex < cdnList.length - 1) {
                        setCdnIndex(prev => prev + 1);
                      } else {
                        setPageLoading(false);
                      }
                    }}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      mushafNightMode 
                        ? '[filter:invert(0.92)_hue-rotate(180deg)_brightness(1.15)_contrast(1.1)]' 
                        : 'mix-blend-multiply'
                    }`}
                  />
                </div>

                {/* Authentic Page Bottom Bar (Sacred Page Number Badge) */}
                <div className={`w-full py-2.5 flex items-center justify-center border-t ${
                  mushafNightMode
                    ? 'border-[#C9A227]/30 text-[#C9A227]'
                    : 'border-[#C9A227]/40 text-[#0F5C4D]'
                } select-none`}>
                  <div className="inline-flex items-center justify-center px-4 py-0.5 rounded-full border border-[#C9A227] text-xs font-bold bg-[#C9A227]/10">
                    - {activePageNumber} -
                  </div>
                </div>

              </div>

            </div>

            {/* Jump to page slider and input */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">الانتقال السريع للصفحة:</span>
              <input
                type="number"
                min={1}
                max={604}
                value={activePageNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= 604) {
                    handlePageChange(val);
                  }
                }}
                className="w-16 px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D221D] text-center font-bold"
              />
              <input
                type="range"
                min={1}
                max={604}
                value={activePageNumber}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="w-36 sm:w-64 accent-[#0F5C4D]"
              />
              <span className="text-gray-400">من 604</span>
            </div>

            {/* Bookmark Current Page */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  saveBookmark(pageSurah.number, pageSurah.name, 1, activePageNumber, `صفحة ${activePageNumber}`);
                  setBookmarkedAyahId(activePageNumber);
                  setTimeout(() => setBookmarkedAyahId(null), 2000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F5C4D]/10 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#C9A227] font-bold text-xs transition"
              >
                <Bookmark className="w-4 h-4" />
                <span>
                  {bookmarkedAyahId === activePageNumber ? 'تم حفظ العلامة بنجاح!' : 'وضع فاصل قراءة عند هذه الصفحة'}
                </span>
              </button>
            </div>

          </div>
        )}

      </div>
    );
  }

  // Surah Index View (قائمة الـ 114 سورة)
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] font-bold">
                114 سورة كاملة
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                القرآن الكريم
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              تلاوة مرئية ومسموعة بأصوات كبار القراء، مع خيار عرض صفحات مصحف المدينة الأصلية أو القراءة النصية المشكولة
            </p>
          </div>

          {/* Reciter selector chip */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-gray-50 dark:bg-[#122A24] border border-gray-200/50 dark:border-white/5">
            <User className="w-4 h-4 text-[#C9A227]" />
            <div className="text-right">
              <span className="block text-[10px] text-gray-400">القارئ المختار:</span>
              <select
                value={currentReciter.id}
                onChange={(e) => {
                  const r = RECITERS_LIST.find(rec => rec.id === e.target.value);
                  if (r) setCurrentReciter(r);
                }}
                className="bg-transparent text-xs font-bold text-[#0F5C4D] dark:text-[#C9A227] focus:outline-none cursor-pointer"
              >
                {RECITERS_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-[#0D221D] text-gray-900 dark:text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث باسم السورة (مثال: الكهف، البقرة) أو برقمها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#122A24] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5C4D] dark:focus:ring-[#C9A227]"
            />
          </div>

          {/* Filter Type (All, Meccan, Medinan) */}
          <div className="flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                filterType === 'all'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              الكل (114)
            </button>
            <button
              onClick={() => setFilterType('Meccan')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                filterType === 'Meccan'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              مكية (86)
            </button>
            <button
              onClick={() => setFilterType('Medinan')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                filterType === 'Medinan'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              مدنية (28)
            </button>
          </div>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSurahs.map((surah) => {
          return (
            <div
              key={surah.number}
              onClick={() => openSurah(surah.number)}
              className="group p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 hover:border-[#C9A227]/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 text-right"
            >
              {/* Surah Number Badge & Names */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 group-hover:bg-[#0F5C4D] text-[#0F5C4D] dark:text-[#C9A227] group-hover:text-white flex items-center justify-center font-bold text-sm shrink-0 transition-colors border border-[#0F5C4D]/20">
                  {surah.number}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#0F5C4D] dark:group-hover:text-[#C9A227] transition-colors truncate">
                    سورة {surah.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {surah.englishName} • {surah.numberOfAyahs} آية
                  </p>
                </div>
              </div>

              {/* Revelation badge & Page number */}
              <div className="text-left shrink-0 space-y-1">
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  surah.revelationType === 'Meccan'
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                }`}>
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
                <span className="block text-[11px] text-gray-400">
                  ص {surah.page} • ج {surah.juz}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 space-y-2">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="font-bold">لم يتم العثور على سورة مطابقة</h4>
          <p className="text-xs text-gray-500">تأكد من كتابة اسم السورة بشكل صحيح أو ابحث برقمها من 1 إلى 114.</p>
        </div>
      )}

    </div>
  );
};
