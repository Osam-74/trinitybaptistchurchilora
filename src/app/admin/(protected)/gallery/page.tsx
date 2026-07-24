"use client";

import { useState, useEffect } from "react";
import R2Uploader from "@/components/R2Uploader";
import AdminSidebar from "@/components/AdminSidebar";
import {
  listAlbums, createAlbum, updateAlbum, deleteAlbum,
  listPhotos, addPhoto, deletePhoto,
  GalleryAlbum, GalleryPhoto,
} from "@/lib/gallery";

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Album modal
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({ title: "", description: "", eventDate: "", coverUrl: "" });
  const [albumSaving, setAlbumSaving] = useState(false);

  // Photo modal
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoMode, setPhotoMode] = useState<"upload" | "url">("upload");
  const [photoSaving, setPhotoSaving] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const data = await listAlbums();
      setAlbums(data);
    } catch (err) {
      console.error("Failed to load albums:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = async (album: GalleryAlbum) => {
    setActiveAlbum(album);
    setPhotosLoading(true);
    try {
      const data = await listPhotos(album.id);
      setPhotos(data);
    } catch (err) {
      console.error("Failed to load photos:", err);
    } finally {
      setPhotosLoading(false);
    }
  };

  const openNewAlbum = () => {
    setEditingAlbum(null);
    setAlbumForm({ title: "", description: "", eventDate: "", coverUrl: "" });
    setShowAlbumModal(true);
  };

  const openEditAlbum = (album: GalleryAlbum, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title,
      description: album.description || "",
      eventDate: album.eventDate || "",
      coverUrl: album.coverUrl || "",
    });
    setShowAlbumModal(true);
  };

  const handleSaveAlbum = async () => {
    if (!albumForm.title.trim()) return;
    setAlbumSaving(true);
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, albumForm);
        setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, ...albumForm } : a));
        if (activeAlbum?.id === editingAlbum.id) setActiveAlbum(a => a ? { ...a, ...albumForm } : a);
      } else {
        const id = await createAlbum(albumForm);
        const newAlbum: GalleryAlbum = { id, ...albumForm, createdAt: new Date().toISOString() };
        setAlbums(prev => [newAlbum, ...prev]);
      }
      setShowAlbumModal(false);
    } catch (err) {
      console.error("Failed to save album:", err);
      alert("Failed to save album. Check console.");
    } finally {
      setAlbumSaving(false);
    }
  };

  const handleDeleteAlbum = async (album: GalleryAlbum, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete album "${album.title}"? This will NOT delete photos inside — they remain in Firestore.`)) return;
    try {
      await deleteAlbum(album.id);
      setAlbums(prev => prev.filter(a => a.id !== album.id));
      if (activeAlbum?.id === album.id) { setActiveAlbum(null); setPhotos([]); }
    } catch (err) {
      console.error("Delete album error:", err);
    }
  };

  const openAddPhoto = () => {
    setPhotoCaption("");
    setPhotoUrl("");
    setPhotoMode("upload");
    setShowPhotoModal(true);
  };

  const handleAddPhoto = async () => {
    if (!activeAlbum || !photoUrl) return;
    setPhotoSaving(true);
    try {
      const id = await addPhoto(activeAlbum.id, photoUrl, photoCaption);
      const newPhoto: GalleryPhoto = { id, albumId: activeAlbum.id, url: photoUrl, caption: photoCaption, createdAt: new Date().toISOString() };
      setPhotos(prev => [newPhoto, ...prev]);
      // If album has no cover yet, set this as cover
      if (!activeAlbum.coverUrl) {
        await updateAlbum(activeAlbum.id, { coverUrl: photoUrl });
        setActiveAlbum(a => a ? { ...a, coverUrl: photoUrl } : a);
        setAlbums(prev => prev.map(a => a.id === activeAlbum.id ? { ...a, coverUrl: photoUrl } : a));
      }
      setShowPhotoModal(false);
    } catch (err) {
      console.error("Add photo error:", err);
      alert("Failed to add photo.");
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto(photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error("Delete photo error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pr-16 lg:pr-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {activeAlbum && (
                <button onClick={() => { setActiveAlbum(null); setPhotos([]); }}
                  className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="font-serif text-2xl font-bold text-primary">
                  {activeAlbum ? activeAlbum.title : "Gallery"}
                </h1>
                <p className="text-text-muted text-sm mt-0.5">
                  {activeAlbum ? `${photos.length} photo${photos.length !== 1 ? "s" : ""}` : `${albums.length} album${albums.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={activeAlbum ? openAddPhoto : openNewAlbum}
              className="btn-shine btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {activeAlbum ? "Add Photo" : "New Album"}
            </button>
          </div>

          {/* Albums grid */}
          {!activeAlbum && (
            loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
                <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-text-muted font-semibold">No albums yet. Create your first album above.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map(album => (
                  <div key={album.id} onClick={() => openAlbum(album)}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group cursor-pointer hover:border-accent/40 hover:shadow-md transition-all">
                    <div className="relative h-48 bg-primary-dark overflow-hidden">
                      {album.coverUrl ? (
                        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => openEditAlbum(album, e)}
                          className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={(e) => handleDeleteAlbum(album, e)}
                          className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-primary">{album.title}</h3>
                      {album.description && <p className="text-stone-500 text-xs mt-1 line-clamp-2">{album.description}</p>}
                      {album.eventDate && <p className="text-accent text-xs font-semibold mt-1">{album.eventDate}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Photos grid inside an album */}
          {activeAlbum && (
            photosLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
                <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-text-muted font-semibold">No photos yet. Add the first photo above.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group">
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <button onClick={() => handleDeletePhoto(photo)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    {photo.caption && (
                      <div className="px-3 py-2.5">
                        <p className="text-stone-700 text-xs font-medium truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* Album modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-primary">{editingAlbum ? "Edit Album" : "New Album"}</h2>
              <button onClick={() => setShowAlbumModal(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Album Title *</label>
                <input value={albumForm.title} onChange={e => setAlbumForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. Sunday Worship July 2026" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Description</label>
                <input value={albumForm.description} onChange={e => setAlbumForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Optional short description" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Event Date</label>
                <input type="date" value={albumForm.eventDate} onChange={e => setAlbumForm(p => ({ ...p, eventDate: e.target.value }))}
                  className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Cover Photo URL (optional)</label>
                <input value={albumForm.coverUrl} onChange={e => setAlbumForm(p => ({ ...p, coverUrl: e.target.value }))}
                  className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="https://..." />
                <p className="text-xs text-stone-400 mt-1">Or leave blank — first uploaded photo will become the cover automatically.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveAlbum} disabled={albumSaving || !albumForm.title.trim()}
                  className="flex-1 btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">
                  {albumSaving ? "Saving…" : editingAlbum ? "Save Changes" : "Create Album"}
                </button>
                <button onClick={() => setShowAlbumModal(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add photo modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-primary">Add Photo</h2>
              <button onClick={() => setShowPhotoModal(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
                {(["upload", "url"] as const).map(mode => (
                  <button key={mode} onClick={() => { setPhotoMode(mode); setPhotoUrl(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${photoMode === mode ? "bg-white shadow-sm text-primary" : "text-stone-500 hover:text-primary"}`}>
                    {mode === "upload" ? "📁 Upload" : "🔗 Paste URL"}
                  </button>
                ))}
              </div>
              {photoMode === "upload" ? (
                <R2Uploader
                  folder="gallery"
                  accept="image/*"
                  label="Click or drag to upload photo"
                  maxMB={10}
                  onUploaded={(url) => setPhotoUrl(url)}
                  onError={(msg) => alert(msg)}
                />
              ) : (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Image URL</label>
                  <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..."
                    className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                  {photoUrl && (
                    <img src={photoUrl} alt="Preview" className="w-full h-36 object-cover rounded-xl mt-3"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Caption (optional)</label>
                <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="Describe the photo…"
                  className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddPhoto} disabled={photoSaving || !photoUrl}
                  className="flex-1 btn-gold py-3 rounded-xl font-semibold disabled:opacity-50">
                  {photoSaving ? "Saving…" : "Add Photo"}
                </button>
                <button onClick={() => setShowPhotoModal(false)} className="px-5 py-3 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
