"use client";

import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/sermons", label: "Sermons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hymns", label: "Hymns" },
  { href: "/book", label: "Book a Session" },
  { href: "/activities", label: "Activities" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-primary-dark text-white/70 overflow-hidden">
      {/* Decorative top line */}
      <div className="gold-divider"/>

      {/* Background pattern */}
      <div className="absolute inset-0 pattern-overlay opacity-50 pointer-events-none"/>

      {/* Floating orbs */}
      <div className="floating-orb w-64 h-64 bg-accent/5 -bottom-20 -right-20" style={{ animationDuration: '9s' }}/>
      <div className="floating-orb w-48 h-48 bg-accent2/5 -bottom-10 left-10" style={{ animationDuration: '12s' }}/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                  <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-serif text-base font-bold leading-tight">Trinity Baptist Church, Ilora</h3>
                <p className="text-accent text-[10px] uppercase tracking-widest">Sanctuary of Praise</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              A place of grace, faith, and community. Join us as we worship God and grow together in Christ under the leadership of Rev&apos;d Dr S. O. Mosebolatan.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: 'Twitter', path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
              ].map((social) => (
                <a key={social.label} href="#" aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.path}/></svg>
                </a>
              ))}
              <a href="#" aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0d1021"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent transition-colors flex items-center gap-2 group">
                    <svg className="w-3 h-3 text-accent/60 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Service Times
            </h4>
            <ul className="space-y-4">
              {[
                { day: "Sunday Morning", times: ["7:30 AM — First Service", "10:00 AM — Second Service"], icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
                { day: "Midweek Service", times: ["Wednesdays, 5:00 PM"], icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { day: "Prayer Meeting", times: ["Fridays, 6:00 AM"], icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
              ].map((svc) => (
                <li key={svc.day} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svc.icon}/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{svc.day}</p>
                    {svc.times.map(t => <p key={t} className="text-xs text-white/50">{t}</p>)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block"/>
              Find Us
            </h4>
            <ul className="space-y-4">
              {[
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "Trinity Baptist Church, Ilora, Oyo State, Nigeria" },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "info@trinitybaptistchurchilora.org" },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-divider mb-6"/>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Trinity Baptist Church, Ilora. All rights reserved.</p>
          <div className="flex items-center gap-1 text-white/30">
            <svg className="w-3.5 h-3.5 text-accent/60 animate-cross-glow" viewBox="0 0 24 24" fill="currentColor">
              <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
              <rect x="2" y="8" width="20" height="3" rx="1.5"/>
            </svg>
            <span>Sanctuary of Praise</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
