"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ChoirPage() {
  useEffect(() => {
    const obs = new IntersectionObserver((e) => e.forEach(en => { if (en.isIntersecting) { en.target.classList.add("revealed"); obs.unobserve(en.target); } }), { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold">
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>CHOIR & MUSIC</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">Choir &<br /><span className="text-gradient-gold">Music Ministry</span></h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">"Sing to the LORD a new song; sing to the LORD, all the earth" — Psalm 96:1</p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" alt="Choir Ministry" className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">All Ages Welcome</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About the Music Ministry</h2>
              <p className="text-stone-600 leading-relaxed mb-4">The Choir & Music Ministry at Trinity Baptist Church is dedicated to excellence in worship. Led by Rev&apos;d Johnson Oyetunde (Music Minister), the ministry comprises the Senior Choir, Youth Choir, and Children&apos;s Choir — all working together to lead the congregation into the presence of God through anointed music and song.</p>
              <p className="text-stone-600 leading-relaxed mb-4">Rehearsals are held weekly, and the music ministry is involved in every worship service — Sunday School, Main Service, midweek meetings, and special programmes. The choir also prepares special musical presentations for conventions, anniversaries, and outreach events.</p>
              <p className="text-stone-600 leading-relaxed">If you have a gift for singing or playing an instrument, you are invited to join the music ministry and use your talent for the glory of God.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 reveal">
            {[
              { title: "Senior & Youth Choirs", desc: "Vibrant choirs for adults and young people, leading worship at all services and programmes." },
              { title: "Weekly Rehearsals", desc: "Dedicated practice sessions ensuring musical excellence in all worship engagements." },
              { title: "Special Presentations", desc: "Musical concerts, anniversary performances, and special worship events throughout the year." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-stone-50"><div className="max-w-4xl mx-auto px-4 text-center"><Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-dark text-sm mb-4">Join the Choir<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link><br/><Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2 mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back to All Ministries</Link></div></section>
      <Footer />
    </main>
  );
}
