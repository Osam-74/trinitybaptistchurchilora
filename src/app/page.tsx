"use client";

import {useState, useEffect,  } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Post, Sermon } from "@/types";
import { formatDate, getYouTubeThumbnail } from "@/lib/utils";
import { samplePosts, sampleSermons} from "@/lib/seed-data";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Floating Particle ── */
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle w-1.5 h-1.5 bg-accent/40" style={style} />;
}

/* ── Hero Section ── */
function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80",
    "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1920&q=80",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const particles = [
    { top: '15%', left: '8%', animationDuration: '6s', animationDelay: '0s' },
    { top: '30%', left: '92%', animationDuration: '8s', animationDelay: '1s' },
    { top: '70%', left: '5%', animationDuration: '7s', animationDelay: '2s' },
    { top: '80%', left: '88%', animationDuration: '5s', animationDelay: '0.5s' },
    { top: '45%', left: '15%', animationDuration: '9s', animationDelay: '1.5s' },
    { top: '55%', left: '82%', animationDuration: '6.5s', animationDelay: '3s' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background slides */}
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === currentBg ? 1 : 0
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Cross/Pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-20" />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* Floating cross */}
      <div className="absolute right-16 top-1/4 opacity-10 floating-cross hidden lg:block">
        <svg viewBox="0 0 80 100" className="w-16 h-20 text-accent" fill="currentColor">
          <rect x="34" y="0" width="12" height="100" rx="6"/>
          <rect x="0" y="28" width="80" height="12" rx="6"/>
        </svg>
      </div>
      <div className="absolute left-12 bottom-1/3 opacity-8 floating-cross hidden lg:block" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 60 75" className="w-10 h-14 text-white" fill="currentColor">
          <rect x="25" y="0" width="10" height="75" rx="5"/>
          <rect x="0" y="20" width="60" height="10" rx="5"/>
        </svg>
      </div>

      {/* Rotating ring (decorative) */}
      <div className="absolute right-8 bottom-16 w-32 h-32 opacity-10 hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-rotate-ring" fill="none" stroke="#e3ef26" strokeWidth="1">
          <circle cx="50" cy="50" r="45" strokeDasharray="8 4"/>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-28 lg:pt-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 mb-8 animate-fade-in">
          <svg className="w-4 h-4 text-accent animate-cross-glow" viewBox="0 0 24 24" fill="currentColor">
            <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
            <rect x="2" y="8" width="20" height="3" rx="1.5"/>
          </svg>
          <span className="text-white/90 text-sm font-medium">Welcome to Our Church Family</span>
        </div>

        {/* Main title */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-white font-bold mb-4 leading-tight animate-fade-in-up">
          Trinity Baptist{" "}
          <span className="block text-gradient-gold">Church, Ilora</span>
        </h1>

        {/* Motto */}
        <div className="flex items-center justify-center gap-3 mb-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="h-px w-12 bg-accent/50"/>
          <p className="text-primary-light text-lg sm:text-xl font-medium italic font-serif">Sanctuary of Praise</p>
          <div className="h-px w-12 bg-accent/50"/>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link href="/live" className="btn-shine btn-gold px-8 py-4 rounded-2xl flex items-center justify-center gap-2.5 text-base font-semibold animate-pulse-glow shadow-2xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Watch Live
          </Link>
          <Link href="/sermons" className="btn-shine px-8 py-4 glass-card text-white font-semibold rounded-2xl flex items-center justify-center gap-2.5 text-base hover:bg-white/15 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            Sermon Library
          </Link>
          <Link href="/book" className="btn-shine px-8 py-4 glass-card text-white font-semibold rounded-2xl flex items-center justify-center gap-2.5 text-base hover:bg-white/15 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Book a Session
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle z-10">
        <div className="flex flex-col items-center gap-1 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {backgrounds.map((_, i) => (
          <button key={i} onClick={() => setCurrentBg(i)}
            className={`transition-all duration-300 rounded-full ${i === currentBg ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/30'}`}/>
        ))}
      </div>
    </section>
  );
}

