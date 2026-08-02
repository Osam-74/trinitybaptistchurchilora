"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { NewsPost } from "@/types";
import { listPublishedPosts } from "@/lib/news";
import { formatDate } from "@/lib/utils";

const categories = ["all", "news", "event", "announcement", "celebration"] as const;

export default function NewsListingPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listPublishedPosts()
      .then((data) => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load news posts", err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6 4h2" />
              </svg>
              NEWS & EVENTS
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Latest <br/><span className="text-gradient-gold">Updates</span>
            </h1>
            <p className="text-white/60 text-lg lg:text-xl animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Stay connected and updated with the latest news, announcements, and events at Trinity Baptist Church, Ilora.
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Category Filter + Search */}
      <section className="py-8 bg-bg-alt border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-5 py-2.5 pl-11 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
              <svg
                className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* Listing Grid */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
              <p className="text-text-muted font-medium">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.433-.135-3.62m-14.73 0a40.06 40.06 0 010 7.24m14.73-3.62A40.11 40.11 0 0112 15c-3.11 0-6.111-.312-9.014-.913m18.028-2.087a38.42 38.42 0 00-1.026-6.142m0 0c-.122-.45-.307-.87-.55-1.246a4.125 4.125 0 00-3.35-1.85c-.118 0-.235.003-.35.01a40.05 40.05 0 00-8.835 0c-.115-.007-.232-.01-.35-.01a4.125 4.125 0 00-3.35 1.85c-.243.376-.428.796-.55 1.246a38.412 38.412 0 00-1.026 6.142m14.73 3.62c.089 1.187.135 2.388.135 3.62m0 0c0 .18-.005.359-.015.538a4.125 4.125 0 01-1.353 2.923c-.768.675-1.748 1.055-2.774 1.055a40.147 40.147 0 01-10.468 0 4.125 4.125 0 01-4.127-3.978A39.9 39.9 0 013 15.62m0 0V12m0 0h16.5" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary mb-2">No Articles Found</h3>
              <p className="text-text-muted mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "We couldn't find any articles matching your search filters. Try adjusting them!"
                  : "We haven't published any news or events yet. Check back soon for updates!"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="btn-shine btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const coverImage = post.images && post.images.length > 0 ? post.images[0] : "/church-building.jpg";
                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-100 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Cover image & Category badge */}
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      <img
                        src={coverImage}
                        alt={post.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-primary border border-stone-100 ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        {post.videoUrl && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1 shadow-sm">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            Video
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(post.date || post.publishedAt || post.createdAt || "")}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-primary leading-snug group-hover:text-primary-light transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt || post.body.slice(0, 120) + "..."}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                        {post.author ? (
                          <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                            <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {post.author}
                          </span>
                        ) : (
                          <div />
                        )}
                        <div className="flex items-center gap-3">
                          <ShareButton
                            url={typeof window !== 'undefined' ? window.location.origin + '/news/' + post.id : '/news/' + post.id}
                            title={post.title}
                          />
                          <Link
                            href={`/news/${post.id}`}
                            className="btn-shine text-accent hover:text-primary-dark font-bold text-sm inline-flex items-center gap-1 group/btn"
                          >
                            Read More
                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
