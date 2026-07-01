"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hymn } from "@/types";
import { seedHymns } from "@/lib/hymns-data";
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
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors"
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
  const [firestoreHymns, setFirestoreHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listHymnsFromFirestore().then((h) => {
      setFirestoreHymns(h);
      setLoading(false);
    });
  }, []);

  // Merge admin-added hymns (Firestore) with the seed library. Firestore
  // entries with the same number+category override the seed version.
  const allHymns: Hymn[] = useMemo(() => {
    const seeded: Hymn[] = seedHymns.map((h, i) => ({ ...h, id: `seed-${i}` }));
    const key = (h: { number: number; category: string }) => `${h.category}-${h.number}`;
    const overridden = new Set(firestoreHymns.map(key));
    const merged = [...seeded.filter((h) => !overridden.has(key(h))), ...firestoreHymns];
    return merged.sort((a, b) => a.number - b.number);
  }, [firestoreHymns]);

  const filtered = useMemo(() => {
    const byCategory = allHymns.filter((h) => h.category === category);
    if (!search.trim()) return byCategory;
    const q = search.trim().toLowerCase();
    return byCategory.filter((h) =>
      searchBy === "title" ? h.title.toLowerCase().includes(q) : h.number.toString().includes(q)
    );
  }, [allHymns, category, search, searchBy]);

  return (
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
            <p className="text-white/60 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              The full text of our hymns, right here on the website — search the English Baptist Hymnal
              or the Yoruba Baptist Hymnal by title or number.
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
              {c.label}
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(["title", "number"] as const).map(mode => (
                <button key={mode} onClick={() => setSearchBy(mode)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                    searchBy === mode ? "bg-accent text-primary-dark" : "bg-stone-50 text-text-muted border border-stone-200 hover:border-accent/40"
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
          {filtered.map((hymn) => (
            <div
              key={hymn.id}
              className={`hymn-card rounded-2xl overflow-hidden shadow-sm ${openHymn === hymn.id ? "border-accent" : "border-stone-100"}`}
            >
              <button
                onClick={() => setOpenHymn(openHymn === hymn.id ? null : hymn.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  openHymn === hymn.id ? "bg-accent text-primary-dark" : "bg-accent/10 text-accent"
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
              {openHymn === hymn.id && (
                <div className="px-5 pb-6 pt-1 border-t border-stone-100 animate-fade-in">
                  {hymn.lyrics ? (
                    <p className="whitespace-pre-line text-text leading-relaxed text-[15px]">{hymn.lyrics}</p>
                  ) : (
                    <p className="text-text-muted text-sm italic">Full lyrics coming soon.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            {category === "yoruba" && allHymns.filter(h => h.category === "yoruba").length === 0 ? (
              <p className="text-text-muted text-lg max-w-md mx-auto">
                The Yoruba Baptist Hymnal is being added. Church staff can add hymns from Admin → Hymns.
              </p>
            ) : (
              <p className="text-text-muted text-lg">No hymns found for &ldquo;{search}&rdquo;</p>
            )}
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
