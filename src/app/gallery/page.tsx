"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GALLERIES = [
  {
    category: "Worship",
    title: "Sunday Glorious Service",
    photo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    desc: "Lifting holy hands in the presence of the King."
  },
  {
    category: "Events",
    title: "Youth Anniversary",
    photo: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
    desc: "A generation burning with zeal for the gospel."
  },
  {
    category: "Community",
    title: "Community Welfare Drive",
    photo: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80",
    desc: "Spreading the practical love of Christ across Ilora."
  },
  {
    category: "Choir",
    title: "Christmas Carol Festival",
    photo: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80",
    desc: "Melodious choristers singing of Christ's nativity."
  },
  {
    category: "Worship",
    title: "Praise and Miracles Night",
    photo: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    desc: "Supernatural breakthroughs during fervent praise."
  },
  {
    category: "Events",
    title: "Annual Church Convention",
    photo: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
    desc: "A gathering of believers receiving unceasing fire."
  },
  {
    category: "Community",
    title: "Sunday School Outreach",
    photo: "https://images.unsplash.com/photo-1490633874645-1a651f43e4b6?w=800&q=80",
    desc: "Planting God's Word early in the young ones."
  },
  {
    category: "Choir",
    title: "Music Ministry Workshop",
    photo: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    desc: "Equipping vocalists and musicians for high service."
  },
  {
    category: "Worship",
    title: "Communion Service",
    photo: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&q=80",
    desc: "Taking the breaking of bread in profound holiness."
  },
  {
    category: "Events",
    title: "Revival and Deliverance",
    photo: "https://images.unsplash.com/photo-1519997943534-a9d08c94a4d8?w=800&q=80",
    desc: "Souls saved and chains broken in Jesus name."
  },
  {
    category: "Community",
    title: "Health & Welfare Day",
    photo: "https://images.unsplash.com/photo-1485871800524-4516490e7529?w=800&q=80",
    desc: "Providing basic healthcare checkups for the town."
  }
];

const VIDEO_GALLERY = [
  { youtubeId: "Sc6C6q9T2QY", title: "Sunday Worship Highlights", date: "July 2026" },
  { youtubeId: "Sc6C6q9T2QY", title: "Rev'd Dr S. O. Mosebolatan Sermon Clip", date: "June 2026" },
  { youtubeId: "Sc6C6q9T2QY", title: "Choir Melodious Ministration", date: "May 2026" },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Worship" | "Events" | "Community" | "Choir">("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const filteredPhotos = GALLERIES.filter(p => selectedCategory === "All" || p.category === selectedCategory);

  const openLightbox = (photoUrl: string) => {
    const idx = GALLERIES.findIndex(p => p.photo === photoUrl);
    if (idx !== -1) {
      setSelectedPhotoIndex(idx);
      setLightboxOpen(true);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev + 1) % GALLERIES.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev - 1 + GALLERIES.length) % GALLERIES.length);
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28 relative">
          <div className="absolute right-16 top-8 opacity-10 hidden lg:block">
            <svg viewBox="0 0 48 60" className="w-12 h-16 text-accent animate-pulse" fill="currentColor">
              <rect x="20" y="0" width="8" height="60" rx="4" />
              <rect x="0" y="16" width="48" height="8" rx="4" />
            </svg>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              GALLERY
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Church Life in <span className="text-gradient-gold">Pictures</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Capturing moments of spiritual ecstasy, sincere fellowship, and grace at Trinity Baptist Church, Ilora.
            </p>
          </div>
        </div>
      </div>

      {/* Album Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {(["All", "Worship", "Events", "Community", "Choir"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-stone-600 hover:text-primary border border-stone-200/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid with Varying Span heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
          {filteredPhotos.map((item, idx) => {
            // Apply varied row-spans for a dynamic masonry-style flow
            let rowSpan = "row-span-1";
            if (idx % 3 === 0) rowSpan = "row-span-2";
            else if (idx % 4 === 1) rowSpan = "row-span-2";

            return (
              <div
                key={idx}
                className={`${rowSpan} relative rounded-3xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200/50 flex flex-col justify-end`}
                onClick={() => openLightbox(item.photo)}
              >
                <img
                  src={item.photo}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover img-zoom transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="relative p-6 z-10 text-white transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-accent text-primary-dark text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-2 leading-tight">{item.title}</h3>
                  <p className="text-white/70 text-xs mt-1.5 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Gallery Section */}
        <div className="mt-24 pt-16 border-t border-stone-200">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">DIGITAL MEDIA</span>
            <h2 className="font-serif text-3xl font-bold text-primary mt-2">Video Gallery</h2>
            <p className="text-stone-600 text-sm mt-2">Watch highlights and sermons from our streaming ministry</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEO_GALLERY.map((video, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 group">
                <div className="relative h-48 bg-primary-dark overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-accent text-primary-dark flex items-center justify-center hover:bg-accent-light transition-all shadow-lg hover:scale-105"
                    >
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">{video.date}</span>
                  <h4 className="font-serif text-base font-bold text-primary mt-1">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
            onClick={prevPhoto}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERIES[selectedPhotoIndex].photo}
              alt={GALLERIES[selectedPhotoIndex].title}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <h3 className="font-serif text-xl font-bold">{GALLERIES[selectedPhotoIndex].title}</h3>
              <p className="text-white/70 text-xs mt-1">{GALLERIES[selectedPhotoIndex].desc}</p>
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
            onClick={nextPhoto}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
