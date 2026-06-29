"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HYMNS = [
  { number: 2, title: "Holy, Holy, Holy" },
  { number: 4, title: "To God Be the Glory" },
  { number: 7, title: "Joyful, Joyful We Adore Thee" },
  { number: 8, title: "A Mighty Fortress Is Our God" },
  { number: 15, title: "Come, Thou Fount of Every Blessing" },
  { number: 16, title: "O Worship the King" },
  { number: 23, title: "God Is So Good" },
  { number: 43, title: "This Is My Father's World" },
  { number: 44, title: "For the Beauty of the Earth" },
  { number: 52, title: "He Leadeth Me! O Blessed Thought" },
  { number: 56, title: "Guide Me, O Thou Great Jehovah" },
  { number: 62, title: "All the Way My Savior Leads Me" },
  { number: 63, title: "Abide With Me" },
  { number: 64, title: "God Will Take Care of You" },
  { number: 74, title: "O God, Our Help in Ages Past" },
  { number: 76, title: "O Come, O Come, Emmanuel" },
  { number: 87, title: "Joy to the World! The Lord Is Come" },
  { number: 88, title: "Hark! The Herald Angels Sing" },
  { number: 89, title: "O Come, All Ye Faithful" },
  { number: 91, title: "Silent Night, Holy Night" },
  { number: 103, title: "Away in a Manger" },
  { number: 126, title: "All Glory, Laud, and Honor" },
  { number: 132, title: "There Is Power in the Blood" },
  { number: 134, title: "Jesus Paid It All" },
  { number: 135, title: "Nothing but the Blood" },
  { number: 139, title: "At the Cross" },
  { number: 141, title: "The Old Rugged Cross" },
  { number: 142, title: "There Is a Fountain" },
  { number: 144, title: "When I Survey the Wondrous Cross" },
  { number: 147, title: "And Can It Be" },
  { number: 156, title: "Were You There" },
  { number: 159, title: "Christ the Lord Is Risen Today" },
  { number: 161, title: "Crown Him with Many Crowns" },
  { number: 175, title: "Man of Sorrows, What a Name" },
  { number: 176, title: "Fairest Lord Jesus" },
  { number: 180, title: "Jesus, Lover of My Soul" },
  { number: 181, title: "No, Not One" },
  { number: 182, title: "What a Friend We Have in Jesus" },
  { number: 187, title: "In the Garden" },
  { number: 200, title: "All Hail the Power of Jesus' Name" },
  { number: 208, title: "Love Divine, All Loves Excelling" },
  { number: 210, title: "My Jesus, I Love Thee" },
  { number: 216, title: "O for a Thousand Tongues to Sing" },
  { number: 217, title: "Oh, How I Love Jesus" },
  { number: 241, title: "Breathe on Me, Breath of God" },
  { number: 247, title: "Come, Thou Almighty King" },
  { number: 253, title: "Praise God, from Whom All Blessings Flow" },
  { number: 261, title: "Wonderful Words of Life" },
  { number: 263, title: "Break Thou the Bread of Life" },
  { number: 267, title: "Dear Lord and Father of Mankind" },
  { number: 275, title: "I Surrender All" },
  { number: 277, title: "Take My Life, and Let It Be Consecrated" },
  { number: 280, title: "Jesus, Keep Me Near the Cross" },
  { number: 288, title: "Where He Leads Me" },
  { number: 290, title: "I Am Thine, O Lord" },
  { number: 291, title: "Beneath the Cross of Jesus" },
  { number: 292, title: "O Love That Wilt Not Let Me Go" },
  { number: 294, title: "Have Thine Own Way, Lord" },
  { number: 295, title: "Near to the Heart of God" },
  { number: 307, title: "Just As I Am" },
  { number: 309, title: "Lord, I'm Coming Home" },
  { number: 312, title: "Softly and Tenderly" },
  { number: 317, title: "Only Trust Him" },
  { number: 329, title: "Grace Greater than Our Sin" },
  { number: 330, title: "Amazing Grace! How Sweet the Sound" },
  { number: 333, title: "Leaning on the Everlasting Arms" },
  { number: 334, title: "Blessed Assurance, Jesus Is Mine" },
  { number: 335, title: "Standing on the Promises" },
  { number: 337, title: "I Know Whom I Have Believed" },
  { number: 338, title: "How Firm a Foundation" },
  { number: 342, title: "Rock of Ages, Cleft for Me" },
  { number: 344, title: "Jesus Loves Me" },
  { number: 350, title: "The Church's One Foundation" },
  { number: 352, title: "Faith of Our Fathers" },
  { number: 354, title: "I Love Thy Kingdom, Lord" },
  { number: 406, title: "The Solid Rock" },
  { number: 410, title: "It Is Well with My Soul" },
  { number: 411, title: "'Tis So Sweet to Trust in Jesus" },
  { number: 413, title: "Faith Is the Victory" },
  { number: 416, title: "My Faith Looks Up to Thee" },
  { number: 447, title: "Trust and Obey" },
  { number: 448, title: "Just a Closer Walk with Thee" },
  { number: 450, title: "I Need Thee Every Hour" },
  { number: 458, title: "Nearer, My God, to Thee" },
  { number: 469, title: "Revive Us Again" },
  { number: 473, title: "More Love to Thee, O Christ" },
  { number: 484, title: "Higher Ground" },
  { number: 485, title: "Stand Up, Stand Up for Jesus" },
  { number: 493, title: "Onward, Christian Soldiers" },
  { number: 502, title: "Open My Eyes That I May See" },
  { number: 514, title: "When We All Get to Heaven" },
  { number: 515, title: "There's a Land That Is Fairer Than Day" },
  { number: 516, title: "When the Roll Is Called Up Yonder" },
  { number: 518, title: "Shall We Gather at the River" },
  { number: 524, title: "We're Marching to Zion" },
  { number: 535, title: "I Will Sing the Wondrous Story" },
  { number: 540, title: "Saved, Saved" },
  { number: 544, title: "Redeemed, How I Love to Proclaim It" },
  { number: 546, title: "Love Lifted Me" },
  { number: 547, title: "I Stand Amazed in the Presence" },
  { number: 559, title: "Rescue the Perishing" },
  { number: 572, title: "I Love to Tell the Story" },
  { number: 575, title: "I Will Sing of My Redeemer" },
  { number: 576, title: "Take the Name of Jesus with You" },
  { number: 581, title: "We Have Heard the Joyful Sound" },
  { number: 587, title: "Jesus Shall Reign" },
  { number: 600, title: "More About Jesus" },
];

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
                <input type={field.type} required={field.required} value={(form as unknown)[field.key]}
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

