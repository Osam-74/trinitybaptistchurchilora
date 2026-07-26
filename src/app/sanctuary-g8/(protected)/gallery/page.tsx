"use client";

import { useState, useEffect } from "react";
import R2Uploader from "@/components/R2Uploader";
import BatchUploader from "@/components/BatchUploader";
import AdminShell from "@/components/AdminShell";
import PermissionGuard from "@/components/PermissionGuard";
import {
  listAlbums, createAlbum, updateAlbum, deleteAlbum,
  listPhotos, addPhoto, deletePhoto, countPhotos,
  GalleryAlbum, GalleryPhoto,
} from "@/lib/gallery";
import { auth } from "@/lib/firebase";
import { logActivity } from "@/lib/activityLog";

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Album modal
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({ title: "", description: "", eventDate: "", coverUrl: "", hidden: false });
  const [albumSaving, setAlbumSaving] = useState(false);

  // Photo modal
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoMode, setPhotoMode] = useState<"batch" | "single">("batch");
  const [photoSaving, setPhotoSaving] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");

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
    setAlbumForm({ title: "", description: "", eventDate: "", coverUrl: "", hidden: false });
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
      hidden: album.hidden || false,
    });
    setShowAlbumModal(true);
  };

  const handleSaveAlbum = async () => {
    if (!albumForm.title.trim()) return;
    setAlbumSaving(true);
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, albumForm);
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "updated", target: `Album: ${albumForm.title}`, section: "Gallery" });
        setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, ...albumForm } : a));
        if (activeAlbum?.id === editingAlbum.id) setActiveAlbum(a => a ? { ...a, ...albumForm } : a);
      } else {
        const id = await createAlbum(albumForm);
        logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "created", target: `Album: ${albumForm.title}`, section: "Gallery" });
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

  const handleToggleHidden = async (album: GalleryAlbum, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHidden = !album.hidden;
    try {
      await updateAlbum(album.id, { hidden: newHidden });
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: newHidden ? "hidden" : "unhidden", target: `Album: ${album.title}`, section: "Gallery" });
      setAlbums(prev => prev.map(a => a.id === album.id ? { ...a, hidden: newHidden } : a));
    } catch (err) {
      console.error("Toggle hidden error:", err);
    }
  };

  const handleDeleteAlbum = async (album: GalleryAlbum, e: React.MouseEvent) => {
    e.stopPropagation();
    // Count photos in album for warning
    let photoCount = 0;
    try {
      photoCount = await countPhotos(album.id);
    } catch { /* ignore count errors */ }

    const warning = photoCount > 0
      ? `⚠️ This album "${album.title}" contains ${photoCount} photo${photoCount !== 1 ? "s" : ""}. Deleting the album will NOT delete the photos inside — they will remain in storage but become orphaned.\n\nDo you want to continue?`
      : `Delete empty album "${album.title}"? This cannot be undone.`;

    if (!confirm(warning)) return;
    try {
      await deleteAlbum(album.id);
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "deleted", target: `Album: ${album.title}`, section: "Gallery" });
      setAlbums(prev => prev.filter(a => a.id !== album.id));
      if (activeAlbum?.id === album.id) { setActiveAlbum(null); setPhotos([]); }
    } catch (err) {
      console.error("Delete album error:", err);
    }
  };

  const openAddPhoto = () => {
    setPhotoCaption("");
    setPhotoUrl("");
    setPhotoMode("batch");
    setBatchProgress("");
    setShowPhotoModal(true);
  };

  // Batch upload: add all uploaded photos to the album
  const handleBatchUploaded = async (urls: string[]) => {
    if (!activeAlbum || urls.length === 0) return;
    setPhotoSaving(true);
    setBatchProgress(`Adding ${urls.length} photos to album…`);
    try {
      const newPhotos: GalleryPhoto[] = [];
      for (const url of urls) {
        const id = await addPhoto(activeAlbum.id, url, "");
        newPhotos.push({ id, albumId: activeAlbum.id, url, caption: "", createdAt: new Date().toISOString() });
      }
      setPhotos(prev => [...newPhotos, ...prev]);
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "added", target: `${urls.length} photos in ${activeAlbum.title}`, section: "Gallery" });

      // Set first photo as cover if album has none
      if (!activeAlbum.coverUrl && urls.length > 0) {
        await updateAlbum(activeAlbum.id, { coverUrl: urls[0] });
        setActiveAlbum(a => a ? { ...a, coverUrl: urls[0] } : a);
        setAlbums(prev => prev.map(a => a.id === activeAlbum.id ? { ...a, coverUrl: urls[0] } : a));
      }

      setBatchProgress(`✓ ${urls.length} photos added successfully!`);
      setTimeout(() => setShowPhotoModal(false), 1500);
    } catch (err) {
      console.error("Batch add error:", err);
      setBatchProgress("Failed to add some photos.");
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleAddSinglePhoto = async () => {
    if (!activeAlbum || !photoUrl) return;
    setPhotoSaving(true);
    try {
      const id = await addPhoto(activeAlbum.id, photoUrl, photoCaption);
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "added", target: `Photo in ${activeAlbum.title}`, section: "Gallery" });
      const newPhoto: GalleryPhoto = { id, albumId: activeAlbum.id, url: photoUrl, caption: photoCaption, createdAt: new Date().toISOString() };
      setPhotos(prev => [newPhoto, ...prev]);
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
      logActivity({ user: auth?.currentUser?.email ?? "admin", userName: auth?.currentUser?.displayName ?? "Admin", action: "deleted", target: `Photo from ${activeAlbum?.title ?? "album"}`, section: "Gallery" });
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error("Delete photo error:", err);
    }
  };

  return (
    <AdminShell>
      <PermissionGuard required="manage_gallery">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {activeAlbum && (
                <button onClick={() => { setActiveAlbum(null); setPhotos([]); }}
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="font-serif text-lg font-bold text-primary">
                  {activeAlbum ? activeAlbum.title : "Gallery"}
                </h1>
                <p className="text-text-muted text-xs mt-0.5">
                  {activeAlbum ? `${photos.length} photo${photos.length !== 1 ? "s" : ""}` : `${albums.length} album${albums.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={activeAlbum ? openAddPhoto : openNewAlbum}
              className="btn-shine btn-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {activeAlbum ? "Add Photos" : "New Album"}
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
                <div className="text-center">
                  <p className="text-text-muted font-semibold">No albums yet. Create your first album above.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map(album => (
                  <div key={album.id} onClick={() => openAlbum(album)}
                    className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm group cursor-pointer hover:border-accent/40 hover:shadow-md transition-all">
                    <div className="relative h-32 sm:h-36 bg-primary-dark overflow-hidden">
                      {album.coverUrl ? (
                        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{ (e.target as HTMLImageElement).src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e7e5e4' width='100' height='100'/%3E%3C/svg%3E"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Hidden badge */}
                      {album.hidden && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-800/80 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
                          </svg>
                          Hidden
                        </div>
                      )}
                      {/* Action buttons — always visible on touch */}
                      <div className="absolute top-1.5 right-1.5 flex gap-1">
                        <button onClick={(e) => openEditAlbum(album, e)}
                          className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors">
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={(e) => handleToggleHidden(album, e)}
                          className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                          title={album.hidden ? "Show on frontend" : "Hide from frontend"}>
                          <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {album.hidden
                              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                            }
                          </svg>
                        </button>
                        <button onClick={(e) => handleDeleteAlbum(album, e)}
                          className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-sm transition-colors">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h3 className="font-bold text-primary text-xs">{album.title}</h3>
                      {album.description && <p className="text-stone-500 text-[10px] mt-0.5 line-clamp-1">{album.description}</p>}
                      {album.eventDate && <p className="text-accent text-[10px] font-semibold mt-0.5">{album.eventDate}</p>}
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
                <p className="text-text-muted font-semibold">No photos yet. Click "Add Photos" to upload.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm group" data-photo-tile>
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{ const el=(e.target as HTMLElement).closest("[data-photo-tile]"); if(el)(el as HTMLElement).style.display="none"; }} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <button onClick={() => handleDeletePhoto(photo)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-semibold hover:bg-red-700 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    {photo.caption && (
                      <div className="px-2.5 py-1.5">
                        <p className="text-stone-700 text-[10px] font-medium truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      

      {/* Album modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-primary">{editingAlbum ? "Edit Album" : "New Album"}</h2>
              <button onClick={() => setShowAlbumModal(false)} className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Album Title *</label>
                <input value={albumForm.title} onChange={e => setAlbumForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. Sunday Worship July 2026" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Description</label>
                <input value={albumForm.description} onChange={e => setAlbumForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Short description…" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Event Date</label>
                <input value={albumForm.eventDate} onChange={e => setAlbumForm(p => ({ ...p, eventDate: e.target.value }))}
                  className="input-field w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. 15 July 2026" />
              </div>

              {/* Cover image upload */}
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Cover Image (optional)</label>
                {albumForm.coverUrl && (
                  <img src={albumForm.coverUrl} alt="Cover" className="w-full h-24 object-cover rounded-xl mb-2" />
                )}
                <R2Uploader
                  folder="gallery"
                  accept="image/*"
                  label="Upload cover image"
                  maxMB={20}
                  onUploaded={(url) => setAlbumForm(p => ({ ...p, coverUrl: url }))}
                  onError={(msg) => alert(msg)}
                />
              </div>

              {/* Hide toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={albumForm.hidden} onChange={e => setAlbumForm(p => ({ ...p, hidden: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary" />
                <span className="text-xs font-medium text-stone-600">Hide this album from the public gallery</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveAlbum} disabled={albumSaving || !albumForm.title.trim()}
                  className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                  {albumSaving ? "Saving…" : editingAlbum ? "Update Album" : "Create Album"}
                </button>
                <button onClick={() => setShowAlbumModal(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-primary">Add Photos to {activeAlbum?.title}</h2>
              <button onClick={() => setShowPhotoModal(false)} className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              {/* Mode toggle */}
              <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
                {(["batch", "single"] as const).map(mode => (
                  <button key={mode} onClick={() => { setPhotoMode(mode); setPhotoUrl(""); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${photoMode === mode ? "bg-white shadow-sm text-primary" : "text-stone-500 hover:text-primary"}`}>
                    {mode === "batch" ? "📁 Batch Upload" : "🔗 Single URL"}
                  </button>
                ))}
              </div>

              {photoMode === "batch" ? (
                <>
                  <BatchUploader
                    folder="gallery"
                    accept="image/*"
                    label="Select multiple photos to upload"
                    onAllUploaded={handleBatchUploaded}
                    onError={(msg) => alert(msg)}
                  />
                  {batchProgress && (
                    <p className="text-xs text-center font-medium text-accent">{batchProgress}</p>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Image URL</label>
                    <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..."
                      className="input-field w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                    {photoUrl && (
                      <img src={photoUrl} alt="Preview" className="w-full h-28 object-cover rounded-xl mt-2"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wide">Caption (optional)</label>
                    <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} placeholder="Describe the photo…"
                      className="input-field w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleAddSinglePhoto} disabled={photoSaving || !photoUrl}
                      className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                      {photoSaving ? "Saving…" : "Add Photo"}
                    </button>
                    <button onClick={() => setShowPhotoModal(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50">
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
          </PermissionGuard>
    </AdminShell>
  );
}
