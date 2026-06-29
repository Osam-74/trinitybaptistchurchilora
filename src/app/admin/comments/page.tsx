"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Comment } from "@/types";
import { formatDate } from "@/lib/utils";

const sampleComments: Comment[] = [
  { id: "c1", postId: "post-0", displayName: "Brother James", text: "This message was exactly what I needed today. God bless you Pastor!", status: "visible", createdAt: new Date(Date.now() - 3600000).toISOString(), deviceToken: "tok1" },
  { id: "c2", postId: "post-0", displayName: "Sister Grace", text: "Amen! The Word of God is truly a lamp to our feet.", status: "visible", createdAt: new Date(Date.now() - 7200000).toISOString(), deviceToken: "tok2" },
  { id: "c3", postId: "post-1", displayName: "Michael O.", text: "Powerful sermon on faith. Thank you for this teaching.", status: "pending", createdAt: new Date(Date.now() - 10800000).toISOString(), deviceToken: "tok3" },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [filter, setFilter] = useState<"all" | "visible" | "pending" | "hidden">("all");
  const filtered = comments.filter((c) => filter === "all" || c.status === filter);

  const updateStatus = (id: string, status: Comment["status"]) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64"><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {(["all", "visible", "pending", "hidden"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? "bg-accent text-white" : "bg-white text-text border border-stone-200 hover:bg-stone-50"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((comment, i) => (
          <div key={comment.id} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{comment.displayName.charAt(0)}</div>
                  <span className="font-medium text-primary text-sm">{comment.displayName}</span>
                  <span className="text-text-muted text-xs">{formatDate(comment.createdAt)}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${comment.status === "visible" ? "bg-green-100 text-green-700" : comment.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{comment.status}</span>
                </div>
                <p className="text-text text-sm">{comment.text}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {comment.status === "pending" && <button onClick={() => updateStatus(comment.id, "visible")} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>}
                {comment.status !== "hidden" && <button onClick={() => updateStatus(comment.id, "hidden")} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hide"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg></button>}
                <button onClick={() => setComments(comments.filter((c) => c.id !== comment.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-text-muted bg-white rounded-xl">No comments found</div>}
      </div>
    </div></main></div>
  );
}
