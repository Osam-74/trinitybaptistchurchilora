"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed" | "unauthed">("checking");

  useEffect(() => {
    if (!auth) {
      // Firebase didn't initialize — treat as unauthed so user sees login page
      setStatus("unauthed");
      router.replace("/admin");
      return;
    }
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setStatus("authed");
      } else {
        setStatus("unauthed");
        router.replace("/admin");
      }
    });
    return () => unsub();
  }, [router]);

  if (status === "checking" || status === "unauthed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
