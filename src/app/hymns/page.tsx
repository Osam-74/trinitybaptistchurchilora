"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hymn } from "@/types";
import { listHymnsFromFirestore } from "@/lib/hymns";
import { seedHymns } from "@/lib/hymns-data";
import SignUpModal from "@/components/SignUpModal";

// ============ Presentation Mode ============
function PresentationMode({ hymn, onClose }: { hymn: Hymn; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const verses = useMemo(() => {
    if (!hymn.lyrics) return [];
    return hymn.lyrics.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);
  }, [hymn]);

  const [verseIndex, setVerseIndex] = useState(0);
  const verseRef = useRef<HTMLDivElement>(null);
  const [fontSize, _setFontSize] = useState(4);

  const next = useCallback(() => setVerseIndex(i => Math.min(i + 1, verses.length - 1)), [verses.length]);
  const prev = useCallback(() => setVerseIndex(i => Math.max(i - 1, 0)), []);

  // Make container truly fullscreen
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen mode:", err);
      });
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error("Error exiting fullscreen mode:", err);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!verseRef.current) return;
    const el = verseRef.current;
    const availHeight = window.innerHeight - 200;
    const availWidth = window.innerWidth - 120;

    let size = 5;
    const minSize = 1.2;

    el.style.fontSize = size + "rem";
    void el.offsetHeight;

    while (size > minSize) {
      const fitsHeight = el.scrollHeight <= availHeight;
      const fitsWidth = el.scrollWidth <= availWidth;
      if (fitsHeight && fitsWidth) break;
      size -= 0.15;
      el.style.fontSize = size + "rem";
      void el.offsetHeight;
    }

    _setFontSize(size);
  }, [verseIndex, verses]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (verseIndex < verses.length - 1) next();
        else onClose();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, onClose, verseIndex, verses.length]);

  if (verses.length === 0) return null;

  const currentVerseText = verses[verseIndex];
  const isChorus = currentVerseText.toLowerCase().startsWith("chorus:") || currentVerseText.toLowerCase().startsWith("ègbè:");
  const displayText = isChorus
    ? currentVerseText.replace(/^(chorus:|ègbè:)\s*/i, "")
    : currentVerseText;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none p-6">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white/60 text-sm flex items-center gap-3">
          <span className="font-serif text-white font-bold text-xl">{hymn.title}</span>
          {hymn.author && <span className="text-white/40 hidden sm:inline">— {hymn.author}</span>}
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit ESC
        </button>
      </div>

      <div className="flex-1 w-full max-w-6xl px-12 flex flex-col items-center justify-center text-center">
        {isChorus && (
          <div className="text-amber-400 font-sans uppercase tracking-widest text-lg lg:text-2xl font-black mb-4 animate-pulse">
            Chorus
          </div>
        )}
        <div ref={verseRef} className="text-white font-serif tracking-wide leading-normal whitespace-pre-wrap transition-all duration-300">
          {displayText}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-6 px-12 flex items-center justify-between z-10 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5">
        <div className="flex items-center gap-2">
          <button onClick={prev} disabled={verseIndex === 0} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} disabled={verseIndex === verses.length - 1} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="text-white/50 text-base font-bold uppercase tracking-wider bg-white/5 px-4 py-2 rounded-xl">
          Verse {verseIndex + 1} of {verses.length}
        </div>
      </div>
    </div>
  );
}

