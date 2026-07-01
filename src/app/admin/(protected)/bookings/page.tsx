"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Booking } from "@/types";

const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DEFAULT_AVAILABLE_DAYS = [false,true,true,true,true,false,false]; // Mon-Thu

const sampleBookings: Booking[] = [
  { id:"b1", slotStart: new Date(Date.now()+86400000).toISOString(), slotEnd: new Date(Date.now()+86400000+1800000).toISOString(), name:"John Adebayo", email:"john@email.com", phone:"+234 801 234 5678", topic:"Marriage counseling", meetingType:"in_person", status:"requested", createdAt: new Date().toISOString() },
  { id:"b2", slotStart: new Date(Date.now()+2*86400000).toISOString(), slotEnd: new Date(Date.now()+2*86400000+1800000).toISOString(), name:"Mary Okafor", email:"mary@email.com", phone:"+234 802 345 6789", topic:"Spiritual guidance", meetingType:"video", status:"confirmed", createdAt: new Date().toISOString() },
  { id:"b3", slotStart: new Date(Date.now()+3*86400000).toISOString(), slotEnd: new Date(Date.now()+3*86400000+1800000).toISOString(), name:"David Ibrahim", email:"david@email.com", phone:"+234 803 456 7890", topic:"Career advice", meetingType:"in_person", status:"requested", createdAt: new Date().toISOString() },
];

function formatSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-NG", { weekday:"short", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [filter, setFilter] = useState<"all"|"requested"|"confirmed"|"cancelled">("all");
  const [availableDays, setAvailableDays] = useState(DEFAULT_AVAILABLE_DAYS);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState("30");
  const [savedAvail, setSavedAvail] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings"|"availability">("bookings");

  const filtered = bookings.filter(b => filter==="all" || b.status===filter);

  const updateStatus = (id: string, status: Booking["status"]) =>
    setBookings(bookings.map(b => b.id===id ? {...b, status} : b));

  const handleSaveAvailability = () => {
    setSavedAvail(true);
    setTimeout(() => setSavedAvail(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-primary">Bookings</h1>
            <p className="text-text-muted text-sm mt-1">Manage session requests and set available days</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-stone-100 rounded-2xl w-fit">
            {(["bookings","availability"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab===tab ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-primary"}`}>
                {tab === "availability" ? "📅 Available Days" : "📋 Bookings"}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && (
            <>
              {/* Filter */}
              <div className="flex gap-2 mb-5">
                {(["all","requested","confirmed","cancelled"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter===f ? "bg-accent text-primary-dark" : "bg-white text-text-muted border border-stone-200 hover:border-accent/40"}`}>
                    {f}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-100 bg-stone-50">
                        {["Person","Slot","Topic","Type","Status","Actions"].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(b => (
                        <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-primary text-sm">{b.name}</p>
                            <p className="text-text-muted text-xs">{b.email}</p>
                            <p className="text-text-muted text-xs">{b.phone}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-text-muted whitespace-nowrap">{formatSlot(b.slotStart)}</td>
                          <td className="px-4 py-4 text-sm text-primary max-w-xs">
                            <p className="truncate">{b.topic}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${b.meetingType==="video" ? "bg-blue-50 text-blue-600" : "bg-stone-100 text-stone-500"}`}>
                              {b.meetingType==="video" ? "📹 Video" : "🏛️ In-person"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${b.status==="confirmed" ? "bg-green-100 text-green-700" : b.status==="cancelled" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {b.status==="requested" && (
                              <div className="flex gap-1.5">
                                <button onClick={() => updateStatus(b.id,"confirmed")}
                                  className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors">Confirm</button>
                                <button onClick={() => updateStatus(b.id,"cancelled")}
                                  className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                              </div>
                            )}
                            {b.status==="confirmed" && (
                              <button onClick={() => updateStatus(b.id,"cancelled")}
                                className="px-3 py-1.5 bg-stone-100 text-stone-500 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors">Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length===0 && (
                    <div className="text-center py-12 text-text-muted">No bookings found</div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "availability" && (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-primary">Set Available Days</h2>
                  <p className="text-text-muted text-xs">These settings sync to the public booking calendar</p>
                </div>
              </div>

              {/* Days grid */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Available Weekdays</p>
                <div className="grid grid-cols-7 gap-2">
                  {WEEKDAY_NAMES.map((day, i) => (
                    <button key={i} onClick={() => setAvailableDays(prev => { const n=[...prev]; n[i]=!n[i]; return n; })}
                      className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all text-xs font-semibold ${availableDays[i] ? "border-accent bg-accent/10 text-primary" : "border-stone-200 text-stone-400 bg-stone-50"}`}>
                      <span>{day.slice(0,3)}</span>
                      {availableDays[i] && (
                        <svg className="w-3.5 h-3.5 text-accent mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time range */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-field"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Slot Duration (mins)</label>
                  <select value={slotDuration} onChange={e => setSlotDuration(e.target.value)} className="input-field bg-white">
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-100">
                <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Summary</p>
                <p className="text-sm text-text-muted">
                  Available: <strong className="text-primary">{WEEKDAY_NAMES.filter((_,i) => availableDays[i]).join(", ") || "None selected"}</strong>
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Hours: <strong className="text-primary">{startTime} – {endTime}</strong> · Slots every <strong className="text-primary">{slotDuration} minutes</strong>
                </p>
              </div>

              <button onClick={handleSaveAvailability}
                className={`btn-shine px-7 py-3 rounded-xl font-semibold text-sm transition-all ${savedAvail ? "bg-green-500 text-white" : "btn-gold"}`}>
                {savedAvail ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    Saved!
                  </span>
                ) : "Save Availability"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
