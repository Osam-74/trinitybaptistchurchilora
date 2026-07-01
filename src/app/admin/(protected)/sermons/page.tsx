"use client";

import { useState } from "react";
import R2Uploader from "@/components/R2Uploader";
import AdminSidebar from "@/components/AdminSidebar";
import { Sermon } from "@/types";
import { sampleSermons } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(sampleSermons.map((s, i) => ({ ...s, id: `sermon-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });

  const handleSave = () => {
    setSermons([{ ...form, id: `sermon-${Date.now()}`, date: new Date().toISOString().split("T")[0], featured: false }, ...sermons]);
    setShowForm(false);
    setForm({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });
  };

  const handleDelete = (id: string) => { if (confirm("Delete?")) setSermons(sermons.filter((s) => s.id !== id)); };

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64"><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">Manage sermon library</p>
        <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Sermon
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg text-primary font-bold mb-4">Add New Sermon</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Preacher" value={form.preacher} onChange={(e) => setForm({ ...form, preacher: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Scripture" value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <input type="text" placeholder="Series (optional)" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "audio" | "video" })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="video">Video (YouTube)</option>
              <option value="audio">Audio</option>
            </select>
            {form.type === "video" ? (
              <input type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} className="input-field" />
            ) : (
              <div className="space-y-2">
                <R2Uploader
                  folder="sermons"
                  accept="audio/*"
                  label="Upload sermon audio (MP3/M4A)"
                  maxMB={80}
                  onUploaded={(url) => setForm({ ...form, audioUrl: url })}
                />
                {form.audioUrl && (
                  <p className="text-xs text-green-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    Uploaded to R2
                  </p>
                )}
              </div>
            )}
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark">Save Sermon</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200"><tr><th className="text-left px-6 py-3 font-medium text-text-muted">Title</th><th className="text-left px-6 py-3 font-medium text-text-muted">Preacher</th><th className="text-left px-6 py-3 font-medium text-text-muted">Type</th><th className="text-left px-6 py-3 font-medium text-text-muted">Date</th><th className="text-right px-6 py-3 font-medium text-text-muted">Actions</th></tr></thead>
          <tbody className="divide-y divide-stone-100">
            {sermons.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4"><div className="font-medium text-primary">{s.title}</div><div className="text-text-muted text-xs">{s.scripture}</div></td>
                <td className="px-6 py-4 text-text">{s.preacher}</td>
                <td className="px-6 py-4"><span className="capitalize text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">{s.type}</span></td>
                <td className="px-6 py-4 text-text-muted">{formatDate(s.date)}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></main></div>
  );
}
