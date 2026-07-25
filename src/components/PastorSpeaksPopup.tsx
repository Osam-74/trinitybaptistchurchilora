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
        const timer = setTimeout(() => setVisible(true), 2000);
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

  const pastorName = data?.pastorName || PASTOR_DEFAULTS.pastorName;
  const pastorImage = data?.pastorImageUrl || PASTOR_DEFAULTS.pastorImageUrl;
  const message = data?.message || '';

  const handleShare = () => {
    const text = `Pastor's Word 🕊️\n\n"${message}"\n\n— ${pastorName}\nSenior Pastor, Trinity Baptist Church, Ilora\n\nVisit: trinitybaptistchurchilora.org`;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.60)',
        backdropFilter: 'blur(5px)',
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
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Gold top accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

        {/* Dark green header */}
        <div className="bg-[#1B4332] px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-amber-300 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mb-0.5">
              A Word From The Pastor
            </p>
            <p className="text-white/50 text-[9px] tracking-wide">Trinity Baptist Church, Ilora</p>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-5">
          {/* Decorative open quote */}
          <svg className="w-9 h-9 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>

          {/* The Word — readable serif, good line-height */}
          <p
            className="text-stone-800 italic leading-[1.75] mb-6"
            style={{
              fontFamily: "'Georgia', 'Palatino Linotype', serif",
              fontSize: '1.0625rem', /* 17px – readable without being too big */
            }}
          >
            {message}
          </p>

          {/* Divider */}
          <div className="border-t border-stone-100 mb-4" />

          {/* Pastor info + Share button */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: photo + name block */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Pastor photo */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200">
                <img
                  src={pastorImage}
                  alt={pastorName}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    /* Fallback to a solid-colour monogram if image fails */
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = '#1B4332';
                      parent.style.display = 'flex';
                      parent.style.alignItems = 'center';
                      parent.style.justifyContent = 'center';
                      const span = document.createElement('span');
                      span.textContent = 'RM';
                      span.style.color = '#D4AF37';
                      span.style.fontWeight = 'bold';
                      span.style.fontSize = '12px';
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>

              {/* Name + title — forced onto own lines, never wrapping across lines */}
              <div className="min-w-0">
                {/* Full name on ONE line — whitespace-nowrap prevents break */}
                <p
                  className="font-bold text-[#1B4332] leading-tight whitespace-nowrap"
                  style={{ fontFamily: "'Georgia', serif", fontSize: '0.875rem' }}
                >
                  Rev. Dr S. O. Mosebolatan
                </p>
                {/* Title on its own line below */}
                <p className="text-stone-400 text-xs mt-0.5 tracking-wide">Senior Pastor</p>
              </div>
            </div>

            {/* Right: WhatsApp Share button — icon + "Share" only */}
            <button
              onClick={handleShare}
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              title="Share on WhatsApp"
            >
              {/* WhatsApp icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Bottom gold accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      </div>
    </div>
  );
}
