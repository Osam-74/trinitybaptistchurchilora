"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { listAllMembers, updateMember, deleteMember } from "@/lib/choir";
import { ChoirMember } from "@/types";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<ChoirMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editing, setEditing] = useState<ChoirMember | null>(null);

  const load = () => {
    setLoading(true);
    listAllMembers().then(data => { setMembers(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (m: ChoirMember) => {
    try { await updateMember(m.id, { status: "approved" }); load(); } catch { /* ignore */ }
  };

  const handleReject = async (m: ChoirMember) => {
    try { await updateMember(m.id, { status: "rejected" }); load(); } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this registration?")) return;
    try { await deleteMember(id); load(); } catch { /* ignore */ }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await updateMember(editing.id, {
        fullName: editing.fullName,
        department: editing.department,
        section: editing.section || "",
        bio: editing.bio || "",
        photoUrl: editing.photoUrl || "",
      });
      setEditing(null);
      load();
    } catch { /* ignore */ }
  };

  const filtered = filter === "all" ? members : members.filter(m => m.status === filter);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${styles[status] || ""}`}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Choir &amp; Media Team</h1>
              <p className="text-text-muted text-sm mt-1">Review registrations and manage the team directory</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                  filter === f ? "bg-primary text-white" : "bg-white border border-stone-200 text-text-muted hover:border-primary/30"
                }`}>
                {f} {f !== "all" && `(${members.filter(m => m.status === f).length})`}
              </button>
            ))}
          </div>

          {loading && <p className="text-text-muted text-sm">Loading…</p>}

          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-text-muted">
              No {filter !== "all" ? filter : ""} registrations found.
            </div>
          )}

          <div className="space-y-4">
            {filtered.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
                {/* Photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-stone-100">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.fullName} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-primary text-sm">{m.fullName}</h3>
                    {statusBadge(m.status)}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span>{m.email}</span>
                    {m.phone && <span>{m.phone}</span>}
                    <span className="font-medium text-primary-light">{m.department}</span>
                    {m.section && <span>· {m.section}</span>}
                    {m.dateJoined && <span>· Joined {m.dateJoined}</span>}
                  </div>
                  {m.bio && <p className="text-xs text-text-muted mt-2 line-clamp-2">{m.bio}</p>}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {m.status !== "approved" && (
                    <button onClick={() => handleApprove(m)} className="text-xs font-medium px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">Approve</button>
                  )}
                  {m.status !== "rejected" && (
                    <button onClick={() => handleReject(m)} className="text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors">Reject</button>
                  )}
                  <button onClick={() => setEditing(m)} className="text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-accent/50 text-primary transition-colors">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit modal */}
          {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">Edit Member</h2>
                  <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} className="input-field"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Department</label>
                      <select value={editing.department} onChange={e => setEditing({ ...editing, department: e.target.value })} className="input-field bg-white">
                        <option value="Choir">Choir</option>
                        <option value="Media Team">Media Team</option>
                        <option value="Instrumentalist">Instrumentalist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Section / Voice Part</label>
                      <input type="text" value={editing.section || ""} onChange={e => setEditing({ ...editing, section: e.target.value })} className="input-field"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Photo URL</label>
                    <input type="text" value={editing.photoUrl || ""} onChange={e => setEditing({ ...editing, photoUrl: e.target.value })} className="input-field" placeholder="Image URL"/>
                    {editing.photoUrl && <img src={editing.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-stone-200 mt-2"/>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Bio</label>
                    <textarea value={editing.bio || ""} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={3} className="input-field resize-none"/>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 btn-gold py-3 rounded-xl font-semibold">Save Changes</button>
                    <button type="button" onClick={() => setEditing(null)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
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
