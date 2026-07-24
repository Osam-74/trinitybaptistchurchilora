"use client";

/**
 * MemberDirectory — Reusable name-search directory component
 * Shows only APPROVED members. Searches from 3+ chars typed.
 * Clicking a result card opens a profile modal.
 */

import { useState, useEffect, useRef } from "react";
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
  const [open, setOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<MinistryMember[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MinistryMember[]>([]);
  const [selected, setSelected] = useState<MinistryMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch approved members only once when directory is opened
  async function openDirectory() {
    setOpen(true);
    setQuery("");
    setResults([]);
    setSelected(null);
    if (!fetched) {
      setLoading(true);
      try {
        const members = await listMembersForMinistry(ministry);
        const approved = members.filter(m => m.status === "approved");
        setAllMembers(approved);
        setFetched(true);
      } finally {
        setLoading(false);
      }
    }
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  // Live search — triggers from 3+ characters
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) { setResults([]); return; }
    const matches = allMembers.filter(m => m.fullName.toLowerCase().includes(q));
    setResults(matches);
  }, [query, allMembers]);

  function close() { setOpen(false); setSelected(null); setQuery(""); setResults([]); }

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={openDirectory}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Browse Directory
      </button>

      {/* ── Directory modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* handle bar */}
            <div className="w-10 h-1.5 rounded-full bg-stone-200 mx-auto mt-3 mb-1 sm:hidden" />

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-800">{ministryLabel} Directory</h2>
                <p className="text-xs text-stone-400 mt-0.5">Search by name — approved members only</p>
              </div>
              <button onClick={close} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search box */}
            <div className="px-6 pt-4 pb-3">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(null); }}
                  placeholder="Type at least 3 letters of a name…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 bg-stone-50"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults([]); setSelected(null); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
              {query.length > 0 && query.length < 3 && (
                <p className="text-xs text-stone-400 mt-2 pl-1">Type {3 - query.length} more letter{3 - query.length !== 1 ? "s" : ""} to search…</p>
              )}
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loading && (
                <div className="text-center py-10 text-stone-400">
                  <svg className="w-6 h-6 mx-auto mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading directory…
                </div>
              )}

              {/* Empty state before search */}
              {!loading && query.length < 3 && (
                <div className="text-center py-10">
                  <svg className="w-12 h-12 mx-auto mb-3 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <p className="text-stone-400 text-sm font-medium">Start typing a name to search</p>
                  <p className="text-stone-300 text-xs mt-1">{allMembers.length} approved member{allMembers.length !== 1 ? "s" : ""} in directory</p>
                </div>
              )}

              {/* No results */}
              {!loading && query.length >= 3 && results.length === 0 && (
                <div className="text-center py-10 text-stone-400">
                  <p className="font-medium">No members found for "{query}"</p>
                  <p className="text-xs mt-1">Only approved members appear in the directory.</p>
                </div>
              )}

              {/* Profile card — shown when a result is clicked */}
              {selected && (
                <div className="mb-4">
                  <button onClick={() => setSelected(null)} className="text-xs text-primary font-semibold flex items-center gap-1 mb-3 hover:underline">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to results
                  </button>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/15 rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      {selected.photoUrl ? (
                        <img src={selected.photoUrl} alt={selected.fullName}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-stone-800 leading-tight">{selected.fullName}</h3>
                        <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          ✓ Approved Member
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/70 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-0.5">Ministry</p>
                        <p className="text-stone-800 font-medium">{ministryLabel}</p>
                      </div>
                      <div className="bg-white/70 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-0.5">Rank / Step</p>
                        <p className="text-stone-800 font-medium text-xs">{selected.rank}</p>
                      </div>
                      {selected.approvedAt && (
                        <div className="col-span-2 bg-white/70 rounded-xl px-3 py-2.5">
                          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-0.5">Member Since</p>
                          <p className="text-stone-800 font-medium">{formatDate(selected.approvedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Search results list */}
              {!selected && results.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-stone-400 font-medium mb-3">{results.length} result{results.length !== 1 ? "s" : ""} for "{query}"</p>
                  {results.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                    >
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.fullName}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-stone-200"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-stone-800 truncate group-hover:text-primary transition-colors">{m.fullName}</p>
                        <p className="text-xs text-stone-400 truncate">{m.rank}</p>
                      </div>
                      <svg className="w-4 h-4 text-stone-300 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
