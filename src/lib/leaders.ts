/**
 * Leaders — persisted in Firestore at leaders/{id}.
 * Falls back to the hardcoded defaults when Firestore isn't available.
 *
 * Uses the same pattern as choir.ts: fetch all docs (no orderBy/where),
 * sort client-side, catch errors and return defaults.
 */

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Leader } from "@/types";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

export const defaultLeaders: Leader[] = [
  { id: "l1", name: "Rev'd Mosebolatan S.O. PhD. JP", role: "Church Pastor", bio: "Our anointed shepherd, Rev'd Dr Mosebolatan S.O. PhD. JP leads Trinity Baptist Church, Ilora with wisdom, grace, and unwavering faith. Reachable at 08034084270.", order: 1, active: true, photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { id: "l2", name: "Rev'd Johnson Oyetunde", role: "Music Minister", bio: "Rev'd Johnson Oyetunde leads the Music Ministry of Trinity Baptist Church with exceptional skill and spiritual depth, overseeing all choral and music-related activities. Tel: 08063868592.", order: 2, active: true, photoUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face" },
  { id: "l3", name: "Mr. Tunji Oladosu", role: "Church Secretary", bio: "Serving with diligence and integrity, Mr. Tunji Oladosu ensures the smooth administrative operation of the church's affairs and correspondence. Tel: 08136980692.", order: 3, active: true, photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { id: "l4", name: "Deaconess F. Ogunleye", role: "Treasurer", bio: "Faithful steward of the church's resources, ensuring transparent and godly management of all financial matters entrusted to the congregation.", order: 4, active: true, photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face" },
];

const activeDefaults = () => defaultLeaders.filter(l => l.active).sort((a, b) => a.order - b.order);

export async function listLeaders(): Promise<Leader[]> {
  try {
    if (!db) return activeDefaults();
    // No orderBy — just get all docs and sort client-side
    const snap = await getDocs(collection(db, "leaders"));
    if (snap.empty) return activeDefaults();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Leader, "id">) })) as Leader[];
    if (items.length === 0) return activeDefaults();
    return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  } catch {
    return activeDefaults();
  }
}

export async function listAllLeaders(): Promise<Leader[]> {
  try {
    if (!db) return [...defaultLeaders].sort((a, b) => a.order - b.order);
    const snap = await getDocs(collection(db, "leaders"));
    if (snap.empty) return [...defaultLeaders].sort((a, b) => a.order - b.order);
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Leader, "id">) })) as Leader[];
    return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  } catch {
    return [...defaultLeaders].sort((a, b) => a.order - b.order);
  }
}

export async function createLeader(data: Omit<Leader, "id">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "leaders"), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

export async function updateLeader(id: string, data: Partial<Leader>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "leaders", id), stripUndefined(data as Record<string, unknown>));
}

export async function deleteLeader(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "leaders", id));
}
