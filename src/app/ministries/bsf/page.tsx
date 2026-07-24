"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BSFPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold">
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>BAPTIST STUDENT FELLOWSHIP</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">
              Baptist Student<br /><span className="text-gradient-gold">Fellowship</span>
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">
              "Don&apos;t let anyone look down on you because you are young" — 1 Timothy 4:12
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" alt="Baptist Student Fellowship"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Students & Young Adults</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">History of BSF in Nigeria</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                The Baptist Student Fellowship (BSF) traces its roots to the early 20th century when Southern Baptist missionaries began campus ministry work among Nigerian university students. The organisation was initially known as the <strong>Baptist Student Union (BSU)</strong> before being officially renamed the <strong>Baptist Student Fellowship (BSF)</strong> in <strong>1978</strong>.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                Key milestones include the appointment of Miss E. O. Ogunsola as a pioneering coordinator, and in 1979, Miss Marie Van Lear became the Student Ministries Coordinator — expanding BSF&apos;s reach across Nigerian campuses. The <strong>BSF Alumni Association</strong> was founded in 1982, and the <strong>BSF–NYSC Programme</strong> was launched in 1983, extending the fellowship&apos;s impact into national service.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Today, BSF operates in 10 zones across Nigeria and is coordinated by the Nigerian Baptist Convention&apos;s Department of Youths and Students Ministries, connecting Baptist students across institutions in fellowship, discipleship, and kingdom witness.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 reveal">
            {[
              { label: "Founded", value: "1978 (renamed from Baptist Student Union)" },
              { label: "Target Group", value: "Tertiary institution students & NYSC members" },
              { label: "Zones", value: "10 zones across Nigeria" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-stone-100 p-5 text-center shadow-sm">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-primary font-bold mb-8 text-center">What BSF Does</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Campus Evangelism", desc: "Active witness on campuses, leading fellow students to Christ through personal evangelism, outreaches, and open-air programmes." },
              { title: "Discipleship", desc: "Structured discipleship groups that ground students in the Word, prayer, and Christian character for lifelong faith." },
              { title: "NYSC Ministry", desc: "The BSF-NYSC Programme connects Baptist corps members across states for fellowship, witness, and service during national service." },
              { title: "Conferences & Conventions", desc: "Annual state and national BSF conferences bring students together for teaching, worship, and vision-casting." },
              { title: "Community Service", desc: "Campus and community outreach projects that demonstrate the love of Christ in practical ways." },
              { title: "Alumni Network", desc: "The BSF Alumni Association (founded 1982) connects graduates who continue to support the work of student ministry across Nigeria." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl text-white font-bold mb-4">Are You a Baptist Student?</h2>
          <p className="text-white/70 mb-8 text-sm">If you are a student or NYSC member connected to Trinity Baptist Church, Ilora, we&apos;d love to connect you with the BSF network. Contact us to find out more.</p>
          <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
            Get Connected
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
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
