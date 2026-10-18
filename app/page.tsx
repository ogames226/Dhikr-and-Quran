'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingAudioPlayer } from '@/components/player/FloatingAudioPlayer';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { HomeView } from '@/components/home/HomeView';
import { QuranView } from '@/components/quran/QuranView';
import { RadiosView } from '@/components/radios/RadiosView';
import { AdhkarView } from '@/components/adhkar/AdhkarView';
import { MasbahaView } from '@/components/masbaha/MasbahaView';
import { SettingsView } from '@/components/settings/SettingsView';
import { Sparkles, Heart } from 'lucide-react';

export default function MainPage() {
  const { activeTab } = useApp();

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FBF8F1] dark:bg-[#081714] text-[#1B362F] dark:text-[#E2E8F0] relative">
      
      {/* Offline Status Alert */}
      <OfflineBanner />

      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'quran' && <QuranView />}
        {activeTab === 'radios' && <RadiosView />}
        {activeTab === 'adhkar' && <AdhkarView />}
        {activeTab === 'masbaha' && <MasbahaView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#0F5C4D]/10 dark:border-[#C9A227]/15 py-8 text-center text-xs text-gray-500 dark:text-gray-400 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-[#0F5C4D] dark:text-[#C9A227] text-sm">
            <Sparkles className="w-4 h-4" />
            <span>ذِكْـرٌ وَقُـرْآن — صَدَقَةٌ جَارِيَة</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
            اللهم اجعل القرآن العظيم ربيع قلوبنا، ونور صدورنا، وجلاء أحزاننا، وذهاب همومنا وغمومنا.
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
            <span>تم تطويره بحب</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>ليكون رفيق كل مسلم في عبادته اليومية.</span>
          </div>
        </div>
      </footer>

      {/* Global Floating Audio Player (Persists across all tabs) */}
      <FloatingAudioPlayer />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

    </div>
  );
}
