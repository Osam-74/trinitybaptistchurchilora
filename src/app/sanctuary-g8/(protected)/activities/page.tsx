"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { Activity } from "@/types";
import { listActivities, createActivity, updateActivity, deleteActivity, seedActivitiesIfEmpty } from "@/lib/activities";
import { getWeekdayName, formatTime } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { logActivity } from "@/lib/activityLog";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export default function AdminActivitiesPage() {
  const currentUser = useCurrentUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", weekday: 0, startTime: "", endTime: "", location: "", description: "", active: true });
  const [saving, setSaving] = useState(false);

  const loadActivities = async () => {
    await seedActivitiesIfEmpty();
    const data = await listActivities();
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => { loadActivities(); }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateActivity(editingId, form);
        logActivity({ user: currentUser?.email ?? "unknown", userName: currentUser?.displayName ?? "Admin", action: "updated", target: `Activity: ${form.title}`, section: "Activities" });
      } else {
        await createActivity(form);
        logActivity({ user: currentUser?.email ?? "unknown", userName: currentUser?.displayName ?? "Admin", action: "created", target: `Activity: ${form.title}`, section: "Activities" });
      }
      await loadActivities();
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", weekday: 0, startTime: "", endTime: "", location: "", description: "", active: true });
    } catch (err) {
      console.error("Save activity error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a: Activity) => {
    setEditingId(a.id);
    setForm({ title: a.title, weekday: a.weekday, startTime: a.startTime, endTime: a.endTime, location: a.location, description: a.description, active: a.active });
    setShowForm(true);
  };

  const handleDelete = async (a: Activity) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try {
      await deleteActivity(a.id);
      logActivity({ user: currentUser?.email ?? "unknown", userName: currentUser?.displayName ?? "Admin", action: "deleted", target: `Activity: ${a.title}`, section: "Activities" });
      await loadActivities();
    } catch (err) {
      console.error("Delete activity error:", err);
    }
  };

  const toggleActive = async (a: Activity) => {
    try {
      await updateActivity(a.id, { active: !a.active });
      setActivities(prev => prev.map(x => x.id === a.id ? { ...x, active: !x.active } : x));
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  // Group by weekday
  const grouped = WEEKDAYS.map(day => ({
    day,
    items: activities.filter(a => a.weekday === day),
  })).filter(g => g.items.length > 0);

  return (
    <AdminShell>
      <PermissionGuard required="manage_activities"><div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-muted text-sm">Manage weekly activities and service programs</p>
        <button onClick={() => { setEditingId(null); setForm({ title: "", weekday: 0, startTime: "", endTime: "", location: "", description: "", active: true }); setShowForm(true); }} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg text-primary font-bold mb-4">{editingId ? "Edit Activity" : "New Activity"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Activity title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm" />
            <select value={form.weekday} onChange={(e) => setForm({ ...form, weekday: Number(e.target.value) })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm">
              {WEEKDAYS.map((d) => <option key={d} value={d}>{getWeekdayName(d)}</option>)}
            </select>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm" />
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm" />
            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm" />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingId ? "Update" : "Save"} Activity
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
          <p className="text-text-muted text-sm">No activities yet. Click "Add Activity" to create one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.day}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 px-1">{getWeekdayName(group.day)}s</h3>
              <div className="space-y-2">
                {group.items.map((a) => (
                  <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex items-center justify-between card-hover">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">{getWeekdayName(a.weekday).slice(0, 3)}</div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-primary text-sm truncate">{a.title}</h4>
                        <p className="text-text-muted text-xs">{formatTime(a.startTime)} - {formatTime(a.endTime)} &middot; {a.location}</p>
                        {a.description && <p className="text-text-muted text-xs mt-0.5 truncate">{a.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleActive(a)} className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${a.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {a.active ? "Active" : "Inactive"}
                      </button>
                      <button onClick={() => handleEdit(a)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(a)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </PermissionGuard>
    </AdminShell>
  );
}
