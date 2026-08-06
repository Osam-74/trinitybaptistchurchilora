"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoCarousel from "@/components/PhotoCarousel";
import { listPublishedAlbums, listPhotos, GalleryAlbum, GalleryPhoto } from "@/lib/gallery";

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxTouchX = useRef(0);

  useEffect(() => {
    listPublishedAlbums().then(data => {
      setAlbums(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openAlbum = async (album: GalleryAlbum) => {
    setActiveAlbum(album);
    setPhotosLoading(true);
    try {
      const data = await listPhotos(album.id);
      setPhotos(data);
    } catch (err) {
      console.error("Failed to load photos:", err);
    } finally {
      setPhotosLoading(false);
    }
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextPhoto = useCallback(() => {
    setLightboxIndex(i => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);
  const prevPhoto = useCallback(() => {
    setLightboxIndex(i => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[42vh] bg-primary-dark flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('/images/gallery-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 animate-fade-in">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            GALLERY
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
            Moments of <span className="text-gradient-gold">Worship</span>
          </h1>
        </div>
      </div>

      {/* Photo Carousel — pulls all gallery photos */}
      <section className="py-8 bg-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <PhotoCarousel speed={35} rowCount={2} label="Our Church in Pictures" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Album Grid View ── */}
        {!activeAlbum && (
          <>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-400 text-sm">No albums published yet. Check back soon!</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h2 className="font-serif text-3xl font-bold text-primary-dark mb-2">Browse Albums</h2>
                  <p className="text-stone-500 text-sm">Select an album to explore photos</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
                  {albums.map((album) => (
                    <button
                      key={album.id}
                      onClick={() => openAlbum(album)}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md border border-stone-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left"
                      style={{ aspectRatio: "4/5" }}
                    >
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary-dark flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-white">
                        <h3 className="font-serif text-sm sm:text-lg font-bold leading-tight">{album.title}</h3>
                        {album.eventDate && <p className="text-white/60 text-[10px] sm:text-xs mt-1">{album.eventDate}</p>}
                        <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-accent text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          Open Album
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── Individual Album Photo Grid ── */}
        {activeAlbum && (
          <>
            {/* Back button + album header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => { setActiveAlbum(null); setPhotos([]); }}
                className="flex items-center gap-2 text-sm font-semibold text-primary-dark hover:text-accent transition-colors bg-white border border-stone-200 rounded-xl px-4 py-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Albums
              </button>
              <div>
                <h2 className="font-serif text-xl font-bold text-primary-dark">{activeAlbum.title}</h2>
                <p className="text-stone-500 text-xs">{photos.length} photos — click any to view full screen</p>
              </div>
            </div>

            {photosLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-400 text-sm">No photos in this album yet.</p>
              </div>
            ) : (
              /* Photo Grid with varying sizes */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[150px] sm:auto-rows-[180px]">
                {photos.map((photo, idx) => {
                  const isFeatured = idx === 0;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 ${isFeatured ? "col-span-2 row-span-2" : ""}`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || activeAlbum.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Watermark: logo + album title at bottom center */}
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gradient-to-t from-black/60 to-transparent">
                        <img src="/logo/trinity-logo.png" alt="TBC" className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="text-white text-[8px] sm:text-[10px] font-semibold tracking-wide truncate max-w-[80%]">
                          {activeAlbum.title}
                        </span>
                      </div>
                      {/* Click-to-expand icon */}
                      <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Full-Screen Lightbox (swipeable, no arrows) ── */}
      {lightboxIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center touch-none"
          onClick={closeLightbox}
          onTouchStart={(e) => { lightboxTouchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - lightboxTouchX.current;
            if (Math.abs(delta) > 50) {
              if (delta < 0) nextPhoto();
              else prevPhoto();
            }
          }}
        >
          <div className="relative max-w-5xl w-full max-h-full px-4 py-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || activeAlbum?.title || ""}
              className="w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl"
              draggable={false}
            />

            {/* Watermark on lightbox image */}
            {activeAlbum && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <img src="/logo/trinity-logo.png" alt="TBC" className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-white text-sm font-semibold tracking-wide">
                  {activeAlbum.title}
                </span>
              </div>
            )}

            {/* Caption */}
            {photos[lightboxIndex].caption && (
              <div className="text-center mt-2">
                <p className="text-white/80 font-medium text-sm">{photos[lightboxIndex].caption}</p>
              </div>
            )}
            <p className="text-white/40 text-sm mt-1 text-center">{lightboxIndex + 1} / {photos.length}</p>

            {/* Thumbnail strip */}
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-1 max-w-xl mx-auto">
              {photos.map((p, i) => (
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
