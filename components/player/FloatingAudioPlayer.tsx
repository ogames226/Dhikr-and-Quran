'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SURAHS_LIST } from '@/data/surahs';
import { RECITERS_LIST } from '@/data/reciters';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Gauge, 
  Bookmark, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  User, 
  AlertCircle,
  Radio as RadioIcon,
  X
} from 'lucide-react';

export const FloatingAudioPlayer: React.FC = () => {
  const {
    currentAudioAyah,
    activeRadio,
    stopRadio,
    isFullSurahMode,
    currentFullSurah,
    isPlaying,
    togglePlay,
    nextAyah,
    prevAyah,
    playbackSpeed,
    setPlaybackSpeed,
    repeatMode,
    setRepeatMode,
    currentReciter,
    setCurrentReciter,
    currentTime,
    duration,
    seekAudio,
    saveBookmark,
    audioError,
    openSurah,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecitersModal, setShowRecitersModal] = useState(false);
  const [bookmarkSavedToast, setBookmarkSavedToast] = useState(false);

  // If no audio has ever been triggered, don't show the bar
  if (!currentAudioAyah && !activeRadio && !isFullSurahMode) return null;

  const currentSurah = isFullSurahMode && currentFullSurah
    ? SURAHS_LIST.find(s => s.number === currentFullSurah.surahNumber)
    : currentAudioAyah
    ? SURAHS_LIST.find(s => s.number === currentAudioAyah.surahNumber)
    : null;

  const surahName = currentSurah 
    ? currentSurah.name 
    : isFullSurahMode && currentFullSurah 
    ? `سورة ${currentFullSurah.surahNumber}` 
    : currentAudioAyah 
    ? `سورة ${currentAudioAyah.surahNumber}` 
    : '';

  // Time formatter MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Speed cycles: 0.75x -> 1.0x -> 1.25x -> 1.5x
  const handleCycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  // Repeat cycles: continuous -> 3x -> once -> none
  const handleCycleRepeat = () => {
    const modes: ('continuous' | '3x' | 'once' | 'none')[] = ['continuous', '3x', 'once', 'none'];
    const idx = modes.indexOf(repeatMode);
    const nextMode = modes[(idx + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatLabel = () => {
    switch (repeatMode) {
      case 'continuous': return 'تتابع السورة';
      case '3x': return 'تكرار 3×';
      case 'once': return 'تكرار السورة/الآية';
      case 'none': return 'إيقاف بعد الانتهاء';
    }
  };

  const handleSaveCurrentBookmark = () => {
    if (!currentSurah) return;
    const ayahNum = currentAudioAyah ? currentAudioAyah.ayahNumber : 1;
    saveBookmark(
      currentSurah.number,
      currentSurah.name,
      ayahNum,
      currentSurah.page,
      `استماع بصوت ${isFullSurahMode && currentFullSurah ? currentFullSurah.reciterName : currentReciter.name}`
    );
    setBookmarkSavedToast(true);
    setTimeout(() => setBookmarkSavedToast(false), 2500);
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-8 md:max-w-lg z-40 transition-all duration-300">
      
      {/* Bookmark Saved Notice */}
      {bookmarkSavedToast && (
        <div className="mb-2 p-2 px-3 rounded-lg bg-[#C9A227] text-[#081714] text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 animate-fadeIn">
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>تم حفظ علامة القراءة والاستماع بنجاح!</span>
        </div>
      )}

      {/* Audio Error Alert */}
      {audioError && (
        <div className="mb-2 p-2 px-3 rounded-lg bg-red-600 text-white text-xs font-medium shadow-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{audioError}</span>
          </div>
          <button onClick={togglePlay} className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold">
            إعادة
          </button>
        </div>
      )}

      {/* Main Player Floating Container */}
      <div className="bg-[#0F5C4D] text-white rounded-2xl shadow-2xl border border-[#C9A227]/30 overflow-hidden backdrop-blur-md">
        
        {/* Progress Bar (Scrubbable for Surahs/Ayahs, animated stream indicator for Live Radios) */}
        {activeRadio ? (
          <div className="w-full h-1.5 bg-[#C9A227]/30 overflow-hidden relative">
            <div className="w-1/3 h-full bg-[#C9A227] animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        ) : (
          <div className="relative w-full h-1.5 bg-black/30 cursor-pointer group">
            <div 
              className="absolute top-0 right-0 h-full bg-[#C9A227] transition-all"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime || 0}
              onChange={(e) => seekAudio(Number(e.target.value))}
              aria-label="شريط تقدم التلاوة"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}

        {/* Compact Bar Content */}
        <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Info: Radio Station OR Quran Surah */}
          {activeRadio ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#C9A227]/20 flex items-center justify-center shrink-0 border border-[#C9A227]/40 text-[#C9A227]">
                <RadioIcon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm truncate">{activeRadio.name}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-red-600 text-white font-bold shrink-0 animate-pulse">
                    مباشر
                  </span>
                </div>
                <p className="text-[11px] text-white/70 truncate">
                  إذاعة قرآنية 24/7 • MP3Quran.net
                </p>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => currentSurah && openSurah(currentSurah.number, currentAudioAyah ? currentAudioAyah.ayahNumber : 1)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-90 transition"
              title="انقر لفتح هذه السورة في المصحف"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-[#C9A227]/30">
                <Volume2 className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm truncate">{surahName}</h4>
                  {currentAudioAyah ? (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-[#C9A227]/20 text-[#C9A227] font-bold shrink-0">
                      آية {currentAudioAyah.ayahNumber}
                    </span>
                  ) : isFullSurahMode ? (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-[#C9A227]/20 text-[#C9A227] font-bold shrink-0">
                      تلاوة كاملة
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-white/70 truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-[#C9A227]" />
                  <span>{isFullSurahMode && currentFullSurah ? currentFullSurah.reciterName : currentReciter.name}</span>
                </p>
              </div>
            </div>
          )}

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {!activeRadio && (
              <button
                onClick={prevAyah}
                aria-label={isFullSurahMode ? 'السورة السابقة' : 'الآية السابقة'}
                title={isFullSurahMode ? 'السورة السابقة' : 'الآية السابقة'}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition active:scale-95"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              className="w-10 h-10 rounded-full bg-[#C9A227] hover:bg-[#b8911c] text-[#081714] flex items-center justify-center shadow-md transition-transform active:scale-90 font-bold"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current mr-0.5" />
              )}
            </button>

            {!activeRadio && (
              <button
                onClick={nextAyah}
                aria-label={isFullSurahMode ? 'السورة التالية' : 'الآية التالية'}
                title={isFullSurahMode ? 'السورة التالية' : 'الآية التالية'}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition active:scale-95"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            {activeRadio ? (
              <button
                onClick={stopRadio}
                aria-label="إيقاف الإذاعة"
                title="إيقاف الإذاعة"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label="تفاصيل المشغل"
                title="خيارات متقدمة"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>

        {/* Expanded Controls Drawer (for non-radio) */}
        {!activeRadio && isExpanded && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-3 text-xs">
            
            {/* Time labels */}
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {/* Repeat Mode */}
              <button
                onClick={handleCycleRepeat}
                title="تغيير وضع التكرار"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition text-center"
              >
                <Repeat className={`w-3.5 h-3.5 ${repeatMode !== 'none' ? 'text-[#C9A227]' : 'text-white/50'}`} />
                <span className="text-[10px] truncate max-w-full">{getRepeatLabel()}</span>
              </button>

              {/* Speed Mode */}
              <button
                onClick={handleCycleSpeed}
                title="تغيير سرعة التلاوة"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition text-center"
              >
                <Gauge className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[10px]">{playbackSpeed}x السرعة</span>
              </button>

              {/* Reciter Selector */}
              <button
                onClick={() => setShowRecitersModal(true)}
                title="اختيار القارئ"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition text-center"
              >
                <User className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[10px] truncate max-w-full">تغيير القارئ</span>
              </button>

              {/* Bookmark position */}
              <button
                onClick={handleSaveCurrentBookmark}
                title="حفظ موضع الاستماع كعلامة قراءة"
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition text-center"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="text-[10px]">حفظ علامة</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Reciters Modal */}
      {showRecitersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900 dark:text-white">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D221D] p-5 shadow-2xl border border-gray-100 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
              <h3 className="font-bold text-base text-[#0F5C4D] dark:text-[#C9A227] flex items-center gap-2">
                <User className="w-4 h-4" />
                اختر القارئ المفضل
              </h3>
              <button 
                onClick={() => setShowRecitersModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {RECITERS_LIST.map((rec) => {
                const isSelected = rec.id === currentReciter.id;
                return (
                  <button
                    key={rec.id}
                    onClick={() => {
                      setCurrentReciter(rec);
                      setShowRecitersModal(false);
                    }}
                    className={`w-full p-3 rounded-xl flex items-center justify-between transition text-right ${
                      isSelected
                        ? 'bg-[#0F5C4D] text-white font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div>
                      <div className="text-sm">{rec.name}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {rec.englishName}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
