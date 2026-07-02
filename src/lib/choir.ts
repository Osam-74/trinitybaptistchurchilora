/**
 * Choir / Media Team members — persisted in Firestore at choir_members/{id}.
 * Registrations from the public sign-up form land here with status "pending".
 * Admins approve / reject / edit / delete from the backend.
 * Only "approved" members show on the public directory page.
 */

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChoirMember } from "@/types";

export async function createChoirMember(data: Omit<ChoirMember, "id" | "createdAt" | "status">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const payload = { ...data, status: "pending" as const, createdAt: new Date().toISOString() };
  const ref = await addDoc(collection(db, "choir_members"), payload);
  return ref.id;
}

export async function listPendingMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, "choir_members"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
  } catch {
    return [];
  }
}

export async function listAllMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, "choir_members"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
  } catch {
    return [];
  }
}

export async function listApprovedMembers(): Promise<ChoirMember[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, "choir_members"), where("status", "==", "approved"), orderBy("fullName"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChoirMember, "id">) })) as ChoirMember[];
  } catch {
    return [];
  }
}

export async function updateMember(id: string, data: Partial<ChoirMember>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "choir_members", id), data as Record<string, unknown>);
}

export async function deleteMember(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "choir_members", id));
}
