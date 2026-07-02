"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { PERMISSIONS, ROLE_DEFAULTS, Permission } from "@/types";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface AdminUser {
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
  const [form, setForm] = useState({ email: "", displayName: "", password: "", role: "editor", permissions: [] as Permission[] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(collection(db, "admin_users"));
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<AdminUser, "id">) })) as AdminUser[];
      setUsers(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingUser(null);
    setForm({ email: "", displayName: "", password: "", role: "editor", permissions: [...ROLE_DEFAULTS.editor] });
    setError("");
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({ email: user.email, displayName: user.displayName, password: "", role: user.roles[0] || "editor", permissions: [...user.permissions] });
    setError("");
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
        // Update existing user profile in Firestore
        if (!db) throw new Error("Database not configured");
        const updates: Partial<AdminUser> = {
          email: form.email,
          displayName: form.displayName,
          roles: [form.role],
          permissions: form.permissions,
        };
        await updateDoc(doc(db, "admin_users", editingUser.id), updates as Record<string, unknown>);
        // If a new password was entered, update it via Firebase Auth
        if (form.password && auth) {
          // Note: client-side Firebase Auth can't update another user's password directly.
          // The admin would need to use the Firebase Admin SDK for this.
          // For now, we show a note — password resets can be done from the Firebase Console.
          setError("Password changes for existing users must be done from the Firebase Console → Authentication → Users.");
        }
      } else {
        // Create new Firebase Auth user with email/password
        if (!auth) throw new Error("Firebase Auth not configured");
        if (!form.password || form.password.length < 6) { setError("Password must be at least 6 characters."); setSaving(false); return; }

        const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
        const uid = cred.user.uid;

        // Store profile in Firestore
        if (db) {
          await setDoc(doc(db, "admin_users", uid), {
            uid,
            email: form.email.trim(),
            displayName: form.displayName,
            roles: [form.role],
            permissions: form.permissions,
            active: true,
            createdAt: new Date().toISOString(),
          });
        }

        // Sign out the newly created user so the admin stays logged in
        // (createUserWithEmailAndPassword auto-signs in the new user)
        // We need to re-sign-in the admin — but we can't store their password.
        // Best approach: tell admin they'll need to re-login after creating a user.
      }

      setShowForm(false);
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
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      if (!db) return;
      await updateDoc(doc(db, "admin_users", user.id), { active: !user.active });
      load();
    } catch { /* ignore */ }
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
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Users &amp; Permissions</h1>
              <p className="text-text-muted text-sm mt-1">Create real Firebase accounts and manage staff access</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Add User
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
            <strong>Real Firebase accounts:</strong> Clicking &ldquo;Add User&rdquo; creates an actual email/password account in Firebase Authentication.
            The user can then log in at the admin portal with the email and password you set.
            <br/><br/>
            <strong>Note:</strong> Creating a user signs you out temporarily — you&apos;ll need to log back in afterward.
            To reset a user&apos;s password or delete their auth account, use the{" "}
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a>.
          </div>

          {loading && <p className="text-text-muted text-sm">Loading…</p>}

          {!loading && users.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-text-muted">
              No admin users found. Click &ldquo;Add User&rdquo; to create the first account.
            </div>
          )}

          {/* User form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">{editingUser ? "Edit User & Permissions" : "Create New User"}</h2>
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
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" disabled={!!editingUser}/>
                    {editingUser && <p className="text-xs text-text-muted mt-1">Email cannot be changed after creation.</p>}
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
                            <p className="text-sm font-medium text-primary">{perm.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                            <p className="text-xs text-text-muted">{perm}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">{saving ? "Saving…" : editingUser ? "Save Changes" : "Create Account"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
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
                      <tr key={user.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                              {user.displayName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-primary text-sm">{user.displayName}</p>
                              <p className="text-text-muted text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium capitalize">
                            {user.roles[0]?.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-text-muted text-xs">{user.permissions.length} permissions</span>
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
      </main>
    </div>
  );
}
