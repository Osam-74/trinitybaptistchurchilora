"use client";

import { useState, useRef, useEffect } from "react";
import R2Uploader from "@/components/R2Uploader";
import AdminShell from "@/components/AdminShell";
import { Sermon } from "@/types";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  orderBy, query, serverTimestamp,
} from "firebase/firestore";

/* ─── Recorder hook ─── */
function useRecorder() {
  const [state, setState] = useState<"idle" | "recording" | "paused" | "stopped">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => { timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000); };
  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mr.start();
      mediaRef.current = mr;
      setElapsed(0); setAudioBlob(null); setAudioUrl(null);
      setState("recording"); startTimer();
    } catch {
      alert("Microphone access denied. Please allow microphone access and try again.");
    }
  };

  const pause = () => { mediaRef.current?.pause(); stopTimer(); setState("paused"); };
  const resume = () => { mediaRef.current?.resume(); startTimer(); setState("recording"); };
  const stop = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach(t => t.stop());
    stopTimer(); setState("stopped");
  };
  const reset = () => {
    if (mediaRef.current?.state === "recording" || mediaRef.current?.state === "paused") {
      mediaRef.current.stop();
      mediaRef.current.stream.getTracks().forEach(t => t.stop());
    }
    stopTimer(); setElapsed(0); setAudioBlob(null); setAudioUrl(null); setState("idle");
  };

  useEffect(() => () => stopTimer(), []);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { state, elapsed, fmt, audioBlob, audioUrl, start, pause, resume, stop, reset };
}

/* ─── Form default ─── */
const EMPTY_FORM = {
  title: "", preacher: "", scripture: "", description: "",
  series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "",
};

