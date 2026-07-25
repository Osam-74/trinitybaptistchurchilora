"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { CalendarEvent } from "@/types";
import { sampleCalendarEvents } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

const EVENT_STYLES: Record<string, string> = {
  service: "bg-primary text-white", special: "bg-accent text-white",
  meeting: "bg-blue-600 text-white", fellowship: "bg-green-600 text-white", other: "bg-stone-500 text-white",
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleCalendarEvents.map((e, i) => ({ ...e, id: `event-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", startTime: "", endTime: "", location: "", description: "", type: "service" as CalendarEvent["type"] });

  const handleSave = () => {
    setEvents([...events, { ...form, id: `event-${Date.now()}`, createdBy: "admin" }]);
    setShowForm(false);
    setForm({ title: "", date: "", startTime: "", endTime: "", location: "", description: "", type: "service" });
  };

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pr-16 lg:pr-8"><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">Manage church calendar events</p>
        <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg text-primary font-bold mb-4">New Calendar Event</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEvent["type"] })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="service">Service</option><option value="special">Special</option><option value="meeting">Meeting</option><option value="fellowship">Fellowship</option><option value="other">Other</option>
            </select>
            <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark">Save Event</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((event, i) => (
          <div key={event.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 flex items-center justify-between card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center ${EVENT_STYLES[event.type] || "bg-stone-500 text-white"}`}>
                <span className="text-[10px] uppercase font-medium opacity-80">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
                <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-primary">{event.title}</h4>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${EVENT_STYLES[event.type] || "bg-stone-500 text-white"}`}>{event.type}</span>
                </div>
                <p className="text-text-muted text-sm">{formatDate(event.date)} &middot; {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""} &middot; {event.location}</p>
                {event.description && <p className="text-text-muted text-xs mt-1">{event.description}</p>}
              </div>
            </div>
            <button onClick={() => setEvents(events.filter((e) => e.id !== event.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </div>
        ))}
      </div>
    </div></main></div>
  );
}
