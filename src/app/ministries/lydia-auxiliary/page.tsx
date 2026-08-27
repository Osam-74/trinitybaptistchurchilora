"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uploadToR2 } from "@/lib/r2";
import { submitMembership } from "@/lib/ministryMembers";
import MemberDirectory from "@/components/MemberDirectory";

const LYDIA_STEPS = [
  { step: 1, name: "Step 1 — First Year" },
  { step: 2, name: "Step 2 — Second Year" },
  { step: 3, name: "Step 3 — Third Year" },
  { step: 4, name: "Step 4 — Fourth Year" },
  { step: 5, name: "Step 5 — Fifth Year (Service Award)" },
];

export default function LydiaAuxiliaryPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", rank: "", photoFile: null as File | null });
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, photoFile: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.rank || !form.photoFile) {
      setError("Please fill all fields and upload your photo.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const url = await uploadToR2(form.photoFile, "members");
      await submitMembership({
        ministry: "lydia-auxiliary",
        fullName: form.fullName.trim(),
        rank: form.rank,
        photoUrl: url,
      });
      setSuccess(true);
      setShowForm(false);
    } catch (err) {
      setError("Submission failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold">
              <span>MINISTRIES</span>
              <span className="opacity-40">›</span>
              <span>LYDIA AUXILIARY</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">
              Lydia<br /><span className="text-gradient-gold">Auxiliary</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl max-w-2xl mx-auto">
              "To open their eyes and to turn them from darkness to light" — Acts 26:18a
            </p>
          </div>
        </div>
      </div>

      {/* History + image */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ77jwXm__WjHqoV_jjMS3Q3nQVU57q3FpXZYt8oIl6ErcfVWvPtgaRlgk&s=10"
                alt="Lydia Auxiliary"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <span className="inline-block bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Young Women · Ages 17+</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">History of Lydia Auxiliary</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Lydia Auxiliary started as the Young People&apos;s Group in <strong>1946</strong> under the leadership of <strong>Mrs. Rebecca Taiwo</strong> (1946–1947), subsequently led by Miss Bykota Ebun Omikunle (1948–1949) and Miss Ibidun John (1951). The group was established to minister to the needs of young unmarried ladies, stimulate interest in missions, and encourage Christian living.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                In <strong>1952</strong>, the Young People&apos;s Group metamorphosed into the Lydia Circle, organised under the leadership of Miss Mary Ellen Yancey (1952–1955), separating young ladies from younger girls to better minister to women aged 17 and above who had never married. The Guidebook committee later recommended renaming it the Lydia Auxiliary — a name adopted and retained to this day.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Named after Lydia of Thyatira (Acts 16:14) — a businesswoman whose heart the Lord opened — the Lydia Auxiliary today is the young women&apos;s arm of the Women Missionary Union in the Nigerian Baptist Convention, building virtuous, mission-minded daughters of God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key sections: Watchword, Colours, Uniform, Awards */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 reveal">

            {/* Watchword */}
            <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Lydia Watchword</h3>
              </div>
              <blockquote className="border-l-4 border-purple-400 pl-4 text-stone-700 italic text-sm leading-relaxed mb-2">
                "To open their eyes and to turn them from darkness to light, and from the power of Satan unto God…"
              </blockquote>
              <p className="text-stone-400 text-xs">— Acts 26:18a</p>
              <p className="text-stone-500 text-sm mt-3 leading-relaxed">The Lydia Auxiliary hymn is <em>"Hark the Voice of Jesus Calling"</em> — a call to mission and devotion to Christ above all else.</p>
            </div>

            {/* Colours */}
            <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Lydia Colours</h3>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-stone-200"/>
                  <div>
                    <p className="text-xs font-bold text-primary">Purple</p>
                    <p className="text-xs text-stone-400">Royalty — Lydias are daughters of the King of kings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-stone-300"/>
                  <div>
                    <p className="text-xs font-bold text-primary">White</p>
                    <p className="text-xs text-stone-400">Purity — Lydias live clean, upright, and virtuous lives</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uniform */}
            <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Lydia Uniform</h3>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                The original Lydia uniform — introduced at the Jos Convention in 1985 — was a <strong>purple gown taped with white</strong>, worn with a white belt, cap, white socks and canvas.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                In <strong>2014</strong>, a new uniform was introduced: a <strong>white shirt on a purple skirt</strong>, with a beret, thin white belt, and customised socks worn with white canvas. A Lydia is expected to be neatly and modestly dressed as a peculiar treasure representing the Most High.
              </p>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Lydia Awards</h3>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                Lydia Awards offer challenging opportunities for excelling in missionary service. There are three levels: the <strong>Service Award</strong>, the <strong>Honour Award</strong>, and the <strong>Career Missionary Award</strong>. The Service Award must be completed before a Lydia can begin working on the Honour Award.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                By the year 2000, 1,259 Lydias completed the Service Award nationwide, 545 received the Honour Award, and 256 qualified for the Career Missionary Award — a testament to the depth of dedication within the Lydia Auxiliary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lydia Steps */}
      <section className="py-16 bg-bg reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-2">Lydia Steps</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto">Members progress through 5 years of disciplined service and missionary growth, concluding with the Lydia Service Award.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {LYDIA_STEPS.map(s => (
              <div key={s.step} className="bg-white border border-stone-100 rounded-2xl p-4 text-center shadow-sm hover:border-purple-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">{s.step}</div>
                <p className="text-xs font-bold text-primary">{s.name.split("— ")[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideals */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="font-serif text-2xl text-primary font-bold mb-6 text-center">The Four Lydia Ideals</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: "Study", desc: "Study of the missionary message of the Bible" },
              { title: "Prayer", desc: "Prayer for missions and missionaries worldwide" },
              { title: "Service", desc: "Devoted personal service for the spiritually and physically needy" },
              { title: "Giving", desc: "Regular giving to support worldwide missions work" },
            ].map(ideal => (
              <div key={ideal.title} className="bg-white rounded-2xl border border-purple-100 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center mx-auto mb-3">{ideal.title[0]}</div>
                <h3 className="font-bold text-primary text-sm mb-1">{ideal.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{ideal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-16 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-bold mb-4">Join Lydia Auxiliary</h2>
          <p className="text-white/70 mb-8">Register to become a member of the Lydia Auxiliary at Trinity Baptist Church, Ilora. Upload a photo in Lydia uniform and select your current step.</p>
          {success ? (
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-6 text-white">
              <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p className="font-bold text-lg mb-1">Registration Submitted!</p>
              <p className="text-white/70 text-sm">Your application is pending admin approval. You will be contacted after review.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <button onClick={() => setShowForm(!showForm)}
                className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Register as a Lydia Member
              </button>
              </div>
              {showForm && (
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-left space-y-4 mt-4">
                  <div>
                    <label className="text-white/80 text-sm font-semibold block mb-1">Full Name *</label>
                    <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-semibold block mb-1">Current Step *</label>
                    <select value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm" required>
                      <option value="" className="text-stone-800">Select your step…</option>
                      {LYDIA_STEPS.map(s => <option key={s.step} value={s.name} className="text-stone-800">{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-semibold block mb-1">Photo in Lydia Uniform *</label>
                    <p className="text-white/50 text-xs mb-2">Please upload a clear photo of yourself in your Lydia Auxiliary uniform (white shirt, purple skirt, beret).</p>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-white/70 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent file:text-primary-dark" required />
                    {photoPreview && <img src={photoPreview} alt="Preview" className="mt-3 w-24 h-24 rounded-xl object-cover border-2 border-accent/30"/>}
                  </div>
                  {error && <p className="text-red-300 text-sm">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={submitting}
                      className="flex-1 btn-shine btn-gold py-3 rounded-xl font-bold text-primary-dark text-sm disabled:opacity-50">
                      {submitting ? "Submitting…" : "Submit Registration"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-5 py-3 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <MemberDirectory ministry="lydia-auxiliary" ministryLabel="Lydia Auxiliary" />
            </>
          )}
        </div>
      </section>

      <section className="py-10 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back to All Ministries
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}