"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import { PERMISSIONS, ROLE_DEFAULTS, Permission } from "@/types";
import { auth, db, firebaseConfig } from "@/lib/firebase";
import { createUserWithEmailAndPassword, getAuth, signOut as fbSignOut, sendPasswordResetEmail, onAuthStateChanged, User as FbUser } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface AdminUser {
  ministryAccess?: string[];
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: Permission[];
  active: boolean;
  createdAt: string;
}

const ROLE_OPTIONS = ["master_admin", "pastor", "media_team", "editor"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ email: "", displayName: "", password: "", role: "editor", permissions: [] as Permission[], ministryAccess: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUid, setCurrentUid] = useState<string>("");
  const [isCurrentUserMasterAdmin, setIsCurrentUserMasterAdmin] = useState(false);
  const [showTransferPrompt, setShowTransferPrompt] = useState(false);
  const [transferTargetUid, setTransferTargetUid] = useState("");
  const [pendingDisableUid, setPendingDisableUid] = useState("");

  // Track current user
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (fbUser: FbUser | null) => {
      if (!fbUser) return;
      setCurrentUid(fbUser.uid);
      if (db) {
        try {
          const snap = await getDocs(collection(db, "admin_users"));
          const myDoc = snap.docs.find(d => d.id === fbUser.uid);
          if (myDoc) {
            const data = myDoc.data();
            setIsCurrentUserMasterAdmin(data.roles?.includes("master_admin") || data.roles?.includes("super_admin"));
          } else {
            // No doc = original super admin
            setIsCurrentUserMasterAdmin(true);
          }
        } catch { /* ignore */ }
      }
    });
    return () => unsub();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(collection(db, "admin_users"));
      const data = snap.docs.map(d => {
        const raw = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          email: (raw.email as string) || "",
          displayName: (raw.displayName as string) || (raw.email as string) || "Unknown",
          roles: (raw.roles as string[]) || [],
          permissions: (raw.permissions as Permission[]) || [],
          active: (raw.active as boolean) ?? true,
          createdAt: (raw.createdAt as string) || "",
          ministryAccess: (raw.ministryAccess as string[]) || [],
        } as AdminUser;
      });
      setUsers(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingUser(null);
    setForm({ email: "", displayName: "", password: "", role: "editor", permissions: [...ROLE_DEFAULTS.editor], ministryAccess: [] });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({ email: user.email, displayName: user.displayName, password: "", role: (user.roles?.[0]) || "editor", permissions: [...(user.permissions || [])], ministryAccess: user.ministryAccess || [] });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleRoleChange = (role: string) => {
    setForm(prev => ({ ...prev, role, permissions: [...(ROLE_DEFAULTS[role as keyof typeof ROLE_DEFAULTS] || [])] }));
  };

  const togglePermission = (perm: Permission) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.displayName.trim()) { setError("Name and email are required."); return; }

    setSaving(true);
    try {
      if (editingUser) {
        if (!db) throw new Error("Database not configured");

        // Check if email is being changed
        const emailChanged = form.email.trim() !== editingUser.email;

        const updates: Partial<AdminUser> = {
          email: form.email.trim(),
          displayName: form.displayName,
          roles: [form.role],
          permissions: form.permissions,
          ministryAccess: form.ministryAccess,
        };
        await updateDoc(doc(db, "admin_users", editingUser.id), updates as Record<string, unknown>);

        // If email changed, update Firebase Auth via server-side API
        if (emailChanged) {
          try {
            const res = await fetch("/api/admin/update-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: editingUser.id, newEmail: form.email.trim() }),
            });
            const result = await res.json();
            if (!res.ok) {
              setError(`Firestore updated, but email change in Firebase Auth failed: ${result.error}`);
              setSaving(false);
              return;
            }
          } catch (err) {
            setError(`Firestore updated, but email change in Firebase Auth failed: ${(err as Error).message}`);
            setSaving(false);
            return;
          }
        }

        // If a new password was entered, update it via Firebase Auth
        if (form.password && auth) {
          setError("Password changes for existing users must be done from the Firebase Console → Authentication → Users.");
        }
      } else {
        if (!form.password || form.password.length < 6) { setError("Password must be at least 6 characters."); setSaving(false); return; }

        const secondaryApp = initializeApp(firebaseConfig, "secondary-" + Date.now());
        let uid: string;
        try {
          const secondaryAuth = getAuth(secondaryApp);
          const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email.trim(), form.password);
          uid = cred.user.uid;
          await fbSignOut(secondaryAuth);
        } finally {
          deleteApp(secondaryApp).catch(() => {});
        }

        if (db) {
          await setDoc(doc(db, "admin_users", uid), {
            uid,
            email: form.email.trim(),
            displayName: form.displayName,
            roles: [form.role],
            permissions: form.permissions,
            ministryAccess: form.ministryAccess,
            active: true,
            createdAt: new Date().toISOString(),
          });
        }
      }

      setShowForm(false);
      setSuccess(editingUser ? "User updated successfully." : `User created! ${form.email} can now sign in with the password you set.`);
      setTimeout(() => setSuccess(""), 8000);
      await load();
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      const message = (err as { message?: string })?.message ?? "Failed to save.";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists in Firebase.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (code === "permission-denied" || message.toLowerCase().includes("insufficient permissions") || message.toLowerCase().includes("missing or insufficient")) {
        setError("Permission denied by Firestore rules. Make sure the firestore.rules are published in Firebase Console.");
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSendReset = async (email: string) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert(`Password reset email sent to ${email}. Ask the user to check their inbox and spam folder.`);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      console.error("[Users] Password reset error:", code);
      alert(`Could not send reset email: ${code || (err as Error).message}`);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    // If enabling, just do it
    if (!user.active) {
      try {
        if (!db) return;
        await updateDoc(doc(db, "admin_users", user.id), { active: true });
        setSuccess(`${user.displayName} has been re-enabled.`);
        setTimeout(() => setSuccess(""), 4000);
        load();
      } catch { /* ignore */ }
      return;
    }

    // If disabling — check if this is the last master admin
    const isMasterAdminUser = user.roles?.includes("master_admin") || user.roles?.includes("super_admin");
    if (isMasterAdminUser) {
      const otherMasterAdmins = users.filter(u =>
        u.id !== user.id &&
        (u.roles?.includes("master_admin") || u.roles?.includes("super_admin")) &&
        u.active !== false
      );

      if (otherMasterAdmins.length === 0) {
        // No other master admins — show transfer prompt
        setPendingDisableUid(user.id);
        setTransferTargetUid("");
        setShowTransferPrompt(true);
        return;
      }
    }

    // Safe to disable
    try {
      if (!db) return;
      await updateDoc(doc(db, "admin_users", user.id), { active: false });
      setSuccess(`${user.displayName} has been disabled. They will be signed out on next visit.`);
      setTimeout(() => setSuccess(""), 4000);
      load();
    } catch { /* ignore */ }
  };

  const handleTransferAndDisable = async () => {
    if (!transferTargetUid) {
      setError("Select a user to transfer the master admin role to.");
      return;
    }
    if (!db) return;

    try {
      // Promote the selected user to master_admin
      const targetUser = users.find(u => u.id === transferTargetUid);
      if (!targetUser) return;

      await updateDoc(doc(db, "admin_users", transferTargetUid), {
        roles: ["master_admin"],
        permissions: [...(targetUser.permissions || []), ...((ROLE_DEFAULTS.master_admin as Permission[]) || [])]
      });

      // Now disable the original master admin
      await updateDoc(doc(db, "admin_users", pendingDisableUid), { active: false });

      setShowTransferPrompt(false);
      setSuccess(`Master admin role transferred to ${targetUser.displayName}. ${targetUser.displayName}'s account has been disabled.`);
      setTimeout(() => setSuccess(""), 6000);
      setPendingDisableUid("");
      setTransferTargetUid("");
      load();
    } catch (err) {
      setError("Failed to transfer role: " + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this user's profile? The Firebase Auth account will remain and must be deleted separately from the Firebase Console.")) return;
    try {
      if (!db) return;
      await deleteDoc(doc(db, "admin_users", id));
      load();
    } catch { /* ignore */ }
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_users"><div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-lg font-bold text-primary">Users &amp; Permissions</h1>
              <p className="text-text-muted text-sm mt-1">Create real Firebase accounts and manage staff access</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Add User
            </button>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              {success}
            </div>
          )}

          {loading && <p className="text-text-muted text-sm">Loading…</p>}

          {!loading && users.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-text-muted">
              No admin users found. Click &ldquo;Add User&rdquo; to create the first account.
            </div>
          )}

          {/* Transfer master admin prompt */}
          {showTransferPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/>
                  </svg>
                </div>
                <h2 className="font-serif text-lg font-bold text-primary mb-2">Transfer Master Admin Role</h2>
                <p className="text-sm text-stone-600 mb-4">
                  You are about to disable the last master admin. You must transfer the <span className="font-semibold">master_admin</span> role to another user to avoid being locked out.
                </p>
                <select
                  value={transferTargetUid}
                  onChange={e => setTransferTargetUid(e.target.value)}
                  className="input-field bg-white mb-4"
                >
                  <option value="">Select a user to promote…</option>
                  {users.filter(u => u.id !== pendingDisableUid && u.active !== false).map(u => (
                    <option key={u.id} value={u.id}>{u.displayName} ({u.email})</option>
                  ))}
                </select>
                {users.filter(u => u.id !== pendingDisableUid && u.active !== false).length === 0 && (
                  <p className="text-sm text-red-600 mb-4">No other active users available. Create another user first.</p>
                )}
                <div className="flex gap-3">
                  <button onClick={handleTransferAndDisable} disabled={!transferTargetUid}
                    className="flex-1 bg-[#0D4A35] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0B2C22] transition-all disabled:opacity-50">
                    Transfer &amp; Disable
                  </button>
                  <button onClick={() => { setShowTransferPrompt(false); setPendingDisableUid(""); }}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-primary">{editingUser ? "Edit User & Permissions" : "Create New User"}</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Display Name *</label>
                    <input type="text" required value={form.displayName} onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))} className="input-field"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field"
                      placeholder={editingUser ? editingUser.email : "new.user@example.com"}/>
                    {editingUser && form.email === editingUser.email && (
                      <p className="text-xs text-text-muted mt-1">Change this field to update the user&apos;s email. This updates both Firestore and Firebase Auth.</p>
                    )}
                    {editingUser && form.email !== editingUser.email && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">Email will be updated in Firebase Auth for this user.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">
                      {editingUser ? "New Password (optional)" : "Password * (min 6 characters)"}
                    </label>
                    <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field" placeholder={editingUser ? "Leave blank to keep current" : "Set a password"} required={!editingUser}/>
                    {editingUser && <p className="text-xs text-text-muted mt-1">Password resets must be done from the Firebase Console.</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Role Preset</label>
                    <select value={form.role} onChange={e => handleRoleChange(e.target.value)} className="input-field bg-white">
                      {ROLE_OPTIONS.map(r => (
                        <option key={r} value={r}>{r.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                      ))}
                    </select>
                    <p className="text-xs text-text-muted mt-1.5">Choosing a role auto-fills permissions below. You can customize further.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-3 uppercase tracking-wide">Permissions</label>
                    <div className="grid grid-cols-1 gap-2">
                      {PERMISSIONS.map(perm => (
                        <label key={perm} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 cursor-pointer hover:border-accent/50 hover:bg-accent/3 transition-all">
                          <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)}
                            className="w-4 h-4 rounded accent-amber-600"/>
                          <div>
                            <p className="text-sm font-medium text-primary">{({
                              manage_pastor_speaks: "Pastor's Word",
                              manage_users: "Users & Permissions",
                              manage_posts: "Blog Posts",
                              manage_bookings: "Bookings",
                              manage_availability: "Availability",
                              manage_streams: "Live Stream",
                              manage_gallery: "Gallery",
                              manage_sermons: "Sermons",
                              manage_activities: "Activities",
                              manage_settings: "Site Settings",
                              manage_announcements: "Announcements",
                              manage_calendar: "Calendar",
                              manage_declarations: "Daily Declarations",
                              manage_hymns: "Hymns",
                              manage_leadership: "Leadership",
                              manage_members: "Choir & Media",
                              manage_ministry_members: "Ministry Members",
                              manage_contacts: "Messages",
                              manage_news: "News & Events",
                              view_activity_log: "View Activity Log",
                            } as Record<string, string>)[perm] || perm.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                            <p className="text-xs text-text-muted">{perm}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Ministry Access */}
                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Ministry Access</label>
                      <p className="text-xs text-text-muted mb-2">Assign which ministries this user can manage.</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { key: 'royal-ambassadors', label: 'Royal Ambassadors' },
                          { key: 'girls-auxiliary', label: "Girls' Auxiliary" },
                          { key: 'lydia-auxiliary', label: 'Lydia Auxiliary' },
                        ].map(m => (
                          <label key={m.key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
                            <input type="checkbox"
                              checked={(form.ministryAccess || []).includes(m.key)}
                              onChange={() => setForm(prev => ({
                                ...prev,
                                ministryAccess: (prev.ministryAccess || []).includes(m.key)
                                  ? (prev.ministryAccess || []).filter((x: string) => x !== m.key)
                                  : [...(prev.ministryAccess || []), m.key]
                              }))}
                              className="w-4 h-4 rounded accent-primary"
                            />
                            <span className="text-sm text-primary">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl font-semibold disabled:opacity-50">{saving ? "Saving…" : editingUser ? "Save Changes" : "Create Account"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users table */}
          {users.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      {["User", "Role", "Permissions", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${user.active === false ? "opacity-60" : ""}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                              {(user.displayName || user.email || "?").charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary">{user.displayName || user.email}</p>
                              <p className="text-xs text-text-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium capitalize">
                            {(user.roles?.[0] || "none")?.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-text-muted text-xs">{(user.permissions?.length || 0)} permissions</span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleActive(user)}
                            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                              user.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                            }`}>
                            {user.active ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(user)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:border-accent/50 text-primary transition-colors">Edit</button>
                            <button onClick={() => handleSendReset(user.email)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700 transition-colors" title="Send a password reset email to this user">Reset Password</button>
                            <button onClick={() => handleDelete(user.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </PermissionGuard>
    </AdminShell>
  );
}
