import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const viewport: Viewport = {
  themeColor: '#0F5C4D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'ذكر وقرآن | المصحف الشريف وأذكار المسلم وأوقات الصلاة',
  description: 'تطبيق وموقع إسلامي شامل: القرآن الكريم كاملاً برسم المصحف والتلاوة العذبة، أوقات الصلاة الدقيقة حسب موقعك، أذكار حصن المسلم مع عدادات تفاعلية، والمسبحة الإلكترونية.',
  keywords: [
    'القرآن الكريم',
    'أذكار المسلم',
    'حصن المسلم',
    'أوقات الصلاة',
    'مسبحة إلكترونية',
    'تلاوة القرآن',
    'مشاري العفاسي',
    'السديس',
    'المنشاوي',
    'أذكار الصباح والمساء'
  ],
  authors: [{ name: 'ذكر وقرآن' }],
  openGraph: {
    title: 'ذكر وقرآن | المصحف الشريف وأذكار المسلم وأوقات الصلاة',
    description: 'تطبيق وموقع إسلامي شامل: القرآن الكريم كاملاً برسم المصحف والتلاوة العذبة، أوقات الصلاة، وأذكار حصن المسلم.',
    type: 'website',
    locale: 'ar_AR',
    siteName: 'ذكر وقرآن',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ذكر وقرآن | المصحف الشريف وأذكار المسلم وأوقات الصلاة',
    description: 'تطبيق إسلامي شامل للقرآن الكريم، أذكار حصن المسلم، أوقات الصلاة والمسبحة.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ذكر وقرآن',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen bg-[#FBF8F1] dark:bg-[#081714] text-[#1B362F] dark:text-[#E2E8F0] selection:bg-[#C9A227]/30 transition-colors duration-200">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
