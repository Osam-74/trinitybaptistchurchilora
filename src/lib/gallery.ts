/**
 * Gallery — Albums & Photos persisted in Firestore.
 * Collections:
 *   /gallery_albums/{albumId}   — album metadata
 *   /gallery_photos/{photoId}   — individual photos (albumId field links to album)
 */

import {
  collection, doc, addDoc, getDocs, deleteDoc, updateDoc,
  query, orderBy, where, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  eventDate?: string;
  hidden?: boolean;
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  albumId: string;
  url: string;
  caption?: string;
  createdAt: string;
}

// ── Albums ──────────────────────────────────────────────────────────────────

export async function listAlbums(): Promise<GalleryAlbum[]> {
  if (!db) return [];
  const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || "Untitled",
      description: data.description,
      coverUrl: data.coverUrl,
      eventDate: data.eventDate,
      hidden: data.hidden || false,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
}

/** Public-facing: only non-hidden albums */
export async function listPublishedAlbums(): Promise<GalleryAlbum[]> {
  const all = await listAlbums();
  return all.filter(a => !a.hidden);
}

export async function createAlbum(data: Omit<GalleryAlbum, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "gallery_albums"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAlbum(id: string, data: Partial<Omit<GalleryAlbum, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "gallery_albums", id), data);
}

export async function deleteAlbum(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "gallery_albums", id));
}

/** Count photos in an album (for delete warning) */
export async function countPhotos(albumId: string): Promise<number> {
  if (!db) return 0;
  const q = query(collection(db, "gallery_photos"), where("albumId", "==", albumId));
  const snap = await getDocs(q);
  return snap.size;
}

// ── Photos ──────────────────────────────────────────────────────────────────

/**
 * List photos for an album.
 * Uses only `where` (no orderBy) to avoid requiring a composite Firestore index.
 * Sorts by createdAt in JS after fetching.
 */
export async function listPhotos(albumId: string): Promise<GalleryPhoto[]> {
  if (!db) return [];
  const q = query(collection(db, "gallery_photos"), where("albumId", "==", albumId));
  const snap = await getDocs(q);
  const photos = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      albumId: data.albumId,
      url: data.url || data.cloudinaryUrl || data.imageUrl || "",
      caption: data.caption,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    } as GalleryPhoto;
  });
  // Sort by createdAt descending (newest first) in JS
  photos.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return photos;
}

export async function listAllPhotos(): Promise<GalleryPhoto[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "gallery_photos"));
  return snap.docs
    .map(d => {
      const data = d.data();
      return {
        id: d.id,
        albumId: data.albumId || "",
        url: data.url || data.cloudinaryUrl || data.imageUrl || "",
        caption: data.caption,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
      } as GalleryPhoto;
    })
    .filter(p => p.url.startsWith("http"))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function addPhoto(albumId: string, url: string, caption?: string): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "gallery_photos"), {
    albumId,
    url,
    caption: caption || "",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deletePhoto(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "gallery_photos", id));
}
