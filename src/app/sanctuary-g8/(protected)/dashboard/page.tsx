"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { samplePosts, sampleSermons, sampleAlbums } from "@/lib/seed-data";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getRecentActivity, ActivityEntry } from "@/lib/activityLog";
import { getAnalyticsSummary, AnalyticsSummary } from "@/lib/analytics";
import { getTodayActivities } from "@/lib/activities";
import { Activity } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function AdminDashboardPage() {
  const [greeting, setGreeting] = useState("Hello");
  const [displayName, setDisplayName] = useState("Admin");
  const [currentDate, setCurrentDate] = useState("");

  // Live stream state — persisted to Firestore
  const [isLive, setIsLive] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);

  // Quick Announcement
  const [annText, setAnnText] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [todaysActivities, setTodaysActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));

    // Load live status + announcements
    getSiteSettings().then((s) => {
      setIsLive(!!(s as { liveEnabled?: boolean }).liveEnabled);
      setAnnouncements(s.announcements || []);
    }).catch(() => {});

    // Load recent activity log
    getRecentActivity(15).then(setActivities).catch(() => {});

    // Load today's activities for service timeline
    getTodayActivities().then(setTodaysActivities).catch(() => {});

    // Load analytics — must run before any early return in this effect
    getAnalyticsSummary().then(s => { setAnalytics(s); setAnalyticsLoading(false); }).catch(() => setAnalyticsLoading(false));

    // Fetch the current user's display name from Firestore
    let unsub: (() => void) | null = null;
    if (auth) {
      unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        try {
          if (db) {
            const snap = await getDoc(doc(db, "admin_users", user.uid));
            if (snap.exists()) {
              const data = snap.data() as { displayName?: string };
              if (data.displayName) setDisplayName(data.displayName);
            }
          }
        } catch { /* ignore */ }
      });
    }

    return () => { if (unsub) unsub(); };
  }, []);

  const toggleLive = async () => {
    setLiveLoading(true);
    const next = !isLive;
    try {
      await updateSiteSettings({ liveEnabled: next } as Parameters<typeof updateSiteSettings>[0]);
      setIsLive(next);
    } catch (e) {
      console.error(e);
    } finally {
      setLiveLoading(false);
    }
  };

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annText.trim()) return;
    setAnnSaving(true);
    try {
      const updated = [...announcements, annText.trim()];
      await updateSiteSettings({ announcements: updated } as Parameters<typeof updateSiteSettings>[0]);
      setAnnouncements(updated);
      setAnnText("");
      setAnnSuccess(true);
      setTimeout(() => setAnnSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setAnnSaving(false);
    }
  };

  const deleteAnnouncement = async (index: number) => {
    const updated = announcements.filter((_, i) => i !== index);
    await updateSiteSettings({ announcements: updated } as Parameters<typeof updateSiteSettings>[0]);
    setAnnouncements(updated);
  };

  const stats = [
    { label: "Total Posts", value: String(samplePosts.length), icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", href: "/sanctuary-g8/posts", bg: "bg-emerald-500/10 text-emerald-600" },
    { label: "Sermons", value: String(sampleSermons.length), icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", href: "/sanctuary-g8/sermons", bg: "bg-indigo-500/10 text-indigo-600" },
    { label: "Gallery Albums", value: String(sampleAlbums.length), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", href: "/sanctuary-g8/gallery", bg: "bg-teal-500/10 text-teal-600" },
    { label: "Announcements", value: String(announcements.length), icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", href: "/sanctuary-g8/announcements", bg: "bg-amber-500/10 text-amber-600" },
  ];

  const quickLinks = [
    { label: "New Post", href: "/sanctuary-g8/posts", icon: "M12 4v16m8-8H4" },
    { label: "Announcements", href: "/sanctuary-g8/announcements", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
    { label: "Add Photos", href: "/sanctuary-g8/gallery", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
    { label: "Messages", href: "/sanctuary-g8/contacts", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Bookings", href: "/sanctuary-g8/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Settings", href: "/sanctuary-g8/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <AdminShell>
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8EDE8] shadow-sm">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0B2C22] tracking-tight">{greeting}, {displayName}</h1>
              <p className="text-stone-500 text-sm mt-1 font-medium">{currentDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sanctuary-g8/posts" className="px-4 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] shadow transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0v8m0-8h8m-8 0H4"/></svg>
                New Post
              </Link>
              <Link href="/sanctuary-g8/live" className="px-4 py-2.5 bg-[#C8E63A] text-[#0B2C22] text-sm font-bold rounded-xl hover:bg-opacity-90 shadow transition-all flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                Go Live
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-6 border border-[#E8EDE8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon}/>
                  </svg>
                </div>
                <h3 className="font-serif text-3xl font-extrabold text-[#0B2C22]">{stat.value}</h3>
                <p className="text-stone-500 text-sm mt-1 font-medium">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* ── Analytics Dashboard ── */}
          <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#0B2C22]">📊 Content Analytics</h2>
                <p className="text-stone-400 text-xs mt-0.5">Track views across sermons, news posts, and faith articles</p>
              </div>
              {!analyticsLoading && analytics && (
                <span className="text-xs text-stone-400 font-medium">Total: {analytics.totalViews} views</span>
              )}
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#0D4A35]/20 border-t-[#0D4A35] rounded-full animate-spin" />
              </div>
            ) : !analytics || analytics.totalViews === 0 ? (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-stone-400 text-sm">No views tracked yet. Analytics will appear here as visitors read your content.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* View counts by type */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-[#0D4A35]/5 rounded-xl p-4 border border-[#0D4A35]/10">
                    <p className="text-2xl font-bold text-[#0B2C22]">{analytics.totalViews}</p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Total Views</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-2xl font-bold text-indigo-600">{analytics.sermonViews}</p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Sermon Views</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{analytics.newsViews}</p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">News & Event Views</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-2xl font-bold text-emerald-600">{analytics.articleViews}</p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Faith Article Views</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-2xl font-bold text-amber-600">{analytics.postViews}</p>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Other Post Views</p>
                  </div>
                </div>

                {/* 7-day chart */}
                <div>
                  <h4 className="text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-3">Last 7 Days</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={analytics.last7Days.map((d, i) => ({ ...d, label: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }) }))} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE8" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#78716c" }} axisLine={{ stroke: "#E8EDE8" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#78716c" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: "#0D4A3508" }} contentStyle={{ backgroundColor: "#fff", border: "1px solid #E8EDE8", borderRadius: "10px", fontSize: "11px" }} formatter={(value: any) => [`${value} ${value === 1 ? "view" : "views"}`, "Views"]} />
                      <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {analytics.last7Days.map((_, i) => (
                          <Cell key={i} fill="#0D4A35" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top content */}
                {analytics.topContent.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-3">Top Content</h4>
                    <div className="space-y-2">
                      {analytics.topContent.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-[#E8EDE8]">
                          <span className="w-6 h-6 rounded-full bg-[#0D4A35] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0B2C22] truncate">{item.title}</p>
                            <p className="text-xs text-stone-400 capitalize">{item.collection.replace('_', ' ')}</p>
                          </div>
                          <span className="flex items-center gap-1 text-sm font-bold text-[#0D4A35] flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            {item.views}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Quick Announcement */}
            <div className="lg:col-span-2 space-y-6">

              {/* Quick Announcement Card */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="mb-5">
                  <h2 className="font-serif text-lg font-bold text-[#0B2C22]">📢 Quick Announcement</h2>
                  <p className="text-stone-400 text-xs mt-0.5">Type an announcement — it will be added to the scrolling ticker on the site immediately.</p>
                </div>

                {annSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl mb-4 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                    Announcement added and now showing on the site!
                  </div>
                )}

                <form onSubmit={addAnnouncement} className="flex gap-3">
                  <input
                    type="text"
                    value={annText}
                    onChange={(e) => setAnnText(e.target.value)}
                    placeholder="e.g. Youth Convention this Saturday at 10:00 AM"
                    className="flex-1 px-4 py-3 rounded-xl border border-[#E8EDE8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]/30"
                    required
                  />
                  <button
                    type="submit"
                    disabled={annSaving}
                    className="px-5 py-3 bg-[#0D4A35] text-white text-sm font-bold rounded-xl hover:bg-[#0B2C22] transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {annSaving ? "Saving…" : "Add"}
                  </button>
                </form>

                {/* Current announcement list */}
                {announcements.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-2">Current Announcements ({announcements.length})</p>
                    {announcements.map((ann, i) => (
                      <div key={i} className="flex items-center gap-3 bg-stone-50 border border-[#E8EDE8] rounded-xl px-4 py-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#0D4A35]/10 text-[#0D4A35] text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                        <span className="flex-1 text-sm text-[#0B2C22] truncate">{ann}</span>
                        <button
                          onClick={() => deleteAnnouncement(i)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors flex-shrink-0"
                          aria-label="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                    <Link href="/sanctuary-g8/announcements" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0D4A35] font-bold hover:underline">
                      Manage all announcements →
                    </Link>
                  </div>
                )}
                {announcements.length === 0 && (
                  <p className="mt-4 text-xs text-stone-400 italic">No announcements yet. Add one above to have it display on the site.</p>
                )}
              </div>

              {/* Today's Service Timeline */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#0B2C22]">Today&apos;s Service Timeline</h3>
                  <Link href="/sanctuary-g8/activities" className="text-xs text-[#0D4A35] font-bold hover:underline">Manage →</Link>
                </div>
                {todaysActivities.length === 0 ? (
                  <div className="py-8 text-center">
                    <svg className="w-10 h-10 text-stone-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p className="text-stone-400 text-xs">No activities scheduled for today.</p>
                    <Link href="/sanctuary-g8/activities" className="text-xs text-[#0D4A35] font-bold hover:underline mt-1 inline-block">Add activities →</Link>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-[#E8EDE8] space-y-5">
                    {todaysActivities.map((a, i) => {
                      const colors = ["#22C55E", "#0D4A35", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899"];
                      const color = colors[i % colors.length];
                      const formatTime = (t: string) => {
                        const [h, m] = t.split(":");
                        const hr = parseInt(h);
                        const ampm = hr >= 12 ? "PM" : "AM";
                        const hr12 = hr % 12 || 12;
                        return `${hr12.toString().padStart(2, "0")}:${m} ${ampm}`;
                      };
                      return (
                        <div key={a.id} className="relative">
                          <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: color }} />
                          <p className="text-xs font-bold" style={{ color }}>{formatTime(a.startTime)} – {formatTime(a.endTime)}</p>
                          <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">{a.title}</h4>
                          {a.description && <p className="text-stone-400 text-xs mt-1">{a.description}</p>}
                          {a.location && <p className="text-stone-300 text-xs mt-0.5">📍 {a.location}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right column */}
            <div className="space-y-6">

              {/* Live Stream Card — persists to Firestore */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-[#0B2C22]">Live Stream</h3>
                  <span className={`w-3 h-3 rounded-full transition-colors ${isLive ? "bg-[#22C55E] animate-pulse" : "bg-stone-300"}`}/>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-[#E8EDE8] mb-4">
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">STATUS</p>
                  <p className={`text-lg font-bold ${isLive ? "text-emerald-700" : "text-stone-500"}`}>
                    {isLive ? "● Broadcasting Live" : "Offline / Standby"}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {isLive ? "Live button is visible to site visitors." : "Live button is hidden from visitors."}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-[#E8EDE8]">
                  <span className="text-sm font-semibold text-[#0B2C22]">Toggle Live</span>
                  <button
                    onClick={toggleLive}
                    disabled={liveLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-60 ${isLive ? "bg-[#22C55E]" : "bg-stone-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${isLive ? "translate-x-6" : "translate-x-1"}`}/>
                  </button>
                </div>
                <Link href="/sanctuary-g8/live" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0D4A35] font-bold hover:underline">
                  Configure live stream →
                </Link>
              </div>

              {/* Quick Nav */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <h3 className="font-serif text-lg font-bold text-[#0B2C22] mb-4">Quick Navigation</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <Link key={link.label} href={link.href}
                      className="p-3 bg-stone-50 hover:bg-[#C8E63A]/10 border border-[#E8EDE8] rounded-xl text-center group transition-all">
                      <svg className="w-6 h-6 text-[#0D4A35] mx-auto mb-1.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon}/>
                      </svg>
                      <span className="text-xs font-bold text-[#0B2C22] group-hover:text-[#0D4A35] transition-colors leading-tight block">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

        {/* ── Activity Log ── */}
        <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0B2C22]">📋 Activity Log</h2>
              <p className="text-stone-400 text-xs mt-0.5">Recent changes made by admin users</p>
            </div>
            <span className="text-xs text-stone-400 font-medium">{activities.length} recent {activities.length === 1 ? 'entry' : 'entries'}</span>
          </div>

          {activities.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <p className="text-stone-400 text-sm">No activity logged yet. Changes you make will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activities.map((act, i) => (
                <div key={act.id ?? i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-[#E8EDE8]">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0D4A35]/10 flex items-center justify-center text-[#0D4A35] font-bold text-xs">
                    {act.userName?.charAt(0).toUpperCase() ?? 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0B2C22]">
                      <span className="font-semibold">{act.userName}</span>{' '}
                      <span className="text-stone-500">{act.action}</span>{' '}
                      <span className="font-medium">{act.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-[#0D4A35] bg-[#C8E63A]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {act.section}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {act.createdAt
                          ? new Date(act.createdAt as string | number | Date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
                          : 'just now'}
                      </span>
                      <span className="text-[10px] text-stone-300 hidden sm:inline">{act.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        </div>
      
</AdminShell>
);
}
