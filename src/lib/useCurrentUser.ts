"use client";

/**
 * useCurrentUser — shared hook that fetches the current admin user's
 * display name and email from Firebase Auth + Firestore (admin_users).
 * Falls back to email if no display name is set.
 *
 * IMPORTANT: This hook is READ-ONLY. It must never create or modify
 * the admin_users document — that would break PermissionGuard, which
 * grants full access to users who have NO admin_users document yet
 * (the "original super admin" fallback).
 */

import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export interface CurrentUser {
  email: string;
  displayName: string;  // display name from Firestore, or email if none set
  uid: string;
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) { setUser(null); return; }
      let displayName = "";
      try {
        if (db) {
          const snap = await getDoc(doc(db, "admin_users", fbUser.uid));
          if (snap.exists()) {
            const data = snap.data() as { displayName?: string };
            displayName = data.displayName || "";
          }
        }
      } catch { /* ignore */ }
      setUser({
        email: fbUser.email || "unknown",
        displayName: displayName || fbUser.email || "Admin",
        uid: fbUser.uid,
      });
    });
    return () => unsub();
  }, []);

  return user;
}
