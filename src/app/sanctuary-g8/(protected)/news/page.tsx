"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import R2Uploader from "@/components/R2Uploader";
import { listAllPosts, createPost, updatePost, deletePost } from "@/lib/news";
import { NewsPost } from "@/types";
import { formatDate } from "@/lib/utils";

const emptyForm: Omit<NewsPost, "id"> = {
  title: "",
  category: "news",
  date: "",
  excerpt: "",
  body: "",
  images: [],
  videoUrl: "",
  featuredVideo: false,
  featured: false,
  active: true,
  author: "",
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [form, setForm] = useState<Omit<NewsPost, "id">>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    listAllPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("[news] Load failed:", err);
        setError("Failed to load news posts.");
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSeedAnniversary = async () => {
    if (!confirm("This will create the 28th Wedding Anniversary post for Rev. Dr. & Mrs. S. O. Mosebolatan with the uploaded photos. Continue?")) return;
    setSaving(true);
    setError("");
    try {
      const now = new Date().toISOString();
      await createPost({
        title: "Celebrating 28 Years of Marriage: Rev. Dr. & Mrs. S. O. Mosebolatan",
        category: "celebration",
        excerpt: "Trinity Baptist Church, Ilora rejoices with our Senior Pastor, Rev. Dr. Solomon Olugbenga Mosebolatan, and his beloved wife as they celebrate 28 years of God's faithfulness in their marriage. We thank God for life, mercies, growth, and increase. May God continue to help your home.",
        body: [
          "It is with great joy and gratitude to God Almighty that Trinity Baptist Church, Ilora celebrates twenty-eight (28) glorious years of marriage with our Senior Pastor, Rev. Dr. Solomon Olugbenga Mosebolatan, and his beloved wife, Mrs. Mosebolatan.",
          "",
          "Twenty-eight years of marriage is no small milestone. It is a testament to the grace, faithfulness, and enduring love of God who has been the anchor of their home. Through seasons of joy and seasons of trial, through growth and change, they have remained steadfast in their commitment to one another and to the calling God placed on their lives.",
          "",
          "A MARRIAGE BUILT ON CHRIST",
          "",
          "Rev. Dr. Mosebolatan and his wife have modelled what it means to build a Christ-centred home. Their union has not only produced a beautiful family but has also been a source of inspiration and encouragement to the congregation and the wider community. They have shown us that when Christ is the foundation, love grows deeper with each passing year.",
          "",
          "WE THANK GOD",
          "",
          "We thank God for:",
          "- Life: for keeping them in good health and strength",
          "- Mercies: for His unfailing compassion and grace over their home",
          "- Growth: for how they have grown together in love, wisdom, and faith",
          "- Increase: for the fruit of their marriage and the lives they have touched",
          "",
          "A PRAYER FOR THE COUPLE",
          "",
          "As we celebrate this milestone, we pray that God Almighty will continue to strengthen their marriage, bless their home, and use them even more for His glory. May the Lord grant them many more years of joy, peace, and fruitful ministry together. May their love continue to be a shining light to all who know them.",
          "",
          "We, the Trinity Baptist Church family, are grateful for your leadership, your example, and your love for God's people. Happy 28th Wedding Anniversary, Papa and Mama!",
          "",
          "With love and prayers, Trinity Baptist Church, Ilora.",
        ].join("\n"),
        images: [
          "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048734902_pastor-anniversary-1.jpg",
          "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048738448_pastor-anniversary-2.jpg",
          "https://pub-2d440e1ef61e471c8b8f495fbe5a0298.r2.dev/session-files/news-events/1785048741602_pastor-family.jpg",
        ],
        date: now,
        publishedAt: now,
        active: true,
        featured: true,
        author: "Trinity Baptist Church",
        tags: ["anniversary", "celebration", "marriage", "pastor"],
      } as Omit<NewsPost, "id">);
      alert("Anniversary post created successfully!");
      load();
    } catch (err) {
      setError(`Failed to seed post: ${(err as { message?: string })?.message || "unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    const today = new Date().toISOString().split("T")[0];
    setForm({ ...emptyForm, date: today });
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: NewsPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      category: p.category,
      date: p.date,
      excerpt: p.excerpt,
      body: p.body,
      images: p.images || [],
      videoUrl: p.videoUrl || "",
      featuredVideo: p.featuredVideo ?? false,
      featured: p.featured ?? false,
      active: p.active ?? true,
      author: p.author || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.category) {
      setError("Category is required.");
      return;
    }
    if (!form.date) {
      setError("Date is required.");
      return;
    }
    if (!form.excerpt.trim()) {
      setError("Excerpt is required.");
      return;
    }
    if (!form.body.trim()) {
      setError("Body is required.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updatePost(editing.id, form);
      } else {
        await createPost(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    setError("");
    try {
      await deletePost(id);
      load();
    } catch (err) {
      console.error("[news] Delete failed:", err);
      setError(`Couldn't delete post: ${(err as { message?: string })?.message || "unknown error"}`);
    }
  };

  const toggleActive = async (post: NewsPost) => {
    setError("");
    try {
      await updatePost(post.id, { active: !post.active });
      load();
    } catch (err) {
      console.error("[news] Toggle active failed:", err);
      setError(`Couldn't update visibility: ${(err as { message?: string })?.message || "unknown error"}`);
    }
  };

  const toggleFeatured = async (post: NewsPost) => {
    setError("");
    try {
      await updatePost(post.id, { featured: !post.featured });
      load();
    } catch (err) {
      console.error("[news] Toggle featured failed:", err);
      setError(`Couldn't update featured status: ${(err as { message?: string })?.message || "unknown error"}`);
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "news":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "event":
        return "bg-green-50 text-green-700 border-green-200";
      case "announcement":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "celebration":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <AdminShell>
      <div>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-lg font-bold text-primary">Latest News & Events</h1>
              <p className="text-text-muted text-sm mt-1">
                Manage announcements, events, celebrations, and news posts shown on the website
              </p>
            </div>
            <button
              onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Post
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center min-h-[30vh]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
                <p className="text-stone-400 text-sm">Loading posts…</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-text-muted shadow-sm">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M9 11h6m-6 4h6m2-8a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-primary mb-1">No posts found</h3>
              <p className="text-xs text-text-muted mb-4">Click &ldquo;Add Post&rdquo; to create your first update, or seed the anniversary post below.</p>
              <button onClick={handleSeedAnniversary} disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-accent/40 text-accent hover:bg-accent/10 transition-all disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                {saving ? "Seeding…" : "Seed Anniversary Post"}
              </button>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Cover image thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                      {post.images && post.images.length > 0 ? (
                        <img src={post.images[0]} alt={post.title} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${getCategoryStyles(post.category)}`}>
                          {post.category}
                        </span>
                        {post.videoUrl && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-100 text-purple-800 border border-purple-200 shadow-sm flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                            Video
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm flex items-center gap-1">
                            <svg className="w-2.5 h-2.5 fill-yellow-600" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Hidden overlay */}
                      {!post.active && (
                        <div className="absolute inset-0 bg-stone-950/50 flex items-center justify-center">
                          <span className="text-white text-xs font-bold uppercase tracking-wider bg-stone-800/90 border border-stone-700 px-3 py-1 rounded-full shadow-lg">
                            Hidden
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
                        {post.date ? formatDate(post.date) : "No Date"}
                      </p>
                      <h3 className="font-serif text-base font-bold text-primary line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      {post.author && (
                        <p className="text-xs text-primary-light font-medium">By {post.author}</p>
                      )}
                      <p className="text-text-muted text-xs leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-stone-50">
                    {/* Toggles */}
                    <div className="flex gap-2 mb-3 mt-3">
                      <button
                        onClick={() => toggleActive(post)}
                        className={`flex-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-colors flex items-center justify-center gap-1
                          ${post.active ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100" : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15"}`}
                      >
                        {post.active ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                            Hide
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Show
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => toggleFeatured(post)}
                        className={`flex-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-colors flex items-center justify-center gap-1
                          ${post.featured ? "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"}`}
                      >
                        <svg className={`w-3.5 h-3.5 ${post.featured ? "fill-yellow-600 text-yellow-600" : "text-stone-400"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {post.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>

                    {/* Edit/Delete actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-200 hover:border-accent/50 hover:bg-accent/5 text-primary transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide-in form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <div className="pointer-events-auto w-screen max-w-xl transform bg-white shadow-2xl transition-all duration-300 ease-in-out">
                    <div className="flex h-full flex-col justify-between">
                      {/* Header */}
                      <div className="flex h-16 items-center justify-between px-6 border-b border-stone-100 bg-stone-50">
                        <h2 className="font-serif text-lg font-bold text-primary">
                          {editing ? "Edit News Post" : "Add News Post"}
                        </h2>
                        <button
                          onClick={() => setShowForm(false)}
                          className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Scrollable Form Body */}
                      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                            {error}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Title *</label>
                          <input
                            type="text"
                            required
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="input-field"
                            placeholder="e.g. Annual Youth Convention 2026"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Category *</label>
                            <select
                              required
                              value={form.category}
                              onChange={e => setForm(p => ({ ...p, category: e.target.value as NewsPost["category"] }))}
                              className="input-field bg-white"
                            >
                              <option value="news">News</option>
                              <option value="event">Event</option>
                              <option value="announcement">Announcement</option>
                              <option value="celebration">Celebration</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Date *</label>
                            <input
                              type="date"
                              required
                              value={form.date}
                              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Excerpt * (~100 words - shown on homepage cards)</label>
                          <textarea
                            required
                            value={form.excerpt}
                            onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Briefly describe this post..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Body Content * (Full details)</label>
                          <textarea
                            required
                            value={form.body}
                            onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                            rows={6}
                            className="input-field resize-none"
                            placeholder="Write the full content..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Images</label>
                          {form.images && form.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {form.images.map((url, index) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 group bg-stone-100">
                                  <img src={url} alt={`Post Image ${index + 1}`} className="w-full h-full object-contain" />
                                  <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }))}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <R2Uploader
                            folder="news-events"
                            label={form.images.length > 0 ? "Add Another Image" : "Upload Post Image"}
                            onUploaded={(url) => setForm(p => ({ ...p, images: [...p.images, url] }))}
                          />
                        </div>

                        {/* Video Upload */}
                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Video (optional max 100MB)</label>
                          {form.videoUrl && (
                            <div className="mb-3 flex items-center gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-700 truncate">Video attached</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setForm(p => ({ ...p, videoUrl: "" }))}
                                className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                              </button>
                            </div>
                          )}
                          <R2Uploader
                            folder="news-events"
                            accept="video/*"
                            maxMB={100}
                            label={form.videoUrl ? "Replace Video" : "Upload Video"}
                            onUploaded={(url) => setForm(p => ({ ...p, videoUrl: url }))}
                          />
                        </div>

                        {/* Featured Video Checkbox — only shown when video is attached */}
                        {form.videoUrl && (
                          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl p-3">
                            <input
                              type="checkbox"
                              id="featuredVideo"
                              checked={form.featuredVideo}
                              onChange={e => setForm(p => ({ ...p, featuredVideo: e.target.checked }))}
                              className="w-4 h-4 rounded border-purple-300 accent-purple-600"
                            />
                            <label htmlFor="featuredVideo" className="text-sm text-primary font-semibold cursor-pointer select-none">
                              Use video as featured content
                            </label>
                            <span className="text-xs text-purple-500 ml-auto">When checked, video replaces the first image as the post thumbnail</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="featured"
                              checked={form.featured}
                              onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                              className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                            />
                            <label htmlFor="featured" className="text-sm text-primary font-semibold cursor-pointer select-none">
                              Featured Post
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="active"
                              checked={form.active}
                              onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                              className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                            />
                            <label htmlFor="active" className="text-sm text-primary font-semibold cursor-pointer select-none">
                              Active / Visible
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Author (Optional)</label>
                          <input
                            type="text"
                            value={form.author}
                            onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                            className="input-field"
                            placeholder="e.g. Media Team, Pastor Solomon"
                          />
                        </div>

                        <div className="border-t border-stone-100 pt-5 bg-white flex gap-3">
                          <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 btn-gold py-2.5 rounded-xl font-semibold disabled:opacity-55"
                          >
                            {saving ? "Saving..." : (editing ? "Save Changes" : "Create Post")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2.5 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
