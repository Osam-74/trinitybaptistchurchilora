"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { getRecentActivity, ActivityEntry } from "@/lib/activityLog";

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  useEffect(() => {
    getRecentActivity(200)
      .then(data => { setActivities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sections = Array.from(new Set(activities.map(a => a.section))).sort();

  const filtered = sectionFilter === "all"
    ? activities
    : activities.filter(a => a.section === sectionFilter);

  const formatTime = (createdAt: unknown) => {
    if (!createdAt) return "just now";
    try {
      const d = new Date(createdAt as string | number | Date);
      return d.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "recently";
    }
  };

  return (
    <AdminShell>
      <PermissionGuard required="view_activity_log">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-primary">Activity Log</h1>
            <p className="text-sm text-text-muted mt-1">All admin actions across the platform — who did what and when.</p>
          </div>

          {/* Section filter */}
          {sections.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setSectionFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sectionFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-stone-100 text-text-muted hover:bg-stone-200"
                }`}
              >
                All ({activities.length})
              </button>
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => setSectionFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sectionFilter === s
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-text-muted hover:bg-stone-200"
                  }`}
                >
                  {s} ({activities.filter(a => a.section === s).length})
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <p className="text-stone-400 text-sm">No activity logged yet.</p>
              <p className="text-stone-300 text-xs mt-1">Actions performed by admin users will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-100">
                {filtered.map((act, i) => (
                  <div key={act.id ?? i} className="flex items-start gap-3 p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {act.userName?.charAt(0).toUpperCase() ?? "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary">
                        <span className="font-semibold">{act.userName || "Admin"}</span>{" "}
                        <span className="text-text-muted">{act.action}</span>{" "}
                        <span className="font-medium">{act.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-primary bg-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {act.section}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {formatTime(act.createdAt)}
                        </span>
                        <span className="text-[10px] text-stone-300 hidden sm:inline">{act.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminShell>
  );
}
