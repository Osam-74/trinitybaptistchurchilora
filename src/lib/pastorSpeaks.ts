import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PastorSpeak {
  message: string;
  pastorName: string;
  pastorImageUrl?: string;
  active: boolean;
  updatedAt: string;
}


export const PASTOR_DEFAULTS = {
  pastorName: "Rev. Solomon Olugbenga Mosebolatan",
  pastorImageUrl: "/images/pastor-mosebolatan.jpg",
} as const;

const REF = () => doc(db!, 'site_config', 'pastor_speaks');

export async function getPastorSpeaks(): Promise<PastorSpeak | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return null;
    return snap.data() as PastorSpeak;
  } catch { return null; }
}

export async function savePastorSpeaks(data: PastorSpeak): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await setDoc(REF(), { ...data, updatedAt: new Date().toISOString() });
}

export async function deletePastorSpeaks(): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(REF());
}


// The pastor's daily declaration prayer text
export const SEED_PRAYER_TEXT = `My Prayer for you today

May God's peace be unto you as you wake up to life this morning.

Today, I pray that, the blessings of God will continue to be with you and your family, in Jesus name.

Our Father in Heaven will continue to guide you through the journey of your life by His grace, and the source of your blessing, joy and favour will remain a mystery to your enemies, in the mighty name of Jesus Christ, amen.

Good morning, have a blessed day. 6/8/2026

MAY GOD BLESSED YOU`;

/** Seed the pastor's word if it doesn't exist yet */
export async function seedPastorSpeaksIfEmpty(): Promise<boolean> {
  if (!db) return false;
  try {
    const snap = await getDoc(REF());
    if (snap.exists() && snap.data()?.message) return false;
    await setDoc(REF(), {
      message: SEED_PRAYER_TEXT,
      pastorName: PASTOR_DEFAULTS.pastorName,
      pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl,
      active: true,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch {
    return false;
  }
}