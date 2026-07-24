"use client";

/**
 * AnnouncementTicker
 * ─ Pulls announcements from Firestore settings/main.announcements[]
 * ─ Alternates white / gold text for each announcement
 * ─ Seamless infinite loop — no gap, no restart flash
 * ─ Each item flows continuously: 1→2→3→1→2→3→…
 */

import { useEffect, useState, useRef } from "react";
import { getSiteSettings } from "@/lib/settings";

const DEFAULT_ANNOUNCEMENTS = [
  "Welcome to Trinity Baptist Church, Ilora!",
  "Join us this Sunday for worship at 9:00 AM",
  "For Christ is our Peace — 2026: My Year of Upliftment",
];

const BULLET = "\u00A0\u00A0\u2022\u00A0\u00A0";

interface Props {
  onDismiss?: () => void;
}

export default function AnnouncementTicker({ onDismiss }: Props) {
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    getSiteSettings()
      .then(s => {
        if (s.announcements && s.announcements.length > 0) {
          setAnnouncements(s.announcements);
        }
      })
      .catch(() => {});
  }, []);

  if (announcements.length === 0) return null;

  // Build spans with alternating colours. We render the set THREE times for
  // a perfectly seamless loop: the animation moves by exactly -1/3 of total width.
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
      {/* Dismiss */}
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

      {/* Scrolling track — 3× content, animate by -33.333% for seamless loop */}
      <div className="flex items-center h-full">
        <div
          className="whitespace-nowrap text-xs font-medium select-none ticker-inner"
          style={{ willChange: "transform" }}
        >
          {buildSpans("a")}
          {buildSpans("b")}
          {buildSpans("c")}
        </div>
      </div>

      <style jsx>{`
        .ticker-inner {
          display: inline-block;
          animation: ticker3x 50s linear infinite;
          padding-left: 60px;
        }
        @keyframes ticker3x {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3334%); }
        }
      `}</style>
    </div>
  );
}
