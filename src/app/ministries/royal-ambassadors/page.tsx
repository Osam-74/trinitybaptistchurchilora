"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uploadToR2 } from "@/lib/r2";
import { submitMembership } from "@/lib/ministryMembers";
import MemberDirectory from "@/components/MemberDirectory";

const RA_RANKS = [
  { rank: 1, name: "Rank 1 — Assistant Intern" },
  { rank: 2, name: "Rank 2 — Intern" },
  { rank: 3, name: "Rank 3 — Senior Intern" },
  { rank: 4, name: "Rank 4 — Envoy" },
  { rank: 5, name: "Rank 5 — Special Envoy" },
  { rank: 6, name: "Rank 6 — Senior Envoy" },
  { rank: 7, name: "Rank 7 — Dean" },
  { rank: 8, name: "Rank 8 — Ambassador" },
  { rank: 9, name: "Rank 9 — Ambassador Extra-ordinary" },
  { rank: 10, name: "Rank 10 — Ambassador Pleni-potentiary" },
];

export default function RoyalAmbassadorsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", rank: "", photoFile: null as File | null, raIdCardNumber: "", occupation: "" });
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
        ministry: "royal-ambassadors",
        fullName: form.fullName.trim(),
        rank: form.rank,
        photoUrl: url,
        ...(form.raIdCardNumber.trim() ? { raIdCardNumber: form.raIdCardNumber.trim() } : {}),
        ...(form.occupation.trim() ? { occupation: form.occupation.trim() } : {}),
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
              <span>ROYAL AMBASSADORS</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">
              Royal<br /><span className="text-gradient-gold">Ambassadors</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl max-w-2xl mx-auto">
              "We are Ambassadors for Christ" — 2 Corinthians 5:20
            </p>
          </div>
        </div>
      </div>

      {/* Hero image + intro */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img
                src="/images/royal-ambassadors.jpg"
                alt="Royal Ambassadors"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
                
              />
            </div>
            <div>
              <span className="inline-block bg-accent/10 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Boys · Ages 10+</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About Royal Ambassadors</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                The Royal Ambassadors (RA) is the boys' missions organisation of the Nigerian Baptist Convention, operating under the Men's Missionary Union (MMU). Founded to fulfil the Great Commission among the next generation, RA trains boys from age 10 and above to become devoted followers of Christ and active kingdom workers.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                The RA programme was established in the NBC to cultivate in young men a passion for Scripture, a love for missions, and the discipline of Christian character. Boys meet weekly in chapters, where they study the Bible, learn about missionaries, earn merit ranks, and engage in community service projects — all under the banner of the King's Business.
              </p>
              <p className="text-stone-600 leading-relaxed">
                At Trinity Baptist Church, Ilora, the RA chapter is a vibrant fellowship where young men are challenged to grow spiritually, serve sacrificially, and represent Christ with courage and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key info cards */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 reveal">
            {[
              { label: "Motto", value: '"The King\'s Business"', icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "Watchword", value: "2 Corinthians 5:20", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
              { label: "Colours", value: "Red, White & Blue", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Age Group", value: "10+ years", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-stone-100 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/></svg>
                </div>
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranks */}
      <section className="py-16 bg-bg reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-2">RA Ranks</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto">Members progress through 10 ranks by completing requirements in Bible study, service, missions, and character development.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {RA_RANKS.map(r => (
              <div key={r.rank} className="bg-white border border-stone-100 rounded-2xl p-4 text-center shadow-sm hover:border-accent/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary text-accent font-bold text-sm flex items-center justify-center mx-auto mb-2">{r.rank}</div>
                <p className="text-xs font-bold text-primary">{r.name.split("— ")[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="font-serif text-3xl text-primary font-bold mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Weekly Chapter Meetings", desc: "Bible study, RA pledges, songs, and missions lessons every week in a structured chapter setting." },
              { title: "Rank Advancement", desc: "Boys earn ranks by completing merit projects in Bible knowledge, community service, and personal conduct." },
              { title: "RA Congress", desc: "Annual state and national RA Congress where chapters gather for competition, fellowship, and spiritual challenge." },
              { title: "Missions Education", desc: "Learning about missionaries worldwide and the NBC's mission work across Nigeria and beyond." },
              { title: "Community Service", desc: "Practical service projects that teach boys to love their neighbours and serve their community for Christ." },
              { title: "Scripture Memorisation", desc: "Regular Bible memory drills that ground boys in the Word of God from an early age." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-accent mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-16 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-bold mb-4">Join the Royal Ambassadors</h2>
          <p className="text-white/70 mb-8">Register your son or yourself to become a member of the RA chapter at Trinity Baptist Church, Ilora. Upload a photo in RA uniform and select your current rank.</p>
          {success ? (
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-6 text-white">
              <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p className="font-bold text-lg mb-1">Registration Submitted!</p>
              <p className="text-white/70 text-sm">Your application is pending admin approval. You will be contacted after review.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Register as Royal Ambassador
                </button>
                <MemberDirectory ministry="royal-ambassadors" ministryLabel="Royal Ambassadors" />
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
                    <label className="text-white/80 text-sm font-semibold block mb-1">Current Rank *</label>
                    <select value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      required>
                      <option value="" className="text-stone-800">Select your rank…</option>
                      {RA_RANKS.map(r => <option key={r.rank} value={r.name} className="text-stone-800">{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-semibold block mb-1">Photo in RA Uniform *</label>
                    <p className="text-white/50 text-xs mb-2">Please upload a clear photo of yourself in your Royal Ambassador uniform.</p>
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
