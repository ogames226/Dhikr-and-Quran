'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ADHKAR_CATEGORIES } from '@/data/adhkar';
import { DhikrItem } from '@/types';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Bed, 
  Sunrise, 
  Building2, 
  Utensils, 
  Compass, 
  HelpCircle, 
  HeartHandshake, 
  Check, 
  Copy, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  BookMarked
} from 'lucide-react';

export const AdhkarView: React.FC = () => {
  const { 
    completedAdhkar, 
    incrementDhikrProgress, 
    resetDhikrCategory,
    fontSize,
    fontFamily
  } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('morning');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCategory = ADHKAR_CATEGORIES.find(c => c.id === activeCategoryId) || ADHKAR_CATEGORIES[0];

  // Calculate progress in current category
  const totalItems = currentCategory.items.length;
  const finishedItems = currentCategory.items.filter(item => {
    const count = completedAdhkar[item.id] || 0;
    return count >= item.count;
  }).length;
  const progressPercent = totalItems > 0 ? Math.round((finishedItems / totalItems) * 100) : 0;

  // Icon mapping
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Bed': return <Bed className="w-4 h-4 text-blue-400" />;
      case 'Sunrise': return <Sunrise className="w-4 h-4 text-orange-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-teal-500" />;
      case 'Compass': return <Compass className="w-4 h-4 text-cyan-500" />;
      case 'HelpCircle': return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-[#C9A227]" />;
    }
  };

  const handleCopyDhikr = (item: DhikrItem) => {
    const textToCopy = `${item.text}\n\n[التكرار: ${item.count} مرات] • [الفضل: ${item.benefit}] • [المصدر: ${item.source}]\n— عبر تطبيق ذكر وقرآن`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareDhikr = async (item: DhikrItem) => {
    const shareData = {
      title: `${currentCategory.title} - ذكر وقرآن`,
      text: `${item.text}\n\nالفضل: ${item.benefit}\nالمصدر: ${item.source}`
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* ignore */ }
    } else {
      handleCopyDhikr(item);
    }
  };

  // Font styling resolver
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base sm:text-lg leading-relaxed';
      case 'md': return 'text-lg sm:text-xl leading-relaxed';
      case 'lg': return 'text-xl sm:text-2xl leading-relaxed';
      case 'xl': return 'text-2xl sm:text-3xl leading-relaxed';
      case '2xl': return 'text-3xl sm:text-4xl leading-relaxed';
      default: return 'text-lg sm:text-xl leading-relaxed';
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

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Category selector horizontal scroller */}
      <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar flex items-center gap-2">
        {ADHKAR_CATEGORIES.map((cat) => {
          const isSelected = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#0F5C4D] text-white shadow-md'
                  : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Category Progress and Actions Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                {currentCategory.title}
              </h2>
              {progressPercent === 100 && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  أتممت قراءة الأذكار!
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {currentCategory.description}
            </p>
          </div>

          {/* Reset progress button */}
          <button
            onClick={() => resetDhikrCategory(currentCategory.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-xs font-semibold text-gray-700 dark:text-gray-200 transition shrink-0 self-start sm:self-auto"
            title="إعادة ضبط عدادات هذا القسم"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط القسم</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
            <span>نسبة إنجاز الأذكار</span>
            <span>{finishedItems} من {totalItems} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-l from-[#C9A227] to-[#0F5C4D] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Adhkar Items Cards */}
      <div className="space-y-4">
        {currentCategory.items.map((item, index) => {
          const currentCount = completedAdhkar[item.id] || 0;
          const isDone = currentCount >= item.count;
          const remaining = Math.max(0, item.count - currentCount);

          return (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-3xl transition-all border ${
                isDone
                  ? 'bg-emerald-50/40 dark:bg-[#0F5C4D]/10 border-emerald-500/40 dark:border-emerald-500/20'
                  : 'bg-white dark:bg-[#0D221D] border-gray-100 dark:border-white/10 shadow-sm hover:border-[#C9A227]/40'
              }`}
            >
              {/* Card Header (Number badge & Done checkmark) */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#C9A227] flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    التكرار المطلوب: {item.count} {item.count === 1 ? 'مرة واحدة' : item.count === 2 ? 'مرتان' : 'مرات'}
                  </span>
                </div>

                {isDone && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>مكتمل</span>
                  </span>
                )}
              </div>

              {/* Main Dhikr Text */}
              <div className="py-4 text-right">
                <p className={`${getFontFamilyClass()} ${getFontSizeClass()} text-gray-900 dark:text-gray-100 leading-relaxed font-semibold`}>
                  {item.text}
                </p>
              </div>

              {/* Virtue & Hadith Source Footnote */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#122A24] space-y-1.5 text-xs text-gray-600 dark:text-gray-300 border-r-3 border-[#C9A227]">
                <div className="flex items-start gap-1.5">
                  <strong className="text-[#0F5C4D] dark:text-[#C9A227] shrink-0 font-bold">الفضل:</strong>
                  <span>{item.benefit}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <BookMarked className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>المصدر: {item.source}</span>
                </div>
              </div>

              {/* Action Toolbar & Interactive Click Counter */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 dark:border-white/10">
                
                {/* Share & Copy buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyDhikr(item)}
                    title="نسخ الذكر كاملاً"
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-800 dark:hover:text-white transition flex items-center gap-1 text-xs"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">نسخ</span>
                  </button>

                  <button
                    onClick={() => handleShareDhikr(item)}
                    title="مشاركة الذكر"
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-800 dark:hover:text-white transition flex items-center gap-1 text-xs"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">مشاركة</span>
                  </button>
                </div>

                {/* Big Interactive Counter Button with Haptic */}
                <button
                  onClick={() => incrementDhikrProgress(item.id, item.count)}
                  disabled={isDone}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl font-extrabold text-sm transition-all active:scale-95 shadow-sm ${
                    isDone
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#0F5C4D] hover:bg-[#0B463A] text-white hover:shadow-md'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم بحمد الله ({item.count})</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-white/80">انقر للتكرار:</span>
                      <span className="w-7 h-7 rounded-full bg-[#C9A227] text-[#081714] flex items-center justify-center text-sm font-extrabold">
                        {remaining}
                      </span>
                    </>
                  )}
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
