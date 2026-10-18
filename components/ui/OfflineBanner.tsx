'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside aria-label="حالة الاتصال" className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-600 text-white shadow-xl text-xs sm:text-sm animate-bounce">
      <div className="flex items-center gap-2">
        <WifiOff className="w-5 h-5 shrink-0" />
        <span>أنت غير متصل بالإنترنت. الأذكار والمصحف المحفوظ متاحان دون اتصال.</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 font-bold shrink-0 flex items-center gap-1"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>تحديث</span>
      </button>
    </aside>
  );
};
