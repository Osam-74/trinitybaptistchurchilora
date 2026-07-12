"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveBanner from "@/components/LiveBanner";
import { getYouTubeThumbnail } from "@/lib/utils";
import { sampleSermons, sampleActivities } from "@/lib/seed-data";

// Custom useScrollReveal Hook
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

// Custom Counter Component for Animate-upwards Stats
function StatCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  useScrollReveal();

  // 1. Live Banner State (simulate check or mock state)
  const [isLive] = useState(true);

  // 2. Hero Background Image Rotation
  const [currentBg, setCurrentBg] = useState(0);
  const heroBackgrounds = [
    "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1920&q=80", // beautiful church interior
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80", // worship crowd
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&q=80", // vibrant light / service
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroBackgrounds.length]);

  // 3. Scripture Testimonial Rotation (auto-rotates every 5s with fade)
  const [scriptureIndex, setScriptureIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);
  const scriptures = [
    {
      text: "The Lord is my strength and my shield; in him my heart trusts, and I am helped; my heart exults, and with my song I give thanks to him.",
      reference: "Psalm 28:7",
    },
    {
      text: "For where two or three are gathered in my name, there am I among them.",
      reference: "Matthew 18:20",
    },
    {
      text: "O come, let us worship and bow down: let us kneel before the Lord our maker. For he is our God; and we are the people of his pasture.",
      reference: "Psalm 95:6-7",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setScriptureIndex((prev) => (prev + 1) % scriptures.length);
        setFadeState(true);
      }, 500); // Allow fade out before changing text
    }, 5000);
    return () => clearInterval(interval);
  }, [scriptures.length]);

  // 4. Extract latest featured sermon
  const featuredSermon = sampleSermons.find((s) => s.featured) || sampleSermons[0];

  return (
    <div className="bg-bg text-primary-dark font-sans overflow-x-hidden min-h-screen flex flex-col">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Live Banner */}
      <LiveBanner isLive={isLive} title="Sunday Morning Worship" />

      {/* 3. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Rotating background images with crossfade */}
        {heroBackgrounds.map((bg, idx) => (
          <div
            key={bg}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: idx === currentBg ? 1 : 0,
            }}
          />
        ))}

        {/* Hero Overlay */}
        <div className="absolute inset-0 hero-overlay bg-black/65 mix-blend-multiply" />

        {/* Slow-moving background shape particles for depth (very low opacity) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[120px] animate-pulse-slow" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[150px] animate-pulse-slow" style={{ animationDuration: "18s" }} />
          <div className="absolute top-2/3 left-10 w-64 h-64 rounded-full bg-accent-light/10 blur-[100px] animate-pulse-slow" style={{ animationDuration: "15s" }} />
        </div>

        {/* Floating decorative cross SVGs */}
        <div className="absolute right-12 top-20 opacity-15 hidden lg:block animate-float" style={{ animationDuration: "8s" }}>
          <svg viewBox="0 0 80 120" className="w-12 h-18 text-accent" fill="currentColor">
            <rect x="34" y="0" width="12" height="120" rx="6" />
            <rect x="0" y="34" width="80" height="12" rx="6" />
          </svg>
        </div>
        <div className="absolute left-16 bottom-24 opacity-10 hidden lg:block animate-float-delayed" style={{ animationDuration: "10s", animationDelay: "2s" }}>
          <svg viewBox="0 0 60 90" className="w-8 h-12 text-white" fill="currentColor">
            <rect x="25" y="0" width="10" height="90" rx="5" />
            <rect x="0" y="25" width="60" height="10" rx="5" />
          </svg>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-16 flex flex-col items-center justify-center">
          {/* Small Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-primary-dark/80 backdrop-blur-md border border-accent/20 rounded-full px-5 py-2.5 mb-8 animate-fade-in shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-white text-xs font-semibold tracking-wider uppercase font-sans">
              Est. 1960s • Ilora, Oyo State
            </span>
          </div>

          {/* Main H1 */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold mb-6 tracking-tight leading-[1.1] drop-shadow-xl animate-fade-in-up">
            Trinity Baptist Church
          </h1>

          {/* Tagline & Horizontal Dividers */}
          <div className="flex items-center justify-center gap-4 mb-6 w-full max-w-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-accent/60" />
            <p className="text-accent text-2xl sm:text-3xl md:text-4xl font-semibold italic font-display tracking-wide drop-shadow">
              Sanctuary of Praise
            </p>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-accent/60" />
          </div>

          {/* Sub-headline */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow font-sans animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            A place of grace, faith, and community in Ilora, Oyo State, Nigeria
          </p>

          {/* 3 CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl px-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <Link
              href="/live"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 group"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Watch Live
            </Link>
            <Link
              href="/book"
              className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(200,230,58,0.4)] transition-all duration-300"
            >
              Plan Your Visit
            </Link>
            <Link
              href="/about"
              className="bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl border border-white/30 flex items-center justify-center gap-2 hover:scale-[1.04] transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Statistics Section (Visual counters with ease-out scroll triggers) */}
      <section className="bg-primary py-12 md:py-16 text-white border-y border-white/5 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C8E63A_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="reveal">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-accent mb-2">
              <StatCounter target={60} suffix="+" />
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Years of Grace</p>
          </div>
          <div className="reveal" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-accent mb-2">
              <StatCounter target={1500} suffix="+" />
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Active Members</p>
          </div>
          <div className="reveal" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-accent mb-2">
              <StatCounter target={12} suffix="+" />
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Ministries & Groups</p>
          </div>
          <div className="reveal" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-accent mb-2">
              <StatCounter target={5} suffix="+" />
            </h3>
            <p className="text-white/60 text-xs sm:text-sm font-bold uppercase tracking-wider">Planted Missions</p>
          </div>
        </div>
      </section>

      {/* 5. Welcome & Pastoral Message Section */}
      <section className="py-24 bg-bg relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Framed image of pastor or sanctuary */}
            <div className="lg:col-span-5 relative reveal-left">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 z-10">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                  alt="Pastoral Greeting"
                  className="w-full h-auto aspect-[4/5] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-6 text-white">
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Our Senior Pastor</p>
                  <h4 className="font-serif text-2xl font-bold leading-tight">Rev&apos;d Dr S. O. Mosebolatan</h4>
                </div>
              </div>
              
              {/* Overlapping back-layer layout frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/10 rounded-3xl -z-0 pointer-events-none hidden sm:block" />
            </div>

            {/* Right side: Welcome text block */}
            <div className="lg:col-span-7 space-y-6 reveal-right">
              <span className="text-primary-light text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block">
                Welcome to Sanctuary of Praise
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary-dark tracking-tight leading-tight">
                Grace and peace be <br />
                <span className="text-gradient-gold">multiplied unto you.</span>
              </h2>
              <div className="w-16 h-1 bg-accent rounded-full" />
              <p className="text-text-muted text-base sm:text-lg leading-relaxed pt-2">
                We are delighted to welcome you to the official platform of Trinity Baptist Church, Ilora. Guided by the Holy Spirit and rooted deeply in the unadulterated Word of God, our congregation is a warm sanctuary where lives find purpose, hearts find healing, and souls lift ultimate praises to the Almighty.
              </p>
              <p className="text-text-muted text-base leading-relaxed">
                Whether you are exploring Christianity for the first time, seeking a spiritual family to call home, or joining us virtually from afar, we pray that you experience the transforming love, overflowing grace, and deep-seated joy of our Lord Jesus Christ today.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link
                  href="/about"
                  className="btn-shine btn-gold inline-flex items-center gap-2 text-primary-dark font-bold py-3.5 px-7 rounded-xl text-sm"
                >
                  Our Leadership & Story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/pastor"
                  className="text-[#0D4A35] font-semibold text-sm hover:underline"
                >
                  Read Pastor&apos;s Profile &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Scripture Banner (Rotating text) */}
      <section className="bg-primary-dark text-white py-16 border-y border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8E63A_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <svg className="w-10 h-10 text-accent mx-auto mb-6 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.842 1.34 2.842 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.843 1.34 2.843 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275z" />
          </svg>
          
          <div className="min-h-[140px] flex flex-col justify-center items-center">
            <p
              className={`font-serif text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed italic max-w-3xl transition-all duration-500
                ${fadeState ? "opacity-100 translate-y-0 filter blur-0" : "opacity-0 translate-y-2 filter blur-sm"}
              `}
            >
              &ldquo;{scriptures[scriptureIndex].text}&rdquo;
            </p>
            <span
              className={`block mt-4 text-accent text-sm font-bold uppercase tracking-wider transition-all duration-500 delay-150
                ${fadeState ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
              `}
            >
              — {scriptures[scriptureIndex].reference}
            </span>
          </div>
        </div>
      </section>

      {/* 7. Weekly Activities Section */}
      <section className="py-24 bg-[#EFF6E0]/60 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-primary-light text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
              Weekly Fellowships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-primary-dark">
              Join Our <span className="text-gradient-gold">Fellowships</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-3">
              Meet with brethren throughout the week for scripture study, prayers, and deep Christian koinonia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {sampleActivities.slice(0, 3).map((act, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-stone-200/50 shadow-sm card-hover flex flex-col justify-between reveal"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-[#0D4A35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary-dark mb-2">{act.title}</h3>
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                    <svg className="w-4 h-4 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][act.weekday]} • {act.startTime}
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    {act.description || "Gather with the family of believers for a rich spiritual atmosphere of growth."}
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="text-sm font-bold text-[#0D4A35] hover:text-[#0B2C22] flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Fellowships
                  <span>&rarr;</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0D4A35] hover:bg-[#0B2C22] text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
            >
              See All Weekly Fellowships
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

        </div>
      </section>

      {/* 8. Featured Latest Sermon / Media Section */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal">
            <div>
              <span className="text-primary-light text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
                Latest Message
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary-dark">
                Hear the <span className="text-gradient-gold">Word of God</span>
              </h2>
            </div>
            <Link
              href="/sermons"
              className="text-[#0D4A35] hover:text-[#0B2C22] font-bold text-sm flex items-center gap-1.5 shrink-0"
            >
              Browse Sermon Archive
              <span>&rarr;</span>
            </Link>
          </div>

          {featuredSermon && (
            <div className="grid lg:grid-cols-12 gap-12 items-center reveal">
              {/* Sermon Video Thumbnail with Play Hover */}
              <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/50 bg-stone-100 group">
                <div className="aspect-video relative w-full overflow-hidden">
                  <img
                    src={getYouTubeThumbnail(featuredSermon.youtubeId || "")}
                    alt={featuredSermon.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark mask overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
                  
                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-primary-dark pl-1">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sermon Description Details */}
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-dark bg-accent/15 border border-accent/20 px-3 py-1 rounded-md inline-block">
                  Featured Message
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-primary-dark leading-tight">
                  {featuredSermon.title}
                </h3>
                <p className="text-xs font-semibold text-primary">
                  Preached by {featuredSermon.preacher} &bull; {featuredSermon.date}
                </p>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {featuredSermon.description || "Listen to this transformative, Bible-centered message designed to equip you with spiritual insight and lead you into deeper relationship with Jesus Christ."}
                </p>
                
                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link
                    href="/sermons"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#0D4A35] hover:bg-[#0B2C22] text-white font-semibold rounded-xl text-sm shadow-md transition-colors"
                  >
                    Listen / Watch Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                  <Link
                    href="/sermons"
                    className="text-[#0D4A35] font-semibold text-sm hover:underline"
                  >
                    View All Sermons Series &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 9. Contact / Action CTA section */}
      <section className="bg-primary-dark text-white py-20 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8E63A_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 reveal">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Be Part of Our Family
          </h2>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you live right here in Ilora or you are joining us from across the globe, we are excited to have you join us. Connect, serve, grow, and walk this journey of faith together with us.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-light text-primary-dark font-bold py-4 px-8 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all text-sm w-full sm:w-auto"
            >
              Get in Touch
            </Link>
            <Link
              href="/book"
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:-translate-y-0.5 transition-all text-sm w-full sm:w-auto"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
