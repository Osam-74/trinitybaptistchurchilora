"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hymn } from "@/types";
import { listHymnsFromFirestore } from "@/lib/hymns";

// Sign-up form component
function SignUpModal({ dept, onClose }: { dept: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dateJoined: "", bio: "", section: dept });
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-primary">Register as a Chorister</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Registration Submitted!</h3>
            <p className="text-text-muted">Your registration is pending approval from the Music Director. You will be contacted once reviewed.</p>
            <button onClick={onClose} className="mt-6 btn-gold px-6 py-2.5 rounded-xl font-semibold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary-light transition-colors"
                onClick={() => document.getElementById('chorister-photo')?.click()}>
                {photo ? <img src={photo} alt="Preview" className="w-full h-full object-cover"/> : (
                  <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Upload your headshot</p>
                <p className="text-xs text-text-muted">JPG or PNG, max 5MB</p>
                <input id="chorister-photo" type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }}/>
              </div>
            </div>

            {[
              { label: "Full Name *", key: "name", type: "text", required: true },
              { label: "Email Address *", key: "email", type: "email", required: true },
              { label: "Phone Number", key: "phone", type: "tel", required: false },
              { label: "Date Joined the Choir", key: "dateJoined", type: "date", required: false },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-primary mb-1.5">{field.label}</label>
                <input type={field.type} required={field.required} value={(form as unknown as Record<string, string>)[field.key] ?? ""}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="input-field"/>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Section / Voice Part</label>
              <select value={form.section} onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))}
                className="input-field bg-white">
                <option value="Soprano">Soprano</option>
                <option value="Alto">Alto</option>
                <option value="Tenor">Tenor</option>
                <option value="Bass">Bass</option>
                <option value="Instrumentalist">Instrumentalist</option>
                <option value="Media Team">Media Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Brief Bio</label>
              <textarea value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us a little about yourself..." rows={3}
                className="input-field resize-none"/>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <strong>Note:</strong> Your registration will be pending approval from the Music Director before activation.
            </div>

            <button type="submit" className="w-full btn-gold py-3.5 rounded-xl font-semibold text-base">
              Submit Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ============ Presentation Mode ============
