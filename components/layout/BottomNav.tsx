'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TabType } from '@/types';
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  CircleDot, 
  Settings,
  Radio
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const items: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
    { id: 'quran', label: 'المصحف', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'radios', label: 'الإذاعات', icon: <Radio className="w-5 h-5" /> },
    { id: 'adhkar', label: 'الأذكار', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'masbaha', label: 'المسبحة', icon: <CircleDot className="w-5 h-5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav 
      aria-label="التنقل السفلي للهاتف"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF8F1]/95 dark:bg-[#081714]/95 backdrop-blur-lg border-t border-[#0F5C4D]/10 dark:border-[#C9A227]/20 pb-safe"
    >
      <div className="grid grid-cols-6 h-16">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive 
                  ? 'text-[#0F5C4D] dark:text-[#C9A227] font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#C9A227] rounded-full shadow-[0_0_8px_#C9A227]" />
              )}
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-medium leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
