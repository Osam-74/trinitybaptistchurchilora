"use client";

import { useState, useRef, useEffect } from "react";
import R2Uploader from "@/components/R2Uploader";
import AdminShell from "@/components/AdminShell";
import { Sermon } from "@/types";
import { sampleSermons } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

function useRecorder() {
  const [state, setState] = useState<"idle" | "recording" | "paused" | "stopped">("idle");
  const [elapsed, setElapsed] = useState(0); // seconds
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = async () => {
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
    setElapsed(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setState("recording");
    startTimer();
  };

  const pause = () => {
    mediaRef.current?.pause();
    stopTimer();
    setState("paused");
  };

  const resume = () => {
    mediaRef.current?.resume();
    startTimer();
    setState("recording");
  };

  const stop = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach(t => t.stop());
    stopTimer();
    setState("stopped");
  };

  const reset = () => {
    stop();
    setElapsed(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setState("idle");
  };

  useEffect(() => () => stopTimer(), []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return { state, elapsed, fmt, audioBlob, audioUrl, start, pause, resume, stop, reset };
}

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(sampleSermons.map((s, i) => ({ ...s, id: `sermon-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [audioTab, setAudioTab] = useState<"upload" | "record">("upload");
  const [form, setForm] = useState({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });
  const [uploading, setUploading] = useState(false);
  const rec = useRecorder();

  const handleSave = () => {
    setSermons([{ ...form, id: `sermon-${Date.now()}`, date: new Date().toISOString().split("T")[0], featured: false }, ...sermons]);
    setShowForm(false);
    setForm({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });
    rec.reset();
  };

  const handleDelete = (id: string) => { if (confirm("Delete?")) setSermons(sermons.filter((s) => s.id !== id)); };

  const handleSaveRecording = async () => {
    if (!rec.audioBlob) return;
    setUploading(true);
    try {
      const file = new File([rec.audioBlob], `sermon-${Date.now()}.webm`, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "sermons");
      const res = await fetch("/api/upload-r2", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm(f => ({ ...f, audioUrl: url, type: "audio" }));
      alert("Recording saved! Click 'Add Sermon' to publish.");
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminShell><div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Sermons</h1>
          <p className="text-text-muted text-sm mt-1">Manage sermon library</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Sermon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-primary">New Sermon</h2>
              <button onClick={() => { setShowForm(false); rec.reset(); }} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Title & Meta */}
              {[
                { label: "Sermon Title *", key: "title", placeholder: "Enter sermon title" },
                { label: "Preacher", key: "preacher", placeholder: "Name of preacher" },
                { label: "Scripture Reference", key: "scripture", placeholder: "e.g. John 3:16" },
                { label: "Series", key: "series", placeholder: "Sermon series name" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">{f.label}</label>
                  <input value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="input-field" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="input-field resize-none" placeholder="Brief description…"/>
              </div>

              {/* Type: Video or Audio */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Content Type</label>
                <div className="flex gap-2">
                  {(["video", "audio"] as const).map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm(p => ({ ...p, type: t }))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${form.type === t ? "bg-primary text-white border-primary" : "border-stone-200 text-stone-600 hover:border-primary/40"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* YouTube URL (video) */}
              {form.type === "video" && (
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">YouTube Video ID</label>
                  <input value={form.youtubeId} onChange={e => setForm(p => ({ ...p, youtubeId: e.target.value }))}
                    className="input-field" placeholder="e.g. dQw4w9WgXcQ"/>
                </div>
              )}

              {/* Audio: Upload or Record tabs */}
              {form.type === "audio" && (
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Audio</label>
                  <div className="flex gap-1 mb-3 bg-stone-100 p-1 rounded-xl w-fit">
                    {(["upload", "record"] as const).map(tab => (
                      <button key={tab} type="button" onClick={() => setAudioTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${audioTab === tab ? "bg-white text-primary shadow-sm" : "text-stone-500"}`}>
                        {tab === "upload" ? "Upload Audio" : "Record Live"}
                      </button>
                    ))}
                  </div>

                  {audioTab === "upload" && (
                    <R2Uploader folder="sermons" label="Choose Audio File" onUploaded={url => setForm(p => ({ ...p, audioUrl: url }))}/>
                  )}

                  {audioTab === "record" && (
                    <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
                      {/* Timer */}
                      <div className="text-center">
                        <span className="font-mono text-3xl font-bold text-primary">{rec.fmt(rec.elapsed)}</span>
                        <p className="text-xs text-text-muted mt-0.5">
                          {rec.state === "idle" && "Ready to record"}
                          {rec.state === "recording" && "Recording…"}
                          {rec.state === "paused" && "Paused"}
                          {rec.state === "stopped" && "Recording complete"}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2 justify-center flex-wrap">
                        {rec.state === "idle" && (
                          <button type="button" onClick={rec.start}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"/>
                            Start Recording
                          </button>
                        )}
                        {rec.state === "recording" && (<>
                          <button type="button" onClick={rec.pause}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            Pause
                          </button>
                          <button type="button" onClick={rec.stop}
                            className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                            Stop
                          </button>
                        </>)}
                        {rec.state === "paused" && (<>
                          <button type="button" onClick={rec.resume}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            Resume
                          </button>
                          <button type="button" onClick={rec.stop}
                            className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                            Stop
                          </button>
                        </>)}
                        {rec.state === "stopped" && (
                          <button type="button" onClick={rec.reset}
                            className="text-sm text-stone-400 underline">
                            Record again
                          </button>
                        )}
                      </div>

                      {/* Preview */}
                      {rec.audioUrl && (
                        <div className="space-y-2">
                          <audio controls src={rec.audioUrl} className="w-full rounded-lg"/>
                          {!form.audioUrl && (
                            <button type="button" onClick={handleSaveRecording} disabled={uploading}
                              className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary-dark transition-colors">
                              {uploading ? "Uploading…" : "Save Recording"}
                            </button>
                          )}
                          {form.audioUrl && (
                            <p className="text-xs text-green-600 font-semibold text-center">✓ Recording saved — click Add Sermon to publish</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {form.audioUrl && audioTab === "upload" && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">✓ Audio ready</p>
                  )}
                </div>
              )}

              <button onClick={handleSave}
                className="w-full btn-shine bg-primary text-white py-3 rounded-xl font-semibold">
                Add Sermon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sermon list */}
      <div className="space-y-3">
        {sermons.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <p className="font-semibold text-primary text-sm truncate">{s.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{s.preacher} · {formatDate(s.date)} · <span className="capitalize">{s.type}</span></p>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div></AdminShell>
  );
}
