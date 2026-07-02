"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Real project config comes from Vercel environment variables (Project
 * Settings → Environment Variables), all prefixed NEXT_PUBLIC_FIREBASE_*.
 *
 * If those aren't set yet (e.g. before the church has connected Firebase),
 * we fall back to a syntactically-valid placeholder config instead of
 * throwing. This is what actually matters here: with a real invalid/missing
 * key, `getAuth()` throws immediately at import time — and because this file
 * is imported by Navbar/Footer/the auth guard (used on nearly every page),
 * that exception used to crash the ENTIRE production build, taking the whole
 * site down instead of just leaving login/admin features inactive.
 *
 * With the fallback below, the site builds and runs normally; only actual
 * sign-in attempts will fail (with a clear message) until real credentials
 * are added.
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
      // Placeholder only — never used for real auth/data. Prevents build
      // crashes when real env vars aren't configured yet.
      apiKey: "AIzaSyDPLACEHOLDER00000000000000000000",
      authDomain: "placeholder-not-configured.firebaseapp.com",
      projectId: "placeholder-not-configured",
      storageBucket: "placeholder-not-configured.firebasestorage.app",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:0000000000000000000000",
    };

if (!isFirebaseConfigured && typeof window !== "undefined") {
  console.warn(
    "[firebase] NEXT_PUBLIC_FIREBASE_* environment variables are not set. " +
      "Admin login and Firestore-backed content (hymns, settings) won't work " +
      "until they're added in Vercel → Project Settings → Environment Variables."
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
