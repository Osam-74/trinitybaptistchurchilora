"use client";

import { useState, useEffect } from "react";
import { toggleLike, hasLiked } from "@/lib/likes";

interface LikeButtonProps {
  collection: string;
  docId: string;
  initialCount?: number;
  size?: "sm" | "md";
}

export default function LikeButton({ collection, docId, initialCount = 0, size = "md" }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(hasLiked(docId));
    setCount(initialCount);
  }, [docId, initialCount]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(c => newLiked ? c + 1 : Math.max(0, c - 1));
    try {
      const result = await toggleLike(collection, docId);
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 transition-all ${size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5"} rounded-full font-medium ${
        liked
          ? "bg-accent/15 text-accent hover:bg-accent/20"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      } ${loading ? "opacity-50" : ""}`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        className={`${iconSize} transition-transform ${liked ? "scale-110" : ""}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.965.166-1.335.44a2.99 2.99 0 00-.398.39c-.484.493-1.089.816-1.716 1.003L2 7v13h5m7-10l-2-2m0 0l2 2m-2-2V3a2 2 0 012-2h3a2 2 0 012 2v0M9 13v8" />
      </svg>
      <span className={textSize}>{count > 0 ? count : "Like"}</span>
    </button>
  );
}
