/**
 * Contact form submissions — persisted in Firestore at /contact_messages/{id}
 */
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export async function submitContactMessage(data: Omit<ContactMessage, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "contact_messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  if (!db) return [];
  const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone,
      subject: data.subject || "",
      message: data.message || "",
      read: data.read ?? false,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "contact_messages", id));
}
