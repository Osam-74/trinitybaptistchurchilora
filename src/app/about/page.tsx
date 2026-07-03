"use client";

import { useEffect, useState } from "react";
import { listLeaders, defaultLeaders } from "@/lib/leaders";
import { Leader } from "@/types";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }); },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const values = [
  { title: "Faith", desc: "Rooted in the Word of God, we walk by faith and not by sight.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { title: "Community", desc: "A welcoming family where everyone belongs and is loved.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Service", desc: "Committed to impacting our community through Christ-like service.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Growth", desc: "Encouraging every member to grow deeper in their walk with God.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { title: "Worship", desc: "Lifting up God in spirit and truth through music, prayer, and praise.", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" },
  { title: "Prayer", desc: "A house of prayer — we believe in the transforming power of intercession.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

export default function AboutPage() {
  useScrollReveal();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [debug, setDebug] = useState<string>("loading...");

  useEffect(() => {
    listLeaders()
      .then(data => {
        const active = data.filter(l => l.active);
        setLeaders(active.length > 0 ? data : defaultLeaders);
        setDebug(`fetched ${data.length} docs, ${active.length} active${active.length === 0 ? " (using 4 defaults)" : ""}`);
      })
      .catch(err => {
        setLeaders(defaultLeaders);
        setDebug(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
      });
  }, []);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ABOUT US
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Our <span className="text-gradient-gold">Story</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Decades of faith, fellowship, and fruitful service to God and community
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4">
                <div className="w-8 h-px bg-primary-light/40"/>
                OUR MISSION
              </div>
              <h2 className="font-serif text-4xl font-bold text-primary mb-6">
                Built on the <span className="text-gradient-gold">Rock</span> of Christ
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-5">
                Trinity Baptist Church, Ilora was founded with a singular vision: to be a <em className="text-primary font-medium">Sanctuary of Praise</em> — a place where lives are transformed by the power of God&apos;s Word and the love of a genuine community.
              </p>
              <p className="text-text-muted leading-relaxed mb-8">
                Through decades of faithful ministry under the leadership of Rev&apos;d Dr S. O. Mosebolatan, we have grown into a vibrant congregation committed to evangelism, discipleship, and community impact across Ilora and beyond.
              </p>
              <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold">
                Get In Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>

            {/* Cross graphic */}
            <div className="flex items-center justify-center reveal-right">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <svg viewBox="0 0 80 100" className="w-24 h-32 text-accent-dark animate-cross-glow" fill="currentColor">
                    <rect x="34" y="0" width="12" height="100" rx="6"/>
                    <rect x="0" y="28" width="80" height="12" rx="6"/>
                  </svg>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/10 animate-float-slow"/>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/10 animate-float-slow" style={{ animationDelay: '2s' }}/>
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-rotate-ring"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4">
              <div className="w-8 h-px bg-primary-light/40"/>
              WHAT WE BELIEVE
              <div className="w-8 h-px bg-primary-light/40"/>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary">Our Core <span className="text-gradient-gold">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon}/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">{v.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMP DEBUG — remove once leadership display is confirmed working */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <p className="text-xs font-mono bg-accent/10 text-primary border border-accent/30 rounded-lg px-3 py-2 text-center">
          [debug] leaders: {debug} — build 2026-07-03
        </p>
      </div>

      {/* Leadership */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4">
              <div className="w-8 h-px bg-primary-light/40"/>
              MEET THE TEAM
              <div className="w-8 h-px bg-primary-light/40"/>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary">Church <span className="text-gradient-gold">Leadership</span></h2>
            <p className="text-text-muted mt-3 max-w-xl mx-auto">Godly leaders dedicated to shepherding the flock of Trinity Baptist Church, Ilora</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.filter(l => l.active).map((leader, i) => (
              <div key={leader.id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm card-hover text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={leader.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} alt={leader.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent"/>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-primary mb-1">{leader.name}</h3>
                  <p className="text-primary-light text-sm font-semibold mb-3">{leader.role}</p>
                  <p className="text-text-muted text-xs leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-40"/>
        <div className="relative max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="font-serif text-3xl text-white font-bold mb-4">Be Part of Our Family</h2>
          <p className="text-white/60 mb-7">Join us this Sunday at 7:30 AM or 10:00 AM and experience the warmth of Trinity Baptist Church, Ilora.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-shine btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold">
              Book a Pastor Session
            </Link>
            <Link href="/contact" className="btn-shine inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold glass-card text-white hover:bg-white/15 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
