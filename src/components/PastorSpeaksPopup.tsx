'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getPastorSpeaks, PASTOR_DEFAULTS, PastorSpeak } from '@/lib/pastorSpeaks';

export default function PastorSpeaksPopup() {
  const pathname = usePathname();
  const [data, setData] = useState<PastorSpeak | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== '/') return;
    getPastorSpeaks().then(d => {
      if (d && d.active && d.message) {
        setData(d);
        setMounted(true);
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    }).catch(() => {});
  }, [pathname]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setMounted(false), 350);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, close]);

  if (!mounted) return null;

  const pastorImage = data?.pastorImageUrl || PASTOR_DEFAULTS.pastorImageUrl;
  const message = data?.message || '';

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Download: capture the actual rendered card using html2canvas
  const handleDownload = async () => {
    if (downloading || !cardRef.current) return;
    setDownloading(true);
    try {
      // Dynamically import html2canvas (avoids SSR issues)
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 2,            // 2× for crisp retina quality
        backgroundColor: null,
        logging: false,
        // Capture at exact rendered size — no stretching
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `pastors-word-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      }, 'image/png');

    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.62)',
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
        }}
        className="relative w-full max-w-lg"
      >
        {/* ── THE CARD — this exact element gets captured and downloaded ── */}
        <div
          ref={cardRef}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top gold accent */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

          {/* Dark green header */}
          <div className="bg-[#1B4332] px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Logo circle */}
              <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="/logo/trinity-logo.png"
                  alt="TBC"
                  className="w-full h-full object-contain p-0.5"
                  crossOrigin="anonymous"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-amber-300 text-[10px] font-bold uppercase tracking-[0.18em] leading-none">
                  A Word from Pastor&apos;s Desk
                </p>
                <p className="text-white/55 text-[9px] mt-0.5">Trinity Baptist Church, Ilora</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <p className="text-white/60 text-[9px] text-right leading-snug hidden sm:block">{dateStr}</p>
              {/* Close button — excluded from download via pointer-events but still rendered */}
              <button
                onClick={close}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
                data-html2canvas-ignore="true"
              >
                <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

          {/* Body */}
          <div className="px-6 pt-5 pb-5">
            {/* Open quote */}
            <svg className="w-9 h-9 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>

            {/* Message */}
            <p
              className="text-stone-800 italic leading-[1.82] mb-5"
              style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", fontSize: '1.05rem' }}
            >
              {message}
            </p>

            <div className="border-t border-stone-100 mb-4" />

            {/* Bottom row: pastor info + download button */}
            <div className="flex items-end justify-between gap-2">
              {/* Pastor */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200 bg-[#1B4332]">
                  <img
                    src={pastorImage}
                    alt="Pastor"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="font-bold text-[#1B4332] truncate"
                    style={{ fontFamily: "'Georgia', serif", fontSize: '0.78rem' }}
                  >
                    Rev. Dr S. O. Mosebolatan
                  </p>
                  <p className="text-stone-400 text-[10px] mt-0.5 tracking-wide">Senior Pastor</p>
                </div>
              </div>

              {/* Download button — ignored by html2canvas so it won't appear in the image */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                data-html2canvas-ignore="true"
                className="flex-shrink-0 flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-60 text-stone-700 text-[11px] font-semibold px-3 py-2 rounded-lg transition-colors"
                title="Download this card as an image"
              >
                {downloading ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                )}
                {downloading ? 'Saving…' : 'Download'}
              </button>
            </div>
          </div>

          {/* Bottom gold accent */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>
        {/* ── end card ── */}
      </div>
    </div>
  );
}
