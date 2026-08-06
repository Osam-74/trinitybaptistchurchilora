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
import { seedHymns } from "@/lib/hymns-data";

const HYMNS_COLLECTION = "hymns";

export async function listHymnsFromFirestore(): Promise<Hymn[]> {
  try {
    if (!db) return seedHymns.map((h, i) => ({ ...h, id: `seed-${i}` }));
    const q = query(collection(db, HYMNS_COLLECTION), orderBy("number", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) {
      // No hymns in Firestore yet — return seed data so the page isn't blank
      return seedHymns.map((h, i) => ({ ...h, id: `seed-${i}` }));
    }
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Hymn, "id">) }));
  } catch {
    // On any error (network, permissions, etc.) fall back to seed data
    return seedHymns.map((h, i) => ({ ...h, id: `seed-${i}` }));
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
