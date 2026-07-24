"use client";

import { useState, useEffect, useCallback } from "react";
import { listAllMembers, updateMemberStatus, deleteMember, MinistryMember, MemberStatus } from "@/lib/ministryMembers";

const MINISTRY_LABELS: Record<string, string> = {
  "royal-ambassadors": "Royal Ambassadors",
  "girls-auxiliary": "Girls' Auxiliary",
  "lydia-auxiliary": "Lydia Auxiliary",
};

const STATUS_STYLES: Record<MemberStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export default function MinistryMembersAdmin() {
  const [members, setMembers] = useState<MinistryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "royal-ambassadors" | "girls-auxiliary" | "lydia-auxiliary">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [noteModal, setNoteModal] = useState<{ id: string; note: string; status: MemberStatus } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAllMembers();
      setMembers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = members.filter(m => {
    if (filter !== "all" && m.ministry !== filter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    return true;
  });

  const handleStatus = async (id: string, status: MemberStatus, note?: string) => {
    setSaving(id);
    try {
      await updateMemberStatus(id, status, note);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status, ...(note !== undefined ? { note } : {}) } : m));
    } finally {
      setSaving(null);
      setNoteModal(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member record permanently?")) return;
    setSaving(id);
    try {
      await deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } finally {
      setSaving(null);
    }
  };

  const counts = {
    all: members.length,
    pending: members.filter(m => m.status === "pending").length,
    approved: members.filter(m => m.status === "approved").length,
    rejected: members.filter(m => m.status === "rejected").length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Ministry Registrations</h1>
          <p className="text-stone-500 text-sm mt-0.5">Approve or reject membership applications for RA, GA, and Lydia Auxiliary.</p>
        </div>
        <button onClick={load} className="text-sm px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600">
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: counts.all, color: "bg-stone-100 text-stone-700" },
          { label: "Pending", count: counts.pending, color: "bg-yellow-100 text-yellow-700" },
          { label: "Approved", count: counts.approved, color: "bg-emerald-100 text-emerald-700" },
          { label: "Rejected", count: counts.rejected, color: "bg-red-100 text-red-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
          {(["all", "royal-ambassadors", "girls-auxiliary", "lydia-auxiliary"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"}`}>
              {f === "all" ? "All Ministries" : MINISTRY_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading registrations…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-lg font-semibold mb-1">No registrations found</p>
          <p className="text-sm">Registrations will appear here when members submit via the ministry pages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white border border-stone-100 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
              {/* Photo */}
              <button onClick={() => setLightbox(m.photoUrl)} className="flex-shrink-0">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.fullName} className="w-16 h-16 rounded-xl object-cover border border-stone-200 hover:opacity-80 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                )}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-stone-800 text-sm">{m.fullName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{MINISTRY_LABELS[m.ministry] || m.ministry}</span>
                </div>
                <p className="text-xs text-stone-500 mb-1">{m.rank}</p>
                <p className="text-xs text-stone-400">Submitted: {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
                {m.note && <p className="text-xs text-stone-500 italic mt-1">Note: {m.note}</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {m.status !== "approved" && (
                  <button onClick={() => handleStatus(m.id, "approved")} disabled={saving === m.id}
                    className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                    Approve
                  </button>
                )}
                {m.status !== "rejected" && (
                  <button onClick={() => setNoteModal({ id: m.id, note: m.note || "", status: "rejected" })} disabled={saving === m.id}
                    className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors disabled:opacity-50">
                    Reject
                  </button>
                )}
                {m.status === "pending" && (
                  <button onClick={() => setNoteModal({ id: m.id, note: m.note || "", status: "pending" })} disabled={saving === m.id}
                    className="text-xs px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg font-semibold hover:bg-stone-200 transition-colors disabled:opacity-50">
                    Add Note
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} disabled={saving === m.id}
                  className="text-xs px-3 py-1.5 bg-stone-50 text-stone-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note/Reject modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-stone-800 mb-3">{noteModal.status === "rejected" ? "Reject Application" : "Add Note"}</h3>
            <textarea
              className="w-full border border-stone-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Optional reason or note for the applicant…"
              value={noteModal.note}
              onChange={e => setNoteModal(n => n ? { ...n, note: e.target.value } : null)}
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleStatus(noteModal.id, noteModal.status, noteModal.note)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold text-white transition-colors ${noteModal.status === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-dark"}`}>
                {noteModal.status === "rejected" ? "Confirm Reject" : "Save Note"}
              </button>
              <button onClick={() => setNoteModal(null)} className="px-4 py-2 bg-stone-100 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="Member photo" className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <button onClick={() => setLightbox(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-stone-600 hover:text-stone-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
