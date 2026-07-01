/**
 * Site settings — persisted in Firestore at settings/main.
 * Falls back to defaultSettings (seed-data.ts) when no document exists yet
 * (e.g. brand new Firebase project) or when Firestore isn't reachable.
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSettings } from "@/lib/seed-data";
import { SiteSettings } from "@/types";

const SETTINGS_DOC = doc(db, "settings", "main");

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(SETTINGS_DOC);
    if (snap.exists()) {
      return { ...defaultSettings, ...(snap.data() as Partial<SiteSettings>) };
    }
    return defaultSettings;
  } catch {
    // Firestore not configured yet, or offline — fall back to defaults so the site still renders.
    return defaultSettings;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await setDoc(SETTINGS_DOC, data, { merge: true });
}
