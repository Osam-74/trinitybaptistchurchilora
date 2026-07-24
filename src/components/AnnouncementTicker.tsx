"use client";

import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/settings";

const DEFAULT_ANNOUNCEMENTS = [
  "Welcome to Trinity Baptist Church, Ilora!",
  "Join us this Sunday for worship at 9:00 AM",
  "For Christ is our Peace — 2026: My Year of Upliftment",
];

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    getSiteSettings()
      .then(s => {
        if (s.announcements && s.announcements.length > 0) {
          setAnnouncements(s.announcements);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible || announcements.length === 0) return null;

  // Build the scrolling text: join all announcements with a long separator
  const separator = "\u00A0\u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0\u00A0"; // four spaces, bullet, four spaces
  const fullText = announcements.join(separator) + separator;

  return (
    <div className="relative w-full bg-primary-dark border-b border-accent/20 overflow-hidden" style={{ height: "32px" }}>
      {/* Dismiss button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Dismiss announcements"
      >
        <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(11,44,34,1), transparent)" }} />

      {/* Right fade mask (before dismiss button) */}
      <div className="absolute right-8 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(11,44,34,1), transparent)" }} />

      {/* Scrolling track */}
      <div className="flex items-center h-full">
        <div className="ticker-track whitespace-nowrap text-white/85 text-xs font-medium" aria-live="polite">
          {/* Duplicate for seamless loop */}
          <span>{fullText}{fullText}</span>
        </div>
      </div>

      <style jsx>{`
        .ticker-track {
          display: inline-block;
          animation: ticker-scroll 40s linear infinite;
          padding-left: 100%;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
