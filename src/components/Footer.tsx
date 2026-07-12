"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/settings";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons" },
  { href: "/ministries", label: "Ministries" },
  { href: "/activities", label: "Activities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/give", label: "Give" },
];

const serviceTimes = [
  { day: "Sunday 1st Service", time: "7:30 AM" },
  { day: "Sunday 2nd Service", time: "10:00 AM" },
  { day: "Wednesday — Prayer Meeting", time: "5:00 PM" },
  { day: "Wednesday — Bible Study", time: "6:00 PM" },
];

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string>("/logo/trinity-logo.png");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      if (s.logoUrl) setLogoUrl(s.logoUrl);
    });
  }, []);

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const contactEmail = settings?.contactEmail || "trinitybaptistchurchilora@gmail.com";
  const contactPhone = settings?.contactPhone || "+234 (0) phone placeholder";
  const address = settings?.address || "Ilora, Oyo State, Nigeria";

  return (
    <footer className="relative bg-primary-dark text-white/70 overflow-hidden">
      <div className="gold-divider"/>
      <div className="absolute inset-0 pattern-overlay opacity-40 pointer-events-none"/>
      <div className="floating-orb w-72 h-72 bg-accent/5 -bottom-24 -right-24 animate-float-slow" style={{ animationDuration: '9s' }}/>
      <div className="floating-orb w-56 h-56 bg-primary-light/10 -bottom-12 left-12 animate-float-slow" style={{ animationDuration: '12s' }}/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 — Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              {logoUrl ? (
                <img src={logoUrl} alt="Trinity Baptist Church logo" className="w-11 h-11 rounded-full object-cover shadow-lg" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-primary-light flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                    <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                  </svg>
                </div>
              )}
              <div>
                <h3 className="text-white font-serif text-base font-bold leading-tight">Trinity Baptist Church</h3>
                <p className="text-accent text-[10px] uppercase tracking-widest">Ilora — Sanctuary of Praise</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              A house of prayer, grace, and community. Growing together in devotion and expanding God&apos;s kingdom in Oyo State and beyond.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: 'Twitter', d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: 'YouTube', d: "M22.54 6.42a2.78 2.78 0 00-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" },
                { label: 'Instagram', d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01" },
              ].map((social) => (
                <a key={social.label} href="#" aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary-dark transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.d}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent transition-colors flex items-center gap-2 group">
                    <svg className="w-3 h-3 text-accent/60 group-hover:text-accent transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Service Times */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Service Times
            </h4>
            <ul className="space-y-4">
              {serviceTimes.map((svc) => (
                <li key={svc.day} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{svc.day}</p>
                    <p className="text-xs text-accent/80 font-semibold">{svc.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", text: address },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: contactPhone },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: contactEmail },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-divider mb-6"/>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Trinity Baptist Church, Ilora. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white/30">
              <svg className="w-3.5 h-3.5 text-accent/60 animate-cross-glow" viewBox="0 0 24 24" fill="currentColor">
                <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                <rect x="2" y="8" width="20" height="3" rx="1.5"/>
              </svg>
              <span>Sanctuary of Praise</span>
            </div>
            <button onClick={handleBackToTop}
              className="px-3 py-1.5 bg-white/5 hover:bg-accent hover:text-primary-dark rounded-lg transition-all duration-300 flex items-center gap-1 text-[11px] font-semibold text-white/60">
              Back to Top
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}