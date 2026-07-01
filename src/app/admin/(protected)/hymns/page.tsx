"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Hymn } from "@/types";
import { seedHymns } from "@/lib/hymns-data";
import { listHymnsFromFirestore, addHymn, updateHymn, deleteHymn, parseBulkHymns } from "@/lib/hymns";

const emptyForm = { number: "", category: "english" as "english" | "yoruba", title: "", author: "", lyrics: "" };

export default function AdminHymnsPage() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"english" | "yoruba">("english");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkResult, setBulkResult] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listHymnsFromFirestore().then((h) => {
      setHymns(h);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const seedCount = useMemo(
    () => ({
      english: seedHymns.filter((h) => h.category === "english").length,
      yoruba: seedHymns.filter((h) => h.category === "yoruba").length,
    }),
    []
  );

  const filtered = hymns.filter((h) => h.category === tab);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: tab });
    setShowForm(true);
  };

  const openEdit = (h: Hymn) => {
    setEditingId(h.id);
    setForm({ number: String(h.number), category: h.category, title: h.title, author: h.author ?? "", lyrics: h.lyrics });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number || !form.title.trim() || !form.lyrics.trim()) return;
    setSaving(true);
    const data = {
      number: parseInt(form.number, 10),
      category: form.category,
      title: form.title.trim(),
      author: form.author.trim() || undefined,
      lyrics: form.lyrics.trim(),
    };
    if (editingId) {
      await updateHymn(editingId, data);
    } else {
      await addHymn(data);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hymn?")) return;
    await deleteHymn(id);
    load();
  };

  const handleBulkImport = async () => {
    const parsed = parseBulkHymns(bulkText);
    if (parsed.length === 0) {
      setBulkResult("No valid hymns found. Check the format and try again.");
      return;
    }
    setSaving(true);
    for (const hymn of parsed) {
      await addHymn(hymn);
    }
    setSaving(false);
    setBulkResult(`Imported ${parsed.length} hymn${parsed.length !== 1 ? "s" : ""} successfully.`);
    setBulkText("");
    load();
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Hymns</h1>
              <p className="text-text-muted text-sm mt-1">Manage the English &amp; Yoruba hymnals shown on the website</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBulk(true)} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-stone-200 text-primary hover:border-accent/40 transition-colors">
                Bulk Import
              </button>
              <button onClick={openNew} className="btn-shine btn-gold px-4 py-2.5 rounded-xl text-sm font-semibold">
                + Add Hymn
              </button>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-sm text-primary mb-6">
            The site also ships with {seedCount.english} built-in English hymns (public-domain classics). Anything you add
            or edit here is layered on top and shown on the public Hymns page automatically.
          </div>

          <div className="flex gap-3 mb-6">
            {(["english", "yoruba"] as const).map((c) => (
              <button key={c} onClick={() => setTab(c)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === c ? "bg-primary text-white" : "bg-white border border-stone-200 text-text-muted"}`}>
                {c === "english" ? "English Baptist Hymnal" : "Yoruba Baptist Hymnal"}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-text-muted text-sm">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center text-text-muted text-sm">
              No hymns added to this hymnal in Firestore yet. Add one manually or use Bulk Import.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((h) => (
                <div key={h.id} className="bg-white rounded-xl p-4 border border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">{h.number}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm truncate">{h.title}</p>
                    {h.author && <p className="text-text-muted text-xs">{h.author}</p>}
                  </div>
                  <button onClick={() => openEdit(h)} className="p-2 text-primary hover:bg-primary/8 rounded-lg transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(h.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-primary">{editingId ? "Edit Hymn" : "Add Hymn"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Hymn Number *</label>
                  <input type="number" required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Hymnal *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as "english" | "yoruba" })} className="input-field bg-white">
                    <option value="english">English Baptist Hymnal</option>
                    <option value="yoruba">Yoruba Baptist Hymnal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Author / Translator (optional)</label>
                <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Full Lyrics *</label>
                <textarea required rows={10} value={form.lyrics} onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
                  placeholder="Verse 1 line one&#10;Verse 1 line two&#10;&#10;Verse 2..." className="input-field resize-none font-mono text-sm" />
                <p className="text-xs text-text-muted mt-1">Leave a blank line between verses. Label a chorus with &ldquo;Chorus:&rdquo; on its own line.</p>
              </div>
            </div>
            <div className="p-6 border-t border-stone-100 flex gap-3">
              <button type="submit" disabled={saving} className="flex-1 btn-shine btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">
                {saving ? "Saving…" : editingId ? "Save Changes" : "Add Hymn"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk import modal */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-primary">Bulk Import Hymns</h2>
              <button onClick={() => setShowBulk(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-text-muted">
                Paste multiple hymns. Separate each hymn with a line containing only <code className="bg-stone-100 px-1.5 py-0.5 rounded">---</code>.
                The first line of each hymn is <code className="bg-stone-100 px-1.5 py-0.5 rounded">Number | English or Yoruba | Title</code>, followed by the full lyrics.
              </p>
              <pre className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-text-muted overflow-x-auto">{`23 | English | God Is So Good
God is so good, God is so good,
God is so good, He's so good to me.
---
472 | Yoruba | Orin Iyin
(paste real lyrics here)`}</pre>
              <textarea rows={10} value={bulkText} onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste hymns here…" className="input-field resize-none font-mono text-sm w-full" />
              {bulkResult && <p className="text-sm text-primary font-medium">{bulkResult}</p>}
              <button onClick={handleBulkImport} disabled={saving || !bulkText.trim()} className="w-full btn-shine btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">
                {saving ? "Importing…" : "Import Hymns"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
