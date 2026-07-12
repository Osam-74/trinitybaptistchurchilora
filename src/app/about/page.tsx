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

const timeline = [
  { year: "Founded", title: "Established in Faith", desc: "Trinity Baptist Church, Ilora was established as part of the Nigerian Baptist Convention's visionary expansion — beginning as a small, fervent house fellowship dedicated to the pure gospel of Jesus Christ." },
  { year: "Growth", title: "Vibrant Congregation", desc: "Experiencing the favour of God, the church grew rapidly in membership. The physical sanctuary was expanded to welcome hundreds of families seeking spiritual nourishment and genuine community." },
  { year: "Outreach", title: "Community Impact", desc: "Launch of deep community outreach initiatives, evangelical crusades, local welfare schemes, and structured social impact programs reaching across Ilora and Oyo State." },
  { year: "Today", title: "Sanctuary of Praise", desc: "Now a thriving, spiritually vibrant congregation under the anointed leadership of Rev'd Dr S. O. Mosebolatan — shepherding souls into everlasting grace and transforming lives through God's Word." },
];

export default function AboutPage() {
  useScrollReveal();
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    listLeaders()
      .then((data) => { const active = data.filter((l) => l.active); setLeaders(active.length > 0 ? data : defaultLeaders); })
      .catch(() => setLeaders(defaultLeaders));
  }, []);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ABOUT US
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Our Story &<br/><span className="text-gradient-gold">Mission</span>
            </h1>
            <p className="text-white/60 text-lg lg:text-xl animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Decades of faith, fellowship, and fruitful service to God and community in Oyo State, Nigeria.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>OUR MISSION</div>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">Built on the <span className="text-gradient-gold">Rock</span> of Christ</h2>
              <p className="text-stone-700 text-lg leading-relaxed mb-5">
                Trinity Baptist Church, Ilora is a sanctified community founded with a singular, glorious vision: to be a <strong>Sanctuary of Praise</strong> — a place where lives are transformed, hearts are healed, and souls are drawn into the fullness of God's love.
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                Through intentional worship, fervent prayer, practical discipleship, and local outreach under the anointed guidance of Rev&apos;d Dr S. O. Mosebolatan, we actively fulfill the Great Commission across Ilora and beyond.
              </p>
              <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold">
                Get In Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>
            <div className="reveal-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl img-zoom group">
                <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&auto=format&fit=crop&q=80" alt="Church community" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4 rounded-2xl text-white">
                    <p className="text-accent font-bold text-sm">TRINITY BAPTIST CHURCH</p>
                    <p className="text-xs text-white/80">Ilora, Oyo State, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-bg-alt relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>OUR JOURNEY<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Our <span className="text-gradient-gold">Timeline</span></h2>
            <p className="text-stone-600 mt-3 max-w-xl mx-auto">How God has faithfully guided and built His church across generations.</p>
          </div>
          <div className="relative space-y-12">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/15 transform md:-translate-x-1/2"/>
            {timeline.map((entry, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={entry.year} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 reveal ${isEven ? "" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-accent border-4 border-primary-dark shadow-md z-20 transform md:-translate-x-1/2 -translate-x-1/2"/>
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12">
                    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-stone-100 card-hover ${isEven ? "md:text-right" : ""}`}>
                      <span className="inline-block bg-accent/15 text-primary font-bold text-xs px-3 py-1 rounded-full mb-3">{entry.year}</span>
                      <h3 className="font-serif text-xl font-bold text-primary mb-2">{entry.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{entry.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2"/>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>WHAT WE BELIEVE<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Our Core <span className="text-gradient-gold">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm card-hover reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon}/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">{v.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>MEET THE TEAM<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Church <span className="text-gradient-gold">Leadership</span></h2>
            <p className="text-stone-600 mt-3 max-w-xl mx-auto">Godly leaders dedicated to shepherding the flock of Trinity Baptist Church, Ilora.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.filter(l => l.active).map((leader, i) => (
              <div key={leader.id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm card-hover reveal group" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="relative h-64 img-zoom">
                  <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/20 to-transparent opacity-80"/>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block bg-accent text-primary-dark text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">{leader.role}</span>
                    <h3 className="font-serif text-lg font-bold text-white leading-tight">{leader.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="floating-orb w-64 h-64 bg-accent/5 -top-20 -right-20 animate-float-slow"/>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Join Our Family</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Whether you are visiting, seeking a spiritual home, or looking to serve — there is a place for you at Trinity.</p>
          <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
            Connect With Us
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
