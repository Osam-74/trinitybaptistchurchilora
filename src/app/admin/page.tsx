"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

function friendlyAuthError(code: string, message: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/api-key-not-valid":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "Sign-in is temporarily unavailable. Please contact the site administrator.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    default:
      if (process.env.NODE_ENV === "development") {
        return message || `Couldn't sign in (${code}). Please check your details and try again.`;
      }
      return "Couldn't sign in. Please check your details and try again.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!auth) {
      setError("Sign-in is temporarily unavailable. Please try again shortly or contact the site administrator.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      const message = (err as { message?: string })?.message ?? "";
      setError(friendlyAuthError(code, message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-white font-bold">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Trinity Baptist Church, Ilora</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {!isFirebaseConfigured && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-4 rounded-xl mb-5">
              <p className="font-semibold mb-2">⚠ Firebase environment variables not found</p>
              <p className="text-xs mb-2">The following NEXT_PUBLIC_ vars are required in Vercel (Settings → Environment Variables) for ALL environments:</p>
              <ul className="text-xs space-y-0.5 ml-4 list-disc opacity-80">
                <li>NEXT_PUBLIC_FIREBASE_API_KEY {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅" : "❌ MISSING"}</li>
                <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅" : "❌ MISSING"}</li>
                <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅" : "❌ MISSING"}</li>
                <li>NEXT_PUBLIC_FIREBASE_APP_ID {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅" : "❌ MISSING"}</li>
              </ul>
              <p className="text-xs mt-2 opacity-80">After adding them, redeploy from Vercel Deployments tab.</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-shine w-full py-4 bg-accent text-primary-dark font-semibold rounded-xl hover:bg-accent-dark hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Access is restricted to authorized church staff. Contact the administrator if you need an account.
        </p>
      </div>
    </main>
  );
}
