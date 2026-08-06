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

  return (
    <>
      <style>{`
        @keyframes amen-finger-blink {
          0%, 100% { opacity: 1; transform: translateX(0) scale(1); }
          45% { opacity: 0.2; transform: translateX(-6px) scale(0.9); }
          55% { opacity: 0.2; transform: translateX(-6px) scale(0.9); }
        }
        .amen-finger-anim {
          animation: amen-finger-blink 1.2s ease-in-out infinite;
        }
        @keyframes amen-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(200,230,58,0.3); }
          50% { box-shadow: 0 0 25px rgba(200,230,58,0.7); }
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

            {/* RIGHT: Prayer text — Amen button floats inside this */}
            <div className="relative flex-1 p-6 md:p-10 overflow-y-auto" style={{ maxHeight: "90vh" }}>
              {/* Header */}
              <div className="mb-4">
                <p className="text-[#C8E63A] text-xs font-bold uppercase tracking-widest mb-2">Pastor's Prayer</p>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold leading-tight">My Prayer for You Today</h2>
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

              {/* Spacer so text doesn't hide behind the floating Amen button */}
              <div style={{ height: hasAmened ? 20 : 80 }} className="transition-all" />

              {/* ── FLOATING AMEN BUTTON — absolute positioned, right side, in front of text ── */}
              <div
                className="absolute flex items-center gap-2 z-20"
                style={{
                  right: "1.5rem",
                  bottom: "1.5rem",
                }}
              >
                {/* Share button — subtle */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-white/50 hover:text-[#C8E63A] transition-colors text-xs font-medium mr-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>

                {/* Blinking pointing finger — disappears after Amen */}
                {!hasAmened && (
                  <div className="amen-finger-anim flex items-center" aria-hidden="true">
                    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Pointing hand — index finger pointing right */}
                      <path
                        d="M6 18c0-2 1.5-3.5 3.5-3.5h14l-2.5-4c-1-1.5.3-3.5 2-3.5 1 0 2 .5 2.5 1.3l6 7c1 1.2 1.5 2.7 1.5 4.2v10c0 3.3-2.7 6-6 6H17c-1.7 0-3.3-.9-4.2-2.3l-5.2-8C7.2 23.5 7 22.8 7 22v-1.5z"
                        fill="#C8E63A"
                      />
                      {/* Fingernail highlight */}
                      <ellipse cx="24" cy="14" rx="1.5" ry="1" fill="#E8FF7A" opacity="0.6" />
                    </svg>
                  </div>
                )}

                {/* Amen counter button */}
                <button
                  onClick={handleAmen}
                  disabled={hasAmened}
                  className={`flex items-center gap-2.5 bg-[#C8E63A] text-[#0D4A35] font-bold px-5 py-3 rounded-xl text-sm transition-all ${amenPulse ? "scale-110 shadow-[0_0_24px_rgba(200,230,58,0.7)]" : "shadow-lg"} ${hasAmened ? "opacity-90 cursor-default" : "amen-glow-anim hover:-translate-y-0.5"} `}
                >
                  <span>Amen</span>
                  <span className={`flex items-center justify-center min-w-[28px] h-[22px] px-1.5 rounded-full bg-[#0D4A35] text-[#C8E63A] text-xs font-bold transition-all ${amenPulse ? "scale-125" : ""}`}>
                    {amenCount > 999 ? `${(amenCount / 1000).toFixed(1)}K` : amenCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
