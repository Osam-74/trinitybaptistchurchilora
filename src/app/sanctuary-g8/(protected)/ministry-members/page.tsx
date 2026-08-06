"use client";

import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { useState, useEffect, useCallback } from "react";
import {
  listAllMembers, updateMemberStatus, deleteMember, updateMemberDetails,
  submitMembership,
  MinistryMember, MemberStatus, MinistryKey,
} from "@/lib/ministryMembers";
import * as XLSX from "xlsx";

const MINISTRY_LABELS: Record<string, string> = {
  "royal-ambassadors": "Royal Ambassadors",
  "girls-auxiliary": "Girls' Auxiliary",
  "lydia-auxiliary": "Lydia Auxiliary",
};

const RA_RANKS = [
  "Rank 1 — Assistant Intern", "Rank 2 — Intern", "Rank 3 — Senior Intern",
  "Rank 4 — Envoy", "Rank 5 — Special Envoy", "Rank 6 — Senior Envoy",
  "Rank 7 — Dean", "Rank 8 — Ambassador", "Rank 9 — Ambassador Extra-ordinary",
  "Rank 10 — Ambassador Pleni-potentiary",
];
const GA_STEPS = [
  "Step 1 — Maiden", "Step 2 — Lady-in-Waiting", "Step 3 — Princess",
  "Step 4 — Queen", "Step 5 — Queen with Scepter", "Step 6 — Queen with Regent",
  "Step 7 — Queen in Service",
];
const LYDIA_STEPS = [
  "Step 1 — First Year", "Step 2 — Second Year", "Step 3 — Third Year",
  "Step 4 — Fourth Year", "Step 5 — Fifth Year (Service Award)",
];

const RANK_OPTIONS: Record<string, string[]> = {
  "royal-ambassadors": RA_RANKS,
  "girls-auxiliary": GA_STEPS,
  "lydia-auxiliary": LYDIA_STEPS,
};

