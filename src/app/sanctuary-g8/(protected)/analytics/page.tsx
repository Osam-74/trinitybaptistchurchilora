"use client";

import { useState, useEffect, useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import { getAnalyticsSummary, getAnalyticsChart, AnalyticsSummary, DateRange } from "@/lib/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "12weeks", label: "12 Weeks" },
  { value: "12months", label: "12 Months" },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange>("7days");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    getAnalyticsSummary()
      .then(s => { setAnalytics(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setChartLoading(true);
    getAnalyticsChart(range)
      .then(res => { setChartData(res.data); setChartLabels(res.labels); setChartLoading(false); })
      .catch(() => setChartLoading(false));
  }, [range]);

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diff = Date.now() - d.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } catch {
      return dateStr;
    }
  };

  const chartDataWithLabels = useMemo(() => {
    return chartData.map((d, i) => ({ ...d, label: chartLabels[i] || d.date }));
  }, [chartData, chartLabels]);

  return (
    <AdminShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Content Analytics</h1>
          <p className="text-sm text-text-muted mt-1">Track views across sermons, news posts, and faith articles.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !analytics || analytics.totalViews === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-stone-400 text-sm">No views tracked yet. Analytics will appear here as visitors read your content.</p>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold text-primary">{analytics.totalViews}</p>
                <p className="text-xs text-text-muted font-medium mt-1">Total Views</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold text-indigo-600">{analytics.sermonViews}</p>
                <p className="text-xs text-text-muted font-medium mt-1">Sermon Views</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold text-blue-600">{analytics.newsViews}</p>
                <p className="text-xs text-text-muted font-medium mt-1">News & Events</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold text-emerald-600">{analytics.articleViews}</p>
                <p className="text-xs text-text-muted font-medium mt-1">Faith Articles</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <p className="text-3xl font-bold text-amber-600">{analytics.postViews}</p>
                <p className="text-xs text-text-muted font-medium mt-1">Other Posts</p>
              </div>
            </div>

            {/* Chart with date range filter */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Views Over Time</h3>
                <div className="flex gap-2 flex-wrap">
                  {RANGE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setRange(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        range === opt.value
                          ? "bg-primary text-white"
                          : "bg-stone-100 text-text-muted hover:bg-stone-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {chartLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartDataWithLabels} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE8" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={{ stroke: "#E8EDE8" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "#0D4A3508" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #E8EDE8",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ fontWeight: 600, color: "#0B2C22" }}
                      formatter={(value: any) => [`${value} ${value === 1 ? "view" : "views"}`, "Views"]}
                    />
                    <Bar dataKey="views" radius={[6, 6, 0, 0]} maxBarSize={50}>
                      {chartDataWithLabels.map((_, i) => (
                        <Cell key={i} fill="#0D4A35" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top content */}
              {analytics.topContent.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Top Content</h3>
                  <div className="space-y-2">
                    {analytics.topContent.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{item.title}</p>
                          <p className="text-xs text-text-muted capitalize">{item.collection.replace("_", " ")}</p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-bold text-primary flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          {item.views}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent views */}
              {analytics.recentViews.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Recent Views</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analytics.recentViews.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{v.title}</p>
                          <p className="text-xs text-text-muted capitalize">{v.collection.replace("_", " ")}</p>
                        </div>
                        <span className="text-xs text-text-muted flex-shrink-0">{formatTime(v.viewedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
