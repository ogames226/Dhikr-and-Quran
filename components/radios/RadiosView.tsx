'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  getMP3QuranRadios, 
  getMP3QuranLiveTV, 
  getMP3QuranReciters, 
  getMP3QuranRiwayat, 
  MP3QuranRadio, 
  MP3QuranLiveTV, 
  MP3QuranReciter, 
  MP3QuranRiwaya 
} from '@/lib/mp3quran';
import { SURAHS_LIST } from '@/data/surahs';
import { 
  Radio as RadioIcon, 
  Tv, 
  Users, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Compass,
  AlertCircle
} from 'lucide-react';

export const RadiosView: React.FC = () => {
  const { 
    activeRadio, 
    playRadio, 
    stopRadio, 
    isPlaying, 
    playFullSurah, 
    isFullSurahMode, 
    currentFullSurah 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'radios' | 'livetv' | 'reciters'>('radios');
  
  // Radios State
  const [radios, setRadios] = useState<MP3QuranRadio[]>([]);
  const [loadingRadios, setLoadingRadios] = useState<boolean>(true);
  const [radioSearch, setRadioSearch] = useState<string>('');

  // Live TV State
  const [liveTV, setLiveTV] = useState<MP3QuranLiveTV[]>([]);
  const [loadingLiveTV, setLoadingLiveTV] = useState<boolean>(true);
  const [activeLiveChannel, setActiveLiveChannel] = useState<MP3QuranLiveTV | null>(null);

  // Reciters State
  const [reciters, setReciters] = useState<MP3QuranReciter[]>([]);
  const [loadingReciters, setLoadingReciters] = useState<boolean>(true);
  const [reciterSearch, setReciterSearch] = useState<string>('');
  const [riwayat, setRiwayat] = useState<MP3QuranRiwaya[]>([]);
  const [selectedRiwaya, setSelectedRiwaya] = useState<string>('all');
  const [expandedReciterId, setExpandedReciterId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    getMP3QuranRadios('ar').then((data) => {
      if (isMounted) {
        setRadios(data);
        setLoadingRadios(false);
      }
    });

    getMP3QuranLiveTV('ar').then((data) => {
      if (isMounted) {
        setLiveTV(data);
        if (data.length > 0) setActiveLiveChannel(data[0]);
        setLoadingLiveTV(false);
      }
    });

    Promise.all([getMP3QuranReciters('ar'), getMP3QuranRiwayat('ar')]).then(([recList, riwList]) => {
      if (isMounted) {
        setReciters(recList);
        setRiwayat(riwList);
        setLoadingReciters(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered radios
  const filteredRadios = radios.filter(r => 
    r.name.toLowerCase().includes(radioSearch.toLowerCase())
  );

  // Filtered reciters
  const filteredReciters = reciters.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(reciterSearch.toLowerCase());
    const matchesRiwaya = selectedRiwaya === 'all' || r.moshaf.some(m => String(m.rewaya_id) === selectedRiwaya);
    return matchesSearch && matchesRiwaya;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227] font-bold">
                API MP3Quran.net
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F5C4D] dark:text-[#C9A227]">
                الإذاعات والبث المباشر ومكتبة القراء
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              استمع لأكثر من 150 إذاعة قرآنية مباشرة، وبث الحرمين الشريفين، وتلاوات كاملة لأكثر من 200 قارئ
            </p>
          </div>

          {/* Sub tabs switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-white/10 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('radios')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'radios'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <RadioIcon className="w-4 h-4" />
              <span>الإذاعات ({radios.length || '...'})</span>
            </button>
            <button
              onClick={() => setActiveTab('livetv')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'livetv'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>البث المرئي</span>
            </button>
            <button
              onClick={() => setActiveTab('reciters')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'reciters'
                  ? 'bg-[#0F5C4D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>مكتبة القراء ({reciters.length || '...'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Radios (إذاعات القرآن الكريم) */}
      {activeTab === 'radios' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن إذاعة (مثال: العفاسي، القاهرة، الرقية الشرعية، المنشاوي، تلاوات خاشعة...)"
              value={radioSearch}
              onChange={(e) => setRadioSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D221D] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            />
          </div>

          {/* Loading state */}
          {loadingRadios && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="p-4 rounded-2xl bg-white dark:bg-[#0D221D] animate-pulse space-y-2 border border-gray-100 dark:border-white/5">
                  <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Radios Grid */}
          {!loadingRadios && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRadios.map((radio) => {
                const isCurrentRadioPlaying = activeRadio?.id === radio.id && isPlaying;
                return (
                  <div
                    key={radio.id}
                    onClick={() => {
                      if (isCurrentRadioPlaying) {
                        stopRadio();
                      } else {
                        playRadio(radio);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${
                      isCurrentRadioPlaying
                        ? 'bg-[#0F5C4D] text-white border-[#C9A227] shadow-lg ring-2 ring-[#C9A227]'
                        : 'bg-white dark:bg-[#0D221D] border-gray-100 dark:border-white/10 hover:border-[#C9A227]/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition ${
                        isCurrentRadioPlaying
                          ? 'bg-[#C9A227] text-[#081714] border-[#C9A227]'
                          : 'bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/30 text-[#0F5C4D] dark:text-[#C9A227] border-[#0F5C4D]/20'
                      }`}>
                        <RadioIcon className={`w-5 h-5 ${isCurrentRadioPlaying ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm truncate">
                          {radio.name}
                        </h4>
                        <span className={`text-[11px] block mt-0.5 ${
                          isCurrentRadioPlaying ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          بث إذاعي مباشر 24/7
                        </span>
                      </div>
                    </div>

                    <button
                      className={`p-2.5 rounded-xl font-bold text-xs shrink-0 transition ${
                        isCurrentRadioPlaying
                          ? 'bg-white text-[#0F5C4D] shadow-md'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {isCurrentRadioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!loadingRadios && filteredRadios.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 space-y-2">
              <RadioIcon className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold">لم يتم العثور على إذاعة مطابقة</h4>
              <p className="text-xs text-gray-500">جرب البحث بكلمة أخرى مثل «العفاسي» أو «مباشر».</p>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Live TV (البث المباشر لقناتي القرآن والسنة) */}
      {activeTab === 'livetv' && (
        <div className="space-y-6">
          
          {/* Channel selector buttons */}
          <div className="flex flex-wrap gap-3">
            {liveTV.map((channel) => {
              const isSelected = activeLiveChannel?.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveLiveChannel(channel)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isSelected
                      ? 'bg-[#0F5C4D] text-white shadow-md ring-2 ring-[#C9A227]'
                      : 'bg-white dark:bg-[#0D221D] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Tv className="w-4 h-4 text-[#C9A227]" />
                  <span>{channel.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white animate-pulse">
                    مباشر
                  </span>
                </button>
              );
            })}
          </div>

          {/* Video Player Card */}
          {activeLiveChannel && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="font-bold text-base sm:text-lg text-[#0F5C4D] dark:text-[#C9A227]">
                    {activeLiveChannel.name}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  بث عالي الدقة من خوادم MP3Quran
                </span>
              </div>

              {/* Video Player element */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center">
                <video
                  controls
                  autoPlay
                  playsInline
                  src={activeLiveChannel.url}
                  className="w-full h-full object-contain"
                >
                  <source src={activeLiveChannel.url} type="application/x-mpegURL" />
                  متصفحك لا يدعم تشغيل هذا البث المباشر.
                </video>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122A24] text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <strong>ملاحظة:</strong> البث المباشر لقناة القرآن الكريم من المسجد الحرام بمكة المكرمة، وقناة السنة النبوية من المسجد النبوي الشريف بالمدينة المنورة يبثان على مدار الساعة طوال أيام العام.
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 3: Complete Reciters Library (مكتبة القراء الشاملة) */}
      {activeTab === 'reciters' && (
        <div className="space-y-4">
          
          {/* Search & Riwaya Filter Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث عن أي قارئ من بين أكثر من 200 قارئ..."
                  value={reciterSearch}
                  onChange={(e) => setReciterSearch(e.target.value)}
                  className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#122A24] text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
                />
              </div>

              {/* Riwaya Select */}
              <select
                value={selectedRiwaya}
                onChange={(e) => setSelectedRiwaya(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#122A24] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              >
                <option value="all">كافة الروايات القرائية</option>
                {riwayat.map(rw => (
                  <option key={rw.id} value={String(rw.id)}>
                    {rw.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading */}
          {loadingReciters && (
            <div className="p-8 text-center text-sm font-bold text-gray-500 animate-pulse">
              جاري تحميل مكتبة قراء MP3Quran...
            </div>
          )}

          {/* Reciters List */}
          {!loadingReciters && (
            <div className="space-y-3">
              {filteredReciters.slice(0, 50).map((reciter) => {
                const isExpanded = expandedReciterId === reciter.id;
                const primaryMoshaf = reciter.moshaf[0];

                return (
                  <div
                    key={reciter.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D221D] border border-gray-100 dark:border-white/10 shadow-sm transition hover:border-[#C9A227]/40"
                  >
                    <div 
                      onClick={() => setExpandedReciterId(isExpanded ? null : reciter.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 text-[#0F5C4D] dark:text-[#C9A227] flex items-center justify-center font-bold text-sm">
                          {reciter.letter || reciter.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                            {reciter.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {primaryMoshaf ? primaryMoshaf.name : 'مصحف مرتّل'} • {primaryMoshaf ? `${primaryMoshaf.surah_total} سورة متوفرة` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 rounded-xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#C9A227] text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>عرض السور</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Surah Grid */}
                    {isExpanded && primaryMoshaf && (
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 space-y-3">
                        <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
                          اختر السورة للاستماع المباشر بصوت {reciter.name}:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-1">
                          {SURAHS_LIST.map((surah) => {
                            const isCurrentlyPlayingThis = 
                              isFullSurahMode && 
                              currentFullSurah?.surahNumber === surah.number && 
                              currentFullSurah?.reciterName === reciter.name && 
                              isPlaying;

                            return (
                              <button
                                key={surah.number}
                                onClick={() => playFullSurah(surah.number, primaryMoshaf.server, reciter.name)}
                                className={`p-2 rounded-xl text-xs font-semibold text-right flex items-center justify-between border transition ${
                                  isCurrentlyPlayingThis
                                    ? 'bg-[#0F5C4D] text-white border-[#C9A227]'
                                    : 'bg-gray-50 dark:bg-[#122A24] hover:bg-gray-100 dark:hover:bg-white/10 border-gray-100 dark:border-white/5'
                                }`}
                              >
                                <span className="truncate">{surah.name}</span>
                                {isCurrentlyPlayingThis ? (
                                  <Volume2 className="w-3.5 h-3.5 text-[#C9A227] animate-pulse shrink-0" />
                                ) : (
                                  <Play className="w-3 h-3 text-gray-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
