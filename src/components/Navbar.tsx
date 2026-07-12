"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "#", label: "Ministries", isDropdown: true },
  { href: "/activities", label: "Activities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pastor", label: "Our Pastor" },
  { href: "/contact", label: "Contact" },
];

const ministries = [
  { name: "Royal Ambassadors (RA)", slug: "royal-ambassadors" },
  { name: "Girls' Auxiliaries (GA)", slug: "girls-auxiliaries" },
  { name: "Lydia Band", slug: "lydia-band" },
  { name: "Men's Missionary Union (MMU)", slug: "mens-missionary-union" },
  { name: "Women Missionary Union (WMU)", slug: "womens-missionary-union" },
  { name: "Youth Fellowship (BYF)", slug: "youth-fellowship" },
  { name: "Sunday School", slug: "sunday-school" },
  { name: "Choir & Music Ministry", slug: "choir" },
];

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);
  return scrolled;
}

export default function Navbar() {
  const scrolled = useScrolled(60);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/logo/trinity-logo.png");
  const pathname = usePathname();

  useEffect(() => {
    getSiteSettings().then((s) => { if (s.logoUrl) setLogoUrl(s.logoUrl); });
  }, []);

  useEffect(() => { setIsOpen(false); setIsDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-glass shadow-xl" : "nav-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Trinity Baptist Church, Ilora logo" className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform shadow-lg" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                    <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-glow -z-10"/>
            </div>
            <div>
              <h1 className="text-white font-serif text-base lg:text-lg font-bold leading-tight whitespace-nowrap">
                Trinity Baptist Church, Ilora
              </h1>
              <p className="text-accent text-[10px] uppercase tracking-widest font-medium">Sanctuary of Praise</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}>
                    <button className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 flex items-center gap-1 transition-all duration-300">
                      {link.label}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 w-72 bg-primary-dark border border-accent/15 rounded-2xl shadow-2xl py-2 mt-2 transition-all duration-300 transform origin-top-left ${isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <Link href="/ministries" className="text-xs font-bold text-accent uppercase tracking-wider">View All Ministries →</Link>
                      </div>
                      {ministries.map((m) => (
                        <Link key={m.slug} href={`/ministries#${m.slug}`}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-accent hover:bg-white/5 transition-colors">
                          {m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-white rounded-lg ${isActive ? "text-accent bg-white/5" : "text-white/80 hover:bg-white/5"}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />}
                </Link>
              );
            })}
            <Link href="/live"
              className="ml-3 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-red-600/30 hover:scale-105">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Live
            </Link>
            <Link href="/give"
              className="ml-2 px-4 py-2 bg-accent text-primary-dark text-sm font-bold rounded-lg hover:bg-accent-light transition-all shadow-lg hover:shadow-accent/30 hover:scale-105">
              Give
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors z-50"
            aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      <div className={`xl:hidden fixed inset-0 transition-opacity duration-300 z-40 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: 'rgba(11,44,34,0.5)', backdropFilter: 'blur(8px)' }}
        onClick={() => setIsOpen(false)} />

      {/* Mobile menu panel — 75% width, slides from right */}
      <div className={`xl:hidden fixed top-0 right-0 bottom-0 w-[75%] sm:w-[50%] bg-primary-dark border-l border-accent/15 shadow-2xl z-50 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full justify-between p-6 pt-24 overflow-y-auto">
          <div className="space-y-2">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="space-y-1">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between text-left px-4 py-3 text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      {link.label}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`pl-4 space-y-1 transition-all duration-300 overflow-hidden ${isDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      {ministries.map((m) => (
                        <Link key={m.slug} href={`/ministries#${m.slug}`}
                          className="block px-4 py-2 text-sm text-white/60 hover:text-accent transition-colors">
                          {m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${isActive ? "text-accent bg-white/5 border border-accent/10" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="space-y-3 mt-8">
            <Link href="/live"
              className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Watch Live
            </Link>
            <Link href="/give"
              className="flex items-center justify-center w-full px-4 py-3.5 bg-accent text-primary-dark font-bold rounded-xl hover:bg-accent-light transition-all">
              Give Online
            </Link>
            <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "YouTube", path: "M22.54 6.42a2.78 2.78 0 00-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" },
              ].map((s) => (
                <a key={s.label} href="#" className="text-white/50 hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={s.path}/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
