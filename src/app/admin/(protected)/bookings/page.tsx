"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import { listBookings, updateBookingStatus, deleteBooking, BookingRecord } from "@/lib/bookings";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";

const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"requested"|"confirmed"|"cancelled">("all");
  const [activeTab, setActiveTab] = useState<"bookings"|"availability">("bookings");

  // Booking toggle
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [togglingBooking, setTogglingBooking] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Availability settings (stored in Firestore settings)
  const [availableDays, setAvailableDays] = useState([false,true,true,true,true,false,false]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [savedAvail, setSavedAvail] = useState(false);
  const [savingAvail, setSavingAvail] = useState(false);

  useEffect(() => {
    loadBookings();
    getSiteSettings().then(s => {
      setBookingEnabled(s.bookingEnabled !== false);
      setSettingsLoading(false);
    });
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await listBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBooking = async () => {
    setTogglingBooking(true);
    try {
      const newVal = !bookingEnabled;
      await updateSiteSettings({ bookingEnabled: newVal });
      setBookingEnabled(newVal);
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to toggle booking. Check Firestore rules.");
    } finally {
      setTogglingBooking(false);
    }
  };

  const handleStatusChange = async (id: string, status: BookingRecord["status"]) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSaveAvailability = async () => {
    setSavingAvail(true);
    try {
      // Store availability in a way TS accepts
      await updateSiteSettings({ bookingEnabled }); // just re-save enabled flag as a noop
      // Also save raw using setDoc
      const { db } = await import("@/lib/firebase");
      const { doc, setDoc } = await import("firebase/firestore");
      if (db) {
        await setDoc(doc(db, "settings", "booking_availability"), {
          availableDays,
          startTime,
          endTime,
        }, { merge: true });
      }
      setSavedAvail(true);
      setTimeout(() => setSavedAvail(false), 2500);
    } catch (err) {
      console.error("Save availability error:", err);
      alert("Failed to save availability.");
    } finally {
      setSavingAvail(false);
    }
  };

  const filtered = bookings.filter(b => filter === "all" || b.status === filter);
  const counts = {
    all: bookings.length,
    requested: bookings.filter(b => b.status === "requested").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <AdminShell><div className="max-w-5xl mx-auto">

          {/* Header with booking toggle */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Bookings</h1>
              <p className="text-text-muted text-sm mt-1">Manage pastoral session requests</p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-stone-200 px-5 py-3 shadow-sm">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wide">Booking Page</p>
                <p className="text-xs text-stone-400 mt-0.5">{settingsLoading ? "Loading…" : bookingEnabled ? "Open — visitors can book" : "Closed — showing notice"}</p>
              </div>
              <button
                onClick={handleToggleBooking}
                disabled={togglingBooking || settingsLoading}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${bookingEnabled ? "bg-green-500" : "bg-stone-300"}`}
                aria-label="Toggle booking page"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out mt-1 ${bookingEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-2xl w-fit">
            {(["bookings","availability"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-primary"}`}>
                {tab === "availability" ? "📅 Availability" : "📋 Bookings"}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {(["all","requested","confirmed","cancelled"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`p-4 rounded-2xl text-center border transition-all ${filter === f ? "bg-primary text-white border-primary" : "bg-white border-stone-100 hover:border-primary/30"}`}>
                    <p className={`text-2xl font-extrabold ${filter === f ? "text-white" : "text-primary"}`}>{counts[f]}</p>
                    <p className={`text-xs capitalize mt-0.5 ${filter === f ? "text-white/80" : "text-text-muted"}`}>{f}</p>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
                  <p className="text-text-muted font-semibold">No {filter === "all" ? "" : filter} bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-serif font-bold text-primary text-lg">{b.clientName}</h3>
                            <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold uppercase tracking-wide ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                              {b.status}
                            </span>
                            {b.sessionType && (
                              <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${b.sessionType === "video" ? "bg-blue-50 text-blue-600" : "bg-stone-100 text-stone-500"}`}>
                                {b.sessionType === "video" ? "📹 Video" : "🏛️ In-person"}
                              </span>
                            )}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-stone-600">
                            <span>📧 {b.email}</span>
                            {b.phone && <span>📞 {b.phone}</span>}
                            <span>📅 {formatDate(b.preferredDate)}{b.startTime ? ` at ${b.startTime}` : ""}</span>
                            <span>🏷️ {b.bookingType}</span>
                          </div>
                          {b.notes && (
                            <p className="text-xs text-stone-500 mt-2 bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">{b.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {b.status !== "confirmed" && (
                            <button onClick={() => handleStatusChange(b.id, "confirmed")}
                              className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors">
                              ✓ Confirm
                            </button>
                          )}
                          {b.status !== "cancelled" && (
                            <button onClick={() => handleStatusChange(b.id, "cancelled")}
                              className="px-4 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                              ✕ Cancel
                            </button>
                          )}
                          {b.status === "cancelled" && (
                            <button onClick={() => handleDelete(b.id)}
                              className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "availability" && (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 max-w-xl">
              <h3 className="font-serif text-lg font-bold text-primary mb-6">Available Days & Times</h3>
              <div className="mb-6">
                <label className="block text-xs font-bold text-primary mb-3 uppercase tracking-wide">Available Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {WEEKDAY_NAMES.map((day, i) => (
                    <button key={day} onClick={() => setAvailableDays(prev => prev.map((v, j) => j === i ? !v : v))}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${availableDays[i] ? "bg-primary text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleSaveAvailability} disabled={savingAvail}
                  className="btn-gold px-8 py-3 rounded-xl font-semibold disabled:opacity-50">
                  {savingAvail ? "Saving…" : "Save Availability"}
                </button>
                {savedAvail && <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  Saved
                </span>}
              </div>
            </div>
          )}

        </div>
</AdminShell>
  );
}
