"use client";

import { useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FbUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Permission } from "@/types";

interface PermissionGuardProps {
  /** The permission required to view this page. Omit for public pages (e.g. dashboard). */
  required?: Permission;
  children: ReactNode;
}

/**
 * Page-level permission guard.
 * Wrap admin page content with <PermissionGuard required="manage_gallery">
 * to block users who don't have the permission, even if they navigate
 * directly via URL.
 */
export default function PermissionGuard({ required, children }: PermissionGuardProps) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    // No permission required → always allow
    if (!required) {
      setStatus("allowed");
      return;
    }

    if (!auth) {
      setStatus("denied");
      return;
    }

    let cancelled = false;

    const unsub = onAuthStateChanged(auth, async (fbUser: FbUser | null) => {
      if (!fbUser) {
        if (!cancelled) setStatus("denied");
        return;
      }

      try {
        if (!db) {
          if (!cancelled) setStatus("denied");
          return;
        }

        const snap = await getDoc(doc(db, "admin_users", fbUser.uid));

        if (cancelled) return;

        if (!snap.exists()) {
          // No admin_users document — original super admin, full access
          setStatus("allowed");
          return;
        }

        const data = snap.data() as { roles?: string[]; permissions?: Permission[] };
        const isMasterAdmin =
          data.roles?.includes("master_admin") ||
          data.roles?.includes("super_admin");

        if (isMasterAdmin || data.permissions?.includes(required)) {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      } catch (err) {
        console.error("PermissionGuard: failed to load profile:", err);
        if (!cancelled) setStatus("denied");
      }
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [required]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
          <p className="text-stone-400 text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Access Denied</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            You don&apos;t have permission to view this page.
            Please contact the administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
