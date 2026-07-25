"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email": return "That doesn't look like a valid email address.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password": return "Invalid email or password. Please try again.";
    case "auth/too-many-requests": return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed": return "Network error. Check your connection and try again.";
    default: return "Couldn't sign in. Please check your credentials and try again.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!auth) { setError("Sign-in is temporarily unavailable. Please contact the site administrator."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      setError(friendlyAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-stretch bg-[#F4F6F3]">

      {/* Left — Church Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#0B2C22] flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,230,58,0.08),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0D4A35] rounded-full filter blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-0 w-48 h-48 bg-[#C8E63A]/5 rounded-full filter blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo/trinity-logo.png" alt="TBC Logo" className="w-10 h-10 rounded-full object-cover shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div>
            <p className="text-white font-bold text-sm">Trinity Baptist Church</p>
            <p className="text-[#C8E63A] text-[10px] uppercase tracking-widest">Ilora, Oyo State</p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="w-16 h-20 mb-8 opacity-20">
            <svg viewBox="0 0 48 60" fill="currentColor" className="text-[#C8E63A] w-full h-full">
              <rect x="20" y="0" width="8" height="60" rx="4"/>
              <rect x="0" y="16" width="48" height="8" rx="4"/>
            </svg>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Welcome Back,<br/><span style={{ color: '#C8E63A' }}>Admin</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Manage your congregation, media, ministries, and more — all in one place.
          </p>
          <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <p className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2">Scripture</p>
            <p className="text-white/85 text-base italic leading-relaxed font-serif">
              &ldquo;Whatever you do, work at it with all your heart, as working for the Lord.&rdquo;
            </p>
            <p className="text-[#C8E63A] text-xs font-bold mt-2">— Colossians 3:23</p>
          </div>
        </div>

        <div className="relative z-10 text-white/30 text-xs">
          © {new Date().getFullYear()} Trinity Baptist Church, Ilora
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-3 mb-10">
            <img src="/logo/trinity-logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div>
              <p className="font-bold text-[#0B2C22] text-sm">Trinity Baptist Church</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Ilora, Oyo State</p>
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#0B2C22] mb-2">Admin Portal</h2>
          <p className="text-stone-500 text-sm mb-8">Sign in to access your church management dashboard.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trinitybaptistilora.org"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2C22] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#0D4A35] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPass
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-[#0D4A35] font-semibold hover:underline">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#0D4A35] text-white font-bold rounded-xl hover:bg-[#0B2C22] transition-all shadow-lg shadow-[#0D4A35]/20 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing In…</>
              ) : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-8">
            Access restricted to authorised administrators only.
          </p>
        </div>
      </div>
    </main>
  );
}
