"use client";

import { useEffect, useState, useRef } from "react";
import { listAllPhotos, GalleryPhoto } from "@/lib/gallery";

// Fallback images when no photos are uploaded yet
const FALLBACK_PHOTOS = [
  { id: "f1", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", caption: "Sunday Worship" },
  { id: "f2", url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80", caption: "Fellowship" },
  { id: "f3", url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80", caption: "Choir Ministry" },
  { id: "f4", url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80", caption: "Prayer Service" },
  { id: "f5", url: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&q=80", caption: "Community Outreach" },
  { id: "f6", url: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&q=80", caption: "Church Gathering" },
  { id: "f7", url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80", caption: "Evening Service" },
  { id: "f8", url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80", caption: "Special Programme" },
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
  speed?: number; // seconds for one full loop — default 35
  rowCount?: number; // 1 or 2 rows — default 2
  label?: string;
}

export default function PhotoCarousel({ speed = 35, rowCount = 2, label }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    listAllPhotos()
      .then(data => {
        const items = data.length >= 4 ? shuffle(data) : FALLBACK_PHOTOS.map(f => ({ ...f, albumId: "", createdAt: "" }));
        setPhotos(items);
        setReady(true);
      })
      .catch(() => {
        setPhotos(FALLBACK_PHOTOS.map(f => ({ ...f, albumId: "", createdAt: "" })));
        setReady(true);
      });
  }, []);

  if (!ready || photos.length === 0) return null;

  // Pad photos to have enough items for both rows
  const minItems = 8;
  const padded = photos.length < minItems
    ? [...photos, ...FALLBACK_PHOTOS.map(f => ({ ...f, albumId: "", createdAt: "" }))].slice(0, Math.max(minItems, photos.length))
    : photos;

  // Split into two rows (interleaved for visual variety)
  const row1 = padded.filter((_, i) => i % 2 === 0);
  const row2 = padded.filter((_, i) => i % 2 === 1);

  return (
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
            <div key={`r1-${photo.id}-${i}`} className="flex-shrink-0 w-56 h-40 mx-1.5 rounded-2xl overflow-hidden shadow-md">
              <img
                src={photo.url}
                alt={photo.caption || "Church photo"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (only if rowCount === 2) */}
      {rowCount === 2 && (
        <div className="relative">
          <div className="flex" style={{ animation: `carousel-right ${speed * 1.15}s linear infinite` }}>
            {[...row2, ...row2].map((photo, i) => (
              <div key={`r2-${photo.id}-${i}`} className="flex-shrink-0 w-56 h-40 mx-1.5 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={photo.url}
                  alt={photo.caption || "Church photo"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
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
  );
}
