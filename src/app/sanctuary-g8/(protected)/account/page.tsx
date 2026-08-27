"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); return; }
      setUser(u);
      try {
        if (db) {
          const snap = await getDoc(doc(db, "admin_users", u.uid));
          if (snap.exists()) {
            const data = snap.data() as { displayName?: string; roles?: string[] };
            if (data.displayName) setDisplayName(data.displayName);
            if (data.roles?.includes("master_admin") || data.roles?.includes("super_admin")) {
              setIsMasterAdmin(true);
            }
          } else {
            // No admin_users document — original super admin
            setIsMasterAdmin(true);
          }
        }
      } catch { /* ignore */ }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!displayName.trim()) { setError("Display name cannot be empty."); return; }
    if (!user || !db) { setError("Not signed in."); return; }
    setSavingName(true);
    try {
      await setDoc(doc(db, "admin_users", user.uid), { displayName: displayName.trim() }, { merge: true });
      setMessage("Your name has been updated.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError((err as Error).message || "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!user) { setError("Not signed in."); return; }
    if (!newEmail.trim()) { setError("Enter a new email address."); return; }
    if (newEmail.trim() === user.email) { setError("That\'s already your email."); return; }
    if (!emailPassword) { setError("Enter your current password to confirm."); return; }

    setSavingEmail(true);
    try {
      // Re-authenticate first (required for email change)
      const credential = EmailAuthProvider.credential(user.email!, emailPassword);
      await reauthenticateWithCredential(user, credential);
      // Update email in Firebase Auth
      await updateEmail(user, newEmail.trim());
      // Update email in admin_users Firestore doc if it exists
      if (db) {
        await setDoc(doc(db, "admin_users", user.uid), { email: newEmail.trim() }, { merge: true });
      }
      setMessage("Email updated successfully. Use your new email next time you sign in.");
      setNewEmail("");
      setEmailPassword("");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Your current password is incorrect.");
      } else if (code === "auth/email-already-in-use") {
        setError("That email is already in use by another account.");
      } else if (code === "auth/invalid-email") {
        setError("That doesn\'t look like a valid email address.");
      } else if (code === "auth/requires-recent-login") {
        setError("Session expired. Please sign out and sign back in, then try again.");
      } else {
        setError((err as Error).message || "Failed to change email.");
      }
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!user) { setError("Not signed in."); return; }
    if (!currentPassword) { setError("Enter your current password."); return; }
    if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("New passwords don't match."); return; }
    if (newPassword === currentPassword) { setError("New password must be different from your current one."); return; }

    setSavingPassword(true);
    try {
      // Re-authenticate with current password (Firebase requires recent auth for password changes)
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      // Now update the password
      await updatePassword(user, newPassword);
      setMessage("Password changed successfully. Use your new password next time you sign in.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Your current password is incorrect. Try again.");
      } else if (code === "auth/weak-password") {
        setError("New password is too weak. Use at least 6 characters.");
      } else if (code === "auth/requires-recent-login") {
        setError("Session expired. Please sign out and sign back in, then try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError((err as Error).message || "Failed to change password.");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-[#C8E63A]/30 border-t-[#C8E63A] rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-lg font-bold text-primary">My Account</h1>
          <p className="text-text-muted text-sm mt-1">Manage your display name and password</p>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        {/* Display Name */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-1">Display Name</h2>
          <p className="text-text-muted text-xs mb-4">This is the name shown on the dashboard greeting and activity log.</p>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
            </div>
            <button type="submit" disabled={savingName}
              className="px-5 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] transition-all disabled:opacity-60">
              {savingName ? "Saving…" : "Update Name"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-1">Change Password</h2>
          <p className="text-text-muted text-xs mb-4">Enter your current password and a new one. This updates your Firebase Auth account immediately.</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Current Password</label>
              <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Confirm New Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
            </div>
            <button type="submit" disabled={savingPassword}
              className="px-5 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] transition-all disabled:opacity-60 flex items-center gap-2">
              {savingPassword ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Changing…</>
              ) : "Change Password"}
            </button>
          </form>
        </div>

        {/* Account email — editable for master admin */}
        <div className="mt-6 bg-stone-50 rounded-2xl border border-stone-200 p-5">
          <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wide">Account Email</p>
          <p className="text-sm text-primary font-medium">{user?.email}</p>
          {isMasterAdmin ? (
            <form onSubmit={handleEmailChange} className="mt-3 space-y-3">
              <p className="text-[11px] text-stone-500">Change your email address below. You&apos;ll need to confirm your current password.</p>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">New Email Address</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new.email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Current Password (confirm)</label>
                <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Your current password"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4A35] focus:ring-4 focus:ring-[#0D4A35]/10 transition-all" />
              </div>
              <button type="submit" disabled={savingEmail}
                className="px-5 py-2.5 bg-[#0D4A35] text-white text-sm font-semibold rounded-xl hover:bg-[#0B2C22] transition-all disabled:opacity-60 flex items-center gap-2">
                {savingEmail ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Updating…</>
                ) : "Update Email"}
              </button>
            </form>
          ) : (
            <p className="text-[11px] text-stone-400 mt-2">If you need to change your email address, contact the super admin.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
