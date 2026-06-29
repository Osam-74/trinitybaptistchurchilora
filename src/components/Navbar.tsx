"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sermons", label: "Sermons" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hymns", label: "Hymns" },
  { href: "/book", label: "Book Session" },
  { href: "/activities", label: "Activities" },
  { href: "/calendar", label: "Calendar" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-solid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                {/* Cross icon */}
                <svg className="w-5 h-5 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                  <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                </svg>
              </div>
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
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "text-accent bg-accent/10 border border-accent/20"
                    : "text-white/80 hover:text-white hover:bg-white/8"
                }`}
              >
                {link.href === "/hymns" ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    {link.label}
                  </span>
                ) : link.label}
              </Link>
            ))}
            <Link
              href="/live"
              className="ml-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Live
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`xl:hidden fixed inset-0 top-16 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu panel */}
      <div className={`xl:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="navbar-solid border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-accent bg-accent/10 border border-accent/20"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.href === "/hymns" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              )}
              {link.label}
            </Link>
          ))}
          <Link
            href="/live"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl mt-2 hover:bg-red-700 transition-colors"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Watch Live
          </Link>
        </div>
      </div>
    </nav>
  );
}
