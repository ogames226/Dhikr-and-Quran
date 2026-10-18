/**
 * MP3Quran.net API Client (v3)
 * Provides access to reciters, riwayat, audio servers, 24/7 live radios, live TV, and tafasir.
 * Documentation: https://www.mp3quran.net/ar/api
 */

export interface MP3QuranMoshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type?: number;
  rewaya_id?: number;
  surah_list: string;
}

export interface MP3QuranReciter {
  id: number;
  name: string;
  letter: string;
  moshaf: MP3QuranMoshaf[];
}

export interface MP3QuranRadio {
  id: number;
  name: string;
  url: string;
}

export interface MP3QuranLiveTV {
  id: number;
  name: string;
  url: string;
}

export interface MP3QuranRiwaya {
  id: number;
  name: string;
}

export interface MP3QuranTafsir {
  id: number;
  name: string;
  url: string;
}

const BASE_URL = 'https://www.mp3quran.net/api/v3';

/**
 * Fetch all reciters from MP3Quran with their servers and surah lists
 */
export async function getMP3QuranReciters(language = 'ar'): Promise<MP3QuranReciter[]> {
  try {
    const res = await fetch(`${BASE_URL}/reciters?language=${language}`, {
      next: { revalidate: 86400 } // cache for 24h
    });
    if (!res.ok) throw new Error('فشل جلب القراء من MP3Quran');
    const data = await res.json();
    return data.reciters || [];
  } catch (err) {
    console.warn('Failed to fetch MP3Quran reciters:', err);
    return [];
  }
}

/**
 * Fetch all live 24/7 Quran Radios from MP3Quran
 */
export async function getMP3QuranRadios(language = 'ar'): Promise<MP3QuranRadio[]> {
  try {
    const res = await fetch(`${BASE_URL}/radios?language=${language}`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('فشل جلب الإذاعات من MP3Quran');
    const data = await res.json();
    return data.radios || [];
  } catch (err) {
    console.warn('Failed to fetch MP3Quran radios:', err);
    return [];
  }
}

/**
 * Fetch Live TV channels (Makkah & Madinah) from MP3Quran
 */
export async function getMP3QuranLiveTV(language = 'ar'): Promise<MP3QuranLiveTV[]> {
  try {
    const res = await fetch(`${BASE_URL}/live-tv?language=${language}`);
    if (!res.ok) throw new Error('فشل جلب البث المباشر من MP3Quran');
    const data = await res.json();
    return data.livetv || [];
  } catch (err) {
    console.warn('Failed to fetch MP3Quran live TV:', err);
    return [];
  }
}

/**
 * Fetch available Riwayat (narrations)
 */
export async function getMP3QuranRiwayat(language = 'ar'): Promise<MP3QuranRiwaya[]> {
  try {
    const res = await fetch(`${BASE_URL}/riwayat?language=${language}`);
    if (!res.ok) throw new Error('فشل جلب الروايات');
    const data = await res.json();
    return data.riwayat || [];
  } catch (err) {
    console.warn('Failed to fetch riwayat:', err);
    return [];
  }
}

/**
 * Helper to construct the audio URL for a surah on MP3Quran CDN
 */
export function getMP3QuranSurahUrl(serverUrl: string, surahNumber: number): string {
  // Ensure serverUrl ends with a slash
  const base = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`;
  const sStr = String(surahNumber).padStart(3, '0');
  return `${base}${sStr}.mp3`;
}