const STATUS_PILL: Record<MemberStatus, string> = {
  pending:  "bg-yellow-100 text-yellow-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}

// ── Add Member Modal ─────────────────────────────────────────────────────────
function AddMemberModal({
  onClose, onAdded,
}: { onClose: () => void; onAdded: (m: MinistryMember) => void }) {
  const [ministry, setMinistry] = useState<MinistryKey>("royal-ambassadors");
  const [fullName, setFullName] = useState("");
  const [rank, setRank] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [raIdCardNumber, setRaIdCardNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // When ministry changes reset rank
  const handleMinistryChange = (v: MinistryKey) => { setMinistry(v); setRank(""); setRaIdCardNumber(""); setOccupation(""); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rank || !photoFile) { setError("Please fill all fields and upload a photo."); return; }
    setSubmitting(true); setError("");
    try {
      const { uploadToR2 } = await import("@/lib/r2");
      const photoUrl = await uploadToR2(photoFile, "members");
      const id = await submitMembership({
        ministry, fullName: fullName.trim(), rank, photoUrl,
        ...(ministry === "royal-ambassadors" && raIdCardNumber.trim() ? { raIdCardNumber: raIdCardNumber.trim() } : {}),
        ...(ministry === "royal-ambassadors" && occupation.trim() ? { occupation: occupation.trim() } : {}),
      });
      onAdded({
        id,
        ministry,
        fullName: fullName.trim(),
        rank,
        photoUrl,
        status: "pending",
        submittedAt: new Date().toISOString(),
        raIdCardNumber: ministry === "royal-ambassadors" ? raIdCardNumber.trim() : "",
        occupation: ministry === "royal-ambassadors" ? occupation.trim() : "",
      });
    } catch (err) {
      setError("Failed to add member. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        <div className="w-10 h-1.5 rounded-full bg-stone-200 mx-auto mt-3 mb-1 sm:hidden"/>
        <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-800 text-lg">Add New Member</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ministry */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Ministry *</label>
              <div className="flex gap-2 flex-wrap">
                {(["royal-ambassadors", "girls-auxiliary", "lydia-auxiliary"] as MinistryKey[]).map(k => (
                  <button key={k} type="button" onClick={() => handleMinistryChange(k)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${ministry === k ? "bg-primary text-white border-primary shadow-sm" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                    {MINISTRY_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                placeholder="Member's full name" required />
            </div>
            {/* Rank / Step */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                {ministry === "royal-ambassadors" ? "Rank" : "Forward Step"} *
              </label>
              <select value={rank} onChange={e => setRank(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" required>
                <option value="">Select…</option>
                {(RANK_OPTIONS[ministry] || []).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* RA-specific fields */}
            {ministry === "royal-ambassadors" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">RA ID Card Number <span className="text-stone-400 normal-case font-normal">(optional)</span></label>
                  <input type="text" value={raIdCardNumber} onChange={e => setRaIdCardNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    placeholder="RA ID card number" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Occupation <span className="text-stone-400 normal-case font-normal">(optional)</span></label>
                  <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    placeholder="e.g. Student, Trader, Civil Servant" />
                </div>
              </>
            )}
            {/* Photo */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Photo in Uniform *</label>
              <input type="file" accept="image/*" onChange={handleFile}
                className="w-full text-sm text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer" required />
              {photoPreview && (
                <img src={photoPreview} alt="Preview"
                  className="mt-3 w-20 h-20 rounded-xl object-cover border-2 border-stone-200"/>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors">
                {submitting ? "Adding member…" : "Add Member"}
              </button>
              <button type="button" onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// ── Edit Details Modal (admin updates RA-specific fields) ─────────────────────
function EditDetailsModal({
  member, onClose, onSaved,
}: { member: MinistryMember; onClose: () => void; onSaved: (m: MinistryMember) => void }) {
  const [raIdCardNumber, setRaIdCardNumber] = useState(member.raIdCardNumber || "");
  const [occupation, setOccupation] = useState(member.occupation || "");
  const [rank, setRank] = useState(member.rank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const rankOptions = RANK_OPTIONS[member.ministry] || [];

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      await updateMemberDetails(member.id, {
        raIdCardNumber: raIdCardNumber.trim(),
        occupation: occupation.trim(),
        rank,
      });
      onSaved({ ...member, raIdCardNumber: raIdCardNumber.trim(), occupation: occupation.trim(), rank });
    } catch (err) {
      setError("Failed to update. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        <div className="w-10 h-1.5 rounded-full bg-stone-200 mx-auto mt-3 mb-1 sm:hidden"/>
        <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-800 text-lg">Edit Member Details</h2>
            <p className="text-xs text-stone-500">{member.fullName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Rank (editable for all ministries) */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              {member.ministry === "royal-ambassadors" ? "Rank" : "Forward Step"}
            </label>
            <select value={rank} onChange={e => setRank(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
              {rankOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* RA-specific fields */}
          {member.ministry === "royal-ambassadors" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">RA ID Card Number</label>
                <input type="text" value={raIdCardNumber} onChange={e => setRaIdCardNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                  placeholder="Enter RA ID card number" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Occupation / Kind of Work</label>
                <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                  placeholder="e.g. Student, Trader, Civil Servant" />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Export Modal (Excel export with rank filtering) ───────────────────────────
function ExportModal({ members, onClose }: { members: MinistryMember[]; onClose: () => void }) {
  const [exportMinistry, setExportMinistry] = useState<"all" | MinistryKey>("all");
  const [rankMode, setRankMode] = useState<"all" | "specific">("all");
  const [selectedRanks, setSelectedRanks] = useState<Set<string>>(new Set());
  const [statusMode, setStatusMode] = useState<"all" | "approved">("all");

  // Get available ranks based on selected ministry
  const availableRanks: string[] = exportMinistry === "all"
    ? [...new Set([...RA_RANKS, ...GA_STEPS, ...LYDIA_STEPS])]
    : RANK_OPTIONS[exportMinistry] || [];

  const toggleRank = (rank: string) => {
    setSelectedRanks(prev => {
      const next = new Set(prev);
      if (next.has(rank)) next.delete(rank); else next.add(rank);
      return next;
    });
  };

  // Filter members for export
  const getExportData = () => {
    let filtered = members;
    if (exportMinistry !== "all") filtered = filtered.filter(m => m.ministry === exportMinistry);
    if (statusMode === "approved") filtered = filtered.filter(m => m.status === "approved");
    if (rankMode === "specific" && selectedRanks.size > 0) {
      filtered = filtered.filter(m => selectedRanks.has(m.rank));
    }
    return filtered;
  };

  const handleExport = () => {
    const data = getExportData();
    if (data.length === 0) {
      alert("No members match the selected filters.");
      return;
    }

    const rows = data.map((m, i) => ({
      "#": i + 1,
      "Full Name": m.fullName,
      "Ministry": MINISTRY_LABELS[m.ministry] || m.ministry,
      "Rank / Step": m.rank,
      "Status": m.status,
      "RA ID Card Number": m.raIdCardNumber || "",
      "Occupation": m.occupation || "",
      "Submitted": formatDate(m.submittedAt),
      "Approved": m.approvedAt ? formatDate(m.approvedAt) : "",
      "Note": m.note || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    // Set column widths
    ws["!cols"] = [
      { wch: 4 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 10 },
      { wch: 20 }, { wch: 25 }, { wch: 14 }, { wch: 14 }, { wch: 30 },
    ];

    const wb = XLSX.utils.book_new();
    const ministryLabel = exportMinistry === "all" ? "All_Ministries" : exportMinistry.replace(/-/g, "_");
    const rankLabel = rankMode === "all" ? "All_Ranks" : "Selected_Ranks";
    XLSX.utils.book_append_sheet(wb, ws, "Members");

    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${ministryLabel}_${rankLabel}_${date}.xlsx`);
    onClose();
  };

  const previewCount = getExportData().length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        <div className="w-10 h-1.5 rounded-full bg-stone-200 mx-auto mt-3 mb-1 sm:hidden"/>
        <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-800 text-lg">Export to Excel</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Ministry selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Ministry</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => { setExportMinistry("all"); setSelectedRanks(new Set()); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${exportMinistry === "all" ? "bg-primary text-white border-primary shadow-sm" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                All Ministries
              </button>
              {(["royal-ambassadors", "girls-auxiliary", "lydia-auxiliary"] as MinistryKey[]).map(k => (
                <button key={k} onClick={() => { setExportMinistry(k); setSelectedRanks(new Set()); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${exportMinistry === k ? "bg-primary text-white border-primary shadow-sm" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                  {MINISTRY_LABELS[k]}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Status</label>
            <div className="flex gap-2">
              <button onClick={() => setStatusMode("all")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${statusMode === "all" ? "bg-stone-700 text-white border-stone-700" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                All Statuses
              </button>
              <button onClick={() => setStatusMode("approved")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${statusMode === "approved" ? "bg-emerald-600 text-white border-emerald-600" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                Approved Only
              </button>
            </div>
          </div>

          {/* Rank filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Ranks / Steps</label>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setRankMode("all")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${rankMode === "all" ? "bg-stone-700 text-white border-stone-700" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                All Ranks
              </button>
              <button onClick={() => setRankMode("specific")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${rankMode === "specific" ? "bg-stone-700 text-white border-stone-700" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                Choose Specific Ranks
              </button>
            </div>
            {rankMode === "specific" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {availableRanks.map(r => (
                  <button key={r} onClick={() => toggleRank(r)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${selectedRanks.has(r) ? "bg-primary/10 border-primary text-primary" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedRanks.has(r) ? "bg-primary border-primary" : "border-stone-300"}`}>
                      {selectedRanks.has(r) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview count */}
          <div className="bg-stone-50 rounded-xl px-4 py-3 text-center">
            <p className="text-sm text-stone-600">
              <span className="font-bold text-stone-800">{previewCount}</span> member{previewCount !== 1 ? "s" : ""} will be exported
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex gap-3">
          <button onClick={handleExport} disabled={previewCount === 0}
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Excel (.xlsx)
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────────────
export default function MinistryMembersAdmin() {
  const [members, setMembers]   = useState<MinistryMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"all" | MinistryKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [search, setSearch]     = useState("");
  const [noteModal, setNoteModal] = useState<{ id: string; note: string; status: MemberStatus } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [saving, setSaving]     = useState<string | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [editMember, setEditMember] = useState<MinistryMember | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listAllMembers();
      setMembers(data);
    } catch (err) {
      console.error("[ministry-members] Failed to load:", err);
      setLoadError("Could not load registrations. Check your connection and try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = members.filter(m => {
    if (filter !== "all" && m.ministry !== filter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (search.trim() && !m.fullName.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const handleStatus = async (id: string, status: MemberStatus, note?: string) => {
    setSaving(id);
    try {
      await updateMemberStatus(id, status, note);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status, ...(note !== undefined ? { note } : {}) } : m));
    } finally { setSaving(null); setNoteModal(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member record permanently?")) return;
    setSaving(id);
    try { await deleteMember(id); setMembers(prev => prev.filter(m => m.id !== id)); }
    finally { setSaving(null); }
  };

  const counts = {
    all:      members.length,
    pending:  members.filter(m => m.status === "pending").length,
    approved: members.filter(m => m.status === "approved").length,
    rejected: members.filter(m => m.status === "rejected").length,
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_ministry_members"><div className="p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Ministry Registrations</h1>
          <p className="text-stone-500 text-sm mt-0.5">Approve or reject membership applications. Add new members directly.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Member
          </button>
          <button onClick={load}
            className="text-sm px-4 py-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600">
            Refresh
          </button>
          <button onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total",    count: counts.all,      color: "bg-stone-100 text-stone-700" },
          { label: "Pending",  count: counts.pending,  color: "bg-yellow-100 text-yellow-700" },
          { label: "Approved", count: counts.approved, color: "bg-emerald-100 text-emerald-700" },
          { label: "Rejected", count: counts.rejected, color: "bg-red-100 text-red-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-3xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-stone-50"
          placeholder="Search by name…"/>
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
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

      {/* Load error */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Members list */}
      {loading ? (
        <div className="text-center py-16 text-stone-400">Loading registrations…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-lg font-semibold mb-1">No registrations found</p>
          <p className="text-sm">
            {search ? `No members match "${search}".` : "Registrations will appear here when submitted."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white border border-stone-100 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
              {/* Photo */}
              <button onClick={() => setLightbox(m.photoUrl)} className="flex-shrink-0">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 hover:opacity-80 transition-opacity"
                    onError={e => { (e.target as HTMLImageElement).src = ""; }} />
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_PILL[m.status]}`}>
                    {m.status}
                  </span>
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                    {MINISTRY_LABELS[m.ministry] || m.ministry}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-0.5">{m.rank}</p>
                <p className="text-xs text-stone-400">
                  Submitted: {formatDate(m.submittedAt)}
                  {m.approvedAt && <span className="ml-2 text-emerald-600">· Approved: {formatDate(m.approvedAt)}</span>}
                </p>
                {m.note && <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 rounded-lg px-2 py-1">Note: {m.note}</p>}
                {(m.raIdCardNumber || m.occupation) && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {m.raIdCardNumber && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">ID: {m.raIdCardNumber}</span>
                    )}
                    {m.occupation && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">Work: {m.occupation}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => setEditMember(m)}
                  className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors">
                  Edit
                </button>
                {m.status === "pending" && (
                  <>
                    <button onClick={() => handleStatus(m.id, "approved")} disabled={saving === m.id}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {saving === m.id ? "…" : "Approve"}
                    </button>
                    <button onClick={() => setNoteModal({ id: m.id, note: m.note || "", status: "rejected" })}
                      className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </>
                )}
                {m.status === "approved" && (
                  <button onClick={() => handleStatus(m.id, "pending")} disabled={saving === m.id}
                    className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50">
                    Revoke
                  </button>
                )}
                {m.status === "rejected" && (
                  <button onClick={() => handleStatus(m.id, "approved")} disabled={saving === m.id}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors disabled:opacity-50">
                    Approve
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} disabled={saving === m.id}
                  className="px-3 py-1.5 bg-stone-100 text-stone-500 text-xs font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
)}

      {/* Edit details modal */}
      {editMember && (
        <EditDetailsModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onSaved={(updated) => {
            setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
            setEditMember(null);
          }}
        />
      )}

      {/* Export modal */}
      {showExport && (
        <ExportModal members={members} onClose={() => setShowExport(false)} />
      )}

      {/* Note / reject modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
          <div onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-stone-800 mb-3">Add a note (optional)</h3>
            <textarea value={noteModal.note} onChange={e => setNoteModal(n => n ? { ...n, note: e.target.value } : null)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
              placeholder="Reason for rejection or internal note…"/>
            <div className="flex gap-3">
              <button onClick={() => handleStatus(noteModal.id, noteModal.status, noteModal.note)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                Confirm Reject
              </button>
              <button onClick={() => setNoteModal(null)}
                className="px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Member photo"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onError={e => { (e.target as HTMLImageElement).src = ""; }}/>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* Add Member modal */}
      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onAdded={m => { setMembers(prev => [m, ...prev]); setShowAdd(false); }}
        />
      )}
    </div>
  
      </PermissionGuard>
    </AdminShell>
);
}