// ============ Scroll Reveal Hook ============
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HymnsPage() {
  useScrollReveal();
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [presentationHymn, setPresentationHymn] = useState<Hymn | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpDept, setSignUpDept] = useState("Choir");

  useEffect(() => {
    async function load() {
      try {
        const list = await listHymnsFromFirestore();
        if (list && list.length > 0) {
          setHymns(list);
        } else {
          // If Firestore is empty, fall back to sample seed hymns (taking first 6)
          const parsedSeed: Hymn[] = seedHymns.slice(0, 6).map((h, idx) => ({
            id: `seed-${idx}`,
            ...h,
          } as Hymn));
          setHymns(parsedSeed);
        }
      } catch (e) {
        console.error(e);
        const parsedSeed: Hymn[] = seedHymns.slice(0, 6).map((h, idx) => ({
          id: `seed-${idx}`,
          ...h,
        } as Hymn));
        setHymns(parsedSeed);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    hymns.forEach(h => { if (h.category) cats.add(h.category); });
    return ["All", ...Array.from(cats).map(c => c.charAt(0).toUpperCase() + c.slice(1))];
  }, [hymns]);

  const filtered = useMemo(() => {
    return hymns.filter(h => {
      const matchSearch =
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        (h.lyrics && h.lyrics.toLowerCase().includes(search.toLowerCase())) ||
        (h.number && h.number.toString().includes(search)) ||
        (h.author && h.author.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || h.category.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [hymns, search, category]);

  // Use the first hymn or any specified as hymn of the week as the featured hymn
  const featuredHymn = useMemo(() => {
    return hymns.length > 0 ? hymns[0] : null;
  }, [hymns]);

  const getFirstVersePreview = (lyrics?: string) => {
    if (!lyrics) return "";
    const firstVerse = lyrics.split(/\n\s*\n/)[0] || "";
    const words = firstVerse.split(/\s+/);
    if (words.length <= 30) return firstVerse;
    return words.slice(0, 30).join(" ") + "...";
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary-dark pt-32 pb-24 overflow-hidden pattern-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,230,58,0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6 text-accent-light text-xs font-semibold uppercase tracking-wider">
            🎼 Hymn Library
          </div>
          <h1 className="reveal font-display text-4xl sm:text-5xl lg:text-7xl text-white font-bold tracking-tight mb-4">
            Songs of <span className="text-gradient-gold">Praise</span>
          </h1>
          <p className="reveal text-white/70 text-lg max-w-2xl mx-auto font-sans">
            Lift up your soul with spiritual songs, hymns, and musical devotionals passed down through generations.
          </p>

          <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setSignUpDept("Choir"); setShowSignUp(true); }}
              className="btn-gold text-primary-dark font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              Join Choir Department
            </button>
            <button
              onClick={() => { setSignUpDept("Instrumentalist"); setShowSignUp(true); }}
              className="btn-outline border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm hover:bg-white/10 cursor-pointer transition-colors"
            >
              Join Instrumentalists
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Featured Hymn of the Week */}
        {!loading && featuredHymn && (
          <section className="reveal">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-xs font-extrabold text-accent-dark tracking-widest uppercase mb-1">🌟 Featured Hymn</p>
              <h2 className="font-serif text-3xl font-bold text-primary-dark">Hymn of the Week</h2>
              <div className="gold-divider mx-auto mt-2" />
            </div>

            <div className="bg-primary rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden max-w-4xl mx-auto border border-accent/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -mr-24 -mt-24" />
              <div className="relative z-10 grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-accent text-primary-dark font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                    🏆 Featured
                  </div>
                  <h3 className="font-serif text-3xl text-white font-bold leading-tight">
                    {featuredHymn.number ? `#${featuredHymn.number} ` : ""}{featuredHymn.title}
                  </h3>
                  {featuredHymn.author && (
                    <p className="text-accent-light/80 text-sm font-semibold">
                      Author: {featuredHymn.author}
                    </p>
                  )}
                  {featuredHymn.category && (
                    <span className="inline-block text-xs bg-white/10 text-white px-3 py-1 rounded-lg uppercase font-bold tracking-wider">
                      {featuredHymn.category}
                    </span>
                  )}
                  <div className="pt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setPresentationHymn(featuredHymn)}
                      className="btn-gold px-5 py-3 text-xs font-extrabold text-primary-dark rounded-xl flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                    >
                      📺 Present Mode
                    </button>
                  </div>
                </div>

                <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 text-white max-h-96 overflow-y-auto">
                  <p className="font-serif whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-white/90">
                    {featuredHymn.lyrics}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search & Filter Bar */}
        <section className="reveal max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hymns by number, title, verses, or author..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-stone-200 text-primary-dark rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent shadow-sm transition-all placeholder-stone-400"
            />
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    category === cat
                      ? "bg-primary text-white shadow-md ring-2 ring-primary/20"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Hymns Grid */}
        <section className="reveal">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-muted text-sm font-semibold">Tuning library...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((hymn) => {
                const isExpanded = expandedId === hymn.id;
                return (
                  <div
                    key={hymn.id}
                    className="hymn-card bg-white border border-stone-200 rounded-3xl p-6 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between group"
                  >
                    {/* Corner music note icon decoration */}
                    <div className="absolute top-4 right-4 text-stone-200 group-hover:text-accent-light/40 transition-colors pointer-events-none">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>

                    <div className="space-y-4">
                      {/* Hymn Number Badge Pill & Category Badge */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {hymn.number && (
                          <span className="inline-flex items-center bg-accent-light/30 text-accent-dark font-extrabold px-3 py-1 rounded-full text-xs">
                            Hymn #{hymn.number}
                          </span>
                        )}
                        {hymn.category && (
                          <span className="inline-flex items-center bg-stone-100 text-stone-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                            {hymn.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-primary-dark">
                        {hymn.title}
                      </h3>

                      {hymn.author && (
                        <p className="text-xs text-text-muted italic">By {hymn.author}</p>
                      )}

                      {/* Content Area: Accordion Preview or Full Lyrics */}
                      <div className="pt-2 border-t border-stone-100 text-stone-600">
                        {isExpanded ? (
                          <div className="space-y-4 text-sm sm:text-base font-serif leading-relaxed whitespace-pre-wrap animate-fade-in py-2 max-h-96 overflow-y-auto">
                            {hymn.lyrics}
                          </div>
                        ) : (
                          <p className="text-sm font-serif leading-relaxed italic text-stone-500">
                            {getFirstVersePreview(hymn.lyrics)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => toggleExpand(hymn.id!)}
                        className="text-xs font-bold text-primary hover:text-primary-light flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {isExpanded ? "Close Hymn" : "Read Full Hymn"}
                        <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setPresentationHymn(hymn)}
                          title="Project Hymn (Fullscreen Presentation)"
                          className="w-10 h-10 rounded-xl bg-bg hover:bg-stone-200 flex items-center justify-center text-primary border border-stone-200 transition-colors cursor-pointer hover:border-accent"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-serif text-lg font-bold text-primary mb-1">No hymns found</h4>
              <p className="text-text-muted text-sm">Try tweaking your search term or category filters.</p>
            </div>
          )}
        </section>

        {/* Music Ministry Sign-up section */}
        <section className="reveal bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(200,230,58,0.06),transparent_50%)]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-accent-light text-xs font-semibold uppercase tracking-wider">
              🎵 Praise & Worship
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Join the Music Ministry</h2>
            <p className="text-white/80 text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
              Our music department leads the congregation into deep, glorious worship and celestial adoration. Whether you are a vocalist or an instrumentalist, we welcome you to serve God with your musical talents.
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setSignUpDept("Choir"); setShowSignUp(true); }}
                className="btn-gold text-primary-dark font-extrabold px-8 py-4 rounded-xl text-sm shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Register as Chorister
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* SignUp modal */}
      {showSignUp && (
        <SignUpModal dept={signUpDept} onClose={() => setShowSignUp(false)} />
      )}

      {/* Presentation view */}
      {presentationHymn && (
        <PresentationMode hymn={presentationHymn} onClose={() => setPresentationHymn(null)} />
      )}

      <Footer />
    </main>
  );
}
