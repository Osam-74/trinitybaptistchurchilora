"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { PERMISSIONS, ROLE_DEFAULTS, Permission } from "@/types";

interface AdminUser { id: string; email: string; displayName: string; roles: string[]; permissions: Permission[]; active: boolean; createdAt: string; }

const SAMPLE_USERS: AdminUser[] = [
  { id: "u1", email: "admin@trinitychurch.ng", displayName: "Master Admin", roles: ["master_admin"], permissions: [...ROLE_DEFAULTS.master_admin], active: true, createdAt: "2024-01-01" },
  { id: "u2", email: "pastor@trinitychurch.ng", displayName: "Rev'd Dr S. O. Mosebolatan", roles: ["pastor"], permissions: [...ROLE_DEFAULTS.pastor], active: true, createdAt: "2024-01-01" },
  { id: "u3", email: "media@trinitychurch.ng", displayName: "Media Team Lead", roles: ["media_team"], permissions: [...ROLE_DEFAULTS.media_team], active: true, createdAt: "2024-03-15" },
];

const ROLE_OPTIONS = ["master_admin", "pastor", "media_team", "editor"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(SAMPLE_USERS);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ email: "", displayName: "", role: "editor", permissions: [] as Permission[] });

  const openNew = () => {
    setEditingUser(null);
    setForm({ email: "", displayName: "", role: "editor", permissions: [...ROLE_DEFAULTS.editor] });
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({ email: user.email, displayName: user.displayName, role: user.roles[0] || "editor", permissions: [...user.permissions] });
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, email: form.email, displayName: form.displayName, roles: [form.role], permissions: form.permissions } : u));
    } else {
      setUsers(prev => [...prev, { id: `u-${Date.now()}`, email: form.email, displayName: form.displayName, roles: [form.role], permissions: form.permissions, active: true, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setShowForm(false);
  };

  const handleToggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this user?")) setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Users & Permissions</h1>
              <p className="text-text-muted text-sm mt-1">Manage staff accounts and access levels</p>
            </div>
            <button onClick={openNew}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Add User
            </button>
          </div>

          {/* User form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">{editingUser ? "Edit User & Permissions" : "Add New User"}</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  {[
                    { label: "Display Name *", key: "displayName", type: "text", required: true },
                    { label: "Email Address *", key: "email", type: "email", required: true },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">{f.label}</label>
                      <input type={f.type} required={f.required} value={(form as Record<string, string>)[f.key] ?? ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-field"/>
                    </div>
                  ))}

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
                    <button type="submit" className="flex-1 btn-gold py-3 rounded-xl font-semibold">{editingUser ? "Save Changes" : "Create User"}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users table */}
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
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.permissions.slice(0, 3).map(p => (
                            <span key={p} className="px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded-md">{p.replace("manage_", "").replace("moderate_", "")}</span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-stone-100 text-text-muted text-xs rounded-md">+{user.permissions.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleToggleActive(user.id)}
                          className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${user.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-50 text-red-500 hover:bg-red-100"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(user)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-medium hover:bg-primary/15 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Edit
                          </button>
                          {user.roles[0] !== "master_admin" && (
                            <button onClick={() => handleDelete(user.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors">
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
