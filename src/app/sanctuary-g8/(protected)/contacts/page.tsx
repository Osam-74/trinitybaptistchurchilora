"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { listContactMessages, deleteContactMessage, ContactMessage } from "@/lib/contacts";

function timeAgo(iso: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    listContactMessages()
      .then(data => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_contacts">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-primary">Contact Messages</h1>
            <p className="text-text-muted text-sm mt-1">{messages.length} message{messages.length !== 1 ? "s" : ""} received</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-text-muted font-semibold">No contact messages yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors"
                    onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{msg.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-primary text-sm">{msg.name}</p>
                          <span className="bg-stone-100 text-stone-500 text-xs px-2 py-0.5 rounded-full">{msg.subject}</span>
                        </div>
                        <p className="text-stone-500 text-xs">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-stone-400">{timeAgo(msg.createdAt)}</span>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <svg className={`w-4 h-4 text-stone-400 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {expanded === msg.id && (
                    <div className="px-5 pb-5 pt-1 border-t border-stone-50">
                      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap bg-stone-50 rounded-xl px-4 py-3">{msg.message}</p>
                      <div className="flex gap-3 mt-4">
                        <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
                </div>
          </PermissionGuard>
    </AdminShell>
  );
}
