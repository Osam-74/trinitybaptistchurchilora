"use client";

import { useState, useRef } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface GalleryItem { id: string; url: string; caption: string; source: "url" | "upload"; createdAt: string; }

const SAMPLE_GALLERY: GalleryItem[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600", caption: "Sunday Worship Service", source: "url", createdAt: "2026-06-15" },
  { id: "g2", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600", caption: "Youth Fellowship", source: "url", createdAt: "2026-06-10" },
  { id: "g3", url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600", caption: "Choir Practice", source: "url", createdAt: "2026-06-05" },
  { id: "g4", url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600", caption: "Prayer Meeting", source: "url", createdAt: "2026-06-01" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(SAMPLE_GALLERY);
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"url" | "upload">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAdd = () => {
    const url = addMode === "url" ? urlInput : previewUrl;
    if (!url) return;
    const newItem: GalleryItem = {
      id: `g-${Date.now()}`,
      url,
      caption: caption || "Church Photo",
      source: addMode,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setItems(prev => [newItem, ...prev]);
    setShowAdd(false);
    setUrlInput(""); setCaption(""); setPreviewUrl(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this photo?")) setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Gallery</h1>
              <p className="text-text-muted text-sm mt-1">Manage church photos and media</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Add Photo
            </button>
          </div>

          {/* Add photo modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-primary">Add Photo</h2>
                  <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Mode tabs */}
                  <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
                    {(["upload", "url"] as const).map(mode => (
                      <button key={mode} onClick={() => setAddMode(mode)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${addMode === mode ? "bg-white shadow-sm text-primary" : "text-text-muted hover:text-primary"}`}>
                        {mode === "upload" ? "📁 Upload from Device" : "🔗 Paste URL"}
                      </button>
                    ))}
                  </div>

                  {addMode === "upload" ? (
                    <div>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center cursor-pointer hover:border-accent transition-colors"
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl"/>
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-stone-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                            </svg>
                            <p className="text-sm font-medium text-primary">Click to select a photo</p>
                            <p className="text-xs text-text-muted mt-1">JPG, PNG, WebP — max 10MB</p>
                          </>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect}/>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Image URL (Cloudflare / CDN)</label>
                      <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://..." className="input-field"/>
                      {urlInput && (
                        <img src={urlInput} alt="Preview" className="w-full h-36 object-cover rounded-xl mt-3" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Caption</label>
                    <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Photo caption..." className="input-field"/>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button onClick={handleAdd} disabled={addMode === "upload" ? !previewUrl : !urlInput}
                      className="flex-1 btn-gold py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                      Add to Gallery
                    </button>
                    <button onClick={() => setShowAdd(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-text-muted hover:bg-stone-50 text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                    <button onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="font-semibold text-primary text-sm">{item.caption}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-text-muted text-xs">{item.createdAt}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.source === "upload" ? "bg-blue-50 text-blue-600" : "bg-stone-100 text-stone-500"}`}>
                      {item.source === "upload" ? "Uploaded" : "URL"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p className="text-text-muted">No photos yet. Add your first photo above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
