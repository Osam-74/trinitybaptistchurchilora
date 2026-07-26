"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, User as FbUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getSiteSettings } from "@/lib/settings";
import { Permission } from "@/types";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  permission?: Permission; // undefined = always visible (Dashboard)
  badge?: string;
};

const navigationGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "OVERVIEW",
    items: [
      { href: "/sanctuary-g8/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ]
  },
  {
    group: "CONTENT",
    items: [
      { href: "/sanctuary-g8/posts", label: "Faith Articles", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", permission: "manage_posts" },
      { href: "/sanctuary-g8/sermons", label: "Sermons", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", permission: "manage_sermons" },
      { href: "/sanctuary-g8/hymns", label: "Hymns", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", permission: "manage_hymns" },
      { href: "/sanctuary-g8/gallery", label: "Gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", permission: "manage_gallery" },
      { href: "/sanctuary-g8/pastor-speaks", label: "Pastor's Word", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", permission: "manage_pastor_speaks" },
    ]
  },
  {
    group: "COMMUNITY",
    items: [
      { href: "/sanctuary-g8/leadership", label: "Leadership", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", permission: "manage_leadership" },
      { href: "/sanctuary-g8/members", label: "Choir & Media", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", permission: "manage_members" },
      { href: "/sanctuary-g8/ministry-members", label: "Ministry Members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", permission: "manage_ministry_members" },
    ]
  },
  {
    group: "EVENTS",
    items: [
      { href: "/sanctuary-g8/bookings", label: "Bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", permission: "manage_bookings" },
      { href: "/sanctuary-g8/contacts", label: "Messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", permission: "manage_contacts" },
      { href: "/sanctuary-g8/announcements", label: "Announcements", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", permission: "manage_announcements" },
      { href: "/sanctuary-g8/calendar", label: "Calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", permission: "manage_calendar" },
      { href: "/sanctuary-g8/activities", label: "Activities", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", permission: "manage_activities" },
    ]
  },
  {
    group: "BROADCAST",
    items: [
      { href: "/sanctuary-g8/live", label: "Live Stream", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z", permission: "manage_streams" },
    ]
  },
  {
    group: "SYSTEM",
    items: [
      { href: "/sanctuary-g8/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", permission: "manage_users" },
      { href: "/sanctuary-g8/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", permission: "manage_settings" },
    ]
  },
  {
    group: "VIEW SITE",
    items: [
      { href: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { href: "/about", label: "About", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { href: "/sermons", label: "Sermons", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
      { href: "/gallery", label: "Gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { href: "/ministries", label: "Ministries", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { href: "/give", label: "Give", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
      { href: "/book", label: "Book Event", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { href: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    ]
  }
];

interface AdminProfile {
  uid: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: Permission[];
  active: boolean;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/logo/trinity-logo.png");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [userProfile, setUserProfile] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load site logo + current user's admin profile (permissions)
  useEffect(() => {
    getSiteSettings().then((s) => { if (s.logoUrl) setLogoUrl(s.logoUrl); });

    if (!auth) { setProfileLoading(false); return; }

    const unsub = onAuthStateChanged(auth, async (fbUser: FbUser | null) => {
      if (!fbUser) {
        setUserProfile(null);
        setCurrentUserEmail("");
        setProfileLoading(false);
        return;
      }
      setCurrentUserEmail(fbUser.email || "Admin");

      // Fetch the user's admin profile from Firestore to get their permissions
      try {
        if (db) {
          const snap = await getDoc(doc(db, "admin_users", fbUser.uid));
          if (snap.exists()) {
            const data = snap.data() as Omit<AdminProfile, "uid">;
            setUserProfile({ uid: fbUser.uid, ...data });
          } else {
            // No admin_users document — this is likely the original super admin
            // who was set up before the user-management system existed.
            // Default to full access so we don't lock anyone out.
            setUserProfile(null);
          }
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
      }
      setProfileLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/sanctuary-g8");
  };

  // ── Permission filtering ──
  // master_admin (or no profile found = original admin) sees everything.
  // Everyone else sees Dashboard + only items matching their permissions.
  const isMasterAdmin =
    !userProfile ||                              // no profile = original admin → full access
    userProfile.roles?.includes("master_admin") ||
    userProfile.roles?.includes("super_admin");

  const hasPermission = (perm?: Permission): boolean => {
    if (!perm) return true;                      // Dashboard — always visible
    if (isMasterAdmin) return true;              // master admin sees everything
    return userProfile?.permissions?.includes(perm) ?? false;
  };

  // Filter groups + items, and drop empty groups entirely
  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  // While loading the profile, show the full menu so there's no flash of
  // an empty sidebar. Once loaded, it snaps to the filtered set.
  const groupsToRender = profileLoading ? navigationGroups : visibleGroups;

  const roleLabel = isMasterAdmin
    ? "Super Administrator"
    : userProfile?.roles?.[0]
      ? userProfile.roles[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Administrator";

  return (
    <>
      {/* Mobile Header Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B2C22] flex items-center justify-between px-4 z-40 border-b border-white/10">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Church logo" className="w-8 h-8 rounded-full object-cover shadow" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0B2C22]" viewBox="0 0 24 24" fill="currentColor">
                <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                <rect x="2" y="8" width="20" height="3" rx="1.5"/>
              </svg>
            </div>
          )}
          <span className="text-white font-semibold text-sm">TBC Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-[#0D4A35] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            )}
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        style={{ backgroundColor: "#0B2C22" }}
        className={`fixed top-0 left-0 h-screen z-[60] flex flex-col transition-all duration-300 border-r border-[#0D4A35]
          w-[260px] md:w-[72px] lg:w-[260px]
          ${mobileOpen ? "translate-x-0 !w-[260px]" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3 overflow-hidden h-16 flex-shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Church logo" className="w-9 h-9 rounded-full object-cover shadow flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#C8E63A] flex items-center justify-center shadow flex-shrink-0">
              <svg className="w-5 h-5 text-[#0B2C22]" viewBox="0 0 24 24" fill="currentColor">
                <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
                <rect x="2" y="8" width="20" height="3" rx="1.5"/>
              </svg>
            </div>
          )}
          <div className="flex flex-col md:hidden lg:flex transition-opacity duration-300">
            <span className="text-white font-bold text-sm tracking-wide">Trinity Baptist</span>
            <span className="text-[#C8E63A] text-[10px] uppercase font-bold tracking-widest">TBC Admin</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin">
          {groupsToRender.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 tracking-wider px-3.5 md:hidden lg:block">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 relative
                        ${active
                          ? "bg-[rgba(200,230,58,0.12)] text-[#C8E63A] border-l-4 border-[#C8E63A] pl-[10px]"
                          : "text-white/75 hover:bg-[#0D4A35] hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 transition-colors duration-200
                            ${active ? "text-[#C8E63A]" : "text-white/50 group-hover:text-white"}
                          `}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                        </svg>
                        <div className="flex flex-col md:hidden lg:flex transition-opacity duration-300">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full md:hidden lg:inline-block">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-[#0B2C22] flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#0D4A35] flex items-center justify-center text-white font-bold text-sm border border-white/10 flex-shrink-0">
              {currentUserEmail ? currentUserEmail[0].toUpperCase() : "A"}
            </div>
            <div className="flex flex-col md:hidden lg:flex min-w-0 transition-opacity duration-300">
              <span className="text-white text-xs font-semibold truncate">
                {currentUserEmail || "Admin User"}
              </span>
              <span className="text-white/40 text-[10px]">{roleLabel}</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-[#0D4A35] transition-all text-sm font-medium"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="md:hidden lg:inline transition-opacity duration-300">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
