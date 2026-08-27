"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import { subscribeArticles, createArticle, updateArticle, deleteArticle, seedArticlesIfEmpty } from "@/lib/posts";
import { auth } from "@/lib/firebase";
import { logActivity } from "@/lib/activityLog";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function AdminPostsPage() {
  const currentUser = useCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", body: "", scripture: "",
    mediaType: "text" as Post["mediaType"],
    pinned: false, status: "published" as Post["status"],
  });

  // Subscribe to Firestore + seed defaults on first mount
  useEffect(() => {
    seedArticlesIfEmpty().then(() => {
      const unsub = subscribeArticles((articles) => {
        setPosts(articles);
        setLoading(false);
      });
      return unsub;
    });
  }, []);

  const openNew = () => {
    setEditingPost(null);
    setForm({ title: "", body: "", scripture: "", mediaType: "text", pinned: false, status: "published" });
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({ title: post.title, body: post.body, scripture: post.scripture, mediaType: post.mediaType || "text", pinned: post.pinned, status: post.status });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const authorName = auth?.currentUser?.displayName || "Admin";
      const authorUid = auth?.currentUser?.uid || "admin";
      if (editingPost) {
        await updateArticle(editingPost.id, { ...form });
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: authorName, action: "updated", target: `Article: ${form.title}`, section: "Faith Articles" });
      } else {
        await createArticle({
          ...form, mediaUrl: "", amenCount: 0,
          createdAt: new Date().toISOString(), authorUid, authorName,
        });
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: authorName, action: "created", target: `Article: ${form.title}`, section: "Faith Articles" });
      }
      setShowForm(false);
    } catch (err) {
      alert(`Save failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await deleteArticle(id);
    logActivity({ user: currentUser?.email ?? "unknown", userName: currentUser?.displayName ?? "Admin", action: "deleted", target: "Article", section: "Faith Articles" });
  };

  const togglePin = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) await updateArticle(id, { pinned: !post.pinned });
  };

  const toggleStatus = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) await updateArticle(id, { status: post.status === "published" ? "draft" : "published" });
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_posts"><div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-lg font-bold text-primary">Faith Articles</h1>
              <p className="text-text-muted text-sm mt-1">Manage faith articles and devotional content</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New Article
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              No articles yet. Click &ldquo;New Article&rdquo; to get started.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      {["Article", "Status", "Date", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {post.pinned && (
                              <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            )}
                            <div>
                              <p className="font-semibold text-primary text-sm line-clamp-1">{post.title}</p>
                              <p className="text-text-muted text-xs line-clamp-1 mt-0.5">{post.body.slice(0, 60)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => toggleStatus(post.id)} className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${post.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                            {post.status}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-xs text-text-muted whitespace-nowrap">{formatDate(post.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(post)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-medium hover:bg-primary/15 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                              Edit
                            </button>
                            <button onClick={() => togglePin(post.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${post.pinned ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                              {post.pinned ? "Unpin" : "Pin"}
                            </button>
                            <button onClick={() => handleDelete(post.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="font-serif text-lg font-bold text-primary">{editingPost ? "Edit Article" : "New Article"}</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Title *</label>
                    <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Article title"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Scripture Reference</label>
                    <input value={form.scripture} onChange={e => setForm(p => ({ ...p, scripture: e.target.value }))} className="input-field" placeholder="e.g. John 3:16"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Content *</label>
                    <textarea required rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="input-field resize-none" placeholder="Write your message..."/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Post["status"] }))} className="input-field bg-white">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 accent-amber-600"/>
                    <label htmlFor="pinned" className="text-sm text-primary font-medium cursor-pointer">Pin this article (featured at top)</label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl font-semibold disabled:opacity-50">
                      {saving ? "Saving…" : editingPost ? "Save Changes" : "Publish Article"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div></PermissionGuard>
    </AdminShell>
  );
}
