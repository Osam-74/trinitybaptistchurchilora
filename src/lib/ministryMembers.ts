/**
 * Ministry Member Registrations — Firestore
 * Collection: /ministry_members/{docId}
 * Used for RA, GA, and Lydia Auxiliary membership registration
 */
import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type MinistryKey = "royal-ambassadors" | "girls-auxiliary" | "lydia-auxiliary";
export type MemberStatus = "pending" | "approved" | "rejected";

export interface MinistryMember {
  id: string;
  ministry: MinistryKey;
  fullName: string;
  rank: string;          // rank/step name
  photoUrl: string;      // uploaded photo URL
  status: MemberStatus;
  submittedAt: string;
  approvedAt?: string;
  note?: string;         // admin note
}

export async function submitMembership(data: {
  ministry: MinistryKey;
  fullName: string;
  rank: string;
  photoUrl: string;
}): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "ministry_members"), {
    ...data,
    status: "pending",
    submittedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listMembersForMinistry(ministry: MinistryKey): Promise<MinistryMember[]> {
  if (!db) return [];
  const q = query(
    collection(db, "ministry_members"),
    where("ministry", "==", ministry),
    orderBy("submittedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ministry: data.ministry,
      fullName: data.fullName,
      rank: data.rank,
      photoUrl: data.photoUrl || "",
      status: data.status || "pending",
      submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : (data.submittedAt || ""),
      approvedAt: data.approvedAt instanceof Timestamp ? data.approvedAt.toDate().toISOString() : data.approvedAt,
      note: data.note,
    };
  });
}

export async function listAllMembers(): Promise<MinistryMember[]> {
  if (!db) return [];
  const q = query(collection(db, "ministry_members"), orderBy("submittedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ministry: data.ministry,
      fullName: data.fullName,
      rank: data.rank,
      photoUrl: data.photoUrl || "",
      status: data.status || "pending",
      submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : (data.submittedAt || ""),
      approvedAt: data.approvedAt instanceof Timestamp ? data.approvedAt.toDate().toISOString() : data.approvedAt,
      note: data.note,
    };
  });
}

export async function updateMemberStatus(
  id: string,
  status: MemberStatus,
  note?: string
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "ministry_members", id), {
    status,
    ...(note !== undefined ? { note } : {}),
    ...(status === "approved" ? { approvedAt: serverTimestamp() } : {}),
  });
}

export async function deleteMember(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "ministry_members", id));
}
