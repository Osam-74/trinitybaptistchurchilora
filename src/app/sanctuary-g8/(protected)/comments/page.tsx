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
          <div className="w-10 h-10 rounded-full border-4 border-[#C8E63A]/30 border-t-[#C8E63A] animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#C8E63A]">
            Comment Moderation
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Review, hide, or delete comments on news posts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{comments.length}</p>
            <p className="text-xs text-white/50 mt-1">Total Comments</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-400">{visibleCount}</p>
            <p className="text-xs text-white/50 mt-1">Visible</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-400">{hiddenCount}</p>
            <p className="text-xs text-white/50 mt-1">Hidden</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            {(["all", "visible", "hidden"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  filter === f
                    ? "bg-[#C8E63A] text-[#0B2C22]"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={postFilter}
            onChange={e => setPostFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#C8E63A]/50"
          >
            <option value="all" className="bg-[#0B2C22]">All posts</option>
            {Object.values(posts).map(p => (
              <option key={p.id} value={p.id} className="bg-[#0B2C22]">
                {p.title.slice(0, 50)}
              </option>
            ))}
          </select>
        </div>

        {/* Comments list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm">No comments to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`bg-white/5 border rounded-2xl p-5 transition-colors ${
                  c.hidden ? "border-amber-500/30 opacity-60" : "border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C8E63A]/20 flex items-center justify-center text-[#C8E63A] font-bold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-white">{c.name}</span>
                      <span className="text-[11px] text-white/40">{formatRelative(c.createdAt)}</span>
                      {c.hidden && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold uppercase">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Comment text */}
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line break-words mb-3">
                      {c.text}
                    </p>

                    {/* Post reference */}
                    <p className="text-[11px] text-white/40 mb-3">
                      On: <span className="text-[#C8E63A]/70">{getPostTitle(c.postId)}</span>
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleHide(c.id, !!c.hidden)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          c.hidden
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        }`}
                      >
                        {c.hidden ? "Show" : "Hide"}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
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
