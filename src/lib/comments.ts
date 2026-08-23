/**
 * Post comments — persisted in Firestore at post_comments/{id}.
 * Public can create comments and read visible ones.
 * Admins can view all, hide, or delete.
 */

import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Comment } from "@/types";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

/** Fetch visible (non-hidden) comments for a post, newest first. */
export async function listCommentsForPost(postId: string): Promise<Comment[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, "post_comments"), where("postId", "==", postId));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    const items = snap.docs
      .map(d => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }) as Comment)
      .filter(c => !c.hidden);
    // Sort newest first by createdAt
    return items.sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  } catch (err) {
    console.error("[comments] listCommentsForPost failed:", err);
    return [];
  }
}

/** Fetch ALL comments (including hidden) — admin only. */
export async function listAllComments(): Promise<Comment[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, "post_comments"));
    if (snap.empty) return [];
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }) as Comment);
    return items.sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  } catch (err) {
    console.error("[comments] listAllComments failed:", err);
    return [];
  }
}

/** Create a new comment (public). */
export async function createComment(data: Omit<Comment, "id">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "post_comments"), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

/** Hide or unhide a comment (admin). */
export async function toggleCommentVisibility(id: string, hidden: boolean): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "post_comments", id), { hidden });
}

/** Delete a comment (admin). */
export async function deleteComment(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "post_comments", id));
}
