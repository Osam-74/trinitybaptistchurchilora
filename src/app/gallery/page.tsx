"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ALBUMS = [
  {
    id: "worship",
    label: "Worship Services",
    icon: "🙏",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=85", caption: "Sunday Morning Worship" },
      { url: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=1200&q=85", caption: "Holy Communion Service" },
      { url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=85", caption: "Evening Praise & Worship" },
      { url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=85", caption: "Midweek Bible Study" },
      { url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=85", caption: "Prayer & Fasting Service" },
      { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=85", caption: "Special Thanksgiving" },
    ],
  },
  {
    id: "events",
    label: "Church Events",
    icon: "🎉",
    cover: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=85", caption: "Annual Church Convention" },
      { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=85", caption: "Praise & Miracles Night" },
      { url: "https://images.unsplash.com/photo-1519997943534-a9d08c94a4d8?w=1200&q=85", caption: "Revival & Deliverance Programme" },
      { url: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=1200&q=85", caption: "Youth Anniversary Celebration" },
      { url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1200&q=85", caption: "Christmas Carol Festival" },
    ],
  },
  {
    id: "community",
    label: "Community Outreach",
    icon: "🤝",
    cover: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=85", caption: "Community Welfare Drive" },
      { url: "https://images.unsplash.com/photo-1490633874645-1a651f43e4b6?w=1200&q=85", caption: "Sunday School Outreach" },
      { url: "https://images.unsplash.com/photo-1485871800524-4516490e7529?w=1200&q=85", caption: "Health & Welfare Day" },
      { url: "https://images.unsplash.com/photo-1438232992991-995b671e4427?w=1200&q=85", caption: "Evangelism & Missions" },
    ],
  },
  {
    id: "choir",
    label: "Choir & Music",
    icon: "🎵",
    cover: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=85", caption: "Music Ministry Workshop" },
      { url: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=1200&q=85", caption: "Choir Ministration" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=85", caption: "Instrumentalists' Rehearsal" },
      { url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=85", caption: "Special Music Presentation" },
    ],
  },
];

const VIDEO_GALLERY = [
  { youtubeId: "Sc6C6q9T2QY", title: "Sunday Worship Highlights", date: "July 2026" },
  { youtubeId: "Sc6C6q9T2QY", title: "Rev'd Dr Mosebolatan Sermon Clip", date: "June 2026" },
  { youtubeId: "Sc6C6q9T2QY", title: "Choir Melodious Ministration", date: "May 2026" },
];

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentAlbum = ALBUMS.find((a) => a.id === activeAlbum);
  const currentPhotos = currentAlbum?.photos ?? [];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextPhoto = useCallback(() => setLightboxIndex((i) => (i !== null ? (i + 1) % currentPhotos.length : 0)), [currentPhotos.length]);
  const prevPhoto = useCallback(() => setLightboxIndex((i) => (i !== null ? (i - 1 + currentPhotos.length) % currentPhotos.length : 0)), [currentPhotos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, nextPhoto, prevPhoto, closeLightbox]);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28 relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              GALLERY
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Moments of <span className="text-gradient-gold">Worship</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Cherished moments of sincere fellowship, praise, and grace at Trinity Baptist Church, Ilora.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Album Grid View ── */}
        {!activeAlbum && (
          <>
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-primary-dark mb-2">Browse Albums</h2>
              <p className="text-stone-500 text-sm">Select an album to explore photos</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {ALBUMS.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setActiveAlbum(album.id)}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md border border-stone-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left"
                  style={{ aspectRatio: "4/5" }}
                >
                  <img
                    src={album.cover}
                    alt={album.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="text-2xl mb-2 block">{album.icon}</span>
                    <h3 className="font-serif text-lg font-bold leading-tight">{album.label}</h3>
                    <p className="text-white/60 text-xs mt-1">{album.photos.length} photos</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
                      Open Album
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Video Gallery Section */}
            <div className="pt-8 border-t border-stone-200">
              <div className="text-center mb-10">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">DIGITAL MEDIA</span>
                <h2 className="font-serif text-3xl font-bold text-primary-dark mt-2">Video Gallery</h2>
                <p className="text-stone-500 text-sm mt-2">Watch highlights and sermons from our streaming ministry</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {VIDEO_GALLERY.map((video, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 group">
                    <div className="relative h-48 bg-primary-dark overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <a
                          href={`https://youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-full bg-accent text-primary-dark flex items-center justify-center hover:bg-accent-light hover:scale-110 transition-all shadow-lg"
                        >
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </a>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] text-stone-400 font-bold uppercase">{video.date}</span>
                      <h3 className="font-serif text-base font-bold text-primary-dark mt-1">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Individual Album Photo Grid ── */}
        {activeAlbum && currentAlbum && (
          <>
            {/* Back button + album header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setActiveAlbum(null)}
                className="flex items-center gap-2 text-sm font-semibold text-primary-dark hover:text-accent transition-colors bg-white border border-stone-200 rounded-xl px-4 py-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Albums
              </button>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary-dark">{currentAlbum.icon} {currentAlbum.label}</h2>
                <p className="text-stone-500 text-sm">{currentAlbum.photos.length} photos — click any to view full screen</p>
              </div>
            </div>

            {/* Photo Grid with varying sizes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
              {currentAlbum.photos.map((photo, idx) => {
                const isFeatured = idx === 0;
                return (
                  <button
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 ${isFeatured ? "col-span-2 row-span-2" : ""}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-xs font-semibold leading-tight">{photo.caption}</p>
                    </div>
                    {/* Click-to-expand icon */}
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Full-Screen Lightbox ── */}
      {lightboxIndex !== null && currentPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Main image */}
          <div className="relative max-w-5xl w-full max-h-full px-16 py-12" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentPhotos[lightboxIndex].url}
              alt={currentPhotos[lightboxIndex].caption}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Caption */}
            <div className="text-center mt-4">
              <p className="text-white/80 font-medium">{currentPhotos[lightboxIndex].caption}</p>
              <p className="text-white/40 text-sm mt-1">{lightboxIndex + 1} / {currentPhotos.length}</p>
            </div>

            {/* Thumbnail strip */}
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-1">
              {currentPhotos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIndex ? "border-accent scale-110" : "border-white/20 opacity-60 hover:opacity-100"}`}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
