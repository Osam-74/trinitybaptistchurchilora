"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SundaySchoolPage() {
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
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>SUNDAY SCHOOL</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">Sunday<br /><span className="text-gradient-gold">School</span></h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">"Train up a child in the way he should go" — Proverbs 22:6</p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" alt="Sunday School" className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-teal-100 text-teal-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">All Ages</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About Sunday School</h2>
              <p className="text-stone-600 leading-relaxed mb-4">Sunday School is the comprehensive weekly Bible education arm of Trinity Baptist Church — serving all age groups from the cradle roll to adult. Organised into age-graded departments (Beginners, Primary, Junior, Intermediate, Young People, and Adult), Sunday School uses NBC-approved curriculum to ground every member in the Word of God systematically and thoroughly.</p>
              <p className="text-stone-600 leading-relaxed mb-4">Held every Sunday from 8:00 AM – 9:30 AM, Sunday School is not just for children — it is the foundation of Christian formation for the entire congregation. Teachers are trained regularly to deliver sound biblical content in ways that are relevant, engaging, and transformative.</p>
              <p className="text-stone-600 leading-relaxed">Whether you are 5 or 75, there is a Sunday School class for you. Come and grow in the knowledge of God&apos;s Word.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 reveal">
            {[
              { title: "Age-Graded Departments", desc: "Classes designed for every stage of life — from toddlers to senior adults." },
              { title: "NBC-Approved Curriculum", desc: "Structured Bible content vetted by the Nigerian Baptist Convention for sound doctrine." },
              { title: "Teacher Training", desc: "Regular training and quarterly reviews to ensure quality and effectiveness of teaching." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-teal-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-stone-50"><div className="max-w-4xl mx-auto px-4 text-center"><Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-dark text-sm mb-4">Join Sunday School<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link><br/><Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2 mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back to All Ministries</Link></div></section>
      <Footer />
    </main>
  );
}
