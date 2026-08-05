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
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(c => newLiked ? c + 1 : Math.max(0, c - 1));
    try {
      const result = await toggleLike(collection, docId);
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      setLiked(!newLiked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const pad = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 transition-all ${pad} rounded-full font-medium border ${loading ? "opacity-50" : ""} ${
        liked
          ? "bg-accent/20 text-accent border-accent/30 hover:bg-accent/25"
          : "bg-primary text-white border-primary hover:bg-primary-dark"
      }`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        className={`${iconSize} transition-transform ${liked ? "scale-110" : ""}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 7.59 6.59C7.22 6.95 7 7.45 7 8v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1z"/>
      </svg>
      <span className={textSize}>{count > 0 ? count : "Like"}</span>
    </button>
  );
}
