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
export async function getPublishedArticles(max = 6): Promise<Post[]> {
  const fallback = () =>
    samplePosts
      .filter(p => p.status === "published")
      .slice(0, max)
      .map((p, i) => ({ ...p, id: `seed-${i}` }));

  if (!db) return fallback();

  try {
    // Try seeding first if collection is empty (also works on homepage visits)
    await seedArticlesIfEmpty();

    const q = query(collection(db, COLL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const articles = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Post))
      .filter(p => p.status === "published")
      .slice(0, max);

    // If Firestore returned nothing, use seed data so the section is never empty
    if (articles.length === 0) return fallback();
    return articles;
  } catch (err) {
    console.error("[posts] getPublishedArticles failed, using fallback:", err);
    return fallback();
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
