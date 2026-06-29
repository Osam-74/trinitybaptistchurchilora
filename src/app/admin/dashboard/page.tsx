"use client";

import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { samplePosts, sampleSermons, sampleAlbums } from "@/lib/seed-data";

const stats = [
  { label: "Total Posts", value: String(samplePosts.length), icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", href: "/admin/posts", color: "bg-blue-50 text-blue-600" },
  { label: "Sermons", value: String(sampleSermons.length), icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", href: "/admin/sermons", color: "bg-purple-50 text-purple-600" },
  { label: "Gallery Albums", value: String(sampleAlbums.length), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", href: "/admin/gallery", color: "bg-green-50 text-green-600" },
  { label: "Pending Bookings", value: "3", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", href: "/admin/bookings", color: "bg-amber-50 text-amber-600" },
];

const quickLinks = [
  { label: "New Post", href: "/admin/posts", icon: "M12 4v16m8-8H4", desc: "Share a message or announcement" },
  { label: "Upload Sermon", href: "/admin/sermons", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", desc: "Add audio or video sermon" },
  { label: "Add Photos", href: "/admin/gallery", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12", desc: "Upload gallery photos" },
  { label: "Manage Bookings", href: "/admin/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", desc: "Review session requests" },
  { label: "Moderate Comments", href: "/admin/comments", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", desc: "Approve or hide comments" },
  { label: "Manage Users", href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197", desc: "Add staff and set permissions" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-dark" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                  <rect x="2" y="8" width="20" height="3" rx="1.5"/>
                </svg>
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-text-muted text-sm">Trinity Baptist Church, Ilora</p>
              </div>
            </div>
            <div className="gold-divider mt-4 max-w-xs"/>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}
                className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm card-hover">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon}/>
                  </svg>
                </div>
                <p className="font-serif text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-text-muted text-xs mt-0.5">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8">
            <h2 className="font-serif text-lg font-bold text-primary mb-5">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.map((link) => (
                <Link key={link.label} href={link.href}
                  className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 hover:border-accent/40 hover:bg-accent/3 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <svg className="w-4.5 h-4.5 text-accent" style={{width:18,height:18}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon}/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">{link.label}</p>
                    <p className="text-text-muted text-xs mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent posts */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-primary">Recent Posts</h2>
              <Link href="/admin/posts" className="text-accent text-sm font-semibold hover:text-accent-dark transition-colors">View all →</Link>
            </div>
            <div className="space-y-3">
              {samplePosts.slice(0, 4).map((post, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${post.pinned ? "bg-accent/15" : "bg-stone-100"}`}>
                    <svg className={`w-4 h-4 ${post.pinned ? "text-accent" : "text-text-muted"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm truncate">{post.title}</p>
                    <p className="text-text-muted text-xs">{post.mediaType} • {post.status}</p>
                  </div>
                  {post.pinned && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium flex-shrink-0">Pinned</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
