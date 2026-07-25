'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getPastorSpeaks, PASTOR_DEFAULTS, PastorSpeak } from '@/lib/pastorSpeaks';

const SESSION_KEY = 'tbc_pastors_word_shown';

export default function PastorSpeaksPopup() {
  const pathname = usePathname();
  const [data, setData] = useState<PastorSpeak | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) return;
    getPastorSpeaks().then(d => {
      if (d && d.active && d.message) {
        setData(d);
        setMounted(true);
        const timer = setTimeout(() => setVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }).catch(() => {/* silent */});
  }, [pathname]);

  const close = useCallback(() => {
    setVisible(false);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, '1');
    }
    setTimeout(() => setMounted(false), 350);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, close]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transform: visible ? 'scale(1)' : 'scale(0.92)',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-5 pb-6">
          {/* Label */}
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">Pastor&apos;s Word</p>

          {/* Decorative quote */}
          <svg className="w-8 h-8 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>

          {/* Message */}
          <p className="font-serif text-base text-stone-800 leading-relaxed italic mb-6">
            {data?.message}
          </p>

          {/* Pastor info */}
          <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
            <img
              src={data?.pastorImageUrl || PASTOR_DEFAULTS.pastorImageUrl}
              alt={data?.pastorName || PASTOR_DEFAULTS.pastorName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-amber-200"
            />
            <p className="font-semibold text-sm text-stone-800">{data?.pastorName || PASTOR_DEFAULTS.pastorName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
