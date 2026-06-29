"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Activity } from "@/types";
import { sampleActivities } from "@/lib/seed-data";
import { formatTime, getWeekdayName } from "@/lib/utils";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(sampleActivities.map((a, i) => ({ ...a, id: `activity-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", weekday: 0, startTime: "", endTime: "", location: "", description: "" });

  const handleSave = () => {
    setActivities([...activities, { ...form, id: `activity-${Date.now()}`, active: true }]);
    setShowForm(false);
    setForm({ title: "", weekday: 0, startTime: "", endTime: "", location: "", description: "" });
  };

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64"><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">Manage weekly activities and programs</p>
        <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg text-primary font-bold mb-4">New Activity</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Activity title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <select value={form.weekday} onChange={(e) => setForm({ ...form, weekday: Number(e.target.value) })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => <option key={d} value={d}>{getWeekdayName(d)}</option>)}
            </select>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark">Save Activity</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 flex items-center justify-between card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">{getWeekdayName(a.weekday).slice(0, 3)}</div>
              <div>
                <h4 className="font-medium text-primary">{a.title}</h4>
                <p className="text-text-muted text-sm">{formatTime(a.startTime)} - {formatTime(a.endTime)} &middot; {a.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>{a.active ? "Active" : "Inactive"}</span>
              <button onClick={() => setActivities(activities.filter((x) => x.id !== a.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
        ))}
      </div>
    </div></main></div>
  );
}
