"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { LiveStream } from "@/types";
import { sampleStreams } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default function AdminLivePage() {
  const [streams, setStreams] = useState<LiveStream[]>(sampleStreams.map((s, i) => ({ ...s, id: `stream-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", embedUrl: "", scheduledAt: "", status: "scheduled" as LiveStream["status"] });

  const handleSave = () => {
    setStreams([...streams, { ...form, id: `stream-${Date.now()}`, createdBy: "admin" }]);
    setShowForm(false);
    setForm({ title: "", embedUrl: "", scheduledAt: "", status: "scheduled" });
  };

  const updateStatus = (id: string, status: LiveStream["status"]) => {
    setStreams(streams.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pr-16 lg:pr-8"><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">Manage live stream schedule</p>
        <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Schedule Stream
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg text-primary font-bold mb-4">Schedule Live Stream</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Stream title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="YouTube embed URL" value={form.embedUrl} onChange={(e) => setForm({ ...form, embedUrl: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark">Schedule</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {streams.map((stream, i) => (
          <div key={stream.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stream.status === "live" ? "bg-red-100 text-red-600" : stream.status === "scheduled" ? "bg-blue-100 text-blue-600" : "bg-stone-100 text-stone-500"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-primary">{stream.title}</h4>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase ${stream.status === "live" ? "bg-red-100 text-red-600" : stream.status === "scheduled" ? "bg-blue-100 text-blue-600" : "bg-stone-100 text-stone-500"}`}>{stream.status}</span>
                  </div>
                  <p className="text-text-muted text-sm">{formatDate(stream.scheduledAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stream.status === "scheduled" && <button onClick={() => updateStatus(stream.id, "live")} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">Go Live</button>}
                {stream.status === "live" && <button onClick={() => updateStatus(stream.id, "ended")} className="px-3 py-1.5 bg-stone-600 text-white text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors">End</button>}
                <button onClick={() => setStreams(streams.filter((s) => s.id !== stream.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div></main></div>
  );
}
