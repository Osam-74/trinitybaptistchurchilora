"use client";

import { useEffect, useState, useRef } from "react";
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

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const stats = [
  { label: "Years in Ministry", target: 30, suffix: "+" },
  { label: "Lives Transformed", target: 1200, suffix: "+" },
  { label: "Community Outreaches", target: 85, suffix: "+" },
];

const philosophy = [
  { title: "Vision", desc: "To see Trinity Baptist Church become a beacon of hope, healing, and transformation — a church that reaches every corner of Ilora and beyond with the undiluted Gospel.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { title: "Mission", desc: "To preach the Word faithfully, make disciples intentionally, care for the flock compassionately, and partner with the Nigerian Baptist Convention in advancing God's kingdom.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { title: "Approach", desc: "Led by the Holy Spirit, grounded in Scripture, and anchored in prayer — with a pastoral heart that meets people where they are and walks with them toward where God is calling them.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

export default function PastorPage() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              LEADERSHIP
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Meet Our <span className="text-gradient-gold">Pastor</span>
            </h1>
            <p className="text-white/65 text-xl text-display italic animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Shepherd · Teacher · Servant of God
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Portrait */}
            <div className="lg:col-span-2 reveal-left">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl img-zoom">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                  alt="Rev'd Dr S. O. Mosebolatan — Senior Pastor"
                  className="w-full h-[520px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent"/>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4 rounded-2xl text-white">
                    <p className="text-accent font-bold text-sm">REV'D DR S. O. MOSEBOLATAN</p>
                    <p className="text-xs text-white/80">Senior Pastor, Trinity Baptist Church, Ilora</p>
                  </div>
                </div>
              </div>
              {/* Favourite verse */}
              <div className="mt-6 bg-primary-dark rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-4 left-4 text-accent/20 text-6xl font-serif leading-none">&ldquo;</div>
                <p className="relative z-10 text-white/85 text-sm leading-relaxed italic text-display pt-4">
                  I have come that they may have life, and have it to the full.
                </p>
                <p className="text-accent text-xs font-bold mt-2 relative z-10">— John 10:10 (Favourite Scripture)</p>
              </div>
            </div>

            {/* Bio Text */}
            <div className="lg:col-span-3 reveal-right">
              <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>SENIOR PASTOR</div>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-2 leading-tight">Rev&apos;d Dr S. O.<br/>Mosebolatan</h2>
              <div className="gold-divider max-w-xs mb-8"/>
              <div className="space-y-5 text-stone-600 leading-relaxed">
                <p>Rev&apos;d Dr S. O. Mosebolatan is a devoted servant of God who has faithfully shepherded Trinity Baptist Church, Ilora with wisdom, compassion, and unwavering vision. A scholar of the Word and a preacher of remarkable depth, his ministry has touched hundreds of lives across Ilora and Oyo State.</p>
                <p>Ordained and recognised under the Nigerian Baptist Convention, Pastor Mosebolatan carries a burning passion for discipleship, missions, and the transformational power of the Gospel. Under his leadership, Trinity Baptist Church has experienced significant spiritual growth, expanded its community outreach programmes, and deepened its commitment to raising kingdom leaders.</p>
                <p>Known for his accessibility, pastoral warmth, and Spirit-filled preaching, he is not just a pastor who preaches from a pulpit — he walks alongside his congregation through life&apos;s most tender moments, celebrating victories and providing godly counsel in seasons of challenge.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {stats.map((stat) => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const { count, ref } = useCounter(stat.target);
                  return (
                    <div key={stat.label} ref={ref} className="bg-bg-alt rounded-2xl p-5 text-center border border-stone-100">
                      <p className="counter-num text-3xl lg:text-4xl text-primary">{count}{stat.suffix}</p>
                      <p className="text-stone-500 text-xs mt-1 font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Philosophy */}
      <section className="py-24 bg-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>PASTORAL HEART<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Ministry <span className="text-gradient-gold">Philosophy</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {philosophy.map((item, i) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon}/></svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sermons CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="floating-orb w-64 h-64 bg-accent/5 -top-20 -left-20 animate-float-slow"/>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-bold mb-4">Hear the Pastor Preach</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">Browse our full archive of sermons, teachings, and special messages from Rev&apos;d Dr S. O. Mosebolatan — powerful, scripture-grounded, and life-changing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sermons" className="btn-shine btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
              Browse Sermon Library
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <Link href="/contact" className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold">
              Send a Prayer Request
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
