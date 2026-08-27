"use client";

/**
 * Activities — Firestore-backed CRUD for weekly church activities/programs.
 * Stored in the `church_activities` collection.
 */

import { db } from "./firebase";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { Activity } from "@/types";

/**
 * Get all active activities.
 */
export async function listActivities(): Promise<Activity[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "church_activities"));
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "",
        weekday: data.weekday ?? 0,
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        location: data.location || "",
        description: data.description || "",
        active: data.active ?? true,
      } as Activity;
    }).sort((a, b) => {
      if (a.weekday !== b.weekday) return a.weekday - b.weekday;
      return a.startTime.localeCompare(b.startTime);
    });
  } catch (err) {
    console.error("listActivities: failed:", err);
    return [];
  }
}

/**
 * Get today's activities (based on current day of week).
 */
export async function getTodayActivities(): Promise<Activity[]> {
  const all = await listActivities();
  const today = new Date().getDay(); // 0 = Sunday
  return all.filter(a => a.active && a.weekday === today);
}

/**
 * Create a new activity.
 */
export async function createActivity(data: Omit<Activity, "id">): Promise<string> {
  if (!db) throw new Error("Database not available");
  const ref = await addDoc(collection(db, "church_activities"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Update an activity.
 */
export async function updateActivity(id: string, data: Partial<Activity>): Promise<void> {
  if (!db) throw new Error("Database not available");
  await updateDoc(doc(db, "church_activities", id), data);
}

/**
 * Delete an activity.
 */
export async function deleteActivity(id: string): Promise<void> {
  if (!db) throw new Error("Database not available");
  await deleteDoc(doc(db, "church_activities", id));
}

/**
 * Seed default activities if the collection is empty (first run).
 */
export async function seedActivitiesIfEmpty(): Promise<void> {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "church_activities"));
    if (snap.size > 0) return;
    
    // Import seed data
    const { sampleActivities } = await import("./seed-data");
    for (const a of sampleActivities) {
      await addDoc(collection(db, "church_activities"), {
        ...a,
        createdAt: serverTimestamp(),
      });
    }
    console.log("[activities] Seeded default activities to Firestore");
  } catch (err) {
    console.error("[activities] Seed failed:", err);
  }
}
