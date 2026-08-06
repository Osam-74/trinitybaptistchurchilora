"use client";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PastorDeclaration } from "@/types/declaration";

// Default pastor image — used when admin hasn't uploaded a custom image
export const DEFAULT_PASTOR_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80";

// The initial seed declaration — written to Firestore on first admin visit.
// After that, admin manages everything from the dashboard.
export const SEED_DECLARATION_TEXT = `My Prayer for you today

May God's peace be unto you as you wake up to life this morning.

Today, I pray that, the blessings of God will continue to be with you and your family, in Jesus name.

Our Father in Heaven will continue to guide you through the journey of your life by His grace, and the source of your blessing, joy and favour will remain a mystery to your enemies, in the mighty name of Jesus Christ, amen.

Good morning, have a blessed day. 6/8/2026

MAY GOD BLESSED YOU`;

/** Fetch the latest published declaration (for the public popup) */
export async function getLatestDeclaration(): Promise<PastorDeclaration | null> {
  if (!db) return null;
  try {
    const q = query(
      collection(db, "pastor_declarations"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return {
      id: d.id,
      text: d.data().text || "",
      imageUrl: d.data().imageUrl || undefined,
      published: d.data().published ?? false,
      createdAt: d.data().createdAt || new Date().toISOString(),
      date: d.data().date || undefined,
    };
  } catch {
    // Fallback: try without orderBy (in case index not built yet)
    try {
      const q2 = query(
        collection(db, "pastor_declarations"),
        where("published", "==", true),
        limit(1)
      );
      const snap2 = await getDocs(q2);
      if (snap2.empty) return null;
      const d = snap2.docs[0];
      return {
        id: d.id,
        text: d.data().text || "",
        imageUrl: d.data().imageUrl || undefined,
        published: d.data().published ?? false,
        createdAt: d.data().createdAt || new Date().toISOString(),
        date: d.data().date || undefined,
      };
    } catch {
      return null;
    }
  }
}

/** Fetch ALL declarations (admin view) */
export async function getAllDeclarations(): Promise<PastorDeclaration[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "pastor_declarations"));
    const items: PastorDeclaration[] = [];
    snap.forEach((d) => {
      items.push({
        id: d.id,
        text: d.data().text || "",
        imageUrl: d.data().imageUrl || undefined,
        published: d.data().published ?? false,
        createdAt: d.data().createdAt || new Date().toISOString(),
        date: d.data().date || undefined,
      });
    });
    // Sort client-side by createdAt desc (avoids needing a composite index)
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  } catch {
    return [];
  }
}

/** Create a new declaration */
export async function createDeclaration(
  data: { text: string; imageUrl?: string; published: boolean; date?: string }
): Promise<string> {
  if (!db) throw new Error("Database not available");
  const docRef = await addDoc(collection(db, "pastor_declarations"), {
    text: data.text,
    imageUrl: data.imageUrl || null,
    published: data.published,
    createdAt: new Date().toISOString(),
    date: data.date || new Date().toLocaleDateString("en-GB"),
  });
  return docRef.id;
}

/** Update an existing declaration */
export async function updateDeclaration(
  id: string,
  data: Partial<{ text: string; imageUrl: string | null; published: boolean; date: string }>
): Promise<void> {
  if (!db) throw new Error("Database not available");
  await updateDoc(doc(db, "pastor_declarations", id), {
    ...(data.text !== undefined && { text: data.text }),
    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    ...(data.published !== undefined && { published: data.published }),
    ...(data.date !== undefined && { date: data.date }),
  });
}

/** Delete a declaration */
export async function deleteDeclaration(id: string): Promise<void> {
  if (!db) throw new Error("Database not available");
  await deleteDoc(doc(db, "pastor_declarations", id));
}

/** Seed the initial declaration if the collection is empty */
export async function seedDeclarationIfEmpty(): Promise<boolean> {
  if (!db) return false;
  try {
    const snap = await getDocs(collection(db, "pastor_declarations"));
    if (snap.size > 0) return false; // Already has data
    await addDoc(collection(db, "pastor_declarations"), {
      text: SEED_DECLARATION_TEXT,
      imageUrl: null, // No image seeded — falls back to DEFAULT_PASTOR_IMAGE
      published: false, // Admin must publish
      createdAt: new Date().toISOString(),
      date: "6/8/2026",
    });
    return true;
  } catch {
    return false;
  }
}
