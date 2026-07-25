"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { samplePosts, sampleSermons, sampleAlbums } from "@/lib/seed-data";

export default function AdminDashboardPage() {
  const [greeting, setGreeting] = useState("Hello");
  const [currentDate, setCurrentDate] = useState("");

  // Live stream state — persisted to Firestore
  const [isLive, setIsLive] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);

  // Quick Announcement
  const [annText, setAnnText] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

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
    { label: "Total Posts", value: String(samplePosts.length), icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", href: "/admin/posts", bg: "bg-emerald-500/10 text-emerald-600" },
    { label: "Sermons", value: String(sampleSermons.length), icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", href: "/admin/sermons", bg: "bg-indigo-500/10 text-indigo-600" },
    { label: "Gallery Albums", value: String(sampleAlbums.length), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", href: "/admin/gallery", bg: "bg-teal-500/10 text-teal-600" },
    { label: "Announcements", value: String(announcements.length), icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", href: "/admin/announcements", bg: "bg-amber-500/10 text-amber-600" },
  ];

  const quickLinks = [
    { label: "New Post", href: "/admin/posts", icon: "M12 4v16m8-8H4" },
    { label: "Announcements", href: "/admin/announcements", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
    { label: "Add Photos", href: "/admin/gallery", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
    { label: "Messages", href: "/admin/contacts", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Bookings", href: "/admin/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Settings", href: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F6F3]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 md:ml-[72px] lg:ml-[260px] pt-20 lg:pt-8 pr-6 lg:pr-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8EDE8] shadow-sm">
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-[#0B2C22] tracking-tight">{greeting}, Admin</h1>
              <p className="text-stone-500 text-sm mt-1 font-medium">{currentDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/posts" className="px-4 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] shadow transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0v8m0-8h8m-8 0H4"/></svg>
                New Post
              </Link>
              <Link href="/admin/live" className="px-4 py-2.5 bg-[#C8E63A] text-[#0B2C22] text-sm font-bold rounded-xl hover:bg-opacity-90 shadow transition-all flex items-center gap-2">
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

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Quick Announcement */}
            <div className="lg:col-span-2 space-y-6">

              {/* Quick Announcement Card */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="mb-5">
                  <h2 className="font-serif text-xl font-bold text-[#0B2C22]">📢 Quick Announcement</h2>
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
                    <Link href="/admin/announcements" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0D4A35] font-bold hover:underline">
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
                <h3 className="font-serif text-xl font-bold text-[#0B2C22] mb-5">Today&apos;s Service Timeline</h3>
                <div className="relative pl-6 border-l-2 border-[#E8EDE8] space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-white"/>
                    <p className="text-xs font-bold text-[#22C55E]">08:00 AM – 09:30 AM</p>
                    <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">Sunday School Preparatory Session</h4>
                    <p className="text-stone-400 text-xs mt-1">Conducted by the Christian Education Directorate</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0D4A35] border-4 border-white"/>
                    <p className="text-xs font-bold text-[#0D4A35]">09:30 AM – 12:00 PM</p>
                    <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">Sunday Worship Service</h4>
                    <p className="text-stone-400 text-xs mt-1">Main sanctuary service and youth assembly</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white"/>
                    <p className="text-xs font-bold text-amber-500">05:00 PM – 06:30 PM</p>
                    <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">House Fellowship Gatherings</h4>
                    <p className="text-stone-400 text-xs mt-1">Multi-location fellowship cells within Ilora</p>
                  </div>
                </div>
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
                <Link href="/admin/live" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0D4A35] font-bold hover:underline">
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

        </div>
      </main>
    </div>
  );
}
