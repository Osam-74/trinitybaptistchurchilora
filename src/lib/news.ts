/**
 * NewsPosts — persisted in Firestore at news_posts/{id}.
 */

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NewsPost } from "@/types";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

export async function listAllPosts(): Promise<NewsPost[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, "news_posts"));
    if (snap.empty) return [];
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<NewsPost, "id">) })) as NewsPost[];
    // Sort newest first by date
    return items.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
  } catch (err) {
    console.error("[news] listAllPosts failed:", err);
    return [];
  }
}

export async function listPublishedPosts(): Promise<NewsPost[]> {
  const posts = await listAllPosts();
  return posts.filter(p => p.active);
}

export async function createPost(data: Omit<NewsPost, "id">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "news_posts"), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updatePost(id: string, data: Partial<NewsPost>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "news_posts", id), stripUndefined(data as Record<string, unknown>));
}

export async function deletePost(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "news_posts", id));
}
