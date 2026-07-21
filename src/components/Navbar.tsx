"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "#", label: "Ministries", isDropdown: true },
  { href: "/hymns", label: "Hymns" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Executives" },
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

function useIsMobile(breakpoint = 1280) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function Navbar() {
  const scrolled = useScrolled(60);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/logo/trinity-logo.png");
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getSiteSettings().then((s) => { if (s.logoUrl) setLogoUrl(s.logoUrl); });
  }, []);

  useEffect(() => { setIsOpen(false); setIsDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-glass shadow-xl" : "nav-transparent"}`} >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <div className="flex items-center justify-between h-16 lg:h-20" >

          {/* ── LEFT ZONE (mobile: flex-1 to push hamburger right; desktop: auto) ── */}
          <div className="relative flex-1 xl:flex-none flex items-center" style={{ minWidth: 0 }}>

            {/* LAYER A — logo + text: visible at rest, fades OUT when scrolled on mobile */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              style={{
                opacity: isMobile && scrolled ? 0 : 1,
                pointerEvents: isMobile && scrolled ? 'none' : 'auto',
                transition: 'opacity 0.35s ease',
              }}
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Trinity Baptist Church, Ilora logo" className="w-10 h-10 rounded-full object-cover shadow-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
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
                <p className="text-accent text-[10px] uppercase tracking-widest font-medium">For Christ is our Peace</p>
              </div>
            </Link>

            {/* LAYER B — logo only, centred in nav: hidden at rest, fades IN when scrolled on mobile.
                Fades out again when the mobile menu is open so it doesn't float over the panel. */}
            {isMobile && (
              <Link
                href="/"
                tabIndex={scrolled && !isOpen ? 0 : -1}
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center xl:hidden"
                style={{
                  opacity: scrolled && !isOpen ? 1 : 0,
                  pointerEvents: scrolled && !isOpen ? 'auto' : 'none',
                  transition: 'opacity 0.35s ease',
                  zIndex: 45,
                }}
              >
                <div className="relative w-12 h-12">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Trinity Baptist Church, Ilora logo" className="w-12 h-12 rounded-full object-cover shadow-lg" style={{ opacity: 1 }} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                        <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-glow -z-10"/>
                </div>
              </Link>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button className="px-2.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-1 transition-all duration-300">
                      {link.label}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Bridge gap between button and dropdown to prevent accidental close */}
                    <div className="absolute top-full left-0 w-72 h-3" style={{ display: isDropdownOpen ? 'block' : 'none' }} />
                    <div className={`absolute top-full left-0 w-72 bg-primary-dark border border-accent/15 rounded-2xl shadow-2xl py-2 mt-3 transition-all duration-300 transform origin-top-left ${isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
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
                  className={`relative px-2.5 py-2 text-sm font-medium transition-all duration-300 hover:text-white rounded-lg ${isActive ? "text-accent bg-white/5" : "text-white/80 hover:bg-white/5"}`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-accent rounded-full" />}
                </Link>
              );
            })}
            <Link href="/live"
              className="ml-2 px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-lg hover:shadow-red-600/30 hover:scale-105">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live
            </Link>
            <Link href="/give"
              className="ml-1.5 px-3 py-1.5 bg-accent text-primary-dark text-sm font-bold rounded-lg hover:bg-accent-light transition-all shadow-lg hover:shadow-accent/30 hover:scale-105">
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

      {/* Mobile menu panel */}
      <div className={`xl:hidden fixed top-0 right-0 bottom-0 w-[75%] sm:w-[50%] bg-primary-dark border-l border-accent/15 shadow-2xl z-50 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Close X button at top of panel */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col h-full justify-between p-6 pt-20 overflow-y-auto">
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="space-y-1">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between text-left px-4 py-2.5 text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all">
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
                  className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${isActive ? "text-accent bg-white/5 border border-accent/20" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="space-y-3 pt-6 border-t border-white/10">
            <Link href="/live" onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"/>Watch Live
            </Link>
            <Link href="/give" onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 bg-accent text-primary-dark font-bold rounded-xl hover:bg-accent-light transition-colors">
              Give / Donate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
