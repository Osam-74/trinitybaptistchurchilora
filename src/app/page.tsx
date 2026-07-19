"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveBanner from "@/components/LiveBanner";
import SideRays from "@/components/SideRays";
import { getYouTubeThumbnail } from "@/lib/utils";
import { sampleSermons } from "@/lib/seed-data";
import { doc, onSnapshot, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

  // 1. LIVE FEED: Subscription to settings/main doc in Firestore
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!db) return;
    try {
      const docRef = doc(db, "settings", "main");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.isLive === "boolean") {
            setIsLive(data.isLive);
          }
        }
      }, (error) => {
        console.error("Error listening to settings/main:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore live subscription failed:", e);
    }
  }, []);

  // 3. GALLERY SECTION: Fetch 6 most recent photos from gallery_photos
  interface GalleryPhoto {
    id: string;
    imageUrl?: string;
    photoUrl?: string;
    createdAt?: { seconds: number } | string | null;
  }
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [, setLoadingPhotos] = useState(true);

  // Pre-configured backup list of high-quality church/worship photos from Unsplash
  const placeholderPhotos = [
    { id: "p1", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80", createdAt: "July 2026" },
    { id: "p2", imageUrl: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80", createdAt: "July 2026" },
    { id: "p3", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&q=80", createdAt: "July 2026" },
    { id: "p4", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", createdAt: "July 2026" },
    { id: "p5", imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80", createdAt: "July 2026" },
    { id: "p6", imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=600&q=80", createdAt: "July 2026" },
    { id: "p7", imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80", createdAt: "July 2026" },
    { id: "p8", imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&q=80", createdAt: "July 2026" },
    { id: "p9", imageUrl: "https://images.unsplash.com/photo-1438232992991-995b671e4427?w=600&q=80", createdAt: "July 2026" },
    { id: "p10", imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80", createdAt: "July 2026" },
    { id: "p11", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", createdAt: "July 2026" },
    { id: "p12", imageUrl: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=600&q=80", createdAt: "July 2026" },
  ];

  useEffect(() => {
    async function fetchGallery() {
      if (!db) {
        setLoadingPhotos(false);
        return;
      }
      try {
        const q = query(collection(db, "gallery_photos"), orderBy("createdAt", "desc"), limit(12));
        const querySnapshot = await getDocs(q);
        const photos: GalleryPhoto[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          photos.push({
            id: docSnap.id,
            imageUrl: data.imageUrl || data.photoUrl,
            createdAt: data.createdAt
          });
        });
        setGalleryPhotos(photos);
      } catch (err) {
        console.error("Error fetching gallery photos:", err);
      } finally {
        setLoadingPhotos(false);
      }
    }
    fetchGallery();
  }, []);

  // Helper function to format timestamp/date for overlay
  const formatPhotoDate = (createdAt: { seconds: number } | string | null | undefined) => {
    if (!createdAt) return "Recent";
    if (typeof createdAt === "string") return createdAt;
    if (createdAt.seconds) {
      const d = new Date(createdAt.seconds * 1000);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    }
    if (createdAt instanceof Date) {
      return createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    }
    return "Recent";
  };

  // 2. Hero Background Image Rotation
  const [currentBg, setCurrentBg] = useState(0);
  const heroBackgrounds = [
    "/church-building.jpg",
    "/church-front.jpg",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80",
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

        {/* Cascadian Side Rays */}
        <SideRays
          speed={2.5}
          rayColor1="#e4af0b"
          rayColor2="#c4ffc4"
          intensity={1.5}
          spread={2.4}
          origin="top-right"
          tilt={-4}
          opacity={0.6}
        />

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
            For Christ is our Peace — Eph. 2:14
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

      {/* 4. Statistics Counter — floats between hero and watchword (overlapping both) */}
      <div className="relative z-20 -mt-10 -mb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-100">
            {[
              { target: 60, suffix: "+", label: "Years of Grace" },
              { target: 1500, suffix: "+", label: "Active Members" },
              { target: 12, suffix: "+", label: "Ministries & Groups" },
              { target: 5, suffix: "+", label: "Planted Missions" },
            ].map((stat, i) => (
              <div key={stat.label} className={`py-8 px-6 text-center ${i >= 2 ? "border-t border-stone-100 md:border-t-0" : ""}`}>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-primary mb-1.5">
                  <StatCounter target={stat.target} suffix={stat.suffix} />
                </h3>
                <p className="text-primary/60 text-[11px] sm:text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 2026 YEARLY WATCHWORD SECTION */}
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B2C22 0%, #0D3D2E 50%, #0B2C22 100%)' }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8E63A_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C8E63A, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C8E63A, transparent)' }} />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Section label */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              ✝ Yearly Watchword — 2026
            </span>
          </div>

          {/* Main 2-column layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* LEFT: Year + Watchword */}
            <div className="text-center lg:text-left">
              {/* Big 2026 */}
              <div className="inline-block relative mb-4">
                <span className="font-serif font-black leading-none text-white select-none"
                  style={{ fontSize: 'clamp(5rem, 16vw, 9rem)', WebkitTextStroke: '3px #C8E63A', color: 'transparent', letterSpacing: '-0.02em' }}>
                  20
                </span>
                <span className="font-serif font-black leading-none select-none"
                  style={{ fontSize: 'clamp(5rem, 16vw, 9rem)', color: '#C8E63A', letterSpacing: '-0.02em' }}>
                  26
                </span>
              </div>

              {/* English watchword */}
              <div className="mb-3">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">My Year of</p>
                <h2 className="font-serif font-black text-white leading-tight"
                  style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', textShadow: '0 2px 20px rgba(200,230,58,0.3)' }}>
                  UPLIFTMENT
                </h2>
              </div>

              {/* Yoruba watchword */}
              <div className="mt-4 inline-block bg-white/5 border border-white/15 rounded-2xl px-6 py-3">
                <p className="text-accent/70 text-xs font-bold uppercase tracking-widest mb-1">Odun</p>
                <h3 className="font-serif font-bold text-accent text-2xl md:text-3xl">IGBE-DIDE MI</h3>
              </div>
            </div>

            {/* RIGHT: Bible Verse */}
            <div className="lg:border-l lg:border-white/10 lg:pl-12">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* English verse */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-accent mb-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.842 1.34 2.842 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.843 1.34 2.843 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275z" />
                  </svg>
                  <p className="text-white/85 text-sm leading-relaxed font-serif italic">
                    &ldquo;Rejoice not against me, O my enemy! when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me.&rdquo;
                  </p>
                  <p className="text-accent font-bold text-xs uppercase tracking-widest mt-4">MICAH 7:8 (AMPC)</p>
                </div>

                {/* Yoruba verse */}
                <div className="bg-white/5 border border-accent/20 rounded-2xl p-6 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-accent mb-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.842 1.34 2.842 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.161 2.51-4.884 4.371 1.405.353 2.843 1.34 2.843 3.528 0 2.525-1.748 4.275-4.477 4.275-2.272 0-4.465-1.368-4.465-4.275z" />
                  </svg>
                  <p className="text-white/85 text-sm leading-relaxed font-serif italic">
                    &ldquo;Má yọ mí, Iwọ ọ̀tà mi: nígba tí mo bà ṣubú, emi ò dide; nígba tí mo bà jokoo ní okùnkun, OLUWA yoo jẹ ìmọlẹ fun mi.&rdquo;
                  </p>
                  <p className="text-accent font-bold text-xs uppercase tracking-widest mt-4">MIKA 7:8 (ATỌKA)</p>
                </div>
              </div>

              {/* Footer quote */}
              <div className="mt-6 text-center lg:text-left">
                <p className="text-white/40 text-xs italic">
                  &ldquo;God bless you as you come again. Amen.&rdquo;
                </p>
              </div>
            </div>
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

      {/* 7. Weekly Activities Section (NOW EXACT SERVICE TIME CARDS) */}
      <section className="py-24 bg-[#EFF6E0]/60 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
              Weekly Services & Fellowship Times
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-primary-dark">
              Join Our <span className="text-gradient-gold">Services & Studies</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-3">
              We look forward to worshiping, studying, and praying together with you. Find our weekly schedules below.
            </p>
          </div>

          {/* Weekly Programme from Bulletin */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* SUNDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #0B2C22, #0D4A35)' }}>
                <span className="text-xl">☀️</span>
                <h3 className="font-serif text-base font-bold text-white">Sunday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">English Service</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">7:30 – 9:15am</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Sunday School</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">9:15 – 10:15am</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Yoruba Service</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">10:15am – 12:15pm</span>
                </div>
                <div className="border-t border-stone-100 pt-2 mt-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Evening</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-stone-600 text-xs">Discipleship / Baptismal Class</span><span className="text-primary text-xs font-semibold">4–5pm</span></div>
                    <div className="flex justify-between"><span className="text-stone-600 text-xs">Church Training Programme</span><span className="text-primary text-xs font-semibold">5–6pm</span></div>
                    <div className="flex justify-between"><span className="text-stone-600 text-xs">Evening Service</span><span className="text-primary text-xs font-semibold">6–7pm</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* MONDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1a4a35, #0D4A35)' }}>
                <span className="text-xl">🌅</span>
                <h3 className="font-serif text-base font-bold text-white">Monday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Early Morning Prayer</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:30 – 6:00am</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">MMU / WMU Meeting</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:30 – 6:30pm</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">G.A. / R.A. / Sun. Beam / Lydia</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:00 – 6:00pm</span>
                </div>
              </div>
            </div>

            {/* TUESDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1a3a50, #174060)' }}>
                <span className="text-xl">💼</span>
                <h3 className="font-serif text-base font-bold text-white">Tuesday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Business Men&apos;s Fellowship</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:30 – 6:30pm</span>
                </div>
              </div>
            </div>

            {/* WEDNESDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3a2a0a, #5a4010)' }}>
                <span className="text-xl">📖</span>
                <h3 className="font-serif text-base font-bold text-white">Wednesday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Prayer Meeting</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:00 – 6:00pm</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Bible Study</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">6:00 – 7:00pm</span>
                </div>
              </div>
            </div>

            {/* THURSDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #2a1a40, #3d2560)' }}>
                <span className="text-xl">🙌</span>
                <h3 className="font-serif text-base font-bold text-white">Thursday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Prayer Band (Spiritual Clinic)</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:00 – 7:00pm</span>
                </div>
              </div>
            </div>

            {/* FRIDAY */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3a1a10, #5a2818)' }}>
                <span className="text-xl">🔥</span>
                <h3 className="font-serif text-base font-bold text-white">Friday</h3>
              </div>
              <div className="p-5 space-y-2.5 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Early Morning Prayer</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:30 – 6:00am</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">SS Preparatory Class</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">5:00 – 6:00pm</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-stone-700 font-medium">Church Executive Meeting</span>
                  <span className="text-primary font-bold text-xs whitespace-nowrap ml-2">6:00 – 7:00pm</span>
                </div>
                <p className="text-[10px] text-stone-400 italic">(1st & 3rd Friday)</p>
              </div>
            </div>
          </div>

          {/* Monthly Programme */}
          <div className="mt-8 bg-primary rounded-3xl p-6 sm:p-8 text-white">
            <h3 className="font-serif text-xl font-bold mb-5 flex items-center gap-2">
              <span>📅</span> Monthly Programme
            </h3>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { name: "Night Watch Prayer", schedule: "Every Last Friday", time: "6:00pm – 8:00pm" },
                { name: "Covenant Service", schedule: "Every 1st Saturday", time: "6:00am – 7:00am" },
                { name: "3 Days Overcomers Service", schedule: "Last Mon to Wed", time: "Monthly" },
                { name: "Marriage Breakthrough", schedule: "Every Last Sunday", time: "5:00pm – 7:00pm" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="font-bold text-accent text-sm mb-1">{item.name}</p>
                  <p className="text-white/70 text-xs">{item.schedule}</p>
                  <p className="text-white/60 text-xs mt-0.5">{item.time}</p>
                </div>
              ))}
            </div>
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
              <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
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
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-accent/15 border border-accent/20 px-3 py-1 rounded-md inline-block">
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

      {/* GALLERY SECTION: Sunday Shots — Dual-row infinite auto-scroll */}
      <section className="py-20 bg-bg border-t border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10 reveal">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
                This Sunday in Pictures
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-primary-dark">
                Moments from our <span className="text-gradient-gold">church family</span>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-[#0D4A35] hover:text-[#0B2C22] font-bold text-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              View Full Gallery →
            </Link>
          </div>
        </div>

        {/* Row 1 — scrolls LEFT */}
        <div className="relative mb-4" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div
            className="flex gap-4"
            style={{
              animation: "gallery-scroll-left 35s linear infinite",
              width: "max-content",
            }}
          >
            {[...(galleryPhotos.length >= 6 ? galleryPhotos : placeholderPhotos), ...(galleryPhotos.length >= 6 ? galleryPhotos : placeholderPhotos)].slice(0, 16).map((photo, i) => (
              <div
                key={`row1-${photo.id}-${i}`}
                className="relative flex-shrink-0 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-stone-100 group shadow-sm"
              >
                <img
                  src={photo.imageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80"}
                  alt="Sunday Shot"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-semibold">{formatPhotoDate(photo.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls RIGHT (reversed) */}
        <div className="relative" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
          <div
            className="flex gap-4"
            style={{
              animation: "gallery-scroll-right 42s linear infinite",
              width: "max-content",
            }}
          >
            {[...(galleryPhotos.length >= 6 ? [...galleryPhotos].reverse() : [...placeholderPhotos].reverse()), ...(galleryPhotos.length >= 6 ? [...galleryPhotos].reverse() : [...placeholderPhotos].reverse())].slice(0, 16).map((photo, i) => (
              <div
                key={`row2-${photo.id}-${i}`}
                className="relative flex-shrink-0 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-stone-100 group shadow-sm"
              >
                <img
                  src={photo.imageUrl || "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&q=80"}
                  alt="Sunday Shot"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-semibold">{formatPhotoDate(photo.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 reveal">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0D4A35] hover:bg-[#0B2C22] text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
          >
            View Full Gallery →
          </Link>
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
