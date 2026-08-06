"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function YouthFellowshipPage() {
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
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>BAPTIST YOUTH FELLOWSHIP</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">Baptist Youth<br /><span className="text-gradient-gold">Fellowship (BYF)</span></h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">"Don&apos;t let anyone look down on you because you are young" — 1 Timothy 4:12</p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80" alt="Baptist Youth Fellowship" className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Young Adults · Ages 18–35</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About BYF</h2>
              <p className="text-stone-600 leading-relaxed mb-4">Baptist Youth Fellowship (BYF) is the dynamic arm of Trinity Baptist Church for young adults aged 18–35. BYF exists to engage the youth generation through vibrant worship, leadership development, targeted evangelism, and kingdom purpose — building a generation that is bold for Christ in every arena of life.</p>
              <p className="text-stone-600 leading-relaxed mb-4">The fellowship organises weekly meetings, retreats, conventions, community projects, and regular gatherings that ignite passion for God. BYF at Trinity Baptist Church is a family — a place where young people are discipled, challenged, and sent out to make a difference.</p>
              <p className="text-stone-600 leading-relaxed">Young adults between ages 18–35 are welcome to join the BYF fellowship. Come as you are — grow together, serve together, shine together.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 reveal">
            {[
              { title: "Weekly Meetings", desc: "Regular BYF meetings with worship, Bible study, and discipleship for young adults." },
              { title: "Youth Retreats", desc: "Annual retreats and conventions for spiritual renewal, fellowship, and vision." },
              { title: "Community Outreach", desc: "Youth-led evangelism and community service projects that demonstrate the love of Christ." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-stone-50"><div className="max-w-4xl mx-auto px-4 text-center"><Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-dark text-sm mb-4">Join BYF<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link><br/><Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2 mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back to All Ministries</Link></div></section>
      <Footer />
    </main>
  );
}
