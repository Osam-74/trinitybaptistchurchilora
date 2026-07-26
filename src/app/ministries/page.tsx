"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const ministries = [
  {
    id: "royal-ambassadors",
    name: "Royal Ambassadors",
    badge: "Boys · Ages 10+",
    image: "/images/royal-ambassadors.jpg",
    fallback: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=70",
    verse: '"We are Ambassadors for Christ" — 2 Cor 5:20',
    cta: "Explore & Register",
    href: "/ministries/royal-ambassadors",
    color: "bg-red-700",
  },
  {
    id: "girls-auxiliary",
    name: "Girls' Auxiliary",
    badge: "Girls · Ages 10+",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Lq5qTCNfXMzP39KXbq8RjOE_mDHoXdjvHK7wui8uZ1fEVsbUXldvA92W&s=10",
    verse: '"Arise, shine; for thy light is come" — Isa 60:1',
    cta: "Explore & Register",
    href: "/ministries/girls-auxiliary",
    color: "bg-green-700",
  },
  {
    id: "lydia-auxiliary",
    name: "Lydia Auxiliary",
    badge: "Young Women · Ages 17+",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ77jwXm__WjHqoV_jjMS3Q3nQVU57q3FpXZYt8oIl6ErcfVWvPtgaRlgk&s=10",
    verse: '"To open their eyes… from darkness to light" — Acts 26:18a',
    cta: "Explore & Register",
    href: "/ministries/lydia-auxiliary",
    color: "bg-purple-700",
  },
  {
    id: "sunbeam",
    name: "Sunbeam Band",
    badge: "Children · Ages 4–9",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZpW2cUdkYN3xD2sHsm7W6KYAWTsUSqrpbNnl5TTlry8TSWEWEFHAkWroj&s=10",
    verse: '"Let your light so shine before men" — Matt 5:16',
    cta: "Learn More",
    href: "/ministries/sunbeam",
    color: "bg-yellow-600",
  },
  {
    id: "bsf",
    name: "Baptist Student Fellowship",
    badge: "Students & Young Adults",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=70",
    verse: '"Don\'t let anyone look down on you because you are young" — 1 Tim 4:12',
    cta: "Learn More",
    href: "/ministries/bsf",
    color: "bg-blue-700",
  },
  {
    id: "mens-missionary-union",
    name: "Men's Missionary Union",
    badge: "Men's Fellowship",
    image: "https://gbcowode.org.ng/wp-content/uploads/2024/03/mmu.png",
    fallback: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=70",
    verse: '"As for me and my house, we will serve the LORD" — Josh 24:15',
    cta: "Learn More",
    href: "/ministries/mmu",
    color: "bg-slate-700",
  },
  {
    id: "womens-missionary-union",
    name: "Women Missionary Union",
    badge: "Women's Missions",
    image: "https://nsbcikorodu.wordpress.com/wp-content/uploads/2025/07/img-20250710-wa00154277680562241187089.jpg",
    verse: '"She opens her arms to the poor" — Prov 31:20',
    cta: "Learn More",
    href: "/ministries/wmu",
    color: "bg-rose-700",
  },
  {
    id: "youth-fellowship",
    name: "Baptist Youth Fellowship",
    badge: "Young Adults · Ages 18–35",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=70",
    verse: '"Don\'t let anyone look down on you because you are young" — 1 Tim 4:12',
    cta: "Learn More",
    href: "/ministries/youth-fellowship",
    color: "bg-orange-600",
  },
  {
    id: "sunday-school",
    name: "Sunday School",
    badge: "All Ages",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70",
    verse: '"Train up a child in the way he should go" — Prov 22:6',
    cta: "Learn More",
    href: "/ministries/sunday-school",
    color: "bg-teal-700",
  },
  {
    id: "choir",
    name: "Choir & Music Ministry",
    badge: "All Ages Welcome",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=70",
    verse: '"Sing to the LORD a new song" — Psalm 96:1',
    cta: "Learn More",
    href: "/ministries/choir",
    color: "bg-indigo-700",
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
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              OUR MINISTRIES
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Every Member,<br /><span className="text-gradient-gold">Every Ministry</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl max-w-3xl mx-auto" style={{ animationDelay: "0.2s" }}>
              Serving God and community through the dedicated ministry arms of Trinity Baptist Church, Ilora — rooted in the Nigerian Baptist Convention.
            </p>
          </div>
        </div>
      </div>

      {/* Grid — 3 columns */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry, i) => (
              <div
                key={ministry.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 group reveal"
                style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ministry.image}
                    alt={ministry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      if (ministry.fallback) (e.target as HTMLImageElement).src = ministry.fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${ministry.color}`}>
                      {ministry.badge}
                    </span>
                  </div>
                  {/* Ministry name over image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="font-serif text-white text-xl font-bold leading-tight">{ministry.name}</h2>
                  </div>
                </div>

                {/* Content: verse + CTA only */}
                <div className="p-5">
                  <p className="text-stone-500 text-sm italic leading-relaxed mb-5 border-l-2 border-accent pl-3">
                    {ministry.verse}
                  </p>
                  <Link
                    href={ministry.href}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-colors duration-200 group/btn"
                  >
                    {ministry.cta}
                    <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
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
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-bold mb-4">Find Your Place in Ministry</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">Every believer is called to serve. Contact us today and we&apos;ll help you discover where your gifts fit in God&apos;s work at Trinity Baptist Church.</p>
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
