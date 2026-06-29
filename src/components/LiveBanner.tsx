"use client";

import Link from "next/link";

interface LiveBannerProps {
  isLive: boolean;
  title?: string;
}

export default function LiveBanner({ isLive, title }: LiveBannerProps) {
  if (!isLive) return null;

  return (
    <Link
      href="/live"
      className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2.5 px-4 flex items-center justify-center gap-3 animate-fade-in hover:brightness-110 transition-all"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <span className="font-medium text-sm">
        LIVE NOW{title ? `: ${title}` : " — Watch Our Service"}
      </span>
      <svg className="w-4 h-4 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </Link>
  );
}