export default function HymnsPage() {
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState<"title" | "number">("title");
  const [selectedHymn, setSelectedHymn] = useState<typeof HYMNS[0] | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return HYMNS;
    const q = search.trim().toLowerCase();
    return HYMNS.filter(h =>
      searchBy === "title"
        ? h.title.toLowerCase().includes(q)
        : h.number.toString().includes(q)
    );
  }, [search, searchBy]);

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
              BAPTIST HYMNAL
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Hymns of <span className="text-gradient-gold">Praise</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Search the Baptist Hymnal by title or number. Join us in lifting our voices in worship.
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
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-10">
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

        <p className="text-text-muted text-sm mb-6">{filtered.length} hymn{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Hymn grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((hymn, i) => (
            <button
              key={hymn.number}
              onClick={() => setSelectedHymn(selectedHymn?.number === hymn.number ? null : hymn)}
              className={`hymn-card rounded-2xl p-5 text-left transition-all shadow-sm animate-fade-in ${
                selectedHymn?.number === hymn.number ? "border-accent bg-accent/5" : "border-stone-100"
              }`}
              style={{ animationDelay: `${(i % 12) * 0.04}s` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  selectedHymn?.number === hymn.number ? "bg-accent text-primary-dark" : "bg-accent/10 text-accent"
                }`}>
                  {hymn.number}
                </div>
                <div>
                  <p className="font-serif font-semibold text-primary text-sm leading-snug">{hymn.title}</p>
                  <p className="text-text-muted text-xs mt-1">Baptist Hymnal</p>
                </div>
              </div>
              {selectedHymn?.number === hymn.number && (
                <div className="mt-4 pt-4 border-t border-accent/20 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs text-accent font-medium mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                    Hymn #{hymn.number}
                  </div>
                  <p className="text-text-muted text-xs">Full lyrics available in the Baptist Hymnal (1991 edition). Ask a church usher for a physical copy.</p>
                  <a
                    href={`https://hymnary.org/search?qu=${encodeURIComponent(hymn.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-light font-semibold hover:text-accent transition-colors"
                  >
                    View on Hymnary.org
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
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
