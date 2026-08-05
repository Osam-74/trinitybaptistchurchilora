import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, getDocs,
} from "firebase/firestore";
import { Post } from "@/types";

const COLL = "faith_articles";

/** Subscribe to all articles (admin) */
export function subscribeArticles(cb: (articles: Post[]) => void) {
  if (!db) { cb([]); return () => {}; }
  const q = query(collection(db, COLL), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
  }, () => cb([]));
}

/** Get published articles for the public homepage */
export async function getPublishedArticles(max = 6): Promise<Post[]> {
  if (!db) return [];

  try {
    // Try ordered query first
    let snap;
    try {
      const q = query(collection(db, COLL), orderBy("createdAt", "desc"));
      snap = await getDocs(q);
    } catch {
      // If orderBy fails (missing field), fall back to unordered query
      snap = await getDocs(collection(db, COLL));
    }

    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
    // Sort client-side as fallback
    all.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return tb - ta;
    });

    const published = all
      .filter(p => !p.status || p.status === "published")
      .slice(0, max);

    return published;
  } catch (err) {
    console.error("[posts] getPublishedArticles failed:", err);
    return [];
  }
}

/** Seed default articles into Firestore if the collection is empty (first run) */
export async function seedArticlesIfEmpty() {
  if (!db) return;
  const snap = await getDocs(collection(db, COLL));
  if (snap.empty) {
    const { samplePosts } = await import("@/lib/seed-data");
    for (const p of samplePosts) {
      await addDoc(collection(db, COLL), {
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
      });
    }
  }
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
