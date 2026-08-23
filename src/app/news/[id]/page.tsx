"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { NewsPost } from "@/types";
import { listPublishedPosts } from "@/lib/news";
import { formatDate } from "@/lib/utils";
import { trackView } from "@/lib/analytics";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<NewsPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<NewsPost[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Compute gallery images from current post (safe before post is loaded — uses optional chaining)
  const galleryImages = post?.images && post.images.length > 1 ? post.images.slice(1) : [];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const nextPhoto = useCallback(() => {
    setLightboxIdx(i => i === null || galleryImages.length === 0 ? i : (i + 1) % galleryImages.length);
  }, [galleryImages.length]);
  const prevPhoto = useCallback(() => {
    setLightboxIdx(i => i === null || galleryImages.length === 0 ? i : (i - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, closeLightbox, nextPhoto, prevPhoto]);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!id) return;

    listPublishedPosts()
      .then((allPosts) => {
        // Look up by slug first, then fall back to ID — so old links keep working
        const found = allPosts.find((p) => p.slug === id) || allPosts.find((p) => p.id === id);
        if (found) {
          setPost(found);
          if (!trackedRef.current) {
            trackedRef.current = true;
            trackView({ collection: "news_posts", docId: found.id, title: found.title });
          }
          // Show 2-3 other recent posts
          const others = allPosts.filter((p) => p.id !== id).slice(0, 3);
          setRecentPosts(others);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load news detail", err);
        setLoading(false);
      });
  }, [id]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "news":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "event":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "announcement":
        return "bg-red-50 text-red-700 border-red-100";
      case "celebration":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-stone-50 text-stone-700 border-stone-100";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
          <p className="text-text-muted font-medium">Loading news article...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-3">Article Not Found</h1>
          <p className="text-text-muted mb-8">The news post you are looking for does not exist or has been unpublished.</p>
          <Link href="/news" className="btn-shine btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to News
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const coverImage = post.images && post.images.length > 0 ? post.images[0] : "/church-building.jpg";
  const additionalImages = galleryImages;

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section */}
      <div className="page-hero pt-20">
        <div className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex flex-col items-center gap-3 mb-6">
              <Link href="/news" className="inline-flex items-center gap-1 text-accent hover:text-white transition-colors text-xs sm:text-sm font-semibold">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to News
              </Link>
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${getCategoryColor(post.category)}`}>
                {post.category}
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.date || post.publishedAt || post.createdAt || "")}
              </span>
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  By {post.author}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Cover — Video if featuredVideo is checked, otherwise image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl mb-12 aspect-video bg-stone-100">
            {post.featuredVideo && post.videoUrl ? (
              <video src={post.videoUrl} controls className="w-full h-full object-contain" />
            ) : (
              <img src={coverImage} alt={post.title} className="w-full h-full object-contain img-zoom" />
            )}
          </div>

          {/* Excerpt — lead paragraph */}
          {post.excerpt && (
            <p className="mb-8 text-stone-800 leading-relaxed text-base sm:text-lg font-medium border-l-4 border-accent pl-4 italic">
              {post.excerpt}
            </p>
          )}

          {/* Article Body */}
          <div className="prose max-w-none mb-16">
            {post.body.split("\n\n").map((para, idx) => (
              <p key={idx} className="mb-6 text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Additional Images Grid */}
          {additionalImages.length > 0 && (
            <div className="mb-16">
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">Gallery</h2>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIdx(idx)}
                    className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-stone-100 group cursor-pointer"
                  >
                    <img src={img} alt={`${post.title} gallery ${idx + 1}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Lightbox */}
          {lightboxIdx !== null && additionalImages.length > 0 && (
            <div
              className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image + arrows */}
              <div className="relative flex items-center justify-center w-full max-w-5xl" onClick={e => e.stopPropagation()}>
                {additionalImages.length > 1 && (
                  <button
                    onClick={prevPhoto}
                    className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors mr-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <img
                  src={additionalImages[lightboxIdx]}
                  alt={`${post.title} gallery ${lightboxIdx + 1}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />

                {additionalImages.length > 1 && (
                  <button
                    onClick={nextPhoto}
                    className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Counter */}
              <p className="text-white/40 text-sm mt-3 text-center">
                {lightboxIdx + 1} / {additionalImages.length}
              </p>

              {/* Thumbnail strip */}
              {additionalImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1 max-w-xl" onClick={e => e.stopPropagation()}>
                  {additionalImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIdx ? "border-accent scale-110" : "border-white/20 opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Share Section */}
          <div className="border-t border-b border-stone-100 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-primary">Share this post</h3>
                <p className="text-text-muted text-sm mt-1">Spread the word and inspire others with this update.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LikeButton collection="news_posts" docId={post.id} initialCount={(post as { likeCount?: number }).likeCount ?? 0} />
              <ShareButton
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={post.title}
                label="Share Post"
              />
            </div>
          </div>

          {/* Comments */}
          <CommentSection postId={post.id} postTitle={post.title} />

          {/* More from Trinity Baptist */}
          {recentPosts.length > 0 && (
            <div className="border-t border-stone-100 pt-16">
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-8 text-center leading-tight">More from Trinity Baptist Church Ilora</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {recentPosts.map((other) => {
                  const otherCover = other.images && other.images.length > 0 ? other.images[0] : "/church-building.jpg";
                  return (
                    <Link
                      key={other.id}
                      href={`/news/${other.slug || other.id}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-100 transition-all duration-300 h-full"
                    >
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        <img src={otherCover} alt={other.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-primary border border-stone-100`}>
                          {other.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-text-muted text-[11px] font-medium mb-1.5">{formatDate(other.date || other.publishedAt || "")}</p>
                          <h4 className="font-serif font-bold text-primary text-sm sm:text-base line-clamp-2 group-hover:text-primary-light transition-colors">
                            {other.title}
                          </h4>
                        </div>
                        <p className="text-accent hover:text-primary-dark transition-colors font-semibold text-xs mt-3 inline-flex items-center gap-1">
                          Read More
                          <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
