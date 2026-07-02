"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ALL_PHOTOS = [
  "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80",
  "https://images.unsplash.com/photo-1490633874645-1a651f43e4b6?w=800&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
  "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&q=80",
  "https://images.unsplash.com/photo-1519997943534-a9d08c94a4d8?w=800&q=80",
  "https://images.unsplash.com/photo-1485871800524-4516490e7529?w=800&q=80",
];

// Tripple the photos for seamless infinite scroll
const makeRow = (photos: string[]) => [...photos, ...photos, ...photos];

const ROW1 = makeRow(ALL_PHOTOS.slice(0, 6));
const ROW2 = makeRow(ALL_PHOTOS.slice(4, 10));
const ROW3 = makeRow(ALL_PHOTOS.slice(2, 8));

function ScrollRow({ photos, direction, speed = "35s" }: { photos: string[]; direction: "left" | "right"; speed?: string }) {
  return (
    <div className="overflow-hidden relative">
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-bg-alt), transparent)' }}/>
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-bg-alt), transparent)' }}/>
      <div className={direction === "left" ? "scroll-row-left" : "scroll-row-right"} style={{ animationDuration: speed }}>
        {photos.map((photo, i) => (
          <div key={i} className="flex-shrink-0 w-60 h-44 mx-1.5 rounded-2xl overflow-hidden cursor-pointer group">
            <img src={photo} alt={`Gallery photo ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const openLightbox = (index: number) => {
    setCurrentPhoto(index);
    setLightboxOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, url]);
    });
  };

  const allDisplayPhotos = [...ALL_PHOTOS, ...uploadedFiles];

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28 relative">
          {/* Decorative cross */}
          <div className="absolute right-16 top-8 opacity-8 hidden lg:block">
            <svg viewBox="0 0 48 60" className="w-12 h-16 text-accent floating-cross" fill="currentColor">
              <rect x="20" y="0" width="8" height="60" rx="4"/>
              <rect x="0" y="16" width="48" height="8" rx="4"/>
            </svg>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              MEDIA GALLERY
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Moments of <span className="text-gradient-gold">Grace</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Capturing beautiful moments of worship, fellowship, and community life at Trinity Baptist Church, Ilora
            </p>
          </div>
        </div>
      </div>

      {/* Auto-scroll section */}
      <div className="bg-bg-alt py-14">
        <div className="mb-4 text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest">Hover to pause — scroll continuously</p>
        </div>
        <div className="space-y-3">
          <ScrollRow photos={ROW1} direction="left" speed="40s"/>
          <ScrollRow photos={ROW2} direction="right" speed="45s"/>
          <ScrollRow photos={ROW3} direction="left" speed="38s"/>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wider">ALL PHOTOS</p>
            <h2 className="font-serif text-3xl text-primary font-bold">Full Gallery</h2>
          </div>
          {/* Upload button (public facing - would need auth in real app) */}
          <label className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Upload Photo
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload}/>
          </label>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {allDisplayPhotos.map((photo, i) => (
            <div
              key={i}
              className="break-inside-avoid overflow-hidden rounded-2xl cursor-pointer group card-hover relative"
              onClick={() => openLightbox(i)}
            >
              <img src={photo} alt={`Church photo ${i + 1}`} className="w-full group-hover:scale-105 transition-transform duration-500 block"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  {/* Download button */}
                  <a
                    href={photo}
                    download={`trinity-church-photo-${i + 1}.jpg`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-primary backdrop-blur flex items-center justify-center hover:bg-primary-light transition-colors"
                    title="Download photo"
                  >
                    <svg className="w-3.5 h-3.5 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightboxOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => (p - 1 + allDisplayPhotos.length) % allDisplayPhotos.length); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => (p + 1) % allDisplayPhotos.length); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={allDisplayPhotos[currentPhoto]} alt="Gallery" className="max-w-[88vw] max-h-[80vh] object-contain rounded-2xl animate-scale-in shadow-2xl"/>
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm">{currentPhoto + 1} / {allDisplayPhotos.length}</span>
              <a
                href={allDisplayPhotos[currentPhoto]}
                download={`trinity-church-photo-${currentPhoto + 1}.jpg`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
