import { Reciter } from '@/types';

export const RECITERS_LIST: Reciter[] = [
  {
    id: 'ar.alafasy',
    name: 'مشاري بن راشد العفاسي',
    englishName: 'Mishary Rashid Alafasy',
    folder: 'Alafasy_128kbps',
    server: 'afs',
    surahServerUrl: 'https://server8.mp3quran.net/afs'
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'عبد الرحمن السديس',
    englishName: 'Abdurrahman As-Sudais',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    server: 'sds',
    surahServerUrl: 'https://server11.mp3quran.net/sds'
  },
  {
    id: 'ar.minshawi',
    name: 'محمد صديق المنشاوي (مرتل)',
    englishName: 'Mohamed Siddiq Al-Minshawi',
    folder: 'Minshawy_Murattal_128kbps',
    server: 'minsh',
    surahServerUrl: 'https://server10.mp3quran.net/minsh'
  },
  {
    id: 'ar.husary',
    name: 'محمود خليل الحصري',
    englishName: 'Mahmoud Khalil Al-Husary',
    folder: 'Husary_128kbps',
    server: 'husr',
    surahServerUrl: 'https://server13.mp3quran.net/husr'
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'ماهر بن حمد المعيقلي',
    englishName: 'Maher Al-Muaiqly',
    folder: 'Maher_AlMuaiqly_64kbps',
    server: 'maher',
    surahServerUrl: 'https://server12.mp3quran.net/maher'
  }
];

export const DEFAULT_RECITER = RECITERS_LIST[0]; // Mishary Alafasy

/**
 * Builds the URL for an individual Ayah audio from everyayah.com
 * Formats surah as 3-digit and ayah as 3-digit (e.g. 001001.mp3)
 */
export function getAyahAudioUrl(reciterFolder: string, surahNumber: number, ayahNumberInSurah: number): string {
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumberInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${reciterFolder}/${sStr}${aStr}.mp3`;
}

/**
 * Builds the URL for full surah audio from mp3quran
 */
export function getSurahAudioUrl(reciterSurahUrl: string, surahNumber: number): string {
  const sStr = String(surahNumber).padStart(3, '0');
  return `${reciterSurahUrl}/${sStr}.mp3`;
}
