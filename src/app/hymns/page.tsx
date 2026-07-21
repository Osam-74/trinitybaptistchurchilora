"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hymn } from "@/types";
import { listHymnsFromFirestore } from "@/lib/hymns";
import { createChoirMember } from "@/lib/choir";
import R2Uploader from "@/components/R2Uploader";

// Sign-up form component
function SignUpModal({ dept, onClose }: { dept: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dateJoined: "", bio: "", section: dept, department: dept });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    setSubmitting(true);
    try {
      await createChoirMember({
        fullName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone || undefined,
        department: form.department,
        section: form.section || undefined,
        photoUrl: photoUrl || undefined,
        bio: form.bio || undefined,
        dateJoined: form.dateJoined || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full flex flex-col animate-scale-in" style={{ maxHeight: '100dvh', height: 'auto' }}>
        <div className="p-5 border-b border-stone-100 flex items-center justify-between flex-shrink-0 sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="font-serif text-xl font-bold text-primary">Register as a Chorister</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1" style={{ overscrollBehavior: 'contain' }}>
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
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Upload your headshot</label>
              {photoUrl && <img src={photoUrl} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border border-stone-200 mb-2"/>}
              <R2Uploader folder="choir" label="Choose Photo" onUploaded={(url) => setPhotoUrl(url)} />
              <p className="text-xs text-text-muted mt-1">JPG or PNG, max 5MB</p>
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
              <label className="block text-sm font-medium text-primary mb-1.5">Department</label>
              <select value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                className="input-field bg-white">
                <option value="Choir">Choir</option>
                <option value="Media Team">Media Team</option>
                <option value="Instrumentalist">Instrumentalist</option>
              </select>
            </div>

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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <button type="submit" disabled={submitting} className="w-full btn-gold py-3.5 rounded-xl font-semibold text-base disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Registration"}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  , document.body);
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

  // Lock body scroll when presentation is open
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prev;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

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

  const [visible, setVisible] = useState(false);

  // Trigger fade-in on mount and fade-out on verse change
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, [verseIndex]);

  if (verses.length === 0) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: "#0B2C22",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      className="select-none"
    >
      {/* Background cross watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 48 60" fill="white" className="w-64 h-80">
          <rect x="20" y="0" width="8" height="60" rx="4"/>
          <rect x="0" y="16" width="48" height="8" rx="4"/>
        </svg>
      </div>

      {/* Top bar — fixed height, no flex-grow */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex flex-col">
          <span className="font-serif text-white font-bold text-base sm:text-lg leading-tight">{hymn.title}</span>
          {hymn.number && <span className="text-accent text-xs font-bold uppercase tracking-widest">Hymn #{hymn.number}</span>}
          {hymn.author && <span className="text-white/40 text-xs">— {hymn.author}</span>}
        </div>
        <button onClick={onClose} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-xs font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Exit (Esc)
        </button>
      </div>

      {/* Verse content — fills remaining space, centred */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 pt-20 pb-24">
        <p className="text-accent/70 text-xs sm:text-sm font-bold uppercase tracking-widest mb-6">
          Verse {verseIndex + 1} / {verses.length}
        </p>
        <p
          className="whitespace-pre-line text-white font-serif leading-relaxed text-center max-w-4xl transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            fontSize: 'clamp(1.4rem, 3.5vw, 3rem)',
            lineHeight: 1.55,
          }}
        >
          {verses[verseIndex]}
        </p>
      </div>

      {/* Bottom controls — fixed at bottom, no scroll */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-5 py-5 z-10 bg-gradient-to-t from-black/40 to-transparent">
        <button onClick={prev} disabled={verseIndex === 0}
          className="text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          <span className="text-sm hidden sm:inline font-semibold">Prev</span>
        </button>

        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
          {verses.map((_, i) => (
            <button key={i} onClick={() => setVerseIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === verseIndex ? 'bg-accent w-8' : 'bg-white/25 w-2 hover:bg-white/50'}`} />
          ))}
        </div>

        <button onClick={() => verseIndex < verses.length - 1 ? next() : onClose()}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
          <span className="text-sm hidden sm:inline font-semibold">{verseIndex < verses.length - 1 ? 'Next' : 'Done'}</span>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  , document.body);
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
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

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

  // Reset to page 1 whenever the filter changes
  useEffect(() => { setCurrentPage(1); }, [category, search, searchBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedHymns = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts = useMemo(() => ({
    english: allHymns.filter(h => h.category === "english").length,
    yoruba: allHymns.filter(h => h.category === "yoruba").length,
  }), [allHymns]);

  return (
    <>
      {presenting && <PresentationMode hymn={presenting} onClose={() => setPresenting(null)} />}
      <main className="min-h-screen bg-bg">
        <Navbar />
        {showSignUp && <SignUpModal dept="Choir" onClose={() => setShowSignUp(false)}/>}

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
          {paginatedHymns.map((hymn) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-stone-200 text-primary hover:border-primary/30 hover:bg-primary/5"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-white border border-stone-200 text-text-muted hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-stone-200 text-primary hover:border-primary/30 hover:bg-primary/5"
            >
              Next →
            </button>
          </div>
        )}
        {totalPages > 1 && (
          <p className="text-center text-text-muted text-xs mt-4">
            Page {currentPage} of {totalPages} · Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
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
    </>
  );
}
