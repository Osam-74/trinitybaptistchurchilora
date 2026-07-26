"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

  return (
    <>
      <div className="w-full overflow-hidden py-2">
        {label && (
          <div className="text-center mb-6">
            <span className="text-primary-light text-xs font-bold uppercase tracking-widest">{label}</span>
          </div>
        )}

        {/* Row 1 — scrolls left, swipeable */}
        <SwipeableRow photos={row1} direction="left" speed={speed} onPhotoClick={setLightbox} />

        {/* Row 2 — scrolls right, swipeable */}
        {rowCount === 2 && (
          <SwipeableRow photos={row2} direction="right" speed={speed * 1.15} onPhotoClick={setLightbox} />
        )}
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

// ── Swipeable Row ────────────────────────────────────────────────────────────
// Uses requestAnimationFrame for auto-scroll. On touch/drag, the user takes
// over and can scroll freely in either direction. On release, auto-scroll
// resumes from the current position.

function SwipeableRow({
  photos,
  direction,
  speed,
  onPhotoClick,
}: {
  photos: GalleryPhoto[];
  direction: "left" | "right";
  speed: number;
  onPhotoClick: (p: GalleryPhoto) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);          // current pixel offset
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const velocityRef = useRef(0);        // for momentum after release
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [, forceRender] = useState(0);

  // Auto-scroll speed in px/sec, derived from the `speed` prop (seconds per loop)
  // Total loop width = half the duplicated track. Faster speed prop = slower scroll.
  const pxPerSec = 60 / (speed / 35);    // ~60px/s at speed=35
  const autoDir = direction === "left" ? -1 : 1;  // left = scroll left (negative offset)

  // Duplicate the photos so the track loops seamlessly
  const doubled = [...photos, ...photos];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number;
    let lastFrame = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastFrame) / 1000;
      lastFrame = now;

      if (!isDraggingRef.current) {
        // Apply momentum decay, then resume auto-scroll
        if (Math.abs(velocityRef.current) > 0.5) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= 0.92; // decay
        } else {
          velocityRef.current = 0;
          // Auto-scroll
          offsetRef.current += autoDir * pxPerSec * dt;
        }

        // Wrap around for seamless loop
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (offsetRef.current <= -halfWidth) offsetRef.current += halfWidth;
          if (offsetRef.current > 0) offsetRef.current -= halfWidth;
        }
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoDir, pxPerSec]);

  // ── Touch handlers ──
  const onTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startOffsetRef.current = offsetRef.current;
    velocityRef.current = 0;
    lastXRef.current = e.touches[0].clientX;
    lastTimeRef.current = performance.now();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const x = e.touches[0].clientX;
    const delta = x - startXRef.current;
    offsetRef.current = startOffsetRef.current + delta;

    // Track velocity for momentum
    const now = performance.now();
    const dt = (now - lastTimeRef.current) / 1000;
    if (dt > 0) {
      velocityRef.current = (x - lastXRef.current) / dt;
    }
    lastXRef.current = x;
    lastTimeRef.current = now;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const onTouchEnd = () => {
    isDraggingRef.current = false;
    // Velocity will decay in the tick loop, then auto-scroll resumes
  };

  // ── Mouse handlers (for desktop drag) ──
  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const x = e.clientX;
    const delta = x - startXRef.current;
    offsetRef.current = startOffsetRef.current + delta;

    const now = performance.now();
    const dt = (now - lastTimeRef.current) / 1000;
    if (dt > 0) {
      velocityRef.current = (x - lastXRef.current) / dt;
    }
    lastXRef.current = x;
    lastTimeRef.current = now;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const PhotoCard = ({ photo, idx }: { photo: GalleryPhoto; idx: number }) => (
    <button
      key={`${photo.id}-${idx}`}
      onClick={() => {
        if (!isDraggingRef.current) onPhotoClick(photo);
      }}
      className="flex-shrink-0 w-56 h-40 mx-1.5 rounded-2xl overflow-hidden shadow-md group relative focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={photo.caption || "View photo"}
    >
      <img
        src={photo.url}
        alt={photo.caption || "Church photo"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        draggable={false}
        onError={(e) => {
          const card = (e.target as HTMLElement).closest("button");
          if (card) card.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
        </svg>
      </div>
    </button>
  );

  return (
    <div
      className="relative mb-3 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{ willChange: 'transform', width: 'max-content' }}
      >
        {doubled.map((photo, i) => (
          <PhotoCard key={`${photo.id}-${i}`} photo={photo} idx={i} />
        ))}
      </div>
    </div>
  );
}
