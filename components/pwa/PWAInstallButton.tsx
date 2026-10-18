'use client';

import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Share2, X, Smartphone, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'button' | 'card' }> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled || justInstalled) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0F5C4D]/10 dark:bg-[#0F5C4D]/20 border border-[#0F5C4D]/20 text-[#0F5C4D] dark:text-[#52c3ab]">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <div className="font-bold text-sm">التطبيق مثبت على جهازك</div>
            <div className="text-xs opacity-80">يمكنك فتحه مباشرة من الشاشة الرئيسية بدون متصفح.</div>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) setJustInstalled(true);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction
      alert('لتثبيت التطبيق على جهازك، افتح قائمة خيارات المتصفح (⋮) واختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".');
    }
  };

  if (variant === 'card') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-l from-[#0F5C4D] to-[#0A3D33] text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
              <Smartphone className="w-5 h-5 text-[#C9A227]" />
              <span>تثبيت تطبيق «ذكر وقرآن»</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 max-w-md">
              ثبت التطبيق على هاتفك لتصفح الأذكار والمصحف الشريف بسرعة فائقة ودون الحاجة لمتصفح الإنترنت.
            </p>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#b58f1f] text-[#081714] font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت الآن</span>
          </button>
        </div>

        {/* Decorative circle */}
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[#C9A227]/10 pointer-events-none" />

        {/* iOS Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900 dark:text-white">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D221D] p-6 shadow-2xl border border-gray-100 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-[#0F5C4D] dark:text-[#C9A227]">
                  <Smartphone className="w-5 h-5" />
                  تثبيت التطبيق على آيفون وآيباد
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">1</span>
                  <p>
                    اضغط على زر المشاركة <Share2 className="w-4 h-4 inline mx-1 text-blue-500" /> في شريط متصفح Safari بالأسفل.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">2</span>
                  <p>
                    مرر لأسفل القائمة واضغط على خيار <strong>«إضافة إلى الشاشة الرئيسية»</strong> (Add to Home Screen).
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">3</span>
                  <p>
                    اضغط على زر <strong>«إضافة»</strong> (Add) بأعلى الزاوية وسيظهر التطبيق على شاشة هاتفك مباشرة!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0F5C4D] text-white font-bold text-sm hover:bg-[#0B463A] transition"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Small navbar button
  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="تثبيت التطبيق"
        title="تثبيت التطبيق على جهازك"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A227]/15 hover:bg-[#C9A227]/25 text-[#0F5C4D] dark:text-[#C9A227] border border-[#C9A227]/30 text-xs font-semibold transition-all active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">تثبيت التطبيق</span>
      </button>

      {/* iOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900 dark:text-white">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D221D] p-6 shadow-2xl border border-gray-100 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[#0F5C4D] dark:text-[#C9A227]">
                <Smartphone className="w-5 h-5" />
                تثبيت التطبيق على آيفون وآيباد
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">1</span>
                <p>
                  اضغط على زر المشاركة <Share2 className="w-4 h-4 inline mx-1 text-blue-500" /> في متصفح Safari.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">2</span>
                <p>
                  مرر لأسفل القائمة واضغط على <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#122A24]">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0F5C4D] text-white text-xs font-bold shrink-0">3</span>
                <p>
                  اضغط على زر <strong>«إضافة»</strong> بالأعلى ليصبح التطبيق متاحاً بجهازك!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F5C4D] text-white font-bold text-sm hover:bg-[#0B463A] transition"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
