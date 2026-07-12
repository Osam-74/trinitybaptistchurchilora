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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B2C22' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
          <p className="text-[#C8E63A]/60 text-sm font-medium tracking-wide">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
