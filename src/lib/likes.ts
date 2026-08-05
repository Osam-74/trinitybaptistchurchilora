import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

const LIKE_STORAGE_KEY = "tbc_liked_items";

function getLikedItems(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LIKE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLikedItems(items: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(items));
}

export function hasLiked(docId: string): boolean {
  return !!getLikedItems()[docId];
}

export async function toggleLike(collection: string, docId: string): Promise<{ liked: boolean; count: number }> {
  const liked = getLikedItems();
  const isLiked = !!liked[docId];
  const delta = isLiked ? -1 : 1;

  // Update localStorage
  if (isLiked) {
    delete liked[docId];
  } else {
    liked[docId] = true;
  }
  saveLikedItems(liked);

  // Update Firestore likeCount
  if (db) {
    try {
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, { likeCount: increment(delta) });
      const snap = await getDoc(docRef);
      const count = (snap.data()?.likeCount as number) || 0;
      return { liked: !isLiked, count };
    } catch (err) {
      console.error("[likes] toggleLike failed:", err);
      return { liked: !isLiked, count: 0 };
    }
  }

  return { liked: !isLiked, count: 0 };
}
