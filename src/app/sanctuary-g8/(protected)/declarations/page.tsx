"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import R2Uploader from "@/components/R2Uploader";
import {
  getAllDeclarations,
  createDeclaration,
  updateDeclaration,
  deleteDeclaration,
  seedDeclarationIfEmpty,
  DEFAULT_PASTOR_IMAGE,
} from "@/lib/declarations";
import type { PastorDeclaration } from "@/types/declaration";
import { auth } from "@/lib/firebase";
import { logActivity } from "@/lib/activityLog";

export default function AdminDeclarationsPage() {
  const [declarations, setDeclarations] = useState<PastorDeclaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadDeclarations = async () => {
    setLoading(true);
    const items = await getAllDeclarations();
    setDeclarations(items);
    setLoading(false);
  };

  useEffect(() => {
    // Set today's date as default
    const now = new Date();
    setDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
    (async () => {
      await seedDeclarationIfEmpty();
      await loadDeclarations();
    })();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setText("");
    setImageUrl(null);
    // Auto-fill today's date in DD/MM/YYYY format
    const now = new Date();
    setDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
    setPublished(false);
  };

  const startEdit = (d: PastorDeclaration) => {
    setEditingId(d.id);
    setText(d.text);
    setImageUrl(d.imageUrl || null);
    setDate(d.date || "");
    setPublished(d.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setError("Please enter the declaration text."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      if (editingId) {
        await updateDeclaration(editingId, {
          text, imageUrl: imageUrl || null, published,
          date: date || new Date().toLocaleDateString("en-GB"),
        });
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "updated", target: "Daily Declaration", section: "Daily Declaration" });
        setSuccess("Declaration updated!");
      } else {
        await createDeclaration({ text, imageUrl: imageUrl || undefined, published, date: date || new Date().toLocaleDateString("en-GB") });
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "created", target: "Daily Declaration", section: "Daily Declaration" });
        setSuccess("Declaration created!");
      }
      resetForm();
      await loadDeclarations();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("permission") || msg.includes("Permission")) {
        setError("Firestore rules not published yet. Go to Firebase Console -> Firestore -> Rules, paste the updated firestore.rules, and click Publish.");
      } else { setError(msg); }
    } finally { setSaving(false); }
  };

  const handleTogglePublish = async (d: PastorDeclaration) => {
    try {
      await updateDeclaration(d.id, { published: !d.published });
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: d.published ? "unpublished" : "published", target: "Daily Declaration", section: "Daily Declaration" });
      setSuccess(d.published ? "Unpublished." : "Published! Now visible on homepage.");
      await loadDeclarations();
    } catch (err) { setError((err as Error).message); }
  };

  const handleDelete = async (d: PastorDeclaration) => {
    if (!confirm("Delete this declaration? This cannot be undone.")) return;
    try {
      await deleteDeclaration(d.id);
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "deleted", target: "Daily Declaration", section: "Daily Declaration" });
      setSuccess("Deleted.");
      if (editingId === d.id) resetForm();
      await loadDeclarations();
    } catch (err) { setError((err as Error).message); }
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_settings">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="font-serif text-lg font-bold text-primary">Daily Declaration</h1>
            <p className="text-text-muted text-sm mt-1">The pastor's daily prayer declaration. Shows as a separate popup on the homepage — distinct from Pastor's Word.</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{success}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-primary text-sm">{editingId ? "Edit Declaration" : "New Declaration"}</h2>
              {editingId && <button type="button" onClick={resetForm} className="text-xs text-text-muted hover:text-primary">Cancel edit</button>}
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-primary">Published</label>
                <p className="text-xs text-text-muted mt-0.5">Only published declarations show on the homepage</p>
              </div>
              <button type="button" onClick={() => setPublished(!published)} className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${published ? "bg-emerald-500" : "bg-stone-300"}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${published ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Date</label>
              <input
                type="date"
                value={date ? (() => { const [d, m, y] = date.split("/"); return `${y}-${m}-${d}`; })() : ""}
                onChange={(e) => {
                  // Format as DD/MM/YYYY for display consistency
                  const val = e.target.value; // yyyy-mm-dd from date picker
                  if (val) {
                    const [y, m, d] = val.split("-");
                    setDate(`${d}/${m}/${y}`);
                  } else {
                    setDate("");
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
              />
            </div>

            {/* Text */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Declaration Text <span className="text-red-400">*</span></label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none font-serif italic" placeholder="Type the pastor's prayer declaration here..." required />
              <p className="text-xs text-text-muted mt-1">First line will be shown as the title in the popup</p>
            </div>

            {/* Pastor Image */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Pastor Photo (optional)</label>
              <p className="text-xs text-text-muted mb-2">Leave empty to use the default pastor image</p>
              <R2Uploader folder="declarations" onUploaded={(url: string) => setImageUrl(url)} />
              {imageUrl && (
                <div className="mt-3 relative inline-block">
                  <img src={imageUrl} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-stone-200" />
                  <button type="button" onClick={() => setImageUrl(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">&times;</button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Declaration" : "Create Declaration"}
              </button>
            </div>
          </form>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
          ) : declarations.length === 0 ? (
            <div className="text-center py-16 text-text-muted text-sm">No declarations yet. Create one above.</div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">All Declarations</h3>
              {declarations.map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-stone-200 p-4 flex gap-4 items-start">
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${d.published ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{d.published ? "Live" : "Draft"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-800 font-medium truncate">{d.text.split("\n")[0]}</p>
                    <p className="text-xs text-text-muted mt-0.5">{d.date || "No date"} · Created {new Date(d.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleTogglePublish(d)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-50 hover:bg-stone-100 text-primary transition-colors">{d.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => startEdit(d)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-50 hover:bg-stone-100 text-primary transition-colors">Edit</button>
                    <button onClick={() => handleDelete(d)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminShell>
  );
}
