'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  CircleDot, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sparkles, 
  Plus, 
  Trophy, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const MasbahaView: React.FC = () => {
  const {
    masbahaCount,
    masbahaTotalToday,
    masbahaTotalAll,
    selectedDhikr,
    setSelectedDhikr,
    incrementMasbaha,
    resetMasbahaCurrent,
    soundEnabled,
    vibrationEnabled,
    toggleSound,
    toggleVibration,
  } = useApp();

  const [cycleTarget, setCycleTarget] = useState<number>(33);
  const [customDhikrInput, setCustomDhikrInput] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [animatePulse, setAnimatePulse] = useState<boolean>(false);

  const presetAthkar = [
    'سُبْحَانَ اللَّهِ',
    'الحَمْدُ لِلَّهِ',
    'لا إِلَهَ إِلا اللَّهُ',
    'اللَّهُ أَكْبَرُ',
    'أَسْتَغْفِرُ اللَّهَ العَظِيمَ وَأَتُوبُ إِلَيْهِ',
    'لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد',
    'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ العَظِيمِ',
    'حَسْبُنَا اللَّهُ وَنِعْمَ الوَكِيلُ',
    'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
  ];

  const handleTap = () => {
    setAnimatePulse(true);
    setTimeout(() => setAnimatePulse(false), 120);
    incrementMasbaha();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDhikrInput.trim()) {
      setSelectedDhikr(customDhikrInput.trim());
      setCustomDhikrInput('');
      setShowCustomModal(false);
    }
  };

  // Progress in current 33/100 cycle
  const currentInCycle = masbahaCount % cycleTarget;
  const completedCycles = Math.floor(masbahaCount / cycleTarget);
  const circleCircumference = 2 * Math.PI * 110;
  const strokeDashoffset = circleCircumference - (currentInCycle / cycleTarget) * circleCircumference;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-[#C9A227]" />
            المسبحة الإلكترونية الذكية
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            رطب لسانك بذكر الله وحافظ على أورادك اليومية
          </p>
        </div>

        {/* Sound & Vibration Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-label="تبديل صوت النقرة"
            title={soundEnabled ? 'كتم صوت التسبيح' : 'تفعيل صوت التسبيح'}
            className={`p-2.5 rounded-xl border transition ${
              soundEnabled
                ? 'bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#C9A227] border-[#0F5C4D]/30'
                : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleVibration}
            aria-label="تبديل الاهتزاز"
            title={vibrationEnabled ? 'تعطيل الاهتزاز' : 'تفعيل الاهتزاز'}
            className={`p-2.5 rounded-xl border transition ${
              vibrationEnabled
                ? 'bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#C9A227] border-[#0F5C4D]/30'
                : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent'
            }`}
          >
            <Vibrate className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Athkar Carousel / Pills */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 px-1">
          <span>اختر صيغة الذكر:</span>
          <button
            onClick={() => setShowCustomModal(true)}
            className="text-[#0F5C4D] dark:text-[#C9A227] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة ذكر مخصص</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {presetAthkar.map((dhikr) => {
            const isSelected = selectedDhikr === dhikr;
            return (
              <button
                key={dhikr}
                onClick={() => setSelectedDhikr(dhikr)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0F5C4D] text-white shadow-sm ring-1 ring-[#C9A227]'
                    : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/5'
                }`}
              >
                {dhikr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Bead Counter Centerpiece */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-islamic-pattern">
        
        {/* Selected Dhikr Display Header */}
        <div className="text-center max-w-md px-4">
          <p className="font-quran text-2xl sm:text-3xl font-bold text-[#0F5C4D] dark:text-[#C9A227] leading-relaxed">
            «{selectedDhikr}»
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>الدورات المكتملة: <strong className="text-gray-800 dark:text-white">{completedCycles}</strong></span>
            <span>•</span>
            <span>الدورة الحالية: <strong className="text-[#0F5C4D] dark:text-[#C9A227]">{currentInCycle} / {cycleTarget}</strong></span>
          </div>
        </div>

        {/* Circular Clickable Bead Area */}
        <div className="relative flex items-center justify-center select-none">
          
          {/* Circular SVG Progress Ring */}
          <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="110"
              className="stroke-gray-100 dark:stroke-white/5"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="110"
              stroke="#C9A227"
              strokeWidth="10"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-150"
            />
          </svg>

          {/* Interactive Tap Button */}
          <button
            onClick={handleTap}
            aria-label="تسبيح، انقر هنا"
            className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#0F5C4D] to-[#08362D] text-white shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 border-4 border-[#C9A227]/40 ${
              animatePulse ? 'scale-98 ring-8 ring-[#C9A227]/30' : 'hover:scale-102'
            }`}
          >
            <span className="text-4xl sm:text-5xl font-black font-cairo tracking-tight text-[#F3E7BE]">
              {masbahaCount}
            </span>
            <span className="text-xs font-bold text-white/80 mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              اضغط للتسبيح
            </span>
          </button>

        </div>

        {/* Target and Reset Toolbar */}
        <div className="flex items-center justify-between w-full max-w-sm pt-4 border-t border-gray-100 dark:border-white/10 text-xs">
          
          {/* Cycle Target Options: 33 vs 100 */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-white/10">
            <button
              onClick={() => setCycleTarget(33)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                cycleTarget === 33
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              33 دورة
            </button>
            <button
              onClick={() => setCycleTarget(100)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                cycleTarget === 100
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              100 دورة
            </button>
          </div>

          {/* Reset Current Count */}
          <button
            onClick={() => {
              if (confirm('هل ترغب في إعادة تصفير العداد الحالي؟')) {
                resetMasbahaCurrent();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير العداد</span>
          </button>

        </div>

      </div>

      {/* Daily & Overall Stats Summary Card */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Today's Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-[#0F5C4D] dark:text-[#C9A227]" />
            <span>مجموع تسبيحات اليوم</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F5C4D] dark:text-[#C9A227]">
            {masbahaTotalToday}
          </div>
          <div className="text-[11px] text-gray-400">
            يحفظ تلقائياً في ذاكرة جهازك
          </div>
        </div>

        {/* All-time Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Trophy className="w-4 h-4 text-[#C9A227]" />
            <span>الإجمالي التراكمي العام</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C9A227]">
            {masbahaTotalAll}
          </div>
          <div className="text-[11px] text-gray-400">
            تقبل الله طاعاتكم وصالح أعمالكم
          </div>
        </div>

      </div>

      {/* Custom Dhikr Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900 dark:text-white">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D221D] p-5 shadow-2xl border border-gray-100 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
              <h3 className="font-bold text-base text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                إضافة صيغة تسبيح أو دعاء مخصص
              </h3>
              <button 
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  اكتب الذكر أو الدعاء:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ..."
                  value={customDhikrInput}
                  onChange={(e) => setCustomDhikrInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#122A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F5C4D] text-white text-xs font-bold shadow-sm hover:bg-[#0B463A]"
                >
                  تعيين واستخدام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