function PresentationMode({ hymn, onClose }: { hymn: Hymn; onClose: () => void }) {
  const verses = useMemo(() => {
    if (!hymn.lyrics) return [];
    // Split by double newline to get verse blocks
    return hymn.lyrics.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);
  }, [hymn]);

  const [verseIndex, setVerseIndex] = useState(0);

  const next = useCallback(() => setVerseIndex(i => Math.min(i + 1, verses.length - 1)), [verses.length]);
  const prev = useCallback(() => setVerseIndex(i => Math.max(i - 1, 0)), []);

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

  return (
    <div className="fixed inset-0 z-[100] bg-primary-dark flex flex-col items-center justify-center p-6 select-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <div className="text-white/60 text-sm">
          <span className="font-serif text-white font-bold text-lg">{hymn.title}</span>
          {hymn.author && <span className="ml-3 text-white/40">— {hymn.author}</span>}
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Exit (Esc)
        </button>
      </div>

      {/* Verse content */}
      <div className="max-w-4xl w-full text-center flex-1 flex flex-col items-center justify-center">
        <p className="text-accent/60 text-sm font-semibold uppercase tracking-widest mb-6">
          Verse {verseIndex + 1} of {verses.length}
        </p>
        <p className="whitespace-pre-line text-white font-serif text-2xl md:text-4xl lg:text-5xl leading-relaxed max-w-3xl">
          {verses[verseIndex]}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 p-6 z-10">
        <button onClick={prev} disabled={verseIndex === 0}
          className="text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          <span className="text-sm hidden sm:inline">Prev</span>
        </button>

        {/* Dots indicator */}
        <div className="flex gap-1.5">
          {verses.map((_, i) => (
            <button key={i} onClick={() => setVerseIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === verseIndex ? 'bg-accent w-6' : 'bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>

        <button onClick={() => verseIndex < verses.length - 1 ? next() : onClose()}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
          <span className="text-sm hidden sm:inline">{verseIndex < verses.length - 1 ? 'Next' : 'Done'}</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const CATEGORIES: { key: "english" | "yoruba"; label: string }[] = [
  { key: "english", label: "English Baptist Hymnal" },
  { key: "yoruba", label: "Yoruba Baptist Hymnal" },
];

export default function HymnsPage() {
  const [category, setCategory] = useState<"english" | "yoruba">("english");
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState<"title" | "number">("title");
  const [openHymn, setOpenHymn] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [presenting, setPresenting] = useState<Hymn | null>(null);
  const [firestoreHymns, setFirestoreHymns] = useState<Hymn[]>([]);
  const [libraryHymns, setLibraryHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the full hymn library from /public/hymns-library.json
  useEffect(() => {
    fetch("/hymns-library.json")
      .then((r) => r.json())
      .then((data: Omit<Hymn, "id">[]) => {
        setLibraryHymns(data.map((h, i) => ({ ...h, id: `lib-${i}` })));
      })
      .catch(() => setLibraryHymns([]));
  }, []);

  // Load admin-added hymns from Firestore (these override library entries)
  useEffect(() => {
    listHymnsFromFirestore().then((h) => {
      setFirestoreHymns(h);
      setLoading(false);
    });
  }, []);

  // Merge: Firestore overrides library by number+category
  const allHymns: Hymn[] = useMemo(() => {
    const key = (h: { number: number; category: string }) => `${h.category}-${h.number}`;
    const overridden = new Set(firestoreHymns.map(key));
    const merged = [...libraryHymns.filter((h) => !overridden.has(key(h))), ...firestoreHymns];
    return merged.sort((a, b) => a.number - b.number);
  }, [libraryHymns, firestoreHymns]);

  const filtered = useMemo(() => {
    const byCategory = allHymns.filter((h) => h.category === category);
    if (!search.trim()) return byCategory;
    const q = search.trim().toLowerCase();
    return byCategory.filter((h) =>
      searchBy === "title" ? h.title.toLowerCase().includes(q) : h.number.toString().includes(q)
    );
  }, [allHymns, category, search, searchBy]);

  const counts = useMemo(() => ({
    english: allHymns.filter(h => h.category === "english").length,
    yoruba: allHymns.filter(h => h.category === "yoruba").length,
  }), [allHymns]);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      {showSignUp && <SignUpModal dept="Choir" onClose={() => setShowSignUp(false)}/>}
      {presenting && <PresentationMode hymn={presenting} onClose={() => setPresenting(null)} />}

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
              HYMNALS
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Hymns of <span className="text-gradient-gold">Praise</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The full text of our hymns, right here on the website — search the English Baptist Hymnal
              ({counts.english} hymns) or the Yoruba Baptist Hymnal ({counts.yoruba} hymns) by title or number.
            </p>
            <button
              onClick={() => setShowSignUp(true)}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold animate-fade-in" style={{ animationDelay: '0.3s' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Join the Choir / Media Team
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hymnal tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key); setOpenHymn(null); }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                category === c.key ? "bg-primary text-white shadow-md" : "bg-white text-text-muted border border-stone-200 hover:border-primary/30"
              }`}
            >
              {c.label} ({counts[c.key]})
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder={searchBy === "title" ? "Search hymn by title..." : "Search by hymn number..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(["title", "number"] as const).map(mode => (
                <button key={mode} onClick={() => setSearchBy(mode)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                    searchBy === mode ? "bg-primary text-white" : "bg-stone-50 text-text-muted border border-stone-200 hover:border-primary/30"
                  }`}>
                  By {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-text-muted text-sm mb-6">
          {loading ? "Loading hymn library…" : `${filtered.length} hymn${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Hymn list with full lyrics inline */}
        <div className="space-y-4">
          {filtered.slice(0, 200).map((hymn) => (
            <div
              key={hymn.id}
              className={`hymn-card rounded-2xl overflow-hidden shadow-sm ${openHymn === hymn.id ? "border-primary-light" : "border-stone-100"}`}
            >
              <div className="flex items-stretch">
                <button
                  onClick={() => setOpenHymn(openHymn === hymn.id ? null : hymn.id)}
                  className="flex-1 flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    openHymn === hymn.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    {hymn.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-primary leading-snug">{hymn.title}</p>
                    {hymn.author && <p className="text-text-muted text-xs mt-0.5">{hymn.author}</p>}
                  </div>
                  <svg className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform ${openHymn === hymn.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {/* Present button */}
                <button
                  onClick={() => setPresenting(hymn)}
                  className="px-4 flex items-center justify-center border-l border-stone-100 text-primary-light hover:bg-primary/5 transition-colors"
                  title="Present this hymn fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </button>
              </div>
              {openHymn === hymn.id && (
                <div className="px-5 pb-6 pt-1 border-t border-stone-100 animate-fade-in">
                  {hymn.lyrics ? (
                    <>
                      <p className="whitespace-pre-line text-text leading-relaxed text-[15px]">{hymn.lyrics}</p>
                      <button
                        onClick={() => setPresenting(hymn)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-light transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                        </svg>
                        Present Fullscreen
                      </button>
                    </>
                  ) : (
                    <p className="text-text-muted text-sm italic">Full lyrics coming soon.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length > 200 && (
          <p className="text-center text-text-muted text-sm mt-6">
            Showing first 200 results. Refine your search to see more.
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <p className="text-text-muted text-lg">No hymns found for &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Choir Sign-up CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pattern-overlay opacity-40"/>
          <div className="relative">
            <svg className="w-12 h-12 text-accent mx-auto mb-5 animate-cross-glow" viewBox="0 0 48 60" fill="currentColor">
              <rect x="20" y="0" width="8" height="60" rx="4"/>
              <rect x="0" y="16" width="48" height="8" rx="4"/>
            </svg>
            <h2 className="font-serif text-3xl text-white font-bold mb-3">Join Our Music Ministry</h2>
            <p className="text-white/60 max-w-md mx-auto mb-6">
              Are you gifted in singing or playing an instrument? Register to join our choir or media team. Registrations are approved by the Music Director.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setShowSignUp(true)}
                className="btn-shine btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Register as Chorister
              </button>
              <button onClick={() => { setShowSignUp(true); }}
                className="btn-shine inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold glass-card text-white hover:bg-white/15 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Register as Media Team
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
