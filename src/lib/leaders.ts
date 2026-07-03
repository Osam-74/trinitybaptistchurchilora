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
  { id: "l1", name: "Rev'd Dr S. O. Mosebolatan", role: "Senior Pastor", bio: "A revered shepherd of the Trinity Baptist Church, Ilora flock, Rev'd Dr Mosebolatan has led the church with wisdom, grace, and unwavering faith for decades.", order: 1, active: true, photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { id: "l2", name: "Pastor Mrs. Mosebolatan", role: "Co-Pastor / Women's Leader", bio: "A pillar of strength and encouragement, Pastor Mrs. Mosebolatan leads the women's ministry with passion and dedication to nurturing spiritual growth.", order: 2, active: true, photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face" },
  { id: "l3", name: "Deacon J. Adeyemi", role: "Church Secretary", bio: "Serving with diligence and integrity, Deacon Adeyemi ensures the smooth administrative operation of the church's affairs.", order: 3, active: true, photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { id: "l4", name: "Deaconess F. Ogunleye", role: "Treasurer", bio: "Faithful steward of the church's resources, ensuring transparent and godly management of all financial matters.", order: 4, active: true, photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face" },
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
