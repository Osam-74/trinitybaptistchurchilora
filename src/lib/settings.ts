/**
 * Site settings — persisted in Firestore at settings/main.
 * Falls back to defaultSettings (seed-data.ts) when no document exists yet
 * or when Firestore isn't reachable/configured.
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSettings } from "@/lib/seed-data";
import { SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (!db) return defaultSettings;
    const ref = doc(db, "settings", "main");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...defaultSettings, ...(snap.data() as Partial<SiteSettings>) };
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await setDoc(doc(db, "settings", "main"), data, { merge: true });
}
