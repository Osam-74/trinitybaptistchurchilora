"use client";

/**
 * useCurrentUser — shared hook that fetches the current admin user's
 * display name and email from Firebase Auth + Firestore (admin_users).
 * Falls back to email if no display name is set.
 */

import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
      // Ensure admin_users doc exists (create if missing)
      if (db && !displayName) {
        try {
          await setDoc(doc(db, "admin_users", fbUser.uid), {
            email: fbUser.email,
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch { /* ignore */ }
      }
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
