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
      .catch(() => setLoading(false));
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
      await incrementAmen(declaration.id);
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

  if (loading || !declaration) return null;

  const imageUrl = declaration.imageUrl || DEFAULT_PASTOR_IMAGE;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(11, 44, 34, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}
        style={{ background: "#0D4A35" }}
      >
        {/* Close button */}
        <button onClick={handleClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group" aria-label="Close">
          <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 max-h-[90vh]">
          {/* LEFT: Pastor Image */}
          <div className="relative h-64 md:h-auto md:min-h-[500px] overflow-hidden">
            <img src={imageUrl} alt="Pastor's Daily Declaration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D4A35]/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0D4A35]/20" />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8E63A] animate-pulse" />
                <span className="text-[#C8E63A] text-xs font-bold uppercase tracking-wider">Daily Declaration</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Prayer text + Amen button */}
          <div className="flex flex-col p-8 md:p-12 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
              <p className="text-[#C8E63A] text-xs font-bold uppercase tracking-widest mb-2">Pastor's Prayer</p>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">My Prayer for You Today</h2>
              <div className="w-16 h-0.5 bg-[#C8E63A]/40 mt-4" />
            </div>

            {/* Prayer text — takes remaining space */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {declaration.text.split("\n").map((line: string, i: number) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={i} className="h-2" />;
                  if (i === 0 && trimmed.toLowerCase().startsWith("my prayer")) {
                    return <p key={i} className="font-serif text-lg md:text-xl text-[#C8E63A] font-semibold">{trimmed}</p>;
                  }
                  if (trimmed.toUpperCase() === trimmed && trimmed.length > 5) {
                    return <p key={i} className="text-white/60 text-sm font-bold uppercase tracking-wider pt-2">{trimmed}</p>;
                  }
                  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
                    return <p key={i} className="text-white/40 text-xs italic">{trimmed}</p>;
                  }
                  return <p key={i} className="text-white/90 text-sm md:text-base leading-relaxed font-sans">{trimmed}</p>;
                })}
              </div>
            </div>

            {/* Amen button row — right-aligned, same level as end of text */}
            <div className="flex-shrink-0 mt-4 pt-4 flex items-center justify-end gap-3">
              {/* Share button — subtle, left side */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-white/50 hover:text-[#C8E63A] transition-colors text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>

              {/* Blinking pointing finger — disappears after Amen */}
              {!hasAmened && (
                <div className="flex items-center" style={{ animation: "amen-point-blink 1s ease-in-out infinite" }}>
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    {/* Pointing hand — finger pointing right toward the Amen button */}
                    <path
                      d="M14 11V4a2 2 0 00-2-2H12a2 2 0 00-2 2v6H6a2 2 0 00-2 2v4a4 4 0 004 4h6a4 4 0 004-4v-3a2 2 0 00-2-2h-2z"
                      fill="#C8E63A"
                      stroke="#C8E63A"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      transform="translate(-2, 0)"
                    />
                  </svg>
                </div>
              )}

              {/* Amen counter button */}
              <button
                onClick={handleAmen}
                disabled={hasAmened}
                className={`flex items-center gap-2.5 bg-[#C8E63A] text-[#0D4A35] font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg ${amenPulse ? "scale-110 shadow-[0_0_20px_rgba(200,230,58,0.5)]" : "hover:shadow-xl hover:-translate-y-0.5"} ${hasAmened ? "opacity-90 cursor-default" : ""}`}
              >
                <span>Amen</span>
                {/* Counter badge */}
                <span className={`flex items-center justify-center min-w-[28px] h-[22px] px-1.5 rounded-full bg-[#0D4A35] text-[#C8E63A] text-xs font-bold transition-all ${amenPulse ? "scale-125" : ""}`}>
                  {amenCount > 999 ? `${(amenCount / 1000).toFixed(1)}K` : amenCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for the blinking pointing finger */}
      <style>{`
        @keyframes amen-point-blink {
          0%, 100% { opacity: 1; transform: translateX(0); }
          45% { opacity: 0.3; transform: translateX(-4px); }
          55% { opacity: 0.3; transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}
