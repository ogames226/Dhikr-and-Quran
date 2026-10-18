'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RECITERS_LIST } from '@/data/reciters';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { 
  Settings, 
  Bookmark, 
  Heart, 
  Sun, 
  Moon, 
  Type, 
  User, 
  Trash2, 
  ExternalLink, 
  Check, 
  Layers, 
  FileText, 
  Info,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    quranViewMode,
    setQuranViewMode,
    currentReciter,
    setCurrentReciter,
    bookmarks,
    removeBookmark,
    favoriteAyahs,
    toggleFavoriteAyah,
    openSurah,
    lastRead,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'bookmarks' | 'favorites'>('settings');

  const fontSizes: { id: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; label: string; previewPx: string }[] = [
    { id: 'sm', label: 'صغير', previewPx: '18px' },
    { id: 'md', label: 'متوسط (افتراضي)', previewPx: '22px' },
    { id: 'lg', label: 'كبير', previewPx: '26px' },
    { id: 'xl', label: 'كبير جداً', previewPx: '30px' },
    { id: '2xl', label: 'ضخم', previewPx: '34px' },
  ];

  const fontFamilies: { id: 'amiri' | 'cairo' | 'scheherazade'; label: string; sub: string }[] = [
    { id: 'amiri', label: 'خط أميري (Amiri)', sub: 'خط كلاسيكي أصيل مخصص لكتابة المصاحف' },
    { id: 'scheherazade', label: 'خط شهرزاد الجديد (Scheherazade)', sub: 'خط نسخي تقليدي واضح ومريح' },
    { id: 'cairo', label: 'خط كايرو (Cairo)', sub: 'خط عربي حديث وواضح' },
  ];

  const handleClearAllStorage = () => {
    if (confirm('هل أنت متأكد من رغبتك في مسح كافة البيانات والإعدادات والعلامات المحفوظة محلياً؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fadeIn">
      
      {/* Top Header & Sub-tabs */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C9A227]" />
            المفضلة والإعدادات
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            تخصيص تجربة القراءة والخطوط واختيار القارئ وعلامات التوقف
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/10 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`py-2 rounded-xl transition ${
              activeSubTab === 'settings'
                ? 'bg-[#0F5C4D] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            الإعدادات والمظهر
          </button>
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'bookmarks'
                ? 'bg-[#0F5C4D] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>العلامات ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'favorites'
                ? 'bg-[#0F5C4D] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>المفضلة ({favoriteAyahs.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: General Settings & Appearance */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          
          {/* Theme card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#C9A227]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              مظهر التطبيق
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                  theme === 'light'
                    ? 'border-[#0F5C4D] ring-2 ring-[#0F5C4D]/20 bg-[#FBF8F1]'
                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#122A24]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-[#0F5C4D]">الوضع النهاري</div>
                  <div className="text-xs text-gray-500">أخضر زمردي وخلفية كريمية مريحة</div>
                </div>
                {theme === 'light' && <Check className="w-5 h-5 text-[#0F5C4D]" />}
              </button>

              <button
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                  theme === 'dark'
                    ? 'border-[#C9A227] ring-2 ring-[#C9A227]/20 bg-[#071310]'
                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#122A24]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-[#C9A227]">الوضع الليلي</div>
                  <div className="text-xs text-gray-400">داكن هادئ للقراءة في الظلام</div>
                </div>
                {theme === 'dark' && <Check className="w-5 h-5 text-[#C9A227]" />}
              </button>
            </div>
          </div>

          {/* Reciter Selector Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#C9A227]" />
              القارئ الافتراضي لتلاوة القرآن
            </h3>
            <div className="space-y-2">
              {RECITERS_LIST.map((r) => {
                const isSelected = r.id === currentReciter.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setCurrentReciter(r)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0F5C4D] bg-[#0F5C4D]/10 dark:border-[#C9A227] dark:bg-[#C9A227]/10'
                        : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {r.englishName}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-[#C9A227]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-[#C9A227]" />
              نوع الخط العربي
            </h3>
            <div className="space-y-2">
              {fontFamilies.map((f) => {
                const isSelected = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0F5C4D] bg-[#0F5C4D]/10 dark:border-[#C9A227] dark:bg-[#C9A227]/10'
                        : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        {f.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {f.sub}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-[#C9A227]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Card with live preview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-[#C9A227]" />
                حجم خط الآيات والأذكار
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 font-bold">
                {fontSizes.find(s => s.id === fontSize)?.label}
              </span>
            </div>

            {/* Slider / Buttons */}
            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/10">
              {fontSizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFontSize(s.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    fontSize === s.id
                      ? 'bg-[#0F5C4D] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#122A24] border border-gray-200/50 dark:border-white/5 text-center">
              <span className="text-[11px] text-gray-400 block mb-2">معاينة مباشرة لحجم الخط:</span>
              <p className={`font-quran text-gray-900 dark:text-gray-100 ${
                fontSize === 'sm' ? 'text-xl' :
                fontSize === 'md' ? 'text-2xl' :
                fontSize === 'lg' ? 'text-3xl' :
                fontSize === 'xl' ? 'text-4xl' : 'text-5xl'
              }`}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          {/* Quran View Mode Default */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C9A227]" />
              النمط الافتراضي لعرض المصحف
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuranViewMode('text')}
                className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                  quranViewMode === 'text'
                    ? 'border-[#0F5C4D] bg-[#0F5C4D]/10 dark:border-[#C9A227] dark:bg-[#C9A227]/10'
                    : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>النص العثماني</span>
                  </div>
                  <div className="text-xs text-gray-500">نص مع إمكانية تكبير الخط والتشغيل لكل آية</div>
                </div>
                {quranViewMode === 'text' && <Check className="w-4 h-4 text-[#0F5C4D] dark:text-[#C9A227]" />}
              </button>

              <button
                onClick={() => setQuranViewMode('mushaf')}
                className={`p-3.5 rounded-2xl border text-right transition flex items-center justify-between ${
                  quranViewMode === 'mushaf'
                    ? 'border-[#0F5C4D] bg-[#0F5C4D]/10 dark:border-[#C9A227] dark:bg-[#C9A227]/10'
                    : 'border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>صفحات المصحف المصورة</span>
                  </div>
                  <div className="text-xs text-gray-500">صفحات مصحف المدينة المنورة بجودة فائقة</div>
                </div>
                {quranViewMode === 'mushaf' && <Check className="w-4 h-4 text-[#0F5C4D] dark:text-[#C9A227]" />}
              </button>
            </div>
          </div>

          {/* PWA Section */}
          <PWAInstallButton variant="card" />

          {/* App Data & Reset */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              الخصوصية والبيانات المخزنة
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              جميع علامات القراءة، والتسبيحات اليومية، والمفضلات محفوظة على متصفحك الخاص فقط (LocalStorage) ولا يتم رفع أي بيانات خاصة بك إلى خوادم خارجية.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClearAllStorage}
                className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إعادة ضبط المصنع ومسح البيانات المحفوظة</span>
              </button>
            </div>
          </div>

          {/* Credits & Trusted Sources */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gray-50 dark:bg-[#122A24] border border-gray-200/50 dark:border-white/5 space-y-3 text-xs text-gray-500 dark:text-gray-400">
            <h4 className="font-bold text-sm text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
              <Info className="w-4 h-4" />
              المصادر والواجهات البرمجية المعتمدة
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>نصوص القرآن الكريم: واجهة AlQuran Cloud الموثوقة برسم المصحف العثماني.</li>
              <li>التلاوات الصوتية: خوادم EveryAyah.com و MP3Quran.net الموثوقة.</li>
              <li>أوقات الصلاة: الحساب الفلكي الدقيق من AlAdhan API (أم القرى).</li>
              <li>الأذكار النبوية: حصن المسلم من أذكار الكتاب والسنة للشيخ سعيد بن علي بن وهف القحطاني رحمه الله.</li>
            </ul>
          </div>

        </div>
      )}

      {/* Sub-tab 2: Bookmarks */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-4">
          
          {/* Last read prominent card */}
          {lastRead && (
            <div className="p-5 rounded-3xl bg-gradient-to-l from-[#0F5C4D] to-[#0A3D33] text-white shadow-md flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C9A227] text-[#081714] font-bold">
                  آخر موضع توقفت عنده
                </span>
                <h4 className="text-lg font-bold mt-1">سورة {lastRead.surahName} - الآية {lastRead.ayahNumber}</h4>
                <p className="text-xs text-white/70">{lastRead.date} {lastRead.pageNumber ? `• ص ${lastRead.pageNumber}` : ''}</p>
              </div>
              <button
                onClick={() => openSurah(lastRead.surahNumber, lastRead.ayahNumber, lastRead.pageNumber)}
                className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#081714] font-bold text-xs shadow-md hover:bg-[#b58f1f] transition shrink-0"
              >
                متابعة القراءة الآن
              </button>
            </div>
          )}

          {/* Bookmarks list */}
          {bookmarks.length > 0 ? (
            <div className="space-y-2.5">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between gap-3 text-right"
                >
                  <div 
                    onClick={() => openSurah(b.surahNumber, b.ayahNumber, b.pageNumber)}
                    className="cursor-pointer hover:opacity-80 transition min-w-0"
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                      سورة {b.surahName} • الآية {b.ayahNumber}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      تاريخ الحفظ: {b.date} {b.pageNumber ? `• صفحة ${b.pageNumber}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openSurah(b.surahNumber, b.ayahNumber, b.pageNumber)}
                      className="px-3 py-1.5 rounded-xl bg-[#0F5C4D]/10 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#C9A227] text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>فتح</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      title="حذف العلامة"
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 space-y-2">
              <Bookmark className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200">لا توجد علامات قراءة محفوظة</h4>
              <p className="text-xs text-gray-500">
                أثناء تصفح المصحف، انقر على أيقونة العلامة بجانب أي آية لتثبيت موضع قراءتك.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Sub-tab 3: Favorites */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteAyahs.length > 0 ? (
            <div className="space-y-3">
              {favoriteAyahs.map((fav) => (
                <div
                  key={`${fav.surahNumber}_${fav.ayahNumber}`}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10 text-xs">
                    <span className="font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                      سورة {fav.surahName} • الآية {fav.ayahNumber}
                    </span>
                    <button
                      onClick={() => toggleFavoriteAyah(fav.surahNumber, fav.ayahNumber, fav.text, fav.surahName)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إزالة</span>
                    </button>
                  </div>

                  <p className="font-quran text-xl text-right leading-loose text-gray-900 dark:text-gray-100">
                    ﴿{fav.text}﴾
                  </p>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => openSurah(fav.surahNumber, fav.ayahNumber)}
                      className="flex items-center gap-1 text-xs font-bold text-[#0F5C4D] dark:text-[#C9A227] hover:underline"
                    >
                      <span>الانتقال لموضع الآية في السورة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 space-y-2">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200">قائمة المفضلة فارغة</h4>
              <p className="text-xs text-gray-500">
                يمكنك الضغط على رمز القلب عند أي آية كريمة لإضافتها إلى قائمة آياتك المفضلة هنا.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
