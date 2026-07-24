"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Default announcements — seeded into Firestore on first load if none exist
  const DEFAULT_ANNOUNCEMENTS = [
    "Welcome to Trinity Baptist Church, Ilora — Sanctuary of Praise!",
    "Sunday Worship: 8:00 AM – 9:30 AM (Sunday School) & 9:30 AM – 12:00 PM (Main Service)",
    "Midweek Bible Study: Wednesdays 5:00 PM & 6:00 PM",
    "2026 Theme: My Year of Upliftment — For Christ is our Peace",
    "Convenient Service: First Saturday of every month, 6:00 AM – 7:00 AM",
    "House Fellowship: Sundays 5:00 PM – 6:30 PM across Ilora",
  ];

  useEffect(() => {
    getSiteSettings().then(async (s) => {
      if (s.announcements && s.announcements.length > 0) {
        // Real data already in Firestore — just display it
        setAnnouncements(s.announcements);
      } else {
        // First time — seed defaults into Firestore so they are real & deletable
        try {
          await updateSiteSettings({ announcements: DEFAULT_ANNOUNCEMENTS } as Parameters<typeof updateSiteSettings>[0]);
        } catch { /* ignore — will show defaults in UI anyway */ }
        setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (updated: string[], msg: string) => {
    setSaving(true);
    try {
      await updateSiteSettings({ announcements: updated } as Parameters<typeof updateSiteSettings>[0]);
      setAnnouncements(updated);
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    await save([...announcements, newText.trim()], "Announcement added!");
    setNewText("");
  };

  const handleDelete = async (i: number) => {
    if (!confirm("Remove this announcement from the ticker?")) return;
    await save(announcements.filter((_, idx) => idx !== i), "Announcement removed.");
  };

  const handleEdit = async (i: number) => {
    if (!editText.trim()) return;
    const updated = [...announcements];
    updated[i] = editText.trim();
    await save(updated, "Announcement updated!");
    setEditIndex(null);
    setEditText("");
  };

  const handleMoveUp = async (i: number) => {
    if (i === 0) return;
    const updated = [...announcements];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    await save(updated, "Order updated.");
  };

  const handleMoveDown = async (i: number) => {
    if (i === announcements.length - 1) return;
    const updated = [...announcements];
    [updated[i + 1], updated[i]] = [updated[i], updated[i + 1]];
    await save(updated, "Order updated.");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F3]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 md:ml-[72px] lg:ml-[260px] pt-20 lg:pt-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
            <h1 className="font-serif text-2xl font-bold text-[#0B2C22]">📢 Announcements</h1>
            <p className="text-stone-400 text-sm mt-1">Manage the scrolling ticker bar at the top of the website. Changes apply immediately to all visitors.</p>
          </div>

          {/* Success banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"/>
              {success}
            </div>
          )}

          {/* Add new */}
          <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
            <h2 className="font-serif text-lg font-bold text-[#0B2C22] mb-4">Add New Announcement</h2>
            <form onSubmit={handleAdd} className="flex gap-3">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="e.g. Prayer Meeting this Friday at 6:00 PM — All welcome!"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]/30"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-3 bg-[#0D4A35] text-white text-sm font-bold rounded-xl hover:bg-[#0B2C22] transition-colors disabled:opacity-50 flex-shrink-0 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Add
              </button>
            </form>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-[#0B2C22]">
                Current Announcements
                <span className="ml-2 text-sm font-normal text-stone-400">({announcements.length})</span>
              </h2>
              <span className="text-xs text-stone-400 italic">Displayed left-to-right in this order</span>
            </div>

            {loading && <p className="text-stone-400 text-sm text-center py-8">Loading…</p>}

            {!loading && announcements.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                <p className="text-sm">No announcements yet. Add one above.</p>
              </div>
            )}

            <div className="space-y-3">
              {announcements.map((ann, i) => (
                <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 overflow-hidden">
                  {editIndex === i ? (
                    <div className="flex gap-2 p-3">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]/30"
                        autoFocus
                      />
                      <button onClick={() => handleEdit(i)} disabled={saving}
                        className="px-3 py-2 bg-[#0D4A35] text-white text-xs font-bold rounded-lg hover:bg-[#0B2C22] transition-colors">Save</button>
                      <button onClick={() => setEditIndex(null)}
                        className="px-3 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-300 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3">
                      {/* Order controls */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => handleMoveUp(i)} disabled={i === 0 || saving}
                          className="w-5 h-4 flex items-center justify-center text-stone-400 hover:text-[#0D4A35] disabled:opacity-20 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7"/></svg>
                        </button>
                        <button onClick={() => handleMoveDown(i)} disabled={i === announcements.length - 1 || saving}
                          className="w-5 h-4 flex items-center justify-center text-stone-400 hover:text-[#0D4A35] disabled:opacity-20 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                        </button>
                      </div>
                      {/* Colour badge */}
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i % 2 === 0 ? "bg-white border-2 border-stone-300" : "bg-[#C8E63A]"}`} title={i % 2 === 0 ? "White on ticker" : "Gold on ticker"}/>
                      {/* Text */}
                      <span className="flex-1 text-sm text-[#0B2C22] min-w-0">{ann}</span>
                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => { setEditIndex(i); setEditText(ann); }}
                          className="w-8 h-8 rounded-lg hover:bg-[#C8E63A]/20 flex items-center justify-center text-stone-400 hover:text-[#0D4A35] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(i)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
