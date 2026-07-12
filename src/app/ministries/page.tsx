"use client";

import { useEffect } from "react";
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

const ministries = [
  {
    id: "royal-ambassadors",
    name: "Royal Ambassadors (RA)",
    badge: "Boys · Ages 6–17",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop&q=80",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    motto: '"We are Ambassadors for Christ" — 2 Cor 5:20',
    desc: "Royal Ambassadors is the Nigerian Baptist Convention's mission-focused boys' ministry. Boys aged 6–17 gather weekly to learn scripture, explore missions history, and build godly character. The RA programme instils values of courage, service, and devotion to Christ — preparing the next generation of kingdom leaders.",
    features: ["Weekly chapter meetings & Bible study", "Merit award system for achievement", "Annual RA Congress & missions experiences"],
  },
  {
    id: "girls-auxiliaries",
    name: "Girls' Auxiliaries (GA)",
    badge: "Girls · Ages 6–17",
    image: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&auto=format&fit=crop&q=80",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    motto: '"Arise, shine; for thy light is come" — Isaiah 60:1',
    desc: "Girls' Auxiliaries is the NBC's vibrant missions organisation for girls aged 6–17. GA cultivates a love for God, scripture, and missions in young girls through prayer, Bible memorisation, and service projects. The Forward Steps programme provides a structured pathway for spiritual and personal growth.",
    features: ["GA chapter meetings & Forward Steps programme", "Mission projects & community service", "Annual GA Camp & leadership training"],
  },
  {
    id: "lydia-band",
    name: "Lydia Band",
    badge: "Young Women · Ages 18–35",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    motto: '"A certain woman named Lydia…whose heart the Lord opened" — Acts 16:14',
    desc: "Named after Lydia of Thyatira — a businesswoman of deep faith — the Lydia Band is the young women's arm under the Women Missionary Union. It focuses on mentorship, spiritual formation, economic empowerment, and kingdom outreach for women aged 18–35. Lydia Band nurtures purpose-driven, God-centred young women.",
    features: ["Mentorship & spiritual growth programmes", "Business & economic empowerment initiatives", "Community outreach & evangelism projects"],
  },
  {
    id: "mens-missionary-union",
    name: "Men's Missionary Union (MMU)",
    badge: "Men's Fellowship",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    motto: '"As for me and my house, we will serve the LORD" — Joshua 24:15',
    desc: "The Men's Missionary Union is the brotherhood arm of Trinity Baptist Church — a fellowship of men committed to prayer, evangelism, church planting support, and community development. MMU runs discipleship programmes, community outreach projects, and annual Men's Conventions that strengthen the spiritual backbone of the church.",
    features: ["Monthly fellowship & discipleship meetings", "Community development & outreach projects", "Annual Men's Convention & leadership summit"],
  },
  {
    id: "womens-missionary-union",
    name: "Women Missionary Union (WMU)",
    badge: "Women's Missions",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    motto: '"She opens her arms to the poor and extends her hands to the needy" — Prov 31:20',
    desc: "The Women Missionary Union is the oldest and most expansive organisation in the Nigerian Baptist Convention. WMU at Trinity Baptist Church focuses on prayer, missions education, evangelism, and social welfare. Key programmes include the Priscilla Circle, Annual WMU Conference, and Day of Prayer — mobilising women to impact their world for Christ.",
    features: ["Priscilla Circle Bible study & prayer groups", "Social welfare & poverty alleviation programmes", "Annual WMU Conference & Day of Prayer"],
  },
  {
    id: "youth-fellowship",
    name: "Youth Fellowship (BYF)",
    badge: "Young Adults · Ages 18–35",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    motto: '"Don\'t let anyone look down on you because you are young" — 1 Tim 4:12',
    desc: "Baptist Youth Fellowship (BYF) is the dynamic arm of Trinity Baptist Church for young adults aged 18–35. BYF exists to engage the youth generation through vibrant worship, leadership development, targeted evangelism, and kingdom purpose. The fellowship organises retreats, conventions, community projects, and regular gatherings that ignite passion for God.",
    features: ["Weekly BYF meetings & discipleship sessions", "Youth retreats, conventions & outreach", "Leadership development & mentorship track"],
  },
  {
    id: "sunday-school",
    name: "Sunday School",
    badge: "All Ages",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    motto: '"Train up a child in the way he should go" — Prov 22:6',
    desc: "Sunday School is the comprehensive weekly Bible education arm of Trinity Baptist Church — serving all age groups from cradle roll to adult. Organised into departments (Beginners, Primary, Junior, Intermediate, Young People, Adult), Sunday School uses NBC-approved curriculum to ground every member in the Word of God systematically.",
    features: ["Age-graded departments for all members", "NBC-approved Bible curriculum", "Teacher training & quarterly reviews"],
  },
  {
    id: "choir",
    name: "Choir & Music Ministry",
    badge: "All Ages Welcome",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80",
    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    motto: '"Sing to the LORD a new song; sing to the LORD, all the earth" — Psalm 96:1',
    desc: "The Choir & Music Ministry at Trinity Baptist Church is dedicated to excellence in worship. Comprising the Senior Choir, Youth Choir, and Children's Choir, the music ministry leads the congregation in powerful worship, special musical presentations, and recordings. Rehearsals are held weekly; all musically gifted members are invited to join.",
    features: ["Senior Choir, Youth Choir & Children's Choir", "Weekly rehearsals & worship leadership", "Special musical events & recordings"],
  },
];

export default function MinistriesPage() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              OUR MINISTRIES
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Every Member,<br/><span className="text-gradient-gold">Every Ministry</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Serving God and community through dedicated ministry arms of Trinity Baptist Church, Ilora — rooted in the Nigerian Baptist Convention.
            </p>
          </div>
        </div>
      </div>

      {/* Ministries Grid */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {ministries.map((ministry, i) => (
              <div key={ministry.id} id={ministry.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm ministry-card reveal group"
                style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                {/* Image header */}
                <div className="relative h-48 img-zoom">
                  <img src={ministry.image} alt={ministry.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-primary-dark/20"/>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-accent text-primary-dark text-xs font-bold px-3 py-1.5 rounded-full">
                      {ministry.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ministry.icon}/></svg>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-7">
                  <div className="border-l-4 border-accent pl-4 mb-5">
                    <h2 className="font-serif text-2xl font-bold text-primary mb-1">{ministry.name}</h2>
                    <p className="text-xs text-accent-dark font-semibold italic">{ministry.motto}</p>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5">{ministry.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {ministry.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                        <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-dark">
                    Join This Ministry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="floating-orb w-64 h-64 bg-accent/5 -bottom-20 -right-20 animate-float-slow"/>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-bold mb-4">Find Your Place in Ministry</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">Every believer is called to serve. Contact us today and we'll help you discover where your gifts fit in God's work at Trinity Baptist Church.</p>
          <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
            Contact Us to Get Involved
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
