/**
 * Bookings — persisted in Firestore at /bookings/{id}
 * Status: "requested" | "confirmed" | "cancelled"
 */
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface BookingRecord {
  id: string;
  booking_id?: string;
  clientName: string;
  email: string;
  phone?: string;
  preferredDate: string;      // ISO date string
  startTime: string;          // "HH:MM"
  bookingType: string;        // "pastoral_counseling" | "photography" | etc
  sessionType?: string;
  notes?: string;
  status: "requested" | "confirmed" | "cancelled";
  totalAmount?: number;
  currency?: string;
  createdAt: string;
}

export async function submitBooking(data: Omit<BookingRecord, "id" | "createdAt" | "status">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, "bookings"), {
    ...data,
    status: "requested",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listBookings(): Promise<BookingRecord[]> {
  if (!db) return [];
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      clientName: data.clientName || data.name || "",
      email: data.email || "",
      phone: data.phone,
      preferredDate: data.preferredDate || data.slotStart || "",
      startTime: data.startTime || "",
      bookingType: data.bookingType || data.topic || "General",
      sessionType: data.sessionType,
      notes: data.notes || data.topic || "",
      status: data.status || "requested",
      totalAmount: data.totalAmount,
      currency: data.currency,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
    };
  });
}

export async function updateBookingStatus(id: string, status: BookingRecord["status"]): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "bookings", id), { status });
}

export async function deleteBooking(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "bookings", id));
}
