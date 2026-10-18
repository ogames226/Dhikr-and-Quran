import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes and cleans Quranic verse text:
 * 1. Strips invisible control characters & BOM (\uFEFF, \u200B-\u200F)
 * 2. Cleans unrenderable or tofu-box-causing archaic Quranic Unicode glyphs
 *    (\u06DF-\u06ED) that appear as hollow boxes [ ] on mobile browsers
 * 3. Formats pause marks (\u06D6-\u06DC) with clean breathing spaces
 * 4. Preserves 100% authentic Tashkeel (harakat), tanween, and letters
 */
export function formatQuranAyahText(text: string): string {
  if (!text) return '';
  return text
    // Strip Byte Order Mark (BOM) & zero-width / bidirectional formatting marks
    .replace(/[\uFEFF\u200B-\u200F\u202A-\u202E]/g, '')
    // Remove archaic Unicode pause and annotation glyphs that lack mobile font support
    // \u06ED (small low meem), \u06DF (small rounded zero), \u06E0 (small rectangular zero),
    // \u06E2 (small high meem), \u06E3 (small low seen), \u06EA (empty low stop),
    // \u06EB (empty high stop), \u06EC (rounded high stop), \u06E8 (small high noon)
    .replace(/[\u06DF\u06E0\u06E2\u06E3\u06E5\u06E6\u06E8\u06EA\u06EB\u06EC\u06ED]/g, '')
    // Format authorized pause marks with elegant spacing: ۖ ۗ ۘ ۙ ۚ ۛ ۜ
    .replace(/\s*([\u06D6-\u06DC])\s*/g, ' $1 ')
    // Normalize excessive consecutive whitespaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Removes redundant Bismillah from the first verse of all surahs
 * (except Al-Fatiha #1, where it is verse 1, and At-Tawbah #9, which has no Bismillah).
 */
export function cleanAyahTextForDisplay(
  rawText: string,
  surahNumber: number,
  ayahNumberInSurah: number
): string {
  if (!rawText) return '';
  
  // Clean invisible characters first so regex anchors work reliably
  let cleaned = rawText.replace(/[\uFEFF\u200B-\u200F\u202A-\u202E]/g, '').trim();

  // If this is verse 1 of any surah other than Al-Fatiha (1), strip the opening Bismillah
  if (surahNumber !== 1 && ayahNumberInSurah === 1) {
    // Regex matching all common forms and encodings of Bismillah with full or partial tashkeel
    cleaned = cleaned.replace(
      /^(بِسْمِ\s+[ٱا]للَّ?هِ\s+ٱ?ل[رَّ|رَّ]حْمَٰ?نِ\s+ٱ?ل[رَّ|رَّ]حِيمِ|بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ|بِسْمِ\s+اللهِ\s+الرَّحْمٰنِ\s+الرَّحِيمِ|بِسْمِ\s+اللهِ\s+الرَّحْمَنِ\s+الرَّحِيمِ|بِسْمِ\s+[^\s]+\s+[^\s]+\s+[^\s]+)\s*/,
      ''
    ).trim();
  }

  return formatQuranAyahText(cleaned);
}
