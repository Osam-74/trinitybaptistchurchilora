"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sermon } from "@/types";
import { sampleSermons } from "@/lib/seed-data";
import { formatDate, getYouTubeThumbnail } from "@/lib/utils";

function formatDuration(sec?: number) {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SermonsPage() {
  const [sermons] = useState<Sermon[]>(sampleSermons.map((s, i) => ({ ...s, id: `sermon-${i}` })));
  const [filter, setFilter] = useState<"all" | "audio" | "video">("all");
  const [search, setSearch] = useState("");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const filtered = sermons.filter((s) => {
    const matchesFilter = filter === "all" || s.type === filter;
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.preacher.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              WORD OF GOD
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Sermons &amp; <span className="text-gradient-gold">Teachings</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Deep spiritual teachings, weekly sermons, and messages of hope to guide you in faith.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Floating card above sermon grid */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/50 p-6 -mt-20 relative z-10 mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, preacher, or scripture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-bg border border-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-primary"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-bg rounded-2xl border border-stone-100 w-full md:w-auto overflow-x-auto">
            {(["all", "video", "audio"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300 whitespace-nowrap ${
                  filter === f
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-stone-600 hover:text-primary hover:bg-white"
                }`}
              >
                {f === "all" ? "All" : f === "video" ? "🎥 Video" : "🎵 Audio"}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-stone-600 text-sm mb-6">{filtered.length} sermon{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-stone-500 text-lg">No sermons match your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((sermon, i) => (
              <article
                key={sermon.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm card-hover animate-fade-in-up group flex flex-col h-full"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Media Header */}
                <div className="relative h-52 bg-primary-dark overflow-hidden flex-shrink-0">
                  {sermon.type === "video" && sermon.youtubeId ? (
                    <>
                      <img
                        src={getYouTubeThumbnail(sermon.youtubeId)}
                        alt={sermon.title}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`https://youtube.com/watch?v=${sermon.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover:bg-accent-light transition-all shadow-2xl hover:scale-105"
                        >
                          <svg className="w-6 h-6 text-primary-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-light p-6">
                      <div className="text-center">
                        <svg className="w-14 h-14 text-accent/25 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        {sermon.audioUrl && (
                          <button
                            onClick={() => setPlayingAudio(playingAudio === sermon.id ? null : sermon.id)}
                            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:bg-accent-light transition-all shadow-xl mx-auto hover:scale-105"
                          >
                            {playingAudio === sermon.id ? (
                              <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-primary-dark ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                      {sermon.type === "video" ? "🎬 Video" : "🎵 Audio"}
                    </span>
                  </div>

                  {sermon.durationSec && (
                    <div className="absolute bottom-4 left-4 bg-primary-dark/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                      {formatDuration(sermon.durationSec)}
                    </div>
                  )}
                </div>

                {/* Inline Audio Player */}
                {playingAudio === sermon.id && sermon.audioUrl && (
                  <div className="px-6 py-4 bg-accent/10 border-b border-accent/20">
                    <audio src={sermon.audioUrl} autoPlay controls className="w-full h-8 rounded-lg outline-none" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {sermon.series && (
                    <p className="text-accent-dark text-xs font-extrabold uppercase tracking-widest mb-2">
                      {sermon.series}
                    </p>
                  )}
                  <h3 className="font-serif text-xl font-bold text-primary mb-3 leading-tight group-hover:text-primary-light transition-colors line-clamp-2">
                    {sermon.title}
                  </h3>

                  <div className="mt-auto space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-stone-700">
                        <svg className="w-3.5 h-3.5 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {sermon.preacher}
                      </span>
                      <span>•</span>
                      <span>{formatDate(sermon.date)}</span>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="inline-block bg-bg-alt text-primary-light text-[11px] font-bold px-3 py-1 rounded-lg">
                        📖 {sermon.scripture}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Podcast / Subscribe CTA */}
        <div className="mt-20 bg-primary-dark rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 pattern-overlay opacity-5" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">SPIRITUAL GROWTH</span>
              <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-3">Subscribe to Our Podcast</h3>
              <p className="text-white/70 max-w-lg text-sm leading-relaxed">
                Take the Word of God with you wherever you go. Listen to sermons, devotionals, and church teachings on the go.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 flex-shrink-0 w-full md:w-auto">
              <a href="#" className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white rounded-2xl px-6 py-3.5 flex items-center justify-center gap-3 border border-white/10 transition-all font-bold text-sm">
                <span className="text-xl">🍏</span> Apple Podcasts
              </a>
              <a href="#" className="flex-1 md:flex-initial bg-accent text-primary-dark hover:bg-accent-light rounded-2xl px-6 py-3.5 flex items-center justify-center gap-3 transition-all font-bold text-sm">
                <span className="text-xl">🎵</span> Spotify
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
