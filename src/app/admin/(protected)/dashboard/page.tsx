"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { samplePosts, sampleSermons, sampleAlbums, sampleActivities } from "@/lib/seed-data";

export default function AdminDashboardPage() {
  const [greeting, setGreeting] = useState("Hello");
  const [currentDate, setCurrentDate] = useState("");
  const [isLive, setIsLive] = useState(false);

  // Quick action title + body states for the Quick Publish Card
  const [publishTitle, setPublishTitle] = useState("");
  const [publishType, setPublishType] = useState("Post");
  const [publishContent, setPublishContent] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const stats = [
    { 
      label: "Total Posts", 
      value: String(samplePosts.length), 
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", 
      href: "/admin/posts", 
      bg: "bg-emerald-500/10 text-emerald-600",
      trend: "+12% this month",
      trendUp: true
    },
    { 
      label: "Sermons", 
      value: String(sampleSermons.length), 
      icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", 
      href: "/admin/sermons", 
      bg: "bg-indigo-500/10 text-indigo-600",
      trend: "+4% this month",
      trendUp: true
    },
    { 
      label: "Gallery Albums", 
      value: String(sampleAlbums.length), 
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", 
      href: "/admin/gallery", 
      bg: "bg-teal-500/10 text-teal-600",
      trend: "Steady growth",
      trendUp: true
    },
    { 
      label: "Pending Bookings", 
      value: "3", 
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", 
      href: "/admin/bookings", 
      bg: "bg-amber-500/10 text-amber-600",
      trend: "Needs review",
      trendUp: false
    },
  ];

  const quickLinks = [
    { label: "New Post", href: "/admin/posts", icon: "M12 4v16m8-8H4", desc: "Share a message" },
    { label: "Upload Sermon", href: "/admin/sermons", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", desc: "Add audio/video" },
    { label: "Add Photos", href: "/admin/gallery", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12", desc: "Upload gallery files" },
    { label: "Manage Bookings", href: "/admin/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", desc: "Review requests" },
    { label: "Manage Users", href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197", desc: "Manage church staff" },
    { label: "Calendar", href: "/admin/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", desc: "View scheduled dates" }
  ];

  const recentActivity = [
    { type: "sermon", text: "Pastor uploaded a new Sermon: 'Walking in Divine Grace'", time: "2 hours ago", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18" },
    { type: "booking", text: "New booking request received from Sis. Abigail Alao for Hall reservation", time: "4 hours ago", icon: "M8 7V3m8 4V3m-9 8h10" },
    { type: "post", text: "Broadcasting team updated 'Weekly Newsletter'", time: "1 day ago", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2" },
    { type: "gallery", text: "New Album 'Youth Convention 2026' added to Gallery", time: "2 days ago", icon: "M4 16l4.586-4.586a2 2 0 012.828 0" },
    { type: "user", text: "Admin assigned 'Choir Coordinator' role to Bro. James Falola", time: "3 days ago", icon: "M12 4.354a4 4 0 110 5.292" }
  ];

  const sampleBookings = [
    { name: "Sis. Abigail Alao", date: "Jul 18, 2026", status: "Pending" },
    { name: "Bro. Dele Johnson", date: "Jul 20, 2026", status: "Confirmed" },
    { name: "Dr. Samuel Banji", date: "Jul 12, 2026", status: "Cancelled" }
  ];

  const handleQuickPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle || !publishContent) return;
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setPublishTitle("");
      setPublishContent("");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F3]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 md:ml-[72px] lg:ml-[260px] pt-20 lg:pt-8 pr-6 lg:pr-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Bar / Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8EDE8] shadow-sm">
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-[#0B2C22] tracking-tight">
                {greeting}, Admin
              </h1>
              <p className="text-stone-500 text-sm mt-1 flex items-center gap-2 font-medium">
                <svg className="w-4.5 h-4.5 text-[#0D4A35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {currentDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/posts" 
                className="px-4 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] shadow transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0v8m0-8h8m-8 0H4"/>
                </svg>
                New Post
              </Link>
              <Link 
                href="/admin/live" 
                className="px-4 py-2.5 bg-[#C8E63A] text-[#0B2C22] text-sm font-bold rounded-xl hover:bg-opacity-90 shadow transition-all flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                Go Live
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <Link 
                key={stat.label} 
                href={stat.href}
                className="bg-white rounded-2xl p-6 border border-[#E8EDE8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon}/>
                    </svg>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    stat.trendUp ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {stat.trendUp ? "↑" : "•"} {stat.trend}
                  </span>
                </div>
                <h3 className="font-serif text-3xl font-extrabold text-[#0B2C22] tracking-tight">{stat.value}</h3>
                <p className="text-stone-500 text-sm mt-1 font-medium">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Activity Feed */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#0B2C22]">System Activity Log</h2>
                    <p className="text-stone-400 text-xs mt-0.5">Real-time portal activity updates</p>
                  </div>
                  <span className="text-xs bg-[#0D4A35]/5 text-[#0D4A35] font-semibold px-3 py-1 rounded-full">
                    Auto-sync Active
                  </span>
                </div>
                <div className="divide-y divide-stone-100">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 group">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-[#0D4A35] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8E63A]/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={activity.icon}/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0B2C22] text-sm font-medium leading-relaxed">{activity.text}</p>
                        <p className="text-stone-400 text-xs mt-1 font-medium flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Publish Card */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="mb-5">
                  <h2 className="font-serif text-xl font-bold text-[#0B2C22]">Quick Broadcast Publish</h2>
                  <p className="text-stone-400 text-xs mt-0.5">Instantly post announcements or messages to the congregation</p>
                </div>
                {publishSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl mb-4 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Content simulated successfully! It will appear in your database shortly.
                  </div>
                )}
                <form onSubmit={handleQuickPublish} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-1.5">Title</label>
                      <input 
                        type="text" 
                        required
                        value={publishTitle}
                        onChange={(e) => setPublishTitle(e.target.value)}
                        placeholder="Weekly Prayer Meeting Focus..." 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDE8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-1.5">Type</label>
                      <select 
                        value={publishType}
                        onChange={(e) => setPublishType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDE8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]"
                      >
                        <option>Post</option>
                        <option>Sermon</option>
                        <option>Event</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-1.5">Content Body</label>
                    <textarea 
                      required
                      value={publishContent}
                      onChange={(e) => setPublishContent(e.target.value)}
                      rows={3} 
                      placeholder="Write your brief content update or scripture reference here..." 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDE8] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4A35]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-[#0D4A35] text-white font-bold rounded-xl hover:bg-[#0B2C22] transition-colors text-sm shadow"
                  >
                    Publish Instantly
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              
              {/* Live Status Card */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-[#0B2C22]">Live Stream status</h3>
                  <span className={`w-3 h-3 rounded-full ${isLive ? "bg-[#22C55E] animate-pulse" : "bg-stone-300"}`} />
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-[#E8EDE8] mb-4">
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">CURRENT STATUS</p>
                  <p className={`text-lg font-bold ${isLive ? "text-emerald-700" : "text-stone-600"}`}>
                    {isLive ? "● Broadcast Live" : "Offline / Standby"}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-[#E8EDE8]">
                  <span className="text-sm font-semibold text-[#0B2C22]">Toggle Live Stream</span>
                  <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      isLive ? "bg-[#22C55E]" : "bg-stone-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      isLive ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#0B2C22]">Upcoming Events</h3>
                  <Link href="/admin/activities" className="text-xs text-[#0D4A35] font-bold hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                  {sampleActivities.slice(0, 3).map((act, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl bg-[#0D4A35]/5 text-[#0D4A35] flex flex-col items-center justify-center font-bold text-[10px] p-1 flex-shrink-0">
                        <span>{act.startTime}</span>
                        <span className="text-xs font-extrabold">{act.endTime}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#0B2C22] truncate">{act.title}</p>
                        <p className="text-stone-400 text-xs mt-0.5 truncate">{act.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links Grid */}
              <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
                <h3 className="font-serif text-lg font-bold text-[#0B2C22] mb-4">Quick Navigation</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <Link 
                      key={link.label} 
                      href={link.href}
                      className="p-3 bg-stone-50 hover:bg-[#C8E63A]/10 border border-[#E8EDE8] rounded-xl text-center group transition-all"
                    >
                      <svg className="w-6 h-6 text-[#0D4A35] mx-auto mb-1.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon}/>
                      </svg>
                      <span className="text-xs font-bold text-[#0B2C22] group-hover:text-[#0D4A35] transition-colors">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Today's Schedule Timeline */}
            <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6">
              <h3 className="font-serif text-xl font-bold text-[#0B2C22] mb-5">Today&apos;s Service Timeline</h3>
              <div className="relative pl-6 border-l-2 border-[#E8EDE8] space-y-6">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-white" />
                  <p className="text-xs font-bold text-[#22C55E]">08:00 AM - 09:30 AM</p>
                  <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">Sunday School Preparatory Session</h4>
                  <p className="text-stone-400 text-xs mt-1">Conducted by the Christian Education Directorate</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0D4A35] border-4 border-white" />
                  <p className="text-xs font-bold text-[#0D4A35]">09:30 AM - 12:00 PM</p>
                  <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">Sunday Worship Service</h4>
                  <p className="text-stone-400 text-xs mt-1">Main sanctuary service and youth assembly</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white" />
                  <p className="text-xs font-bold text-amber-500">05:00 PM - 06:30 PM</p>
                  <h4 className="font-semibold text-[#0B2C22] text-sm mt-0.5">House Fellowship Gatherings</h4>
                  <p className="text-stone-400 text-xs mt-1">Multi-location fellowship cells within Ilora</p>
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-2xl border border-[#E8EDE8] shadow-sm p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-bold text-[#0B2C22]">Recent Session Bookings</h3>
                <Link href="/admin/bookings" className="text-xs text-[#0D4A35] font-bold hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E8EDE8] text-stone-400 text-xs uppercase tracking-wider font-bold">
                      <th className="pb-3">Applicant</th>
                      <th className="pb-3">Proposed Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sampleBookings.map((b, i) => (
                      <tr key={i} className="group hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 font-semibold text-[#0B2C22]">{b.name}</td>
                        <td className="py-3.5 text-stone-500">{b.date}</td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            b.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" :
                            b.status === "Cancelled" ? "bg-red-50 text-red-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
