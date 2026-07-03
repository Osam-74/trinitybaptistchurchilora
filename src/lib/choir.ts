/**
 * Choir / Media Team members — persisted in Firestore at choir_members/{id}.
 * Registrations from the public sign-up form land here with status "pending".
 * Admins approve / reject / edit / delete from the backend.
 * Only "approved" members show on the public directory page.
 *
 * Uses the same pattern as leaders.ts: fetch all docs, filter client-side,
 * catch errors and return [] (never throw to the caller).
 */

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChoirMember } from "@/types";

// Firestore rejects `undefined` field values outright.
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

export async function createChoirMember(data: Omit<ChoirMember, "id" | "createdAt" | "status">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const payload = stripUndefined({ ...data, status: "pending" as const, createdAt: new Date().toISOString() });
  const ref = await addDoc(collection(db, "choir_members"), payload);
  return ref.id;
}

export async function listPendingMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, "choir_members"));
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
    return items
      .filter(m => m.status === "pending")
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (err) {
    console.error("[choir] listPendingMembers failed:", err);
    return [];
  }
}

export async function listAllMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, "choir_members"));
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
    return items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (err) {
    console.error("[choir] listAllMembers failed:", err);
    return [];
  }
}

/**
 * Public directory — fetches ALL choir_members and filters for approved
 * client-side. Same pattern as listLeaders(): get all docs, no where clause,
 * catch errors and return [] silently.
 */
export async function listApprovedMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const snap = await getDocs(collection(db, "choir_members"));
    if (snap.empty) return [];
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
    return items
      .filter(m => m.status === "approved")
      .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
  } catch (err) {
    console.error("[choir] listApprovedMembers failed:", err);
    return [];
  }
}

export async function updateMember(id: string, data: Partial<ChoirMember>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "choir_members", id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteMember(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "choir_members", id));
}
