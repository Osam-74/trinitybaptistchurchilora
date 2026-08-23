"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";
import { listAllComments, deleteComment, toggleCommentVisibility } from "@/lib/comments";
import { listPublishedPosts } from "@/lib/news";
import { Comment, NewsPost } from "@/types";

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Record<string, NewsPost>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [postFilter, setPostFilter] = useState<string>("all");

  const loadData = useCallback(async () => {
    const [allComments, allPosts] = await Promise.all([
      listAllComments(),
      listPublishedPosts(),
    ]);
    setComments(allComments);
    const postMap: Record<string, NewsPost> = {};
    allPosts.forEach(p => { postMap[p.id] = p; });
    setPosts(postMap);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    await deleteComment(id);
    await loadData();
  };

  const handleToggleHide = async (id: string, hidden: boolean) => {
    await toggleCommentVisibility(id, !hidden);
    await loadData();
  };

  const formatRelative = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getPostTitle = (postId: string) => {
    const p = posts[postId];
    return p ? p.title : "Unknown post";
  };

  const filtered = comments.filter(c => {
    if (filter === "visible" && c.hidden) return false;
    if (filter === "hidden" && !c.hidden) return false;
    if (postFilter !== "all" && c.postId !== postFilter) return false;
    return true;
  });

  const hiddenCount = comments.filter(c => c.hidden).length;
  const visibleCount = comments.filter(c => !c.hidden).length;

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Comment Moderation
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Review, hide, or delete comments on news posts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary">{comments.length}</p>
            <p className="text-xs text-text-muted mt-1">Total Comments</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{visibleCount}</p>
            <p className="text-xs text-text-muted mt-1">Visible</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-500">{hiddenCount}</p>
            <p className="text-xs text-text-muted mt-1">Hidden</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            {(["all", "visible", "hidden"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  filter === f
                    ? "bg-accent text-primary"
                    : "bg-stone-100 text-text-muted hover:bg-stone-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={postFilter}
            onChange={e => setPostFilter(e.target.value)}
            className="bg-white border border-stone-200 text-primary text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="all">All posts</option>
            {Object.values(posts).map(p => (
              <option key={p.id} value={p.id}>
                {p.title.slice(0, 50)}
              </option>
            ))}
          </select>
        </div>

        {/* Comments list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-xl">
            <p className="text-text-muted text-sm">No comments to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`bg-white border rounded-xl p-4 sm:p-5 shadow-sm transition-colors ${
                  c.hidden ? "border-amber-300 bg-amber-50/40" : "border-stone-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-primary">{c.name}</span>
                      <span className="text-[11px] text-text-muted">{formatRelative(c.createdAt)}</span>
                      {c.hidden && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold uppercase">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Comment text */}
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line break-words mb-3">
                      {c.text}
                    </p>

                    {/* Post reference */}
                    <p className="text-[11px] text-text-muted mb-3">
                      On: <span className="text-primary/70 font-medium">{getPostTitle(c.postId)}</span>
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleHide(c.id, !!c.hidden)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          c.hidden
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {c.hidden ? "Show" : "Hide"}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
