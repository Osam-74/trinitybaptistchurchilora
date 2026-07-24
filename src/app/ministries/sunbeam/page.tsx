"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SunbeamPage() {
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
              <span>MINISTRIES</span><span className="opacity-40">›</span><span>SUNBEAM BAND</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 leading-tight">
              Sunbeam<br /><span className="text-gradient-gold">Band</span>
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto">
              "Jesus said, I am the light of the world" — John 8:12
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" alt="Sunbeam Band"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]" />
            </div>
            <div>
              <span className="inline-block bg-yellow-100 text-yellow-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Children · Ages 4–9</span>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-bold mb-4">About Sunbeam Band</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Sunbeam Band is one of the four organisations under the Women Missionary Union (WMU) of the Nigerian Baptist Convention. It provides early Christian education and mission formation to the youngest members of the church family — children aged 4 to 9 years — fulfilling the scriptural mandate of Mark 10:13–16.
              </p>
              <p className="text-stone-600 leading-relaxed mb-4">
                In earlier years, children from ages 3 through 12 were eligible for the Sunbeam. From <strong>1953</strong>, children were divided into age-graded groups: the <strong>Beginner Sunbeam Band</strong> (ages 4–6) and the <strong>Primary Sunbeam Band</strong> (ages 7–9). At age 10, Sunbeam boys graduate to the Royal Ambassadors, while Sunbeam girls graduate to the Girls&apos; Auxiliary.
              </p>
              <p className="text-stone-600 leading-relaxed">
                At Trinity Baptist Church, Ilora, the Sunbeam Band is a joyful and nurturing community where the youngest children are introduced to prayer, Bible stories, missions, and the love of Christ in fun and age-appropriate ways.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 reveal">
            {[
              { label: "Watchword", value: "\"Let your light so shine\" — Matthew 5:16", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
              { label: "Colours", value: "Gold / Yellow, Sky-Blue & White", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
              { label: "Age Groups", value: "Beginner (4–6) · Primary (7–9)", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-stone-100 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/></svg>
                </div>
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-primary font-bold mb-2 text-center">The Five Sunbeam Aims</h2>
          <p className="text-stone-500 text-sm text-center mb-8 max-w-xl mx-auto">These are taught in a memorable pantomime so even the youngest children can embrace them.</p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { aim: "Talking with our Heavenly Father", action: "Clap hands together as in prayer" },
              { aim: "Hiding God's Word in our hearts", action: "Cross hands on chest" },
              { aim: "Learning about children of the world", action: "Hands together palms up (open book)" },
              { aim: "Helping others for Jesus' sake", action: "Clap hands with the person next to you" },
              { aim: "Giving to help preach the Gospel", action: "Extend hands, fingers dropping" },
            ].map((a, i) => (
              <div key={i} className="bg-white border border-yellow-100 rounded-2xl p-4 text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">{i + 1}</div>
                <p className="text-xs font-bold text-primary mb-1">{a.aim}</p>
                <p className="text-stone-400 text-xs italic">{a.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="font-serif text-3xl text-primary font-bold mb-8 text-center">Sunbeam Programmes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Mission Study Programme", desc: "Children learn about people around the world and the love of God for all nations." },
              { title: "Day Camp", desc: "Fun-filled day camps where children engage in Bible learning, games, and missions projects." },
              { title: "Weekly Meeting", desc: "Regular chapter meetings combining worship, Bible stories, prayer, and age-appropriate missions lessons." },
              { title: "Bible Memory Drill", desc: "Scripture memorisation exercises that hide God's Word in the hearts of young children early." },
              { title: "Sunbeam Week", desc: "An annual celebration highlighting the Sunbeam ministry across NBC churches nationwide." },
              { title: "Offering & Giving", desc: "Children are taught the joy of giving to missions — stewardship begins from the youngest age." },
            ].map(p => (
              <div key={p.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mb-3"/>
                <h3 className="font-bold text-primary mb-1 text-sm">{p.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-bg">
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
