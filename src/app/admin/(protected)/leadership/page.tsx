"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import R2Uploader from "@/components/R2Uploader";
import { listAllLeaders, createLeader, updateLeader, deleteLeader } from "@/lib/leaders";
import { Leader } from "@/types";

const emptyForm: Omit<Leader, "id"> = {
  name: "", role: "", bio: "", photoUrl: "", order: 99, active: true,
};

export default function AdminLeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Leader | null>(null);
  const [form, setForm] = useState<Omit<Leader, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    listAllLeaders().then(data => { setLeaders(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: leaders.length + 1 });
    setShowForm(true);
  };

  const openEdit = (l: Leader) => {
    setEditing(l);
    setForm({ name: l.name, role: l.role, bio: l.bio, photoUrl: l.photoUrl || "", order: l.order, active: l.active });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.role.trim()) { setError("Name and role are required."); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateLeader(editing.id, form);
      } else {
        await createLeader(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this leader from the website?")) return;
    try { await deleteLeader(id); load(); } catch { /* ignore */ }
  };

  const toggleActive = async (l: Leader) => {
    try { await updateLeader(l.id, { active: !l.active }); load(); } catch { /* ignore */ }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Church Leadership</h1>
              <p className="text-text-muted text-sm mt-1">Add, edit, or remove leaders shown on the About page</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Add Leader
            </button>
          </div>

          {loading && <p className="text-text-muted text-sm">Loading…</p>}

          {!loading && leaders.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-text-muted">
              No leaders yet. Click &ldquo;Add Leader&rdquo; to get started.
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leaders.sort((a, b) => a.order - b.order).map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  {l.photoUrl ? (
                    <img src={l.photoUrl} alt={l.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                  )}
                  {!l.active && (
                    <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-stone-800 px-3 py-1 rounded-full">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-sm font-bold text-primary">{l.name}</h3>
                  <p className="text-primary-light text-xs font-semibold mb-2">{l.role}</p>
                  <p className="text-text-muted text-xs leading-relaxed line-clamp-3">{l.bio}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(l)} className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-accent/50 hover:bg-accent/5 text-primary transition-colors">Edit</button>
                    <button onClick={() => toggleActive(l)} className="text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-accent/50 text-primary transition-colors">{l.active ? "Hide" : "Show"}</button>
                    <button onClick={() => handleDelete(l.id)} className="text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">{editing ? "Edit Leader" : "Add New Leader"}</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Full Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Role / Title *</label>
                    <input type="text" required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Senior Pastor, Church Secretary" className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Brief biography..."/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Photo</label>
                    {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-stone-200 mb-2"/>}
                    <R2Uploader folder="leaders" label="Upload Photo" onUploaded={(url) => setForm(p => ({ ...p, photoUrl: url }))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Display Order</label>
                      <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 99 }))} className="input-field"/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Visible?</label>
                      <select value={form.active ? "yes" : "no"} onChange={e => setForm(p => ({ ...p, active: e.target.value === "yes" }))} className="input-field bg-white">
                        <option value="yes">Yes — show on website</option>
                        <option value="no">No — hidden</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">{saving ? "Saving…" : editing ? "Save Changes" : "Add Leader"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
