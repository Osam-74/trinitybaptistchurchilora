"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WMUPage() {
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
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>WOMEN MISSIONARY UNION</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">Women Missionary<br /><span className="text-gradient-gold">Union (WMU)</span></h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">"She opens her arms to the poor and extends her hands to the needy" — Proverbs 31:20</p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" alt="Women Missionary Union" className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Women&apos;s Missions</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About WMU</h2>
              <p className="text-stone-600 leading-relaxed mb-4">The Women Missionary Union is the oldest and most expansive organisation in the Nigerian Baptist Convention — the mother body that oversees the Sunbeam Band, Girls&apos; Auxiliary, and Lydia Auxiliary. The WMU has been at the forefront of missions education, evangelism, social welfare, and prayer mobilisation since the earliest days of Baptist work in Nigeria.</p>
              <p className="text-stone-600 leading-relaxed mb-4">At Trinity Baptist Church, WMU members gather through the Priscilla Circle for Bible study and prayer, organise the annual Day of Prayer, lead poverty alleviation initiatives, and host the WMU Annual Conference — making a profound impact on the lives of women, children, and families in Ilora and beyond.</p>
              <p className="text-stone-600 leading-relaxed">All married women of the church are members of the WMU. Single ladies above age 17 are in the Lydia Auxiliary, which feeds into the WMU upon marriage.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 reveal">
            {[
              { title: "Priscilla Circle", desc: "Bible study and prayer groups meeting regularly for spiritual growth and fellowship." },
              { title: "Day of Prayer", desc: "Annual WMU Day of Prayer — interceding for missions, Nigeria, and the church worldwide." },
              { title: "Social Welfare", desc: "Poverty alleviation projects, hospital visits, and support for vulnerable families in the community." },
            ].map(a => (
              <div key={a.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-rose-500 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{a.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-stone-50"><div className="max-w-4xl mx-auto px-4 text-center"><Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-primary-dark text-sm mb-4">Get Involved<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link><br/><Link href="/ministries" className="text-primary font-semibold text-sm hover:text-primary-light transition-colors inline-flex items-center gap-2 mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back to All Ministries</Link></div></section>
      <Footer />
    </main>
  );
}
