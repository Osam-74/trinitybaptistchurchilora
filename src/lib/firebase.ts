"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

if (typeof window !== "undefined") {
  const c = firebaseConfig;
  console.log("[Firebase] Config check:", {
    apiKey: c.apiKey ? `${c.apiKey.slice(0, 8)}...` : "❌ MISSING",
    authDomain: c.authDomain || "❌ MISSING",
    projectId: c.projectId || "❌ MISSING",
    storageBucket: c.storageBucket || "(unused — uploads now via Vercel Blob)",
    configured: isFirebaseConfigured,
  });
}

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
// Storage moved to Vercel Blob — see src/lib/r2.ts and /api/upload
