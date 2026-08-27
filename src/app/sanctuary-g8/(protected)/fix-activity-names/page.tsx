"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function FixActivityNamesPage() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [results, setResults] = useState<{ total: number; updated: number; skipped: number; details: string[] }>({ total: 0, updated: 0, skipped: 0, details: [] });

  const runFix = async () => {
    setStatus("running");
    setResults({ total: 0, updated: 0, skipped: 0, details: [] });
    
    if (!db) { setStatus("error"); return; }

    try {
      // Step 1: Load all admin_users to build email → displayName map
      const adminSnap = await getDocs(collection(db, "admin_users"));
      const nameMap: Record<string, string> = {};
      adminSnap.docs.forEach(d => {
        const data = d.data();
        if (data.email && data.displayName) {
          nameMap[data.email.toLowerCase()] = data.displayName;
        }
      });

      // Step 2: Load all activity log entries
      const logSnap = await getDocs(collection(db, "activity_log"));
      let total = 0, updated = 0, skipped = 0;
      const details: string[] = [];

      for (const logDoc of logSnap.docs) {
        total++;
        const data = logDoc.data();
        const currentName = data.userName || "";
        const email = data.user || "";

        // Find the real display name
        let realName = nameMap[email.toLowerCase()] || "";

        // If no displayName in admin_users but email exists, use email as name
        if (!realName && email && email !== "unknown") {
          realName = email;
        }

        // Only update if we found a better name and it's different from current
        if (realName && realName !== currentName && currentName === "Admin") {
          await updateDoc(doc(db, "activity_log", logDoc.id), { userName: realName });
          updated++;
          details.push(`Updated: "Admin" → "${realName}" (${email})`);
        } else {
          skipped++;
          if (currentName !== "Admin" && currentName) {
            details.push(`Skipped (already named): "${currentName}" (${email})`);
          } else {
            details.push(`Skipped (no match found): "${currentName}" (${email})`);
          }
        }
      }

      setResults({ total, updated, skipped, details });
      setStatus("done");
    } catch (err) {
      console.error("Fix failed:", err);
      setStatus("error");
    }
  };

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <h1 className="font-serif text-2xl font-bold text-primary mb-2">Fix Activity Log Names</h1>
        <p className="text-sm text-stone-500 mb-6">
          This one-time tool updates old activity log entries that show &quot;Admin&quot; instead of the real user name.
          It matches each log entry&apos;s email to the admin_users collection and replaces &quot;Admin&quot; with the correct display name.
        </p>

        {status === "idle" && (
          <button onClick={runFix}
            className="px-6 py-3 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] transition-all">
            Run Fix Now
          </button>
        )}

        {status === "running" && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
            <p className="text-sm text-stone-600">Scanning activity log and updating names…</p>
          </div>
        )}

        {status === "done" && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
              <p className="text-sm font-semibold text-green-800">Done!</p>
              <p className="text-sm text-green-700 mt-1">
                {results.total} entries found · {results.updated} updated · {results.skipped} skipped
              </p>
            </div>
            {results.details.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-4 max-h-96 overflow-y-auto">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">Details</p>
                <div className="space-y-1">
                  {results.details.map((d, i) => (
                    <p key={i} className="text-xs text-stone-600 font-mono">{d}</p>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-stone-400 mt-4">
              You can delete this page now — it&apos;s a one-time tool. The fix is permanent.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-red-800">Something went wrong.</p>
            <p className="text-sm text-red-600 mt-1">Check the browser console for details.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
