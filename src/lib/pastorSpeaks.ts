import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PastorSpeak {
  message: string;
  pastorName: string;
  pastorImageUrl?: string;
  active: boolean;
  updatedAt: string;
}

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
