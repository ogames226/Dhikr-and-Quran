export interface DailyAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  tafsir: string;
}

export interface DailyHadith {
  text: string;
  narrator: string;
  source: string;
  lesson: string;
}

export const DAILY_AYAHS: DailyAyah[] = [
  {
    surahNumber: 2,
    surahName: "البَقَرَة",
    ayahNumber: 152,
    text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    tafsir: "فضل الذكر عظيم؛ فمن ذكر ربه في قلبه ذكره الله في نفسه، ومن ذكره في ملأ ذكره في ملأ خير منهم وأكرم."
  },
  {
    surahNumber: 13,
    surahName: "الرَّعْد",
    ayahNumber: 28,
    text: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    tafsir: "حقيقة طمأنينة القلب وسكينته وزوال اضطرابه لا تكون إلا بالتعلق بالله وحسن ذكره ودوام مناجاته."
  },
  {
    surahNumber: 94,
    surahName: "الشَّرْح",
    ayahNumber: 5,
    text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    tafsir: "بشارة ربانية عظيمة بأن كل ضيق يعقبه فرجان، ولن يغلب عسر يسرين."
  },
  {
    surahNumber: 65,
    surahName: "الطَّلَاق",
    ayahNumber: 3,
    text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ",
    tafsir: "من فوض أموره كلها لله وتوكل عليه بصدق كفاه كل ما أهمه في معاشه ومعاده."
  },
  {
    surahNumber: 39,
    surahName: "الزُّمَر",
    ayahNumber: 53,
    text: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    tafsir: "أرجى آية في كتاب الله؛ باب التوبة مفتوح لكل عائد، ومغفرة الله أوسع من كل الخطايا."
  },
  {
    surahNumber: 2,
    surahName: "البَقَرَة",
    ayahNumber: 186,
    text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    tafsir: "قرب الله من عباده عند الدعاء بغير واسطة، ووعده الحق بإجابة السائلين المخلصين."
  }
];

export const DAILY_HADITHS: DailyHadith[] = [
  {
    text: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ.",
    narrator: "عن أبي موسى الأشعري رضي الله عنه",
    source: "صحيح البخاري (رقم 6407)",
    lesson: "الذكر حياة القلوب الحقيقية، والغفلة عنها تميت البصيرة والروح."
  },
  {
    text: "خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ.",
    narrator: "عن عثمان بن عفان رضي الله عنه",
    source: "صحيح البخاري (رقم 5027)",
    lesson: "أشرف العلوم وأعلاها منزلة عند الله هو الاشتغال بكتابه العزيز تلاوةً وتدبراً وتعليماً."
  },
  {
    text: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.",
    narrator: "عن عائشة أم المؤمنين رضي الله عنها",
    source: "صحيح مسلم (رقم 782)",
    lesson: "الاستمرار في الطاعات والأذكار اليومية ولو كانت يسيرة أحب إلى الله من الانقطاع."
  },
  {
    text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ.",
    narrator: "عن أبي هريرة رضي الله عنه",
    source: "صحيح البخاري (رقم 6406)",
    lesson: "يسر الدين وعظيم أجر الكلمات الطيبة في ميزان الحسنات يوم القيامة."
  },
  {
    text: "مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الجَنَّةِ.",
    narrator: "عن أبي هريرة رضي الله عنه",
    source: "صحيح مسلم (رقم 2699)",
    lesson: "فضل طلب العلم الشرعي والتفقه في الدين وقراءة القرآن والعمل به."
  }
];

export function getTodayAyah(): DailyAyah {
  // Use day of year to pick consistently for the day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
}

export function getTodayHadith(): DailyHadith {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_HADITHS[(dayOfYear + 2) % DAILY_HADITHS.length];
}
