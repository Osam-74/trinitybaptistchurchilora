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
                className="group relative aspect-square rounded-full overflow-hidden border-2 border-white/25 hover:border-accent transition-all duration-300 hover:scale-105 active:scale-95"
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

      {/* Profile Modal — photo on the left, details on the right */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row animate-scale-in"
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Close profile"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left — profile picture */}
            <div className="relative flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/15 px-6 py-8 md:py-0 md:w-[42%]">
              {/* Decorative ring */}
              <div className="absolute inset-4 rounded-[2rem] border border-primary/10 hidden md:block" />
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl">
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
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40 text-7xl font-bold">
                    {selected.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Right — submitted details, left-aligned field rows */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-left">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100 mb-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                APPROVED MEMBER
              </span>
              <p className="text-text-muted text-[11px] font-semibold uppercase tracking-wider mt-2">{ministryLabel}</p>

              <div className="mt-4 divide-y divide-stone-100 border-t border-stone-100">
                <div className="py-3.5">
                  <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Full Name</p>
                  <p className="text-primary font-bold text-lg leading-snug">{selected.fullName}</p>
                </div>
                <div className="py-3.5">
                  <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Rank</p>
                  <p className="text-primary font-semibold text-sm leading-snug">{selected.rank || "—"}</p>
                </div>
                {selected.occupation && (
                  <div className="py-3.5">
                    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Occupation</p>
                    <p className="text-primary font-semibold text-sm leading-snug">{selected.occupation}</p>
                  </div>
                )}
                {selected.raIdCardNumber && (
                  <div className="py-3.5">
                    <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">ID Card Number</p>
                    <p className="text-primary font-semibold text-sm leading-snug">{selected.raIdCardNumber}</p>
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