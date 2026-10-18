'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getTodayAyah, getTodayHadith } from '@/data/dailyContent';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { 
  BookOpen, 
  Sparkles, 
  CircleDot, 
  Bookmark, 
  Clock, 
  MapPin, 
  Play, 
  Pause, 
  Volume2, 
  Share2, 
  Copy, 
  Check, 
  Compass, 
  Calendar, 
  ChevronLeft,
  RefreshCw,
  Sun,
  Moon,
  Radio
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    prayerData, 
    loadingPrayers, 
    userCity, 
    nextPrayer, 
    fetchPrayersByLocation, 
    fetchPrayersByCity,
    playAyah, 
    isPlaying, 
    currentAudioAyah,
    openSurah,
    lastRead,
  } = useApp();

  const [copiedAyah, setCopiedAyah] = useState(false);
  const [copiedHadith, setCopiedHadith] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedCityInput, setSelectedCityInput] = useState('');

  const todayAyah = getTodayAyah();
  const todayHadith = getTodayHadith();

  const isTodayAyahPlaying = 
    isPlaying && 
    currentAudioAyah?.surahNumber === todayAyah.surahNumber && 
    currentAudioAyah?.ayahNumber === todayAyah.ayahNumber;

  const handleToggleAyahAudio = () => {
    if (isTodayAyahPlaying) {
      // Toggle handled via player
    } else {
      playAyah(todayAyah.surahNumber, todayAyah.ayahNumber);
    }
  };

  const handleCopyAyah = () => {
    const textToCopy = `﴿${todayAyah.text}﴾ [سورة ${todayAyah.surahName}: ${todayAyah.ayahNumber}]\n\nالتفسير والتدبر: ${todayAyah.tafsir}\n\n— عبر تطبيق «ذكر وقرآن»`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(true);
    setTimeout(() => setCopiedAyah(false), 2000);
  };

  const handleShareAyah = async () => {
    const shareData = {
      title: 'آية اليوم - ذكر وقرآن',
      text: `﴿${todayAyah.text}﴾ [سورة ${todayAyah.surahName}: ${todayAyah.ayahNumber}]\n${todayAyah.tafsir}`
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      handleCopyAyah();
    }
  };

  const handleCopyHadith = () => {
    const textToCopy = `قال رسول الله ﷺ: «${todayHadith.text}»\n${todayHadith.narrator} | ${todayHadith.source}\n\nالفائدة: ${todayHadith.lesson}\n\n— عبر تطبيق «ذكر وقرآن»`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedHadith(true);
    setTimeout(() => setCopiedHadith(false), 2000);
  };

  const popularCities = [
    { city: 'مكة المكرمة', country: 'Saudi Arabia' },
    { city: 'المدينة المنورة', country: 'Saudi Arabia' },
    { city: 'الرياض', country: 'Saudi Arabia' },
    { city: 'القاهرة', country: 'Egypt' },
    { city: 'القدس', country: 'Palestine' },
    { city: 'عَمّان', country: 'Jordan' },
    { city: 'دبي', country: 'United Arab Emirates' },
    { city: 'الدوحة', country: 'Qatar' },
    { city: 'الكويت', country: 'Kuwait' },
    { city: 'إسطنبول', country: 'Turkey' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-fadeIn">
      
      {/* Hero Card with Islamic Ornament */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5C4D] via-[#0A473B] to-[#062922] text-white p-6 sm:p-8 shadow-xl border border-[#C9A227]/30 bg-islamic-pattern">
        
        {/* Decorative corner stars */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              أهلاً بك في <span className="text-[#C9A227]">«ذِكْـرٌ وَقُـرْآن»</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
              رفيقك اليومي لتلاوة كتاب الله العظيم، وحفظ الأذكار المباركة من حصن المسلم، ومعرفة أوقات الصلاة بدقة أينما كنت.
            </p>
          </div>

          {/* Hijri & Gregorian Date Badge */}
          {prayerData && (
            <div className="flex flex-col items-end gap-1.5 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 self-stretch md:self-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227]">
                <Calendar className="w-4 h-4" />
                <span>التقويم الهجري</span>
              </div>
              <div className="text-base sm:text-lg font-bold font-quran text-white">
                {prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year}هـ
              </div>
              <div className="text-xs text-white/70">
                الموافق {prayerData.date.readable} م
              </div>
            </div>
          )}
        </div>

        {/* Next Prayer Countdown Bar inside Hero */}
        {nextPrayer && (
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A227] animate-pulse" />
              <span>الصلاة القادمة:</span>
              <strong className="text-[#C9A227] text-base font-bold">{nextPrayer.name}</strong>
              <span className="opacity-75">في تمام ({nextPrayer.time})</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/20 text-[#C9A227] font-bold">
              <span>متبقٍ:</span>
              <span>{Math.floor(nextPrayer.remainingMinutes / 60)} س و {nextPrayer.remainingMinutes % 60} د</span>
            </div>
          </div>
        )}
      </section>

      {/* Quick Navigation Action Cards */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: The Holy Quran */}
          <div 
            onClick={() => setActiveTab('quran')}
            className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#C9A227]/50 transition-all text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#C9A227] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">
              المصحف الشريف
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              114 سورة بالرسم العثماني
            </p>
          </div>

          {/* Card 2: MP3Quran Live Radios & TV */}
          <div 
            onClick={() => setActiveTab('radios')}
            className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#C9A227]/50 transition-all text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">
              الإذاعات والبث
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              بث مباشر وقراء MP3Quran
            </p>
          </div>

          {/* Card 3: Morning & Evening Adhkar */}
          <div 
            onClick={() => setActiveTab('adhkar')}
            className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#C9A227]/50 transition-all text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">
              أذكار المسلم
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              الصباح والمساء وحصن المسلم
            </p>
          </div>

          {/* Card 4: Electronic Masbaha */}
          <div 
            onClick={() => setActiveTab('masbaha')}
            className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#C9A227]/50 transition-all text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CircleDot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">
              المسبحة الإلكترونية
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              تسبيح ذكي وحفظ الإجمالي
            </p>
          </div>

          {/* Card 5: Last Read Bookmark */}
          <div 
            onClick={() => {
              if (lastRead) {
                openSurah(lastRead.surahNumber, lastRead.ayahNumber, lastRead.pageNumber);
              } else {
                openSurah(1, 1);
              }
            }}
            className="group cursor-pointer p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#C9A227]/50 transition-all text-right col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/15 text-[#C9A227] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-0.5">
              {lastRead ? `متابعة: ${lastRead.surahName}` : 'علامة القراءة'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {lastRead ? `الآية ${lastRead.ayahNumber}` : 'ابدأ القراءة من الفاتحة'}
            </p>
          </div>

        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#C9A227]" />
              أوقات الصلاة اليوم
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#0F5C4D] dark:text-[#C9A227]" />
              <span>الموقع: {userCity}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-semibold text-gray-700 dark:text-gray-200 transition"
            >
              تغيير المدينة
            </button>
            <button
              onClick={fetchPrayersByLocation}
              title="تحديد الموقع الجغرافي التلقائي"
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPrayers ? 'animate-spin text-[#C9A227]' : ''}`} />
            </button>
          </div>
        </div>

        {/* City Picker Drawer if toggled */}
        {showCityPicker && (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#122A24] space-y-3 border border-gray-200/60 dark:border-white/5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">اختر مدينة سريعة أو اكتب مدينتك:</span>
            <div className="flex flex-wrap gap-1.5">
              {popularCities.map((c) => (
                <button
                  key={c.city}
                  onClick={() => {
                    fetchPrayersByCity(c.city, c.country);
                    setShowCityPicker(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D221D] hover:bg-[#0F5C4D] hover:text-white dark:hover:bg-[#C9A227] dark:hover:text-[#081714] text-xs font-medium border border-gray-200 dark:border-white/10 transition"
                >
                  {c.city}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="أدخل اسم أي مدينة (مثال: بغداد، تونس، الإسكندرية...)"
                value={selectedCityInput}
                onChange={(e) => setSelectedCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedCityInput.trim()) {
                    fetchPrayersByCity(selectedCityInput.trim());
                    setShowCityPicker(false);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0D221D] text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5C4D]"
              />
              <button
                onClick={() => {
                  if (selectedCityInput.trim()) {
                    fetchPrayersByCity(selectedCityInput.trim());
                    setShowCityPicker(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-[#0F5C4D] text-white text-xs font-bold"
              >
                تطبيق
              </button>
            </div>
          </div>
        )}

        {/* Prayers Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {[
            { key: 'Fajr', label: 'الفجر', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
            { key: 'Sunrise', label: 'الشروق', icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { key: 'Dhuhr', label: 'الظهر', icon: <Sun className="w-4 h-4 text-yellow-500" /> },
            { key: 'Asr', label: 'العصر', icon: <Sun className="w-4 h-4 text-orange-400" /> },
            { key: 'Maghrib', label: 'المغرب', icon: <Moon className="w-4 h-4 text-rose-400" /> },
            { key: 'Isha', label: 'العشاء', icon: <Moon className="w-4 h-4 text-blue-400" /> },
          ].map(({ key, label, icon }) => {
            const rawTime = prayerData?.timings[key as keyof typeof prayerData.timings] || '--:--';
            const cleanTime = rawTime.split(' ')[0];
            const isNext = nextPrayer?.name.includes(label);

            return (
              <div
                key={key}
                className={`p-3 rounded-2xl text-center transition-all ${
                  isNext
                    ? 'bg-gradient-to-b from-[#0F5C4D] to-[#0A3D33] text-white shadow-md scale-102 border border-[#C9A227]'
                    : 'bg-gray-50 dark:bg-[#122A24] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {icon}
                </div>
                <div className={`text-xs font-bold ${isNext ? 'text-[#C9A227]' : 'text-gray-500 dark:text-gray-400'}`}>
                  {label}
                </div>
                <div className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5">
                  {cleanTime}
                </div>
                {isNext && (
                  <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#C9A227] text-[#081714] font-bold">
                    القادمة
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* Daily Content: Ayah of the Day & Hadith of the Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ayah of the Day */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                <h3 className="font-bold text-base text-[#0F5C4D] dark:text-[#C9A227]">
                  آية وتدبّر اليوم
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#52c3ab] font-bold">
                سورة {todayAyah.surahName} : {todayAyah.ayahNumber}
              </span>
            </div>

            {/* Ayah Text in Uthmani calligraphy */}
            <div className="py-2 px-1">
              <p className="font-quran text-xl sm:text-2xl text-center leading-loose text-gray-900 dark:text-gray-100">
                ﴿ {todayAyah.text} ﴾
              </p>
            </div>

            {/* Tafsir Reflection */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122A24] text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-r-4 border-[#C9A227]">
              <strong className="block text-[#0F5C4D] dark:text-[#C9A227] mb-1 font-bold">
                إشراقة وتفسير:
              </strong>
              {todayAyah.tafsir}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
            <button
              onClick={handleToggleAyahAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F5C4D] text-white hover:bg-[#0B463A] font-bold shadow-sm transition active:scale-95"
            >
              {isTodayAyahPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>استمع للتلاوة</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyAyah}
                title="نسخ الآية وتفسيرها"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                {copiedAyah ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShareAyah}
                title="مشاركة"
                className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => openSurah(todayAyah.surahNumber, todayAyah.ayahNumber)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[#0F5C4D] dark:text-[#C9A227] hover:bg-[#0F5C4D]/10 font-bold transition"
              >
                <span>فتح السورة</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Hadith of the Day */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F5C4D]" />
                <h3 className="font-bold text-base text-[#0F5C4D] dark:text-[#C9A227]">
                  حديث اليوم النبوي
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {todayHadith.source}
              </span>
            </div>

            <div className="py-2 px-1">
              <p className="text-base sm:text-lg text-center leading-relaxed font-semibold text-gray-900 dark:text-gray-100">
                «{todayHadith.text}»
              </p>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                {todayHadith.narrator}
              </p>
            </div>

            {/* Lesson */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122A24] text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-r-4 border-[#0F5C4D]">
              <strong className="block text-[#0F5C4D] dark:text-[#C9A227] mb-1 font-bold">
                من فوائد الحديث:
              </strong>
              {todayHadith.lesson}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('adhkar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F5C4D]/10 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#C9A227] font-bold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>المزيد من الأذكار النبوية</span>
            </button>

            <button
              onClick={handleCopyHadith}
              title="نسخ الحديث الشريف"
              className="flex items-center gap-1 p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
            >
              {copiedHadith ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">نسخ</span>
            </button>
          </div>
        </section>

      </div>

      {/* PWA Install Promo Card */}
      <PWAInstallButton variant="card" />

    </div>
  );
};