/* ── Service Times Banner ── */
function ServiceBanner() {
  return (
    <div className="bg-primary text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          {[
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "First Service: Sundays 7:30 AM" },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "Second Service: Sundays 10:00 AM" },
            { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "Ilora, Oyo State, Nigeria" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
              </svg>
              <span className="text-white/80">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Welcome / Stats Section ── */
function WelcomeSection() {
  return (
    <section className="py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4 reveal-left">
              <div className="w-8 h-px bg-primary-light/40"/>
              ABOUT OUR CHURCH
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary font-bold mb-6 leading-tight reveal-left">
              A Place of Grace,<br/>
              <span className="text-gradient-gold">Faith & Community</span>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-6 reveal-left">
              Trinity Baptist Church, Ilora is a vibrant community of believers committed to worshipping God, growing in faith, and serving our community with love and compassion.
            </p>
            <p className="text-text-muted leading-relaxed mb-8 reveal-left">
              Under the anointed leadership of Rev&apos;d Dr S. O. Mosebolatan, we are dedicated to bringing the Word of God to life and helping each member discover their God-given purpose.
            </p>
            <Link href="/about" className="btn-shine btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-xl reveal-left">
              <span>Learn More About Us</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 reveal-right">
            {[
              { number: "50+", label: "Years of Ministry", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
              { number: "1000+", label: "Church Members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { number: "1000+", label: "Sermons Preached", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
              { number: "10+", label: "Active Departments", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm card-hover text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon}/>
                  </svg>
                </div>
                <p className="font-serif text-3xl font-bold text-primary mb-1">{stat.number}</p>
                <p className="text-text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pastor's Messages (Feed) ── */
function PastorFeedSection() {
  const [posts] = useState<Post[]>(samplePosts.map((p, i) => ({ ...p, id: `post-${i}` })));
  const [amenCounts, setAmenCounts] = useState<Record<string, number>>({});
  const [amenClicked, setAmenClicked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedAmens: Record<string, boolean> = {};
    posts.forEach((p) => {
      if (typeof window !== "undefined" && localStorage.getItem(`amen_${p.id}`)) savedAmens[p.id] = true;
    });
    setAmenClicked(savedAmens);
  }, [posts]);

  const handleAmen = (postId: string) => {
    if (amenClicked[postId]) return;
    setAmenCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    setAmenClicked((prev) => ({ ...prev, [postId]: true }));
    if (typeof window !== "undefined") localStorage.setItem(`amen_${postId}`, "true");
  };

  return (
    <section className="py-20 lg:py-28 bg-bg-alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            FROM OUR PASTOR
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-primary font-bold mb-4">
            Pastor&apos;s Messages
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Words of encouragement, teaching, and inspiration from Rev&apos;d Dr S. O. Mosebolatan
          </p>
          <div className="gold-divider mt-6 max-w-xs mx-auto"/>
        </div>

        <div className="space-y-10">
          {posts
            .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
            .map((post, index) => (
              <article
                key={post.id}
                className={`bg-white rounded-3xl shadow-md border overflow-hidden card-hover reveal ${
                  post.pinned ? "border-accent/40 ring-2 ring-accent/20" : "border-stone-100"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {post.pinned && (
                  <div className="bg-gradient-to-r from-accent/15 to-accent/5 px-6 py-2.5 border-b border-accent/20 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-primary text-xs font-semibold uppercase tracking-wider">Featured Message</span>
                  </div>
                )}

                {post.mediaType === "image" && post.mediaUrl && (
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent"/>
                  </div>
                )}

                {post.mediaType === "video" && post.youtubeId && (
                  <div className="relative aspect-video bg-primary-dark group cursor-pointer" onClick={() => window.open(`https://youtube.com/watch?v=${post.youtubeId}`, '_blank')}>
                    <img src={getYouTubeThumbnail(post.youtubeId)} alt={post.title} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                        <svg className="w-7 h-7 text-primary-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-primary-dark font-bold text-sm shadow">
                      TBC
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">Rev&apos;d Dr S. O. Mosebolatan</p>
                      <p className="text-text-muted text-xs">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {post.scripture && (
                    <div className="flex items-start gap-2 bg-primary/8 rounded-xl px-4 py-2.5 mb-4 border-l-4 border-primary-light">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      <span className="text-primary text-sm font-medium italic">{post.scripture}</span>
                    </div>
                  )}

                  <h3 className="font-serif text-xl font-bold text-primary mb-3">{post.title}</h3>
                  <p className="text-text-muted leading-relaxed">{post.body}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAmen(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          amenClicked[post.id]
                            ? "bg-primary/10 text-primary cursor-default"
                            : "bg-stone-50 text-text-muted hover:bg-primary/10 hover:text-primary border border-stone-200 hover:border-primary/30"
                        }`}
                      >
                        <svg className="w-4 h-4" fill={amenClicked[post.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        {amenClicked[post.id] ? "Amen!" : "Amen"}
                        {(amenCounts[post.id] || 0) > 0 && (
                          <span className="bg-accent text-primary-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {amenCounts[post.id]}
                          </span>
                        )}
                      </button>
                    </div>

                    <span className="text-xs text-text-muted capitalize bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">
                      {post.mediaType}
                    </span>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ── Recent Gallery Section ── */
function RecentGallerySection() {
  const photos = [
    "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80",
  ];

  return (
    <section className="py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 reveal">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-3">
              <div className="w-8 h-px bg-primary-light/40"/>
              GALLERY
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary font-bold">
              Moments of <span className="text-gradient-gold">Worship</span>
            </h2>
          </div>
          <Link href="/gallery" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm">
            View All Photos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl cursor-pointer group card-hover reveal ${i === 0 ? 'row-span-2' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-72 md:h-full min-h-[300px]' : 'aspect-square'}`}>
                <img src={photo} alt={`Church photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden reveal">
          <Link href="/gallery" className="btn-shine btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold">
            View All Photos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Sermons Preview ── */
function SermonsPreview() {
  const [sermons] = useState<Sermon[]>(sampleSermons.slice(0, 3).map((s, i) => ({ ...s, id: `sermon-${i}` })));

  return (
    <section className="py-20 lg:py-28 bg-primary-dark relative overflow-hidden">
      <div className="floating-orb w-96 h-96 bg-accent/5 -top-24 -left-24" style={{ animationDuration: '10s' }}/>
      <div className="floating-orb w-72 h-72 bg-accent2/5 -bottom-16 -right-16" style={{ animationDuration: '13s' }}/>
      <div className="absolute inset-0 pattern-overlay opacity-30"/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4">
            <div className="w-8 h-px bg-primary-light/40"/>
            SERMON LIBRARY
            <div className="w-8 h-px bg-primary-light/40"/>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-bold">
            Recent <span className="text-gradient-gold">Sermons</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {sermons.map((sermon, i) => (
            <div key={sermon.id} className="glass-card rounded-2xl overflow-hidden card-hover reveal" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="relative h-44 bg-primary overflow-hidden">
                {sermon.type === "video" && sermon.youtubeId ? (
                  <img src={getYouTubeThumbnail(sermon.youtubeId)} alt={sermon.title} className="w-full h-full object-cover opacity-80"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-light">
                    <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase">{sermon.type}</span>
              </div>
              <div className="p-5">
                <p className="text-primary text-xs font-semibold mb-2 uppercase tracking-wider">{formatDate(sermon.date)}</p>
                <h3 className="font-serif text-white font-bold text-base mb-1 line-clamp-2">{sermon.title}</h3>
                <p className="text-white/50 text-sm">{sermon.scripture}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center reveal">
          <Link href="/sermons" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base">
            Browse All Sermons
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ── */
function CTASection() {
  return (
    <section className="py-20 bg-bg-alt relative overflow-hidden">
      <div className="absolute inset-0 pattern-overlay"/>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal">
          <svg className="w-12 h-12 text-accent mx-auto mb-6 animate-cross-glow" viewBox="0 0 48 60" fill="currentColor">
            <rect x="20" y="0" width="8" height="60" rx="4"/>
            <rect x="0" y="16" width="48" height="8" rx="4"/>
          </svg>
          <h2 className="font-serif text-4xl lg:text-5xl text-primary font-bold mb-5">
            Plan Your <span className="text-gradient-gold">Visit</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
            We&apos;d love to welcome you to Trinity Baptist Church, Ilora. Whether you&apos;re new to faith or returning home, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-shine btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Get Directions
            </Link>
            <Link href="/book" className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base bg-primary text-white hover:bg-primary-light transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Book a Session
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Export ── */
export default function HomePage() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServiceBanner />
      <WelcomeSection />
      <PastorFeedSection />
      <RecentGallerySection />
      <SermonsPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
