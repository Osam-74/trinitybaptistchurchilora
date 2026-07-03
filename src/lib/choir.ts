/**
 * Choir / Media Team members — persisted in Firestore at choir_members/{id}.
 * Registrations from the public sign-up form land here with status "pending".
 * Admins approve / reject / edit / delete from the backend.
 * Only "approved" members show on the public directory page.
 */

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChoirMember } from "@/types";

// Firestore rejects `undefined` field values outright (addDoc/setDoc throw
// "Unsupported field value: undefined"). Strip any undefined keys before writing.
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
    const q = query(collection(db, "choir_members"), where("status", "==", "pending"));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
    return items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
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
 * Public directory — fetches approved members for the /team page.
 * IMPORTANT: This function THROWS on error (does NOT swallow) so the
 * caller can display a proper diagnostic message to the user.
 */
export async function listApprovedMembers(): Promise<ChoirMember[]> {
  if (!db) throw new Error("Firebase not initialized — check env vars");

  const q = query(collection(db, "choir_members"), where("status", "==", "approved"));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
  return items.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
}

export async function updateMember(id: string, data: Partial<ChoirMember>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "choir_members", id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteMember(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "choir_members", id));
}
