import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, getDocs,
} from "firebase/firestore";
import { Post } from "@/types";
import { samplePosts } from "@/lib/seed-data";

const COLL = "faith_articles";

/** Seed default articles into Firestore if the collection is empty (first run) */
export async function seedArticlesIfEmpty() {
  if (!db) return;
  const snap = await getDocs(collection(db, COLL));
  if (snap.empty) {
    for (const p of samplePosts) {
      await addDoc(collection(db, COLL), {
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
      });
    }
  }
}

/** Subscribe to all articles (admin) */
export function subscribeArticles(cb: (articles: Post[]) => void) {
  if (!db) { cb([]); return () => {}; }
  const q = query(collection(db, COLL), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
  }, () => cb([]));
}

/** Get published articles for the public homepage */
export async function getPublishedArticles(limit = 6): Promise<Post[]> {
  if (!db) {
    // Fallback to seed data if Firebase isn't configured
    return samplePosts
      .filter(p => p.status === "published")
      .slice(0, limit)
      .map((p, i) => ({ ...p, id: `seed-${i}` }));
  }
  const q = query(collection(db, COLL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Post))
    .filter(p => p.status === "published")
    .slice(0, limit);
}

/** Create a new article */
export async function createArticle(data: Omit<Post, "id">): Promise<string> {
  if (!db) throw new Error("Database not configured");
  const docRef = await addDoc(collection(db, COLL), {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  });
  return docRef.id;
}

/** Update an article */
export async function updateArticle(id: string, data: Partial<Post>): Promise<void> {
  if (!db) throw new Error("Database not configured");
  await updateDoc(doc(db, COLL, id), data);
}

/** Delete an article */
export async function deleteArticle(id: string): Promise<void> {
  if (!db) throw new Error("Database not configured");
  await deleteDoc(doc(db, COLL, id));
}
