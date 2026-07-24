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
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
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

// ── Photos ──────────────────────────────────────────────────────────────────

export async function listPhotos(albumId: string): Promise<GalleryPhoto[]> {
  if (!db) return [];
  const q = query(
    collection(db, "gallery_photos"),
    where("albumId", "==", albumId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      albumId: data.albumId,
      url: data.url || data.cloudinaryUrl || data.imageUrl || "",
      caption: data.caption,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
}

export async function listAllPhotos(): Promise<GalleryPhoto[]> {
  if (!db) return [];
  const q = query(collection(db, "gallery_photos"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      albumId: data.albumId || "",
      url: data.url || data.cloudinaryUrl || data.imageUrl || "",
      caption: data.caption,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
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
