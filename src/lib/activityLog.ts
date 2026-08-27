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
  createdAt?: unknown; // Firestore timestamp — can be Timestamp object or Date
}

/**
 * Log an activity. Call this after a successful admin action.
 * Pass the user's display name (from useCurrentUser) — falls back to email.
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
    console.error("logActivity: failed to write:", err);
  }
}

/**
 * Convert a Firestore Timestamp, Date, or string to an ISO string.
 * Handles the common Firestore return formats.
 */
function toISOString(value: unknown): string | null {
  if (!value) return null;
  // Already a string
  if (typeof value === "string") return value;
  // Date object
  if (value instanceof Date) return value.toISOString();
  // Firestore Timestamp — has toDate() method
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch { return null; }
  }
  // Firestore Timestamp-like object with _seconds/_nanoseconds
  if (typeof value === "object" && value !== null && "_seconds" in value) {
    try {
      const sec = (value as unknown as { _seconds: number })._seconds;
      const nan = (value as unknown as { _nanoseconds: number })._nanoseconds || 0;
      return new Date(sec * 1000 + nan / 1000000).toISOString();
    } catch { return null; }
  }
  // Firestore Timestamp-like object with seconds/nanoseconds (no underscore)
  if (typeof value === "object" && value !== null && "seconds" in value) {
    try {
      const sec = (value as unknown as { seconds: number }).seconds;
      const nan = (value as unknown as { nanoseconds: number }).nanoseconds || 0;
      return new Date(sec * 1000 + nan / 1000000).toISOString();
    } catch { return null; }
  }
  return null;
}

/**
 * Fetch the most recent activity entries (newest first).
 * Properly converts Firestore Timestamps to ISO strings.
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
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        user: data.user || "unknown",
        userName: data.userName || data.user || "Admin",
        action: data.action || "",
        target: data.target || "",
        section: data.section || "",
        createdAt: toISOString(data.createdAt) || undefined,
      } as ActivityEntry;
    });
  } catch (err) {
    console.error("getRecentActivity: failed:", err);
    return [];
  }
}
