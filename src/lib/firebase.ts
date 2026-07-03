"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase initialization.
 *
 * NEXT_PUBLIC_FIREBASE_* env vars are inlined by Next.js at BUILD TIME.
 * If they're not set (e.g., local dev, build env without secrets), we
 * fall back to a syntactically-valid placeholder config so the build
 * doesn't crash. Real auth/data calls will simply fail until proper
 * credentials are added.
 *
 * Only initialize on the client to avoid SSR issues — Firebase Auth
 * and Firestore are client-side SDKs here.
 */

const requiredEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export const isFirebaseConfigured = requiredEnvKeys.every(
  (key) => !!process.env[key] && process.env[key] !== ""
);

const firebaseConfig = isFirebaseConfigured
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
  : {
      // Placeholder — prevents build crashes, never used for real auth/data
      apiKey: "AIzaSyDPLACEHOLDER00000000000000000000",
      authDomain: "placeholder-not-configured.firebaseapp.com",
      projectId: "placeholder-not-configured",
      storageBucket: "placeholder-not-configured.firebasestorage.app",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:0000000000000000000000",
    };

// Initialize on the client only
let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

if (typeof window !== "undefined") {
  try {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  } catch (err) {
    console.error("[Firebase] Initialization failed:", err);
  }
}

export const auth = _auth as ReturnType<typeof getAuth>;
export const db = _db as ReturnType<typeof getFirestore>;
