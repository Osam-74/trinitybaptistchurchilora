"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MMUPage() {
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
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>MEN&apos;S MISSIONARY UNION</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">Men&apos;s Missionary<br /><span className="text-gradient-gold">Union (MMU)</span></h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">"As for me and my house, we will serve the LORD" — Joshua 24:15</p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://gbcowode.org.ng/wp-content/uploads/2024/03/mmu.png"
                alt="Men's Missionary Union" className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"; }} />
            </div>
            <div>
              <span className="inline-block bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Men&apos;s Fellowship</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About MMU</h2>
              <p className="text-stone-600 leading-relaxed mb-4">The Men&apos;s Missionary Union (MMU) is the brotherhood arm of the Nigerian Baptist Convention — a fellowship of men committed to prayer, evangelism, discipleship, church planting support, and community development. Operating under the NBC, the MMU mobilises men to take responsibility for the spiritual health of their families, churches, and nation.</p>
              <p className="text-stone-600 leading-relaxed mb-4">At Trinity Baptist Church, Ilora, the MMU is a vibrant men&apos;s fellowship that gathers for Bible study, accountability, community outreach, and the annual Men&apos;s Convention. The MMU also champions empowerment initiatives and leadership development programmes for men in the community.</p>
              <p className="text-stone-600 leading-relaxed">Every man — young or old — is welcome to join this brotherhood of faith, purpose, and kingdom service.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 reveal">
            {[
              { title: "Monthly Fellowship", desc: "Regular meetings combining Bible study, prayer, testimony, and kingdom planning." },
              { title: "Community Outreach", desc: "Development and welfare projects that demonstrate the gospel in practical ways." },
              { title: "Annual Convention", desc: "State and national Men's Conventions for spiritual refreshing and vision-casting." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-slate-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-stone-50"><div className="max-w-4xl mx-auto px-4 text-center"><Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-dark text-sm mb-4">Join MMU<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link><br/><Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2 mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back to All Ministries</Link></div></section>
      <Footer />
    </main>
  );
}
