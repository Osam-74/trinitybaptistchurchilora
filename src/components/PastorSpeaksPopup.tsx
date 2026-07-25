'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getPastorSpeaks, PASTOR_DEFAULTS, PastorSpeak } from '@/lib/pastorSpeaks';

export default function PastorSpeaksPopup() {
  const pathname = usePathname();
  const [data, setData] = useState<PastorSpeak | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    // Show on EVERY homepage load — no session storage check
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

  // Download the card as a canvas image, then open WhatsApp
  const handleShare = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const W = 900;
      const H = 520;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // White background with rounded feel (clipped)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Top gold bar
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#D97706');
      grad.addColorStop(0.5, '#FDE68A');
      grad.addColorStop(1, '#D97706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, 8);

      // Dark green header
      ctx.fillStyle = '#1B4332';
      ctx.fillRect(0, 8, W, 80);

      // Header text
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 16px "Arial", sans-serif';
      ctx.fillText("A WORD FROM PASTOR'S DESK", 80, 38);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '12px "Arial", sans-serif';
      ctx.fillText('Trinity Baptist Church, Ilora', 80, 58);

      // Date on right
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = '11px "Arial", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(dateStr, W - 30, 48);
      ctx.textAlign = 'left';

      // Thin gold divider
      ctx.fillStyle = 'rgba(253,230,138,0.4)';
      ctx.fillRect(0, 88, W, 1);

      // Open quote mark
      ctx.fillStyle = 'rgba(253,230,138,0.6)';
      ctx.font = 'bold 100px "Georgia", serif';
      ctx.fillText('\u201C', 28, 190);

      // Message text — wrap
      ctx.fillStyle = '#1c1917';
      ctx.font = 'italic 22px "Georgia", serif';
      ctx.textAlign = 'center';
      const words = message.split(' ');
      let line = '';
      let y = 165;
      const maxW = 720;
      for (const w of words) {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line.trim(), W / 2, y);
          line = w + ' ';
          y += 36;
          if (y > 360) { ctx.fillText('…', W / 2, y); break; }
        } else { line = test; }
      }
      if (line.trim()) ctx.fillText(line.trim(), W / 2, y);
      ctx.textAlign = 'left';

      // Bottom divider
      ctx.strokeStyle = '#e7e5e4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, H - 100);
      ctx.lineTo(W - 40, H - 100);
      ctx.stroke();

      // Try to draw pastor photo
      const drawText = () => {
        ctx.fillStyle = '#1B4332';
        ctx.font = 'bold 15px "Georgia", serif';
        ctx.fillText('Rev. Dr S. O. Mosebolatan', 130, H - 66);
        ctx.fillStyle = '#78716c';
        ctx.font = '12px "Arial", sans-serif';
        ctx.fillText('Senior Pastor, Trinity Baptist Church, Ilora', 130, H - 46);
        // Watermark
        ctx.fillStyle = 'rgba(27,67,50,0.35)';
        ctx.font = '11px "Arial", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('trinitybaptistchurchilora.org', W - 30, H - 15);
        ctx.textAlign = 'left';
        // Gold bottom bar
        const grad2 = ctx.createLinearGradient(0, 0, W, 0);
        grad2.addColorStop(0, 'transparent');
        grad2.addColorStop(0.5, '#FDE68A');
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, H - 4, W, 4);
      };

      // Try loading pastor photo
      try {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(78, H - 62, 34, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 44, H - 96, 68, 68);
            ctx.restore();
            resolve();
          };
          img.onerror = () => {
            // Draw green circle placeholder
            ctx.beginPath();
            ctx.arc(78, H - 62, 34, 0, Math.PI * 2);
            ctx.fillStyle = '#1B4332';
            ctx.fill();
            resolve();
          };
          img.src = pastorImage;
          setTimeout(() => resolve(), 1500);
        });
      } catch { /* skip photo */ }

      drawText();

      // Download — mobile-safe: convert to Blob URL first
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

      // Open WhatsApp after short delay (so download triggers first)
      setTimeout(() => {
        const text = `From the Pastor's Desk\nTrinity Baptist Church, Ilora\nRev. Dr S. O. Mosebolatan`;
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
      }, 800);
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
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top gold accent */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

        {/* Dark green header */}
        <div className="bg-[#1B4332] px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/logo/trinity-logo.png" alt="TBC"
                className="w-full h-full object-contain p-0.5"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-amber-300 text-[10px] font-bold uppercase tracking-[0.18em] leading-none truncate">
                A Word from Pastor&apos;s Desk
              </p>
              <p className="text-white/55 text-[9px] mt-0.5 truncate">Trinity Baptist Church, Ilora</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="text-white/60 text-[9px] text-right leading-snug hidden sm:block">{dateStr}</p>
            <button onClick={close}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close">
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
          <p className="text-stone-800 italic leading-[1.82] mb-5"
            style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", fontSize: '1.05rem' }}>
            {message}
          </p>

          <div className="border-t border-stone-100 mb-4" />

          {/* Bottom: pastor row + WhatsApp btn shifted down */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200 bg-[#1B4332]">
                <img src={pastorImage} alt="Pastor"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="min-w-0">
                {/* Full name on ONE line */}
                <p className="font-bold text-[#1B4332] truncate"
                  style={{ fontFamily: "'Georgia', serif", fontSize: '0.78rem' }}>
                  Rev. Dr S. O. Mosebolatan
                </p>
                <p className="text-stone-400 text-[10px] mt-0.5 tracking-wide">Senior Pastor</p>
              </div>
            </div>

            {/* WhatsApp Share — smaller, shifted down 20px to stay clear of pastor name */}
            <button onClick={handleShare} disabled={downloading}
              className="flex-shrink-0 flex items-center gap-1 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ marginTop: '20px' }}
              title="Download card &amp; Share on WhatsApp">
              {downloading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      </div>
    </div>
  );
}
