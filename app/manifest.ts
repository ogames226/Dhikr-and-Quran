import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'ذكر وقرآن - بوابة القرآن والأذكار',
    short_name: 'ذكر وقرآن',
    description: 'تطبيق إسلامي شامل: القرآن الكريم تلاوة وتفسيراً، أوقات الصلاة الدقيقة، حصن المسلم للأذكار، والمسبحة الإلكترونية.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0F5C4D',
    theme_color: '#0F5C4D',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
