"use client";

import { useEffect, useState, useCallback } from "react";
import { listAllPhotos, GalleryPhoto } from "@/lib/gallery";

const FALLBACK_PHOTOS: GalleryPhoto[] = [
  { id: "f1", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", caption: "Sunday Worship", albumId: "", createdAt: "" },
  { id: "f2", url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80", caption: "Fellowship", albumId: "", createdAt: "" },
  { id: "f3", url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80", caption: "Choir Ministry", albumId: "", createdAt: "" },
  { id: "f4", url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80", caption: "Prayer Service", albumId: "", createdAt: "" },
  { id: "f5", url: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&q=80", caption: "Community Outreach", albumId: "", createdAt: "" },
  { id: "f6", url: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&q=80", caption: "Church Gathering", albumId: "", createdAt: "" },
  { id: "f7", url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80", caption: "Evening Service", albumId: "", createdAt: "" },
  { id: "f8", url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80", caption: "Special Programme", albumId: "", createdAt: "" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  speed?: number;
  rowCount?: number;
  label?: string;
  /** If true and no real photos exist, show nothing (hides placeholders in gallery page) */
  hideWhenEmpty?: boolean;
}

export default function PhotoCarousel({ speed = 35, rowCount = 2, label, hideWhenEmpty = false }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [ready, setReady] = useState(false);
  const [isReal, setIsReal] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    listAllPhotos()
      .then(data => {
        if (data.length >= 2) {
          setPhotos(shuffle(data));
          setIsReal(true);
        } else {
          setPhotos(FALLBACK_PHOTOS);
          setIsReal(false);
        }
        setReady(true);
      })
      .catch(() => {
        setPhotos(FALLBACK_PHOTOS);
        setIsReal(false);
        setReady(true);
      });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox]);

  if (!ready) return null;
  if (hideWhenEmpty && !isReal) return null;
  if (photos.length === 0) return null;

  // Pad to at least 8 items for a full-looking carousel
  const padded = photos.length < 8
    ? [...photos, ...FALLBACK_PHOTOS].slice(0, 8)
    : photos;

  const row1 = padded.filter((_, i) => i % 2 === 0);
  const row2 = padded.filter((_, i) => i % 2 === 1);

  const PhotoCard = ({ photo, keyStr }: { photo: GalleryPhoto; keyStr: string }) => (
    <button
      key={keyStr}
      onClick={() => setLightbox(photo)}
      className="flex-shrink-0 w-56 h-40 mx-1.5 rounded-2xl overflow-hidden shadow-md group relative focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={photo.caption || "View photo"}
    >
      <img
        src={photo.url}
        alt={photo.caption || "Church photo"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
        </svg>
      </div>
    </button>
  );

  return (
    <>
      <div className="w-full overflow-hidden py-2">
        {label && (
          <div className="text-center mb-6">
            <span className="text-primary-light text-xs font-bold uppercase tracking-widest">{label}</span>
          </div>
        )}

        {/* Row 1 — scrolls left */}
        <div className="relative mb-3">
          <div className="flex" style={{ animation: `carousel-left ${speed}s linear infinite` }}>
            {[...row1, ...row1].map((photo, i) => (
              <PhotoCard key={`r1-${photo.id}-${i}`} photo={photo} keyStr={`r1-${i}`} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        {rowCount === 2 && (
          <div className="relative">
            <div className="flex" style={{ animation: `carousel-right ${speed * 1.15}s linear infinite` }}>
              {[...row2, ...row2].map((photo, i) => (
                <PhotoCard key={`r2-${photo.id}-${i}`} photo={photo} keyStr={`r2-${i}`} />
              ))}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes carousel-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes carousel-right {
            0%   { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={lightbox.url}
              alt={lightbox.caption || "Church photo"}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {lightbox.caption && (
              <p className="text-center text-white/80 text-sm mt-3 font-medium">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
