'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Bookmark, PrayerData, Reciter, TabType } from '@/types';
import { RECITERS_LIST, DEFAULT_RECITER, getAyahAudioUrl } from '@/data/reciters';
import { SURAHS_LIST } from '@/data/surahs';
import { getMP3QuranSurahUrl } from '@/lib/mp3quran';

interface ActiveAyahInfo {
  surahNumber: number;
  ayahNumber: number;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Theme & Appearance
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => void;
  fontFamily: 'amiri' | 'cairo' | 'scheherazade';
  setFontFamily: (font: 'amiri' | 'cairo' | 'scheherazade') => void;
  quranViewMode: 'text' | 'mushaf';
  setQuranViewMode: (mode: 'text' | 'mushaf') => void;

  // Active Surah Reader
  activeSurahNumber: number | null;
  activeSurahAyahTarget: number | null;
  activePageNumber: number;
  openSurah: (surahNumber: number, targetAyah?: number, page?: number) => void;
  closeSurah: () => void;
  goToNextSurah: () => void;
  goToPrevSurah: () => void;
  setActivePageNumber: (page: number) => void;

  // Audio Player
  isPlaying: boolean;
  currentReciter: Reciter;
  setCurrentReciter: (r: Reciter) => void;
  currentAudioAyah: ActiveAyahInfo | null;
  activeRadio: { id: number; name: string; url: string } | null;
  playRadio: (radio: { id: number; name: string; url: string }) => void;
  stopRadio: () => void;
  isFullSurahMode: boolean;
  currentFullSurah: { surahNumber: number; reciterName: string } | null;
  playFullSurah: (surahNumber: number, serverUrl?: string, reciterName?: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  repeatMode: 'none' | 'once' | '3x' | 'continuous';
  setRepeatMode: (mode: 'none' | 'once' | '3x' | 'continuous') => void;
  currentTime: number;
  duration: number;
  audioProgress: number;
  audioError: string | null;
  playAyah: (surahNumber: number, ayahNumberInSurah: number) => void;
  togglePlay: () => void;
  pauseAudio: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seekAudio: (seconds: number) => void;

  // Bookmarks & Favorites
  bookmarks: Bookmark[];
  lastRead: Bookmark | null;
  saveBookmark: (surahNumber: number, surahName: string, ayahNumber: number, pageNumber?: number, note?: string) => void;
  removeBookmark: (id: string) => void;
  favoriteAyahs: { surahNumber: number; ayahNumber: number; text: string; surahName: string }[];
  toggleFavoriteAyah: (surahNumber: number, ayahNumber: number, text: string, surahName: string) => void;
  isAyahFavorite: (surahNumber: number, ayahNumber: number) => boolean;

  // Masbaha
  masbahaCount: number;
  masbahaTotalToday: number;
  masbahaTotalAll: number;
  selectedDhikr: string;
  setSelectedDhikr: (d: string) => void;
  incrementMasbaha: () => void;
  resetMasbahaCurrent: () => void;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleVibration: () => void;

  // Adhkar progress
  completedAdhkar: Record<string, number>;
  incrementDhikrProgress: (id: string, maxCount: number) => void;
  resetDhikrCategory: (categoryId: string) => void;

  // Prayer Times
  prayerData: PrayerData | null;
  loadingPrayers: boolean;
  prayerError: string | null;
  userCity: string;
  nextPrayer: { name: string; time: string; remainingMinutes: number } | null;
  fetchPrayersByLocation: () => void;
  fetchPrayersByCity: (city: string, country?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Synthetic click sound using Web Audio API
function playBeadClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore audio context errors if blocked by browser policy
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Appearance with lazy localStorage initialization
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dq_theme') as 'light' | 'dark' | null;
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_fontSize') as 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null;
      if (saved) return saved;
    }
    return 'md';
  });

  const [fontFamily, setFontFamily] = useState<'amiri' | 'cairo' | 'scheherazade'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_fontFamily') as 'amiri' | 'cairo' | 'scheherazade' | null;
      if (saved) return saved;
    }
    return 'amiri';
  });

  const [quranViewMode, setQuranViewMode] = useState<'text' | 'mushaf'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_quranMode') as 'text' | 'mushaf' | null;
      if (saved) return saved;
    }
    return 'text';
  });

  // Active Surah in reader
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);
  const [activeSurahAyahTarget, setActiveSurahAyahTarget] = useState<number | null>(null);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);

  // Audio Player
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentReciter, setCurrentReciter] = useState<Reciter>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_reciter');
      if (saved) {
        const found = RECITERS_LIST.find(r => r.id === saved);
        if (found) return found;
      }
    }
    return DEFAULT_RECITER;
  });

  const [currentAudioAyah, setCurrentAudioAyah] = useState<ActiveAyahInfo | null>(null);
  const [activeRadio, setActiveRadio] = useState<{ id: number; name: string; url: string } | null>(null);
  const [isFullSurahMode, setIsFullSurahMode] = useState<boolean>(false);
  const [currentFullSurah, setCurrentFullSurah] = useState<{ surahNumber: number; reciterName: string } | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [repeatMode, setRepeatMode] = useState<'none' | 'once' | '3x' | 'continuous'>('continuous');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const repeatCountRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleAudioEndedRef = useRef<() => void>(() => {});

  // Bookmarks & Favorites with lazy initialization
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_bookmarks');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  const [lastRead, setLastRead] = useState<Bookmark | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_lastRead');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return null;
  });

  const [favoriteAyahs, setFavoriteAyahs] = useState<{ surahNumber: number; ayahNumber: number; text: string; surahName: string }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_favAyahs');
      if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
      }
    }
    return [];
  });

  // Masbaha with lazy initialization
  const [masbahaCount, setMasbahaCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_masbaha_curr');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const [masbahaTotalToday, setMasbahaTotalToday] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const todayKey = `dq_masbaha_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const [masbahaTotalAll, setMasbahaTotalAll] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_masbaha_all');
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const [selectedDhikr, setSelectedDhikr] = useState<string>('سُبْحَانَ اللَّهِ');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_masbaha_sound');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dq_masbaha_vib');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  // Adhkar Progress
  const [completedAdhkar, setCompletedAdhkar] = useState<Record<string, number>>({});

  // Prayer Times
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loadingPrayers, setLoadingPrayers] = useState<boolean>(true);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string>('مكة المكرمة');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remainingMinutes: number } | null>(null);

  // Sync theme class to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync theme changes with DOM & Storage
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('dq_theme', next);
      return next;
    });
  };

  // Sync font size
  const updateFontSize = (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    setFontSize(size);
    localStorage.setItem('dq_fontSize', size);
  };

  // Sync font family
  const updateFontFamily = (font: 'amiri' | 'cairo' | 'scheherazade') => {
    setFontFamily(font);
    localStorage.setItem('dq_fontFamily', font);
  };

  // Sync Quran view mode
  const updateQuranViewMode = (mode: 'text' | 'mushaf') => {
    setQuranViewMode(mode);
    localStorage.setItem('dq_quranMode', mode);
  };

  // Reciter change
  const handleSetReciter = (r: Reciter) => {
    setCurrentReciter(r);
    localStorage.setItem('dq_reciter', r.id);
    if (currentAudioAyah && isPlaying && audioRef.current) {
      const newUrl = getAyahAudioUrl(r.folder, currentAudioAyah.surahNumber, currentAudioAyah.ayahNumber);
      audioRef.current.src = newUrl;
      audioRef.current.play().catch(() => {});
    }
  };

  // Open Surah in reader
  const openSurah = (surahNumber: number, targetAyah?: number, page?: number) => {
    setActiveSurahNumber(surahNumber);
    setActiveSurahAyahTarget(targetAyah || 1);
    const surahMeta = SURAHS_LIST.find(s => s.number === surahNumber);
    if (page) {
      setActivePageNumber(page);
    } else if (surahMeta) {
      setActivePageNumber(surahMeta.page);
    }
    setActiveTab('quran');
  };

  const closeSurah = () => {
    setActiveSurahNumber(null);
    setActiveSurahAyahTarget(null);
  };

  const goToNextSurah = () => {
    if (!activeSurahNumber || activeSurahNumber >= 114) return;
    openSurah(activeSurahNumber + 1);
  };

  const goToPrevSurah = () => {
    if (!activeSurahNumber || activeSurahNumber <= 1) return;
    openSurah(activeSurahNumber - 1);
  };

  // Play a specific Ayah
  const playAyah = useCallback((surahNumber: number, ayahNumberInSurah: number) => {
    if (!audioRef.current) return;
    setAudioError(null);
    setActiveRadio(null);
    setIsFullSurahMode(false);
    setCurrentFullSurah(null);

    const url = getAyahAudioUrl(currentReciter.folder, surahNumber, ayahNumberInSurah);
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackSpeed;
    setCurrentAudioAyah({ surahNumber, ayahNumber: ayahNumberInSurah });
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Audio play failed:', err);
      setIsPlaying(false);
      setAudioError('تعذر تشغيل الصوت تلقائياً، اضغط تشغيل للبدء.');
    });
  }, [currentReciter, playbackSpeed]);

  // Play Live Radio Stream from MP3Quran
  const playRadio = useCallback((radio: { id: number; name: string; url: string }) => {
    if (!audioRef.current) return;
    setAudioError(null);
    setCurrentAudioAyah(null);
    setIsFullSurahMode(false);
    setCurrentFullSurah(null);
    setActiveRadio(radio);

    audioRef.current.src = radio.url;
    audioRef.current.playbackRate = 1;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Radio stream play error:', err);
      setIsPlaying(false);
      setAudioError('تعذر تشغيل بث الإذاعة، يرجى المحاولة لاحقاً أو اختيار إذاعة أخرى.');
    });
  }, []);

  const stopRadio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setActiveRadio(null);
    setIsPlaying(false);
  }, []);

  // Play Full Surah from MP3Quran
  const playFullSurah = useCallback((surahNumber: number, serverUrl?: string, reciterName?: string) => {
    if (!audioRef.current) return;
    setAudioError(null);
    setActiveRadio(null);
    setCurrentAudioAyah(null);
    setIsFullSurahMode(true);

    const rName = reciterName || currentReciter.name;
    const sUrl = serverUrl || currentReciter.surahServerUrl || 'https://server8.mp3quran.net/afs';
    const finalAudioUrl = getMP3QuranSurahUrl(sUrl, surahNumber);

    setCurrentFullSurah({ surahNumber, reciterName: rName });
    audioRef.current.src = finalAudioUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Full surah audio play error:', err);
      setIsPlaying(false);
      setAudioError('تعذر تشغيل تلاوة السورة كاملة من خوادم MP3Quran.');
    });
  }, [currentReciter, playbackSpeed]);

  // Audio Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (activeRadio) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else if (isFullSurahMode && currentFullSurah) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else if (currentAudioAyah) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        const sNum = activeSurahNumber || 1;
        playAyah(sNum, 1);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Next
  const nextAyah = useCallback(() => {
    if (isFullSurahMode && currentFullSurah) {
      if (currentFullSurah.surahNumber < 114) {
        playFullSurah(currentFullSurah.surahNumber + 1);
      }
      return;
    }

    if (!currentAudioAyah) return;
    const surahMeta = SURAHS_LIST.find(s => s.number === currentAudioAyah.surahNumber);
    if (!surahMeta) return;

    if (currentAudioAyah.ayahNumber < surahMeta.numberOfAyahs) {
      playAyah(currentAudioAyah.surahNumber, currentAudioAyah.ayahNumber + 1);
    } else if (currentAudioAyah.surahNumber < 114) {
      playAyah(currentAudioAyah.surahNumber + 1, 1);
    } else {
      setIsPlaying(false);
    }
  }, [isFullSurahMode, currentFullSurah, currentAudioAyah, playAyah, playFullSurah]);

  // Prev
  const prevAyah = () => {
    if (isFullSurahMode && currentFullSurah) {
      if (currentFullSurah.surahNumber > 1) {
        playFullSurah(currentFullSurah.surahNumber - 1);
      }
      return;
    }

    if (!currentAudioAyah) return;
    if (currentAudioAyah.ayahNumber > 1) {
      playAyah(currentAudioAyah.surahNumber, currentAudioAyah.ayahNumber - 1);
    } else if (currentAudioAyah.surahNumber > 1) {
      const prevSurahMeta = SURAHS_LIST.find(s => s.number === currentAudioAyah.surahNumber - 1);
      if (prevSurahMeta) {
        playAyah(prevSurahMeta.number, prevSurahMeta.numberOfAyahs);
      }
    }
  };

  // Audio Ended Handler based on repeatMode
  const handleAudioEnded = useCallback(() => {
    if (activeRadio) {
      // Live radio reconnect
      return;
    }
    if (isFullSurahMode && currentFullSurah) {
      if (repeatMode === 'once') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      } else if (repeatMode === 'continuous') {
        if (currentFullSurah.surahNumber < 114) {
          playFullSurah(currentFullSurah.surahNumber + 1);
        }
      }
      return;
    }

    if (repeatMode === 'once') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (repeatMode === '3x') {
      repeatCountRef.current += 1;
      if (repeatCountRef.current < 3) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      } else {
        repeatCountRef.current = 0;
        nextAyah();
      }
    } else if (repeatMode === 'continuous') {
      nextAyah();
    } else {
      setIsPlaying(false);
    }
  }, [activeRadio, isFullSurahMode, currentFullSurah, repeatMode, nextAyah, playFullSurah]);

  // Keep ref updated
  useEffect(() => {
    handleAudioEndedRef.current = handleAudioEnded;
  }, [handleAudioEnded]);

  // Initialize HTML5 Audio instance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      handleAudioEndedRef.current();
    };

    const handleError = () => {
      setAudioError('تعذر تحميل الملف الصوتي، يرجى التحقق من اتصال الإنترنت.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Speed change
  const handleSetSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Seek
  const seekAudio = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Calculate audio progress percentage
  const audioProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Bookmarking
  const saveBookmark = (surahNumber: number, surahName: string, ayahNumber: number, pageNumber?: number, note?: string) => {
    const newBookmark: Bookmark = {
      id: `${surahNumber}_${ayahNumber}_${Date.now()}`,
      surahNumber,
      surahName,
      ayahNumber,
      pageNumber,
      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
      note
    };

    setLastRead(newBookmark);
    localStorage.setItem('dq_lastRead', JSON.stringify(newBookmark));

    setBookmarks(prev => {
      const filtered = prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber));
      const updated = [newBookmark, ...filtered];
      localStorage.setItem('dq_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('dq_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteAyah = (surahNumber: number, ayahNumber: number, text: string, surahName: string) => {
    setFavoriteAyahs(prev => {
      const exists = prev.some(item => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber);
      let updated;
      if (exists) {
        updated = prev.filter(item => !(item.surahNumber === surahNumber && item.ayahNumber === ayahNumber));
      } else {
        updated = [{ surahNumber, ayahNumber, text, surahName }, ...prev];
      }
      localStorage.setItem('dq_favAyahs', JSON.stringify(updated));
      return updated;
    });
  };

  const isAyahFavorite = (surahNumber: number, ayahNumber: number) => {
    return favoriteAyahs.some(item => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber);
  };

  // Masbaha Actions
  const incrementMasbaha = () => {
    setMasbahaCount(prev => {
      const next = prev + 1;
      localStorage.setItem('dq_masbaha_curr', String(next));
      return next;
    });

    setMasbahaTotalToday(prev => {
      const next = prev + 1;
      const todayKey = `dq_masbaha_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, String(next));
      return next;
    });

    setMasbahaTotalAll(prev => {
      const next = prev + 1;
      localStorage.setItem('dq_masbaha_all', String(next));
      return next;
    });

    if (soundEnabled) {
      playBeadClickSound();
    }

    if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const resetMasbahaCurrent = () => {
    setMasbahaCount(0);
    localStorage.setItem('dq_masbaha_curr', '0');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('dq_masbaha_sound', String(next));
      return next;
    });
  };

  const toggleVibration = () => {
    setVibrationEnabled(prev => {
      const next = !prev;
      localStorage.setItem('dq_masbaha_vib', String(next));
      return next;
    });
  };

  // Adhkar Counter
  const incrementDhikrProgress = (id: string, maxCount: number) => {
    setCompletedAdhkar(prev => {
      const current = prev[id] || 0;
      if (current >= maxCount) return prev;
      const next = current + 1;

      if (next === maxCount && typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60, 40, 60]);
      } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }

      return { ...prev, [id]: next };
    });
  };

  const resetDhikrCategory = (categoryId: string) => {
    setCompletedAdhkar(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (key.startsWith(categoryId.slice(0, 2))) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  // Prayer Times calculation
  const calculateNextPrayer = useCallback((timings: PrayerData['timings']) => {
    const prayerNames: (keyof PrayerData['timings'])[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const arabicNames: Record<string, string> = {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let next: { name: string; time: string; remainingMinutes: number } | null = null;

    for (const key of prayerNames) {
      const timeStr = timings[key];
      if (!timeStr) continue;
      const cleanTime = timeStr.split(' ')[0];
      const [h, m] = cleanTime.split(':').map(Number);
      const prayerMinutes = h * 60 + m;

      if (prayerMinutes > currentMinutes) {
        next = {
          name: arabicNames[key] || key,
          time: cleanTime,
          remainingMinutes: prayerMinutes - currentMinutes
        };
        break;
      }
    }

    if (!next && timings.Fajr) {
      const cleanTime = timings.Fajr.split(' ')[0];
      const [h, m] = cleanTime.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      const remaining = (24 * 60 - currentMinutes) + prayerMinutes;
      next = {
        name: 'الفجر (غداً)',
        time: cleanTime,
        remainingMinutes: remaining
      };
    }

    setNextPrayer(next);
  }, []);

  // Fetch prayer timings by city
  const fetchPrayersByCity = useCallback(async (city: string, country = 'Saudi Arabia') => {
    setLoadingPrayers(true);
    setPrayerError(null);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`);
      if (!res.ok) throw new Error('فشل جلب أوقات الصلاة');
      const data = await res.json();
      if (data && data.data) {
        const fetchedData: PrayerData = {
          timings: data.data.timings,
          date: data.data.date,
          city
        };
        setPrayerData(fetchedData);
        setUserCity(city);
        calculateNextPrayer(data.data.timings);
      }
    } catch {
      const fallbackData: PrayerData = {
        timings: {
          Fajr: '05:05',
          Sunrise: '06:22',
          Dhuhr: '12:18',
          Asr: '15:39',
          Maghrib: '18:14',
          Isha: '19:44'
        },
        date: {
          readable: new Date().toLocaleDateString('ar-SA'),
          hijri: {
            date: '1447-04-18',
            day: '18',
            weekday: { ar: 'السبت', en: 'Saturday' },
            month: { ar: 'ربيع الآخر', en: 'Rabi Al-Thani', number: 4 },
            year: '1447'
          },
          gregorian: {
            date: new Date().toLocaleDateString('en-US'),
            weekday: { en: 'Saturday' },
            month: { en: 'October', number: 10 },
            year: '2026'
          }
        },
        city: `${city} (تقريبي)`
      };
      setPrayerData(fallbackData);
      calculateNextPrayer(fallbackData.timings);
      setPrayerError('تعذر جلب أوقات الصلاة مباشرة من الخادم، يتم عرض مواقيت تقريبية.');
    } finally {
      setLoadingPrayers(false);
    }
  }, [calculateNextPrayer]);

  // Fetch prayer timings by geolocation
  const fetchPrayersByLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      fetchPrayersByCity('مكة المكرمة');
      return;
    }

    setLoadingPrayers(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
          if (!res.ok) throw new Error('فشل جلب أوقات الصلاة');
          const data = await res.json();
          if (data && data.data) {
            const fetchedData: PrayerData = {
              timings: data.data.timings,
              date: data.data.date,
              city: 'موقعي الحالي'
            };
            setPrayerData(fetchedData);
            setUserCity('موقعي الحالي');
            calculateNextPrayer(data.data.timings);
          }
        } catch {
          fetchPrayersByCity('مكة المكرمة');
        } finally {
          setLoadingPrayers(false);
        }
      },
      () => {
        fetchPrayersByCity('مكة المكرمة');
      },
      { timeout: 7000 }
    );
  }, [calculateNextPrayer, fetchPrayersByCity]);

  // Initial prayer timings fetch on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrayersByLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchPrayersByLocation]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        fontSize,
        setFontSize: updateFontSize,
        fontFamily,
        setFontFamily: updateFontFamily,
        quranViewMode,
        setQuranViewMode: updateQuranViewMode,
        activeSurahNumber,
        activeSurahAyahTarget,
        activePageNumber,
        openSurah,
        closeSurah,
        goToNextSurah,
        goToPrevSurah,
        setActivePageNumber,
        isPlaying,
        currentReciter,
        setCurrentReciter: handleSetReciter,
        currentAudioAyah,
        activeRadio,
        playRadio,
        stopRadio,
        isFullSurahMode,
        currentFullSurah,
        playFullSurah,
        playbackSpeed,
        setPlaybackSpeed: handleSetSpeed,
        repeatMode,
        setRepeatMode,
        currentTime,
        duration,
        audioProgress,
        audioError,
        playAyah,
        togglePlay,
        pauseAudio,
        nextAyah,
        prevAyah,
        seekAudio,
        bookmarks,
        lastRead,
        saveBookmark,
        removeBookmark,
        favoriteAyahs,
        toggleFavoriteAyah,
        isAyahFavorite,
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
        completedAdhkar,
        incrementDhikrProgress,
        resetDhikrCategory,
        prayerData,
        loadingPrayers,
        prayerError,
        userCity,
        nextPrayer,
        fetchPrayersByLocation,
        fetchPrayersByCity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
