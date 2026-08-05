/**
 * Analytics — tracks views for sermons, news posts, and faith articles.
 * Stores individual view events in Firestore at /content_views/{id}.
 * Also provides aggregate stats for the admin dashboard.
 */

import {
  collection, addDoc, getDocs, query, orderBy, limit,
  serverTimestamp, doc, getDoc, increment, updateDoc, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ContentType = "sermons" | "news_posts" | "posts";

export interface ContentView {
  id: string;
  collection: ContentType;
  docId: string;
  title: string;
  viewedAt: string;
  referrer?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  sermonViews: number;
  newsViews: number;
  postViews: number;
  topContent: { title: string; collection: ContentType; docId: string; views: number }[];
  recentViews: ContentView[];
  last7Days: { date: string; views: number }[];
}

/**
 * Track a single view event.
 * Called from public pages when a user opens a sermon, news post, or article.
 */
export async function trackView(opts: {
  collection: ContentType;
  docId: string;
  title: string;
  referrer?: string;
}): Promise<void> {
  try {
    if (!db) return;

    // 1) Write the individual view event
    await addDoc(collection(db, "content_views"), {
      collection: opts.collection,
      docId: opts.docId,
      title: opts.title,
      referrer: opts.referrer || "",
      viewedAt: serverTimestamp(),
    });

    // 2) Increment the viewCount field on the document itself (for quick display)
    const docRef = doc(db, opts.collection, opts.docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentCount = (data.viewCount as number) || 0;
      await updateDoc(docRef, { viewCount: currentCount + 1 });
    }
  } catch (err) {
    // Silently fail — analytics should never break the page
    console.error("[analytics] trackView failed:", err);
  }
}

/**
 * Get the full analytics summary for the admin dashboard.
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!db) return {
    totalViews: 0,
    sermonViews: 0,
    newsViews: 0,
    postViews: 0,
    topContent: [],
    recentViews: [],
    last7Days: [],
  };

  try {
    const snap = await getDocs(collection(db, "content_views"));
    const views: ContentView[] = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        collection: data.collection as ContentType,
        docId: data.docId || "",
        title: data.title || "",
        viewedAt: data.viewedAt instanceof Timestamp ? data.viewedAt.toDate().toISOString() : (data.viewedAt || ""),
        referrer: data.referrer || "",
      };
    });

    const sermonViews = views.filter(v => v.collection === "sermons").length;
    const newsViews = views.filter(v => v.collection === "news_posts").length;
    const postViews = views.filter(v => v.collection === "posts").length;

    // Top content by view count
    const viewMap = new Map<string, { title: string; collection: ContentType; docId: string; views: number }>();
    for (const v of views) {
      const key = `${v.collection}/${v.docId}`;
      const existing = viewMap.get(key);
      if (existing) {
        existing.views++;
      } else {
        viewMap.set(key, { title: v.title, collection: v.collection, docId: v.docId, views: 1 });
      }
    }
    const topContent = Array.from(viewMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Recent views (last 20)
    const recentViews = views
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
      .slice(0, 20);

    // Last 7 days breakdown
    const now = new Date();
    const last7Days: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStr = day.toISOString().split("T")[0];
      const dayViews = views.filter(v => v.viewedAt && v.viewedAt.split("T")[0] === dayStr).length;
      last7Days.push({ date: dayStr, views: dayViews });
    }

    return {
      totalViews: views.length,
      sermonViews,
      newsViews,
      postViews,
      topContent,
      recentViews,
      last7Days,
    };
  } catch (err) {
    console.error("[analytics] getAnalyticsSummary failed:", err);
    return {
      totalViews: 0,
      sermonViews: 0,
      newsViews: 0,
      postViews: 0,
      topContent: [],
      recentViews: [],
      last7Days: [],
    };
  }
}

/**
 * Get per-item view counts for a specific collection (for admin listing pages).
 * Returns a map of docId → viewCount.
 */
export async function getViewCounts(collectionName: ContentType): Promise<Record<string, number>> {
  if (!db) return {};
  try {
    const snap = await getDocs(collection(db, "content_views"));
    const counts: Record<string, number> = {};
    snap.docs.forEach(d => {
      const data = d.data();
      if (data.collection === collectionName) {
        const docId = data.docId || "";
        counts[docId] = (counts[docId] || 0) + 1;
      }
    });
    return counts;
  } catch {
    return {};
  }
}
