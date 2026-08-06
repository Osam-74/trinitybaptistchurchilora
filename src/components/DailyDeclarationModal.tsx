"use client";

import { useState, useEffect } from "react";
import type { PastorDeclaration } from "@/types/declaration";
import { DEFAULT_PASTOR_IMAGE, getLatestDeclaration, incrementAmen } from "@/lib/declarations";

interface Props {
  onClose: () => void;
}

export default function DailyDeclarationModal({ onClose }: Props) {
  const [declaration, setDeclaration] = useState<PastorDeclaration | null>(null);
  const [amenCount, setAmenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hasAmened, setHasAmened] = useState(false);
  const [amenPulse, setAmenPulse] = useState(false);

  useEffect(() => {
    getLatestDeclaration()
      .then((d: PastorDeclaration | null) => {
        setDeclaration(d);
        if (d) {
          setAmenCount(d.amenCount || 0);
          setTimeout(() => setVisible(true), 300);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[DailyDeclaration] Failed to load:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAmen = async () => {
    if (hasAmened) return;
    setHasAmened(true);
    setAmenPulse(true);
    setAmenCount((c) => c + 1);
    if (declaration) {
      incrementAmen(declaration.id).catch(() => {});
    }
    setTimeout(() => setAmenPulse(false), 600);
    setTimeout(() => handleClose(), 1200);
  };

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/?declaration=true` : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pastor's Daily Declaration — Trinity Baptist Church Ilora", text: declaration?.text?.split("\n")[0] || "Today's declaration", url: shareLink });
      } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareLink); alert("Link copied!"); } catch {}
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(11, 44, 34, 0.85)", backdropFilter: "blur(8px)" }}>
        <div className="w-10 h-10 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!declaration) return null;

  const imageUrl = declaration.imageUrl || DEFAULT_PASTOR_IMAGE;

  // Reusable Amen button — reduced to half size, click-pointer icon pulsing on top
  const AmenButton = ({ compact }: { compact?: boolean }) => (
    <div className="relative inline-flex items-center">
      {/* Click pointer icon — sits ON TOP of the button, pulsing, points to it */}
      {!hasAmened && (
        <img
          src="/icons/click-pointer.png"
          alt=""
          aria-hidden="true"
          className="amen-pointer-anim absolute pointer-events-none select-none"
          style={{
            width: compact ? 42 : 48,
            height: compact ? 42 : 48,
            top: compact ? -8 : -10,
            right: compact ? -10 : -12,
            zIndex: 10,
            filter: "brightness(0) invert(1)",
          }}
        />
      )}
      <button
        onClick={handleAmen}
        disabled={hasAmened}
        className={`flex items-center gap-1.5 bg-[#C8E63A] text-[#0D4A35] font-bold rounded-lg transition-all ${compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} ${amenPulse ? "scale-110 shadow-[0_0_16px_rgba(200,230,58,0.7)]" : "shadow-md"} ${hasAmened ? "opacity-90 cursor-default" : "amen-glow-anim hover:-translate-y-0.5"}`}
      >
        <span>Amen</span>
        <span className={`flex items-center justify-center rounded-full bg-[#0D4A35] text-[#C8E63A] font-bold transition-all ${compact ? "min-w-[16px] h-[14px] text-[9px] px-1" : "min-w-[18px] h-[16px] text-[10px] px-1"} ${amenPulse ? "scale-125" : ""}`}>
          {amenCount > 999 ? `${(amenCount / 1000).toFixed(1)}K` : amenCount}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes amen-pointer-pulse {
          0%, 100% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.55; transform: translateY(3px) scale(0.92); }
        }
        .amen-pointer-anim {
          animation: amen-pointer-pulse 1.1s ease-in-out infinite;
        }
        @keyframes amen-glow {
          0%, 100% { box-shadow: 0 0 6px rgba(200,230,58,0.3); }
          50% { box-shadow: 0 0 16px rgba(200,230,58,0.65); }
        }
        .amen-glow-anim {
          animation: amen-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(11, 44, 34, 0.85)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <div
          className={`relative w-full max-w-5xl rounded-3xl shadow-2xl transition-all duration-500 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}
          style={{ background: "#0D4A35", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        >
          {/* Close button */}
          <button onClick={handleClose} className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group" aria-label="Close">
            <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Two-column layout — flex, not grid, to avoid overflow issues */}
          <div className="flex flex-col md:flex-row" style={{ maxHeight: "90vh", overflow: "hidden" }}>
            {/* LEFT: Pastor Image */}
            <div className="relative flex-shrink-0 h-48 md:h-auto md:w-2/5 overflow-hidden">
              <img src={imageUrl} alt="Pastor's Daily Declaration" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D4A35]/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0D4A35]/20" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8E63A] animate-pulse" />
                  <span className="text-[#C8E63A] text-xs font-bold uppercase tracking-wider">Daily Declaration</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Prayer text */}
            <div className="relative flex-1 p-6 md:p-10 overflow-y-auto" style={{ maxHeight: "90vh" }}>
              {/* Header — mobile: Amen button sits on the same line as the "Pastor's Prayer" label, right under the image */}
              <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[#C8E63A] text-xs font-bold uppercase tracking-widest">Pastor's Prayer</p>
                  {/* Mobile-only Amen button — same line as label, right-aligned, right under image */}
                  <div className="md:hidden">
                    <AmenButton compact />
                  </div>
                </div>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold leading-tight mt-2">My Prayer for You Today</h2>
                <div className="w-16 h-0.5 bg-[#C8E63A]/40 mt-3" />
              </div>

              {/* Prayer text */}
              <div className="space-y-3">
                {declaration.text.split("\n").map((line: string, i: number) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={i} className="h-2" />;
                  if (i === 0 && trimmed.toLowerCase().startsWith("my prayer")) {
                    return <p key={i} className="font-serif text-base md:text-lg text-[#C8E63A] font-semibold">{trimmed}</p>;
                  }
                  if (trimmed.toUpperCase() === trimmed && trimmed.length > 5) {
                    return <p key={i} className="text-white/60 text-xs font-bold uppercase tracking-wider pt-1">{trimmed}</p>;
                  }
                  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
                    return <p key={i} className="text-white/40 text-xs italic">{trimmed}</p>;
                  }
                  return <p key={i} className="text-white/90 text-sm md:text-base leading-relaxed font-sans">{trimmed}</p>;
                })}
              </div>

              {/* Spacer so text doesn't hide behind the floating desktop Amen button */}
              <div className="hidden md:block" style={{ height: hasAmened ? 20 : 70 }} />

              {/* Desktop/tablet — Amen button floats bottom-right of the text area (unchanged position) */}
              <div className="hidden md:flex absolute items-center gap-2 z-20" style={{ right: "1.5rem", bottom: "1.5rem" }}>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-white/50 hover:text-[#C8E63A] transition-colors text-xs font-medium mr-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                <AmenButton />
              </div>

              {/* Mobile — Share link sits quietly under the text, since Amen already moved to the top */}
              <div className="md:hidden mt-4 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-white/50 hover:text-[#C8E63A] transition-colors text-xs font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
