"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import R2Uploader from "@/components/R2Uploader";
import {
  getAllDeclarations,
  createDeclaration,
  updateDeclaration,
  deleteDeclaration,
  seedDeclarationIfEmpty,
  DEFAULT_PASTOR_IMAGE,
  SEED_DECLARATION_TEXT,
} from "@/lib/declarations";
import type { PastorDeclaration } from "@/types/declaration";

export default function AdminDeclarationsPage() {
  const [declarations, setDeclarations] = useState<PastorDeclaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
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
    (async () => {
      // Auto-seed the initial declaration if collection is empty
      await seedDeclarationIfEmpty();
      await loadDeclarations();
    })();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setText("");
    setImageUrl(null);
    setDate("");
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

  const handleSave = async () => {
    if (!text.trim()) {
      setError("Declaration text is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateDeclaration(editingId, {
          text: text.trim(),
          imageUrl: imageUrl || null,
          published,
          date: date || new Date().toLocaleDateString("en-GB"),
        });
        setSuccess("Declaration updated successfully!");
      } else {
        await createDeclaration({
          text: text.trim(),
          imageUrl: imageUrl || undefined,
          published,
          date: date || new Date().toLocaleDateString("en-GB"),
        });
        setSuccess("Declaration created successfully!");
      }
      setSuccess("Declaration saved!");
      setTimeout(() => setSuccess(""), 3000);
      resetForm();
      await loadDeclarations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save declaration.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (d: PastorDeclaration) => {
    try {
      // Unpublish all others, then publish this one
      const others = declarations.filter((x) => x.id !== d.id && x.published);
      for (const o of others) {
        await updateDeclaration(o.id, { published: false });
      }
      await updateDeclaration(d.id, { published: true });
      setSuccess("Declaration published! It will now show on the website.");
      setTimeout(() => setSuccess(""), 4000);
      await loadDeclarations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish.");
    }
  };

  const handleUnpublish = async (d: PastorDeclaration) => {
    try {
      await updateDeclaration(d.id, { published: false });
      setSuccess("Declaration unpublished.");
      setTimeout(() => setSuccess(""), 3000);
      await loadDeclarations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unpublish.");
    }
  };

  const handleDelete = async (d: PastorDeclaration) => {
    if (!confirm(`Delete this declaration from ${d.date || "unknown date"}? This cannot be undone.`)) return;
    try {
      await deleteDeclaration(d.id);
      setSuccess("Declaration deleted.");
      setTimeout(() => setSuccess(""), 3000);
      await loadDeclarations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  const handleSeed = async () => {
    setSaving(true);
    try {
      const seeded = await seedDeclarationIfEmpty();
      if (seeded) {
        setSuccess("Initial declaration seeded! Edit it below and publish when ready.");
        setTimeout(() => setSuccess(""), 4000);
        await loadDeclarations();
      } else {
        setError("Declarations already exist — no seeding needed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-[#0D4A35] mb-1">Pastor&apos;s Daily Declaration</h1>
            <p className="text-sm text-stone-500">Create and publish the pastor&apos;s daily prayer declaration. Only one declaration can be published at a time.</p>
          </div>

          {/* Alerts */}
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          {success && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

          {/* Editor Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8">
            <h3 className="font-serif text-lg font-bold text-[#0D4A35] mb-4">
              {editingId ? "Edit Declaration" : "New Declaration"}
            </h3>

            {/* Image upload */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#0D4A35] mb-2">Pastor&apos;s Image</label>
              <div className="flex items-start gap-4">
                <img
                  src={imageUrl || DEFAULT_PASTOR_IMAGE}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl object-cover border border-stone-200"
                />
                <div className="flex-1">
                  <R2Uploader
                    folder="declarations"
                    label="Upload Pastor Image"
                    onUploaded={(url) => setImageUrl(url)}
                  />
                  <p className="text-xs text-stone-400 mt-2">
                    If no image is uploaded, the default pastor portrait will be used automatically.
                  </p>
                  {imageUrl && (
                    <button
                      onClick={() => setImageUrl(null)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                    >
                      Remove uploaded image (use default)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#0D4A35] mb-1.5">Date Label (optional)</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder={new Date().toLocaleDateString("en-GB")}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C8E63A]/30"
              />
              <p className="text-xs text-stone-400 mt-1">A label like &quot;6/8/2026&quot; shown with the declaration.</p>
            </div>

            {/* Prayer text */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#0D4A35] mb-1.5">Declaration / Prayer Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                placeholder="Enter the pastor's prayer for today..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C8E63A]/30 resize-none font-serif text-base leading-relaxed"
              />
            </div>

            {/* Published toggle */}
            <div className="mb-5 flex items-center gap-3">
              <button
                onClick={() => setPublished(!published)}
                className={`relative w-12 h-6 rounded-full transition-colors ${published ? "bg-[#0D4A35]" : "bg-stone-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${published ? "translate-x-6" : ""}`}
                />
              </button>
              <span className="text-sm font-medium text-[#0D4A35]">
                {published ? "Published — visible on website" : "Draft — not visible"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0D4A35] hover:bg-[#0B2C22] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Update Declaration" : "Create Declaration"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* Seed button (only shows if no declarations) */}
          {declarations.length === 0 && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center">
              <p className="text-amber-800 text-sm mb-3">No declarations yet. Seed the initial Pastor&apos;s prayer to get started.</p>
              <button
                onClick={handleSeed}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Seed Initial Declaration
              </button>
            </div>
          )}

          {/* Existing declarations list */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0D4A35] mb-4">All Declarations</h3>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-[#C8E63A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-stone-400">Loading declarations…</p>
              </div>
            ) : declarations.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">No declarations created yet.</p>
            ) : (
              <div className="space-y-3">
                {declarations.map((d) => (
                  <div
                    key={d.id}
                    className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-all ${
                      d.published ? "border-[#0D4A35] shadow-md ring-1 ring-[#0D4A35]/10" : "border-stone-200"
                    }`}
                  >
                    <img
                      src={d.imageUrl || DEFAULT_PASTOR_IMAGE}
                      alt="Declaration"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {d.published && (
                          <span className="bg-[#0D4A35] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Live
                          </span>
                        )}
                        <span className="text-xs text-stone-400">{d.date || "No date"}</span>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {d.text.split("\n").find((l) => l.trim()) || "Untitled"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {d.published ? (
                        <button
                          onClick={() => handleUnpublish(d)}
                          className="text-xs text-amber-600 hover:text-amber-700 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(d)}
                          className="text-xs text-[#0D4A35] hover:text-[#0B2C22] font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(d)}
                        className="text-xs text-stone-600 hover:text-stone-800 font-medium px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share link helper */}
          {declarations.some((d) => d.published) && (
            <div className="mt-8 bg-[#0D4A35] rounded-2xl p-6 text-center">
              <p className="text-[#C8E63A] text-xs font-bold uppercase tracking-wider mb-2">Shareable Link</p>
              <p className="text-white/80 text-sm mb-3">Share this link — the declaration popup will show immediately on load:</p>
              <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <code className="text-[#C8E63A] text-xs sm:text-sm truncate">
                  {typeof window !== "undefined" ? `${window.location.origin}/?declaration=true` : "https://trinitybaptistchurchilora.vercel.app/?declaration=true"}
                </code>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/?declaration=true`;
                    navigator.clipboard.writeText(link).then(() => {
                      setSuccess("Link copied to clipboard!");
                      setTimeout(() => setSuccess(""), 2000);
                    });
                  }}
                  className="bg-[#C8E63A] text-[#0D4A35] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#D4ED5A] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
