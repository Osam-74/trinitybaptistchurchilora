"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setChecking(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthed(true);
        setChecking(false);
      } else {
        setAuthed(false);
        setChecking(false);
        router.replace("/admin");
      }
    });
    return () => unsub();
  }, [router]);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-xl font-bold text-primary mb-2">Firebase not connected yet</h1>
          <p className="text-text-muted text-sm">
            Add your Firebase project&apos;s environment variables in Vercel (Project Settings → Environment
            Variables), then redeploy — admin login and this page will become available.
          </p>
        </div>
      </div>
    );
  }

  if (checking || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
