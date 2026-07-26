'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { toPng } from 'html-to-image';
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

  /**
   * Download the exact popup card as a PNG.
   * Uses html-to-image's toPng directly on the live card node.
   * The card is styled with inline styles (not Tailwind classes) so the
   * captured image matches the on-screen popup pixel-for-pixel.
   * Interactive elements (close + download buttons) are tagged
   * data-no-capture and filtered out of the image.
   */
  const handleDownload = async () => {
    if (downloading || !cardRef.current) return;
    setDownloading(true);
    try {
      // Square corners in the downloaded image (rounded corners leave white gaps
      // outside the curve). The popup keeps its rounded look on the website.
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,        // crisp output
        cacheBust: true,       // force fresh image fetches (logo, pastor photo)
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0',
          overflow: 'visible',
        },
        filter: (node: Node) => {
          if (node === cardRef.current) return true;
          if (node instanceof HTMLElement) return !node.closest('[data-no-capture]');
          return true;
        },
      });
      const link = document.createElement('a');
      link.download = `pastors-desk-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: lower pixel ratio
      try {
        const dataUrl = await toPng(cardRef.current!, {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: { borderRadius: '0', overflow: 'visible' },
        });
        const link = document.createElement('a');
        link.download = `pastors-desk-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e2) {
        console.error('Fallback failed:', e2);
        alert('Download failed on this device. Please take a screenshot instead.');
      }
    } finally {
      setDownloading(false);
    }
  };

  // ── Shared inline style helpers (kept here so the captured DOM is self-contained) ──
  const CARD_WIDTH = 420;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.62)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
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
        className="relative w-full"
      >
        {/* ── CARD — inline-styled so the downloaded PNG matches exactly ── */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            maxWidth: CARD_WIDTH,
            margin: '0 auto',
            borderRadius: 24,
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          }}
        >
          {/* Top gold accent */}
          <div style={{ height: 4, background: 'linear-gradient(to right, #f59e0b, #fde047, #f59e0b)' }} />

          {/* Dark green header */}
          <div style={{
            background: '#1B4332',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', flexShrink: 0,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src="/logo/trinity-logo.png" alt="TBC"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0, color: '#fcd34d', fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.18em', lineHeight: 1,
                }}>
                  Pastor&apos;s Desk
                </p>
                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: 9 }}>
                  Trinity Baptist Church, Ilora
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 9, textAlign: 'right', lineHeight: 1.3 }}>
                {dateStr}
              </p>
              {/* Close — excluded from capture */}
              <button onClick={close} data-no-capture
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Close">
                <svg width="14" height="14" style={{ color: 'rgba(255,255,255,0.8)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider line */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(252,211,77,0.5), transparent)' }} />

          {/* Body */}
          <div style={{ padding: '20px 24px' }}>
            {/* Open quote */}
            <svg width="36" height="36" style={{ color: '#fde68a', marginBottom: 8 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            {/* Message */}
            <p style={{
              margin: '0 0 20px', color: '#292524',
              fontStyle: 'italic', lineHeight: 1.82,
              fontFamily: "'Georgia', 'Palatino Linotype', serif",
              fontSize: 'calc(1.05rem - 5px)',
            }}>
              {message}
            </p>

            {/* Separator */}
            <div style={{ borderTop: '1px solid #f5f5f4', marginBottom: 16 }} />

            {/* Bottom row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              {/* Pastor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                  boxShadow: '0 0 0 2px #fde68a', background: '#1B4332',
                }}>
                  <img src={pastorImage} alt="Pastor"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontWeight: 700, color: '#1B4332',
                    fontFamily: "'Georgia', serif", fontSize: '0.78rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    Rev. Dr S. O. Mosebolatan
                  </p>
                  <p style={{ margin: '2px 0 0', color: '#a8a29e', fontSize: 10, letterSpacing: '0.04em' }}>
                    Senior Pastor
                  </p>
                </div>
              </div>

              {/* Download button — excluded from capture */}
              <button data-no-capture
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  background: '#f5f5f4', color: '#44403c', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600, padding: '8px 12px', borderRadius: 8,
                  opacity: downloading ? 0.6 : 1,
                }}
                title="Download this card as image"
              >
                {downloading ? (
                  <>
                    <svg width="14" height="14" className="animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom gold accent */}
          <div style={{ height: 2, background: 'linear-gradient(to right, transparent, #fcd34d, transparent)' }} />
        </div>
        {/* ── end card ── */}
      </div>
    </div>
  );
}
