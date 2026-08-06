"use client";

/**
 * Activity Log — tracks who did what, when.
 * Writes to the `activity_log` Firestore collection.
 * Anyone authenticated can read; anyone authenticated can create.
 */

import { db } from "./firebase";
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";

export interface ActivityEntry {
  id?: string;
  user: string;        // email of the person who made the change
  userName: string;    // display name
  action: string;      // e.g. "created", "updated", "deleted"
  target: string;      // what was changed, e.g. "Sermon: Sunday Service"
  section: string;     // e.g. "Sermons", "Gallery", "Posts"
  createdAt?: unknown; // Firestore timestamp
}

/**
 * Log an activity. Call this after a successful admin action.
 */
export async function logActivity(opts: {
  user: string;
  userName: string;
  action: string;
  target: string;
  section: string;
}): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, "activity_log"), {
      ...opts,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Non-blocking — don't fail the parent action if logging fails
    console.error("logActivity: failed to write:", err);
  }
}

/**
 * Fetch the most recent activity entries (newest first).
 */
export async function getRecentActivity(maxCount = 20): Promise<ActivityEntry[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "activity_log"),
      orderBy("createdAt", "desc"),
      limit(maxCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as ActivityEntry));
  } catch (err) {
    console.error("getRecentActivity: failed:", err);
    return [];
  }
}
