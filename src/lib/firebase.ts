"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase initialization.
 *
 * NEXT_PUBLIC_FIREBASE_* env vars are inlined by Next.js at BUILD TIME.
 * We try to read them and initialize Firebase. If the vars are missing
 * or contain placeholder values, auth/db will still be created but auth
 * calls will fail with a real Firebase error (which is more helpful than
 * our own "not configured" gate).
 *
 * Common reasons this fails:
 *  1. Env vars in Vercel aren't prefixed with NEXT_PUBLIC_  (required
 *     for client-side access — without it they're server-only)
 *  2. Env var names don't match exactly (case-sensitive)
 *  3. Env vars were added AFTER the last build — trigger a redeploy
 *  4. Env vars are set for "Preview" but you're on the "Production" URL
 *     (or vice versa) — set them for all environments
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if the required values are actually present (not undefined/empty)
// We do NOT gate initialization on this — we always try, and let Firebase
// produce a real error if the config is bad.
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

// Debug: log which vars are visible so the user can check browser console
// (development only — kept quiet in production)
if (typeof window !== "undefined" && !isFirebaseConfigured && process.env.NODE_ENV === "development") {
  console.warn("[Firebase] Missing env vars. Check Vercel Project Settings → Environment Variables.");
  console.warn("[Firebase] Required (all must be prefixed NEXT_PUBLIC_):");
  console.warn("  NEXT_PUBLIC_FIREBASE_API_KEY:", firebaseConfig.apiKey ? "✅ set" : "❌ MISSING");
  console.warn("  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", firebaseConfig.authDomain ? "✅ set" : "❌ MISSING");
  console.warn("  NEXT_PUBLIC_FIREBASE_PROJECT_ID:", firebaseConfig.projectId ? "✅ set" : "❌ MISSING");
  console.warn("  NEXT_PUBLIC_FIREBASE_APP_ID:", firebaseConfig.appId ? "✅ set" : "❌ MISSING");
  console.warn("  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", firebaseConfig.storageBucket ? "✅ set" : "⚠️ optional");
  console.warn("  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", firebaseConfig.messagingSenderId ? "✅ set" : "⚠️ optional");
  console.warn("[Firebase] If vars ARE set in Vercel, make sure they're prefixed with NEXT_PUBLIC_ and redeploy.");
}

// Always try to initialize — even with partial config, Firebase won't
// throw at init time. Auth calls will fail with a clear error instead.
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

if (typeof window !== "undefined") {
  try {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  } catch (err) {
    console.error("[Firebase] Initialization failed:", err);
  }
}

export const auth = _auth;
export const db = _db;