/* ─── Page ─── */
export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [audioTab, setAudioTab] = useState<"upload" | "record">("upload");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const rec = useRecorder();

  /* Listen to Firestore */
  useEffect(() => {
    if (!db) { setLoadingList(false); return; }
    const q = query(collection(db, "sermons"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setSermons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Sermon)));
      setLoadingList(false);
    }, () => setLoadingList(false));
    return unsub;
  }, []);

  const openNew = () => {
    setEditingId(null); setForm({ ...EMPTY_FORM }); setAudioTab("upload"); rec.reset(); setShowForm(true);
  };
  const openEdit = (s: Sermon) => {
    setEditingId(s.id);
    setForm({ title: s.title, preacher: s.preacher, scripture: s.scripture, description: s.description || "", series: s.series || "", type: s.type, youtubeId: s.youtubeId || "", audioUrl: s.audioUrl || "" });
    setAudioTab("upload"); rec.reset(); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: new Date().toISOString().split("T")[0],
        featured: false,
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "sermons", editingId), payload);
      } else {
        await addDoc(collection(db, "sermons"), { ...payload, createdAt: serverTimestamp() });
      }
      setShowForm(false); rec.reset(); setForm({ ...EMPTY_FORM }); setEditingId(null);
    } catch (err) {
      alert(`Save failed: ${(err as Error).message}`);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sermon?")) return;
    await deleteDoc(doc(db, "sermons", id));
  };

  /**
   * Upload recording to Cloudflare R2 (permanent storage) via the shared
   * consultdrfat Worker — same upload path the gallery already uses.
   */
  const handleUploadRecording = async () => {
    if (!rec.audioBlob) return;
    setUploading(true);
    setUploadProgress("Uploading…");
    try {
      const { uploadToR2 } = await import("@/lib/r2");
      const blobFile = new File([rec.audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
      const url = await uploadToR2(blobFile, "sermons");
      setForm(f => ({ ...f, audioUrl: url, type: "audio" }));
      setUploadProgress("✓ Uploaded to cloud");
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
      setUploadProgress("");
    } finally { setUploading(false); }
  };

  /**
   * Save recording to Firestore using the local blob URL.
   * NOTE: blob:// URLs only live in the current browser session.
   * The sermon will show immediately but the audio link won't persist after page reload.
   * For permanent storage, use "Upload to Cloud" first.
   */
  const handleSaveLocalRecording = () => {
    if (!rec.audioUrl) return;
    setForm(f => ({ ...f, audioUrl: rec.audioUrl!, type: "audio" }));
  };

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-primary">Sermons</h1>
            <p className="text-text-muted text-sm mt-1">Manage the sermon library</p>
          </div>
          <button onClick={openNew}
            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sermon
          </button>
        </div>

        {/* ── FORM MODAL ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
                <h2 className="font-serif text-xl font-bold text-primary">{editingId ? "Edit Sermon" : "New Sermon"}</h2>
                <button onClick={() => { setShowForm(false); rec.reset(); }}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    className="input-field" placeholder="e.g. The Power of Faith" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Preacher</label>
                  <input value={form.preacher} onChange={e => setForm(p => ({ ...p, preacher: e.target.value }))}
                    className="input-field" placeholder="e.g. Rev. Dr S. O. Mosebolatan" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Scripture</label>
                  <input value={form.scripture} onChange={e => setForm(p => ({ ...p, scripture: e.target.value }))}
                    className="input-field" placeholder="e.g. John 3:16" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">
                    Series <span className="text-stone-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input value={form.series} onChange={e => setForm(p => ({ ...p, series: e.target.value }))}
                    className="input-field" placeholder="e.g. Walking by Faith (leave blank if standalone)" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3} className="input-field resize-none" placeholder="Brief summary…" />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Type</label>
                  <div className="flex gap-2">
                    {(["video", "audio"] as const).map(t => (
                      <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${form.type === t ? "bg-primary text-white border-primary" : "border-stone-200 text-stone-600 hover:border-primary/40"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* YouTube */}
                {form.type === "video" && (
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">YouTube Video ID</label>
                    <input value={form.youtubeId} onChange={e => setForm(p => ({ ...p, youtubeId: e.target.value }))}
                      className="input-field" placeholder="e.g. dQw4w9WgXcQ (the part after ?v=)" />
                  </div>
                )}

                {/* Audio */}
                {form.type === "audio" && (
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Audio</label>
                    <div className="flex gap-1 mb-3 bg-stone-100 p-1 rounded-xl w-fit">
                      {(["upload", "record"] as const).map(tab => (
                        <button key={tab} type="button" onClick={() => setAudioTab(tab)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${audioTab === tab ? "bg-white text-primary shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                          {tab === "upload" ? "Upload File" : "Record Live"}
                        </button>
                      ))}
                    </div>

                    {audioTab === "upload" && (
                      <R2Uploader folder="sermons" accept="audio/*" maxMB={100} label="Choose Audio File (.mp3, .m4a, .wav)"
                        onUploaded={url => setForm(p => ({ ...p, audioUrl: url }))} />
                    )}

                    {audioTab === "record" && (
                      <div className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-stone-50">
                        {/* Timer */}
                        <div className="text-center">
                          <span className="font-mono text-4xl font-bold text-primary tabular-nums">{rec.fmt(rec.elapsed)}</span>
                          <p className="text-xs text-text-muted mt-1">
                            {rec.state === "idle" && "Press Start to begin recording"}
                            {rec.state === "recording" && "● Recording in progress…"}
                            {rec.state === "paused" && "⏸ Paused"}
                            {rec.state === "stopped" && "✓ Recording complete"}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 justify-center flex-wrap">
                          {rec.state === "idle" && (
                            <button type="button" onClick={rec.start}
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                              Start Recording
                            </button>
                          )}
                          {rec.state === "recording" && (<>
                            <button type="button" onClick={rec.pause}
                              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                              Pause
                            </button>
                            <button type="button" onClick={rec.stop}
                              className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
                              Stop
                            </button>
                          </>)}
                          {rec.state === "paused" && (<>
                            <button type="button" onClick={rec.resume}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              Resume
                            </button>
                            <button type="button" onClick={rec.stop}
                              className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                              Stop
                            </button>
                          </>)}
                          {rec.state === "stopped" && (
                            <button type="button" onClick={rec.reset}
                              className="text-sm text-stone-400 hover:text-stone-600 underline">Record again</button>
                          )}
                        </div>

                        {/* Playback + save options */}
                        {rec.audioUrl && rec.state === "stopped" && (
                          <div className="space-y-3">
                            <audio controls src={rec.audioUrl} className="w-full rounded-lg" />

                            {form.audioUrl && form.audioUrl === rec.audioUrl ? (
                              <p className="text-xs text-green-600 font-semibold text-center">
                                ✓ Recording ready — click &ldquo;Save Sermon&rdquo; below to publish
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {/* Primary: upload to cloud for permanent storage */}
                                <button type="button" onClick={handleUploadRecording} disabled={uploading}
                                  className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                  {uploading ? (
                                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>{uploadProgress}</>
                                  ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>Upload to Cloud (Permanent)</>
                                  )}
                                </button>

                                {/* Secondary: use local blob — works now but won't persist after reload */}
                                <button type="button" onClick={handleSaveLocalRecording}
                                  className="w-full border border-stone-300 text-stone-600 py-2 rounded-xl font-medium text-sm hover:border-stone-400 transition-colors">
                                  Use Recording Now
                                  <span className="block text-[10px] text-stone-400 font-normal">Audio will work until you close this tab</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {form.audioUrl && (
                      <p className="text-xs text-green-600 mt-1.5 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {form.audioUrl.startsWith("blob:") ? "Recording set (session only — upload to cloud for permanent storage)" : "Audio ready"}
                      </p>
                    )}
                  </div>
                )}

                <button onClick={handleSave} disabled={!form.title.trim() || saving}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Saving…</> : editingId ? "Save Changes" : "Add Sermon"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SERMON LIST ── */}
        {loadingList ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            No sermons yet. Click &ldquo;Add Sermon&rdquo; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {sermons.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-primary text-sm truncate">{s.title}</p>
                    {s.featured && <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">Featured</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.type === "audio" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                      {s.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {s.preacher && <span>{s.preacher} · </span>}
                    {s.date ? formatDate(s.date) : ""}
                    {s.series && <span> · {s.series}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(s)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors text-stone-500"
                    title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(s.id)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-stone-500"
                    title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
