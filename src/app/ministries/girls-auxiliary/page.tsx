"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { uploadToR2 } from "@/lib/r2";
import { submitMembership } from "@/lib/ministryMembers";
import MemberDirectory from "@/components/MemberDirectory";

const GA_STEPS = [
  { step: 1, name: "Step 1 — Maiden" },
  { step: 2, name: "Step 2 — Lady-in-Waiting" },
  { step: 3, name: "Step 3 — Princess" },
  { step: 4, name: "Step 4 — Queen" },
  { step: 5, name: "Step 5 — Queen with Scepter" },
  { step: 6, name: "Step 6 — Queen with Regent" },
  { step: 7, name: "Step 7 — Queen in Service" },
];

export default function GirlsAuxiliaryPage() {
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
        ministry: "girls-auxiliary",
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
              <span>GIRLS&apos; AUXILIARY</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">
              Girls&apos;<br /><span className="text-gradient-gold">Auxiliary</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl max-w-2xl mx-auto">
              "Arise, shine; for thy light is come" — Isaiah 60:1
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Lq5qTCNfXMzP39KXbq8RjOE_mDHoXdjvHK7wui8uZ1fEVsbUXldvA92W&s=10"
                alt="Girls Auxiliary"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <span className="inline-block bg-green-100 text-green-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Girls · Ages 10+</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">History of Girls&apos; Auxiliary</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                The Girls&apos; Auxiliary was pioneered in Nigeria in 1922 by Mrs. Carson, a Southern Baptist Convention missionary, who gathered girls too old for the Sunbeam Band to form a &ldquo;Girls&apos; Association&rdquo; — renamed Girls&apos; Auxiliary that same year. Miss Grace Emokpae (later Mrs. Sagie) was among the earliest leaders in Lagos, while Miss Young championed the work in Ogbomoso.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                By 1924, nine GA chapters had been established across Ijora, Awe, Ode-Omu, Ibadan, Iresi, Ikire, Abeokuta, Igbajo, and Ogbomoso — with 149 enrolled members. The organisation was officially recognised as part of the Women Missionary Union family in 1925. That year, its permanent watchword — Isaiah 60:1 — was adopted.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Today, the Girls&apos; Auxiliary is the NBC&apos;s vibrant missions organisation for girls ages 10 and above, structured in two groups: Junior (10–12) and Intermediate (13+). Members advance through seven Forward Steps, growing in faith, missions knowledge, and Christian character — before graduating to the Lydia Auxiliary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 reveal">
            {[
              { label: "Watchword", value: "Isaiah 60:1", col: "green" },
              { label: "Colours", value: "Green & White", col: "green" },
              { label: "Emblem", value: "White Star in Green Octagon", col: "green" },
              { label: "Age Group", value: "10+ years", col: "green" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-stone-100 p-5 text-center shadow-sm">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forward Steps */}
      <section className="py-16 bg-bg reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-2">Forward Steps</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto">GA members advance through 7 progressive steps, each building deeper commitment to Christ and missions service.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GA_STEPS.map(s => (
              <div key={s.step} className="bg-white border border-stone-100 rounded-2xl p-4 text-center shadow-sm hover:border-green-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-700 text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">{s.step}</div>
                <p className="text-xs font-bold text-primary">{s.name.split("— ")[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="font-serif text-3xl text-primary font-bold mb-8 text-center">What GA Does</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Missions Education", desc: "Learning about the NBC's mission work in Nigeria and worldwide through structured missions curricula." },
              { title: "Forward Steps Programme", desc: "A structured advancement path where girls complete spiritual, academic, and service requirements at each step." },
              { title: "Bible Memorisation", desc: "Regular scripture memory drills grounding girls in the Word of God from an early age." },
              { title: "Community Service", desc: "Service projects that teach girls to love their neighbours and serve their community for Christ." },
              { title: "Annual GA Camp", desc: "State and national camps for fellowship, leadership training, and spiritual challenge among GA chapters." },
              { title: "Prayer & Witness", desc: "Learning the discipline of prayer and personal evangelism — sharing their faith with boldness and love." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 mb-3"/>
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
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-bold mb-4">Join Girls&apos; Auxiliary</h2>
          <p className="text-white/70 mb-8">Register to become a member of the GA chapter at Trinity Baptist Church, Ilora. Upload a photo in GA uniform and select your current Forward Step.</p>
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
                  className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Register as a GA Member
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
                    <label className="text-white/80 text-sm font-semibold block mb-1">Current Forward Step *</label>
                    <select value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent text-sm" required>
                      <option value="" className="text-stone-800">Select your step…</option>
                      {GA_STEPS.map(s => <option key={s.step} value={s.name} className="text-stone-800">{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-semibold block mb-1">Photo in GA Uniform *</label>
                    <p className="text-white/50 text-xs mb-2">Please upload a clear photo of yourself in your Girls&apos; Auxiliary uniform.</p>
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
              <MemberDirectory ministry="girls-auxiliary" ministryLabel="Girls&apos; Auxiliary" />
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