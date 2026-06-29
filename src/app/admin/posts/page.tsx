"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Post } from "@/types";
import { samplePosts } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts.map((p, _i) => ({ ...p, id: `post-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", body: "", scripture: "", mediaType: "text" as Post["mediaType"], mediaUrl: "", pinned: false, status: "published" as Post["status"] });

  const openNew = () => {
    setEditingPost(null);
    setForm({ title: "", body: "", scripture: "", mediaType: "text", mediaUrl: "", pinned: false, status: "published" });
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({ title: post.title, body: post.body, scripture: post.scripture, mediaType: post.mediaType, mediaUrl: post.mediaUrl || "", pinned: post.pinned, status: post.status });
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...form } : p));
    } else {
      const newPost: Post = { ...form, id: `post-${Date.now()}`, amenCount: 0, createdAt: new Date().toISOString(), authorUid: "admin", authorName: "Admin" };
      setPosts(prev => [newPost, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this post?")) { setPosts(prev => prev.filter(p => p.id !== id)); }
  };

  const togglePin = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p));
  };

  const toggleStatus = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p));
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Posts</h1>
              <p className="text-text-muted text-sm mt-1">Manage pastor messages and announcements</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New Post
            </button>
          </div>

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">{editingPost ? "Edit Post" : "New Post"}</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Title *</label>
                    <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Post title"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Scripture Reference</label>
                    <input value={form.scripture} onChange={e => setForm(p => ({ ...p, scripture: e.target.value }))} className="input-field" placeholder="e.g. John 3:16"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Content *</label>
                    <textarea required rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="input-field resize-none" placeholder="Write your message..."/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Media Type</label>
                      <select value={form.mediaType} onChange={e => setForm(p => ({ ...p, mediaType: e.target.value as Post["mediaType"] }))} className="input-field bg-white">
                        <option value="text">Text only</option>
                        <option value="image">Image</option>
                        <option value="video">YouTube Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Status</label>
                      <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Post["status"] }))} className="input-field bg-white">
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  {form.mediaType !== "text" && (
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Media URL / Cloudflare Link</label>
                      <input value={form.mediaUrl} onChange={e => setForm(p => ({ ...p, mediaUrl: e.target.value }))} className="input-field" placeholder="https://..."/>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="pinned" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 accent-amber-600"/>
                    <label htmlFor="pinned" className="text-sm text-primary font-medium cursor-pointer">Pin this post (featured)</label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 btn-gold py-3 rounded-xl font-semibold">{editingPost ? "Save Changes" : "Publish Post"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Posts table */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {["Post", "Type", "Status", "Date", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, _i) => (
                    <tr key={post.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {post.pinned && (
                            <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                        <span className="px-2.5 py-1 bg-stone-100 text-text-muted text-xs rounded-full capitalize">{post.mediaType}</span>
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
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${post.pinned ? "bg-accent/15 text-accent hover:bg-accent/25" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                            {post.pinned ? "Unpin" : "Pin"}
                          </button>
                          <button onClick={() => handleDelete(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors">
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
        </div>
      </main>
    </div>
  );
}
