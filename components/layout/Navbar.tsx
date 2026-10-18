'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TabType } from '@/types';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { 
  BookOpen, 
  Home, 
  Sparkles, 
  CircleDot, 
  Settings, 
  Moon, 
  Sun, 
  Bookmark,
  Volume2,
  Radio
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    isPlaying, 
    lastRead, 
    openSurah 
  } = useApp();

  const navLinks: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'quran', label: 'القرآن الكريم', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'radios', label: 'الإذاعات والبث', icon: <Radio className="w-4 h-4" /> },
    { id: 'adhkar', label: 'الأذكار', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'masbaha', label: 'المسبحة', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'settings', label: 'الإعدادات والمفضلة', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF8F1]/90 dark:bg-[#081714]/90 backdrop-blur-md border-b border-[#0F5C4D]/10 dark:border-[#C9A227]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5C4D] to-[#0A3D33] p-0.5 shadow-md group-hover:shadow-[#C9A227]/20 transition-all flex items-center justify-center border border-[#C9A227]/40">
            {/* Embedded Mini Islamic emblem */}
            <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#C9A227]">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.6"/>
              <path d="M50,22 Q65,15 80,24 Q80,55 50,68 Q20,55 20,24 Q35,15 50,22 Z" fill="currentColor" opacity="0.9"/>
              <path d="M42,32 L58,32 M40,40 L60,40 M44,48 L56,48" stroke="#0F5C4D" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-[#0F5C4D] dark:text-[#C9A227] tracking-tight">
                ذِكْـرٌ وَقُـرْآن
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C9A227]/15 text-[#C9A227] font-bold border border-[#C9A227]/30">
                1447هـ
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              المصحف الشريف • أذكار حصن المسلم • أوقات الصلاة
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'text-white bg-[#0F5C4D] shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#0F5C4D] dark:hover:text-[#C9A227] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C9A227] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (Audio Indicator, Last Read Quick Button, PWA, Theme) */}
        <div className="flex items-center gap-2">
          {/* Quick Last Read jump button */}
          {lastRead && (
            <button
              onClick={() => openSurah(lastRead.surahNumber, lastRead.ayahNumber, lastRead.pageNumber)}
              title={`مواصلة القراءة: سورة ${lastRead.surahName} الآية ${lastRead.ayahNumber}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/25 hover:bg-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#6adbc3] text-xs font-semibold border border-[#0F5C4D]/20 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current text-[#C9A227]" />
              <span>متابعة: {lastRead.surahName}</span>
            </button>
          )}

          {/* Audio Active Playing Pulse Indicator */}
          {isPlaying && (
            <div 
              onClick={() => setActiveTab('quran')}
              title="التلاوة جارية - اضغط للذهاب للمصحف"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F5C4D] text-[#C9A227] text-xs font-bold cursor-pointer animate-pulse shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">صوت جارٍ</span>
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-[#C9A227] h-2 animate-bounce rounded-full" />
                <span className="w-1 bg-[#C9A227] h-3 animate-bounce [animation-delay:0.2s] rounded-full" />
                <span className="w-1 bg-[#C9A227] h-1.5 animate-bounce [animation-delay:0.4s] rounded-full" />
              </span>
            </div>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton variant="button" />

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="تبديل المظهر النهاري والليلي"
            title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95 border border-transparent hover:border-[#C9A227]/30"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#C9A227]" />
            ) : (
              <Moon className="w-5 h-5 text-[#0F5C4D]" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
