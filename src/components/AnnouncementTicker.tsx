"use client";

/**
 * AnnouncementTicker
 * ─ Pulls announcements from Firestore settings/main.announcements[]
 * ─ Renders NOTHING until Firestore has responded — zero bleed/flash
 * ─ Alternates white / gold text for each announcement
 * ─ Seamless infinite loop
 */

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/settings";

const BULLET = "\u00A0\u00A0\u2022\u00A0\u00A0";

interface Props {
  onDismiss?: () => void;
}

export default function AnnouncementTicker({ onDismiss }: Props) {
  // null = still loading (renders nothing), [] = loaded but empty, string[] = show these
  const [announcements, setAnnouncements] = useState<string[] | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then(s => {
        setAnnouncements(s.announcements && s.announcements.length > 0 ? s.announcements : []);
      })
      .catch(() => {
        setAnnouncements([]);
      });
  }, []);

  // Still loading → render nothing (no flash of old/default content)
  if (announcements === null) return null;
  // Loaded but no announcements → hide the bar
  if (announcements.length === 0) return null;

  const buildSpans = (keyPrefix: string) =>
    announcements.map((text, i) => (
      <span key={`${keyPrefix}-${i}`}>
        <span style={{ color: i % 2 === 0 ? "rgba(255,255,255,0.92)" : "#C8E63A" }}>
          {text}
        </span>
        <span style={{ color: "rgba(255,255,255,0.40)" }}>{BULLET}</span>
      </span>
    ));

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "30px", background: "rgba(11,44,34,0.98)", borderBottom: "1px solid rgba(200,230,58,0.18)" }}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Dismiss announcements"
        >
          <svg className="w-3 h-3" style={{ color: "rgba(255,255,255,0.45)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="flex items-center h-full overflow-hidden">
        <div
          className="whitespace-nowrap text-xs font-medium select-none ticker-track"
          style={{ willChange: "transform" }}
        >
          {buildSpans("a")}
          {buildSpans("b")}
          {buildSpans("c")}
        </div>
      </div>

      <style jsx>{`
        .ticker-track {
          display: inline-block;
          padding-left: 60px;
          animation: tickerScroll 55s linear infinite;
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3334%); }
        }
      `}</style>
    </div>
  );
}
