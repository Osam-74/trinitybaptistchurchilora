"use client";

/**
 * MemberDirectory — Auto-loading photo grid with click-to-view profile modal.
 * Shows approved members as a photo grid. Search filters by name.
 * Clicking a photo opens a fullscreen profile modal.
 */

import { useState, useEffect } from "react";
import { listMembersForMinistry, MinistryMember, MinistryKey } from "@/lib/ministryMembers";

interface Props {
  ministry: MinistryKey;
  ministryLabel: string;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}

export default function MemberDirectory({ ministry, ministryLabel }: Props) {
  const [allMembers, setAllMembers] = useState<MinistryMember[]>([]);
  const [filtered, setFiltered] = useState<MinistryMember[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MinistryMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch approved members on mount
  useEffect(() => {
    listMembersForMinistry(ministry).then(members => {
      const approved = members.filter(m => m.status === "approved");
      setAllMembers(approved);
      setFiltered(approved);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [ministry]);

  // Filter on search
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      setFiltered(allMembers);
    } else {
      setFiltered(allMembers.filter(m => m.fullName.toLowerCase().includes(q)));
    }
  }, [query, allMembers]);

  return (
    <>
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search members by name..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent text-sm backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60 text-sm">
            {query ? `No members found for "${query}"` : "No approved members yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Photo grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/20 hover:border-accent transition-all duration-300 hover:scale-105"
              >
                {m.photoUrl ? (
                  <img
                    src={m.photoUrl}
                    alt={m.fullName}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                {!m.photoUrl && (
                  <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/60 text-lg font-bold">
                    {m.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Hover overlay with name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                  <p className="text-white text-xs font-semibold text-center px-2 truncate max-w-full">{m.fullName}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs mt-4">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}{query ? ` matching "${query}"` : ""}
          </p>
        </>
      )}

      {/* Profile Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Photo at top */}
            <div className="w-full aspect-square overflow-hidden flex-shrink-0">
              {selected.photoUrl ? (
                <img
                  src={selected.photoUrl}
                  alt={selected.fullName}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              {!selected.photoUrl && (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40 text-6xl font-bold">
                  {selected.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content — left aligned */}
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="font-serif text-2xl font-bold text-primary mb-3 text-left">{selected.fullName}</h3>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ✓ Approved Member
              </span>

              <div className="space-y-3 text-left">
                <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">Ministry</p>
                  <p className="text-primary font-medium">{ministryLabel}</p>
                </div>
                <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">Rank / Step</p>
                  <p className="text-primary font-medium text-sm">{selected.rank}</p>
                </div>
                {selected.approvedAt && (
                  <div className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                    <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-0.5">Member Since</p>
                    <p className="text-primary font-medium">{formatDate(selected.approvedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
