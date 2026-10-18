// Types for "ذكر وقرآن"

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  page: number;
  juz: number;
}

export interface Ayah {
  number: number;          // Global ayah number (1 to 6236)
  numberInSurah: number;  // 1 to N
  text: string;
  audio?: string;
  page?: number;
  juz?: number;
  sajda?: boolean;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  folder: string; // EveryAyah folder name
  server?: string; // mp3quran server if full surah
  surahServerUrl?: string; // Base url for full surah audio
}

export interface DhikrItem {
  id: string;
  category: string;
  text: string;
  count: number;
  benefit: string;
  source: string;
}

export interface DhikrCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  items: DhikrItem[];
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      weekday: { ar: string; en: string };
      month: { ar: string; en: string; number: number };
      year: string;
    };
    gregorian: {
      date: string;
      weekday: { en: string };
      month: { en: string; number: number };
      year: string;
    };
  };
  city?: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  pageNumber?: number;
  date: string;
  note?: string;
}

export type TabType = 'home' | 'quran' | 'radios' | 'adhkar' | 'masbaha' | 'settings';
