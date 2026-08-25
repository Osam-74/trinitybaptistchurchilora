"use client";

import { useState, useEffect } from "react";
import { listMembersForMinistry, MinistryMember, MinistryKey } from "@/lib/ministryMembers";

interface Props {
  ministry: MinistryKey;
  ministryLabel: string;
}

function formatDate(iso?: string) {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MemberDirectory({ ministry, ministryLabel }: Props) {
  const [members, setMembers] = useState<MinistryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MinistryMember | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    async function fetchMembers() {
      setLoading(true);
      try {
        const all = await listMembersForMinistry(ministry);
        if (active) {
          const approved = all.filter((m) => m.status === "approved");
          setMembers(approved);
        }
      } catch (err) {
        console.error("Error fetching ministry members:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchMembers();
    return () => {
      active = false;
    };
  }, [ministry]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? members.filter((m) =>
        m.fullName.toLowerCase().includes(query.trim().toLowerCase())
      )
    : members;

  return (
    <div className="w-full text-left my-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              {ministryLabel} Directory
            </h3>
            <p className="text-xs text-white/70 mt-1">
              {loading
                ? "Loading members..."
                : `${members.length} approved member${members.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8E63A] focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-white/70">
            <svg
              className="w-8 h-8 mx-auto mb-3 animate-spin text-[#C8E63A]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm font-medium">Loading member directory...</p>
          </div>
        )}

        {/* Empty Directory State */}
        {!loading && members.length === 0 && (
          <div className="py-16 text-center text-white/70">
            <svg className="w-12 h-12 mx-auto mb-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-base font-semibold text-white mb-1">No approved members yet</p>
            <p className="text-xs text-white/60">Approved members will appear in this directory.</p>
          </div>
        )}

        {/* No Search Results State */}
        {!loading && members.length > 0 && filtered.length === 0 && (
          <div className="py-16 text-center text-white/70">
            <p className="text-base font-semibold text-white mb-1">No members found</p>
            <p className="text-xs text-white/60">No members matching &quot;{query}&quot;</p>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {filtered.map((m) => {
              const hasImage = m.photoUrl && !imageErrors[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/20 bg-white/5 hover:border-[#C8E63A]/80 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C8E63A]"
                  aria-label={`View profile for ${m.fullName}`}
                >
                  {hasImage ? (
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [m.id]: true }))
                      }
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-[#0D4A35]/80 flex items-center justify-center border border-white/10 text-white font-bold text-lg sm:text-xl tracking-wider">
                      {getInitials(m.fullName)}
                    </div>
                  )}

                  {/* Name overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-2xl">
                    <p className="text-white text-xs font-semibold truncate leading-tight">
                      {m.fullName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Profile Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col p-6 text-left"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors shadow-sm focus:outline-none"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Top Photo */}
            <div className="w-full relative aspect-square max-h-72 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 mb-5 flex-shrink-0">
              {selected.photoUrl && !imageErrors[`modal-${selected.id}`] ? (
                <img
                  src={selected.photoUrl}
                  alt={selected.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={() =>
                    setImageErrors((prev) => ({
                      ...prev,
                      [`modal-${selected.id}`]: true,
                    }))
                  }
                />
              ) : (
                <div className="w-full h-full bg-[#0D4A35] flex items-center justify-center rounded-2xl">
                  <span className="text-4xl font-bold text-[#C8E63A] tracking-wider">
                    {getInitials(selected.fullName)}
                  </span>
                </div>
              )}
            </div>

            {/* Content Below - Left Aligned */}
            <div className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D4A35]/10 text-[#0D4A35] border border-[#0D4A35]/20 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8E63A]" />
                  Approved Member
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0D4A35]">
                  {selected.fullName}
                </h3>
              </div>

              {/* Church Design System Details */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">
                    Ministry
                  </p>
                  <p className="text-stone-800 font-semibold text-sm">
                    {ministryLabel}
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">
                    Rank / Step
                  </p>
                  <p className="text-stone-800 font-semibold text-sm">
                    {selected.rank || "Member"}
                  </p>
                </div>

                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-bold mb-1">
                    Member Since
                  </p>
                  <p className="text-stone-800 font-semibold text-sm">
                    {formatDate(selected.approvedAt || selected.submittedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
