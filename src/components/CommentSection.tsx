"use client";

import { useState, useEffect, useCallback } from "react";
import { listCommentsForPost, createComment } from "@/lib/comments";
import { Comment } from "@/types";

interface Props {
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postId, postTitle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    const items = await listCommentsForPost(postId);
    setComments(items);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createComment({
        postId,
        name: name.trim(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        hidden: false,
      });
      setText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadComments();
    } catch (err) {
      console.error("Failed to post comment", err);
      setError("Could not post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="border-t border-stone-100 pt-12">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
        Comments
      </h2>
      <p className="text-text-muted text-sm mb-8">
        Share your thoughts on &ldquo;{postTitle}&rdquo;
      </p>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
              maxLength={60}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">
              Comment *
            </label>
            <textarea
              required
              value={text}
              onChange={e => setText(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="Write your comment..."
              maxLength={500}
            />
            <p className="text-[11px] text-text-muted mt-1 text-right">{text.length}/500</p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Comment posted! Thank you for sharing.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !text.trim()}
            className="btn-shine btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-text-muted text-sm">No comments yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm text-primary">{c.name}</span>
                    <span className="text-[11px] text-text-muted">{formatRelative(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line break-words">
                    {c.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
