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
  const [amening, setAmening] = useState(false);
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
    if (amening) return;
    setAmening(true);
    setAmenPulse(true);
    // Optimistic update
    setAmenCount((c) => c + 1);
    // Fire and forget — increment in Firestore
    if (declaration) {
      await incrementAmen(declaration.id);
    }
    // Close after a short delay so the user sees the Amen animation
    setTimeout(() => handleClose(), 800);
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

          {/* RIGHT: Prayer text */}
          <div className="flex flex-col p-8 md:p-12 overflow-y-auto max-h-[90vh]">
            <div className="mb-6 flex-shrink-0">
              <p className="text-[#C8E63A] text-xs font-bold uppercase tracking-widest mb-2">Pastor's Prayer</p>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">My Prayer for You Today</h2>
              <div className="w-16 h-0.5 bg-[#C8E63A]/40 mt-4" />
            </div>

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

            {/* Amen counter + actions */}
            <div className="flex-shrink-0 mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              {/* Share */}
              <button onClick={handleShare} className="flex items-center gap-2 text-white/60 hover:text-[#C8E63A] transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>

              {/* Amen counter button */}
              <button
                onClick={handleAmen}
                disabled={amening}
                className={`flex items-center gap-3 bg-[#C8E63A] text-[#0D4A35] font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl ${amenPulse ? "scale-110" : "hover:-translate-y-0.5"} ${amening ? "opacity-80" : ""}`}
              >
                {/* Praying hands icon */}
                <svg className={`w-5 h-5 transition-transform ${amenPulse ? "scale-125" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a2 2 0 012-2h0a2 2 0 012 2v4m0 0V5a2 2 0 012-2h0a2 2 0 012 2v6m0 0v1m-6-1v5a3 3 0 003 3h3a3 3 0 003-3v-5" />
                </svg>
                <span>Amen</span>
                {/* Counter badge */}
                <span className={`flex items-center justify-center min-w-[28px] h-[22px] px-1.5 rounded-full bg-[#0D4A35] text-[#C8E63A] text-xs font-bold transition-all ${amenPulse ? "scale-125" : ""}`}>
                  {amenCount > 999 ? `${(amenCount / 1000).toFixed(1)}K` : amenCount}
                </span>
              </button>
            </div>

            {/* Small hint */}
            <p className="text-center text-white/30 text-xs mt-3">Click Amen to receive this prayer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
