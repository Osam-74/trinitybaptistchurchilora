/**
 * Hymn library — backed by Firestore ("hymns" collection) so admins can add,
 * edit, or bulk-import songs from Admin → Hymns. The public Hymns page loads
 * the full library from /public/hymns-library.json and merges Firestore entries
 * on top.
 */

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Hymn } from "@/types";

const HYMNS_COLLECTION = "hymns";

export async function listHymnsFromFirestore(): Promise<Hymn[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, HYMNS_COLLECTION), orderBy("number", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Hymn, "id">) }));
  } catch {
    return [];
  }
}

export async function addHymn(hymn: Omit<Hymn, "id">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, HYMNS_COLLECTION), {
    ...hymn,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateHymn(id: string, data: Partial<Hymn>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, HYMNS_COLLECTION, id), data);
}

export async function deleteHymn(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, HYMNS_COLLECTION, id));
}

/**
 * Bulk import from pasted text. Format — one hymn per block, blocks separated
 * by a line of three dashes (---):
 *
 *   123 | English | Hymn Title
 *   Verse one line one
 *   Verse one line two
 *
 *   Verse two line one
 *   ---
 *   124 | Yoruba | Orin Miran
 *   ...
 */
export function parseBulkHymns(raw: string): Omit<Hymn, "id">[] {
  const blocks = raw.split(/\n\s*---\s*\n/g);
  const results: Omit<Hymn, "id">[] = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");
    const header = lines[0];
    const parts = header.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const number = parseInt(parts[0], 10);
    const category = parts[1].toLowerCase().startsWith("yor") ? "yoruba" : "english";
    const title = parts.slice(2).join("|").trim();
    const lyrics = lines.slice(1).join("\n").trim();
    if (!number || !title || !lyrics) continue;
    results.push({ number, category, title, lyrics });
  }
  return results;
}
