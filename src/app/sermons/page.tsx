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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              SERMON LIBRARY
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Word of <span className="text-gradient-gold">God</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Browse sermons, teachings, and inspirational messages from Rev&apos;d Dr S. O. Mosebolatan
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search sermons, preachers, scripture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "video", "audio"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                  filter === f
                    ? "bg-accent text-primary-dark shadow-md shadow-accent/20"
                    : "bg-stone-50 text-text border border-stone-200 hover:border-accent/40 hover:text-accent"
                }`}
              >
                {f === "all" ? "All" : f === "video" ? "🎥 Video" : "🎵 Audio"}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-text-muted text-sm mb-6">{filtered.length} sermon{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <p className="text-text-muted text-lg">No sermons found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((sermon, i) => (
              <article key={sermon.id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm card-hover animate-fade-in-up group" style={{ animationDelay: `${i * 0.05}s` }}>
                {/* Thumbnail */}
                <div className="relative h-52 bg-primary-dark overflow-hidden">
                  {sermon.type === "video" && sermon.youtubeId ? (
                    <>
                      <img src={getYouTubeThumbnail(sermon.youtubeId)} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`https://youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer"
                          className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center hover:bg-accent transition-colors shadow-2xl">
                          <svg className="w-6 h-6 text-primary-dark ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-light">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-white/25 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                        </svg>
                        {sermon.audioUrl && (
                          <button
                            onClick={() => setPlayingAudio(playingAudio === sermon.id ? null : sermon.id)}
                            className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center hover:bg-accent transition-colors shadow-xl mx-auto">
                            {playingAudio === sermon.id ? (
                              <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-primary-dark ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase">{sermon.type}</span>
                    {sermon.featured && (
                      <span className="bg-white/90 text-primary text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                    )}
                  </div>

                  {sermon.durationSec && (
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {formatDuration(sermon.durationSec)}
                    </div>
                  )}
                </div>

                {/* Audio player */}
                {playingAudio === sermon.id && sermon.audioUrl && (
                  <div className="px-6 pt-4 bg-primary-dark/5 border-b border-stone-100">
                    <audio src={sermon.audioUrl} autoPlay controls className="w-full h-10 rounded-lg"/>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {sermon.series && (
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{sermon.series}</p>
                  )}
                  <h3 className="font-serif text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{sermon.title}</h3>

                  <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-3">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {sermon.preacher}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {formatDate(sermon.date)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      {sermon.scripture}
                    </div>
                  </div>

                  {sermon.description && (
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-4">{sermon.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
                    {sermon.type === "video" && sermon.youtubeId && (
                      <a href={`https://youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/>
                        </svg>
                        Watch
                      </a>
                    )}
                    {sermon.type === "audio" && sermon.audioUrl && (
                      <button
                        onClick={() => setPlayingAudio(playingAudio === sermon.id ? null : sermon.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-light transition-colors"
                      >
                        {playingAudio === sermon.id ? (
                          <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> Pause</>
                        ) : (
                          <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play</>
                        )}
                      </button>
                    )}
                    {/* Download button */}
                    {(sermon.audioUrl || sermon.youtubeId) && (
                      <a
                        href={sermon.audioUrl || `https://youtube.com/watch?v=${sermon.youtubeId}`}
                        download={sermon.audioUrl ? true : undefined}
                        target={!sermon.audioUrl ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 text-accent text-sm font-semibold rounded-xl hover:bg-accent/20 border border-accent/20 transition-all"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
