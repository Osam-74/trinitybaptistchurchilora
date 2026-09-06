"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import { getArticleById } from "@/lib/posts";
import { trackView } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import { Post } from "@/types";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getArticleById(id).then(a => {
      setArticle(a);
      setLoading(false);
      if (a) {
        trackView({ collection: "faith_articles", docId: a.id, title: a.title });
      }
    }).catch(() => setLoading(false));
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="page-hero pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-accent uppercase tracking-widest mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.25a.75.75 0 00-.966 0L2.25 8.25a.75.75 0 000 1.097l.42.38H3.5v6.998c0 .414.336.75.75.75h4.5v-5.25h2.5v5.25h4.5a.75.75 0 00.75-.75V8.63h.83l.42-.38a.75.75 0 000-1.097l-7.18-6a.75.75 0 00-.966-.38z"/></svg>
            Spiritual Nourishment
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
            {loading ? (
              <span className="inline-block w-64 h-10 rounded-xl bg-white/10 animate-pulse align-middle" />
            ) : (
              article?.title || "Article"
            )}
          </h1>
          {article?.scripture && (
            <p className="text-accent text-sm font-semibold italic mt-4">
              &ldquo;{article.scripture}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-stone-100 rounded-full w-full" />)}
            </div>
          ) : !article ? (
            <div className="text-center py-16">
              <p className="text-text-muted mb-4">Sorry, this article could not be found or is no longer published.</p>
              <Link href="/" className="text-accent font-semibold hover:text-primary transition-colors">← Back to Homepage</Link>
            </div>
          ) : (
            <>
              {/* Meta row — author, date, share, like */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {(article.authorName || "TBC").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary leading-tight">{article.authorName || "Trinity Baptist Church"}</p>
                    {article.createdAt && (
                      <p className="text-xs text-text-muted">{formatDate(article.createdAt)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <LikeButton collection="faith_articles" docId={article.id} initialCount={article.likeCount ?? 0} size="sm" />
                  <ShareButton
                    url={shareUrl}
                    title={article.title}
                    label="Share"
                    className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Body */}
              <article className="text-[15px] md:text-base leading-relaxed text-stone-700">
                <div className="whitespace-pre-wrap">{article.body}</div>
              </article>

              {/* Bottom share CTA */}
              <div className="mt-10 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link href="/" className="text-sm font-semibold text-accent hover:text-primary transition-colors">
                  ← Back to Homepage
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-medium">Blessed by this? Share it:</span>
                  <ShareButton url={shareUrl} title={article.title} label="Share Article"
                    className="px-4 py-2 rounded-xl bg-accent text-primary-dark font-bold hover:bg-accent-light transition-colors text-xs" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
